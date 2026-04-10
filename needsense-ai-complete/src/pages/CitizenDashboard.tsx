import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, Plus, FileText, Bell, LogOut, ChevronRight, 
  CheckCircle2, AlertCircle, X, Camera, Send, 
  BrainCircuit, Crosshair, Star, MessageSquare,
  ShieldCheck, MapPin, Loader2, Info, Map as MapIcon, ArrowRight, Menu
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "../lib/utils";
import { db, Issue } from "../lib/database";
import { geminiService } from "../lib/gemini";
import { generateDigiPin } from "../lib/location";

// Fix leaflet icon
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const issues = db.getIssues().filter(i => i.reporterType === 'citizen');
  const notifications = db.getNotifications('citizen');

  return (
    <div className="flex h-screen bg-slate-50 font-[Inter] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[6000] bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col shrink-0 z-[6001] transition-transform duration-500 lg:relative lg:translate-x-0 w-[280px] lg:w-[240px]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 lg:h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-black">N</div>
            NeedSense <span className="text-slate-400 font-normal text-sm">/ You</span>
          </Link>
          <button className="lg:hidden p-2 text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: "home", icon: Home, label: "My Dashboard" },
            { id: "report", icon: Plus, label: "Report Issue", special: true },
            { id: "my-issues", icon: FileText, label: "My Reports" },
            { id: "notifications", icon: Bell, label: "Notifications" },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={cn("w-full flex items-center gap-4 px-5 py-4 lg:py-2.5 rounded-2xl lg:rounded-xl text-base lg:text-sm font-semibold transition-all",
                item.special && activeTab !== item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" :
                activeTab === item.id ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700")}>
              <item.icon className={cn("w-6 h-6 lg:w-5 lg:h-5", item.special && activeTab !== item.id ? "text-white" : "")} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={() => { localStorage.removeItem('needsense_auth'); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-5 py-4 lg:py-2.5 rounded-2xl lg:rounded-xl text-base lg:text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut className="w-6 h-6 lg:w-5 lg:h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 lg:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0 relative z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 bg-slate-100 text-slate-600 rounded-xl active:scale-90 transition-transform shadow-sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl lg:text-lg font-black text-slate-900 tracking-tight capitalize italic">
              {activeTab === 'home' ? 'Overview' : activeTab === 'report' ? 'Report' : activeTab === 'my-issues' ? 'History' : 'Alerts'}
            </h2>
          </div>
          <div className="flex items-center gap-4 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900">Rohan Kumar</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level 3 Citizen</div>
            </div>
            <img src="https://i.pravatar.cc/150?u=rohan" alt="User" className="w-9 h-9 lg:w-8 lg:h-8 rounded-full border-2 border-slate-200 shadow-md" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === "home" && <CitizenHome issues={issues} onReport={() => setActiveTab("report")} />}
          {activeTab === "report" && <CitizenReport onSuccess={() => setActiveTab("my-issues")} />}
          {activeTab === "my-issues" && <CitizenIssues issues={issues} />}
          {activeTab === "notifications" && <CitizenNotifications notifications={notifications} />}
        </main>
      </div>
    </div>
  );
}

function CitizenHome({ issues, onReport }: { issues: Issue[]; onReport: () => void }) {
  const active = issues.filter(i => i.status !== 'resolved' && i.status !== 'closed');
  const resolved = issues.filter(i => i.status === 'resolved');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20">
            <ShieldCheck className="w-3 h-3 text-cyan-300" /> Verified Platform
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Step up for your city, Rohan.</h1>
          <p className="text-blue-100 mb-8 max-w-lg font-medium leading-relaxed">Your reports directly inform city planning. Every pothole marked, every light fixed adds points to your civic impact score.</p>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={onReport} className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl active:scale-95">
              <Plus className="w-5 h-5" /> Start New Report
            </button>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-blue-600 ring-2 ring-white/10" alt="" />)}
              <span className="ml-6 text-xs font-bold text-blue-100">Joined by +2.4k citizens today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: FileText, label: "Total Reports", val: issues.length, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
          { icon: Info, label: "Active Issues", val: active.length, color: "orange", bg: "bg-orange-50", text: "text-orange-600" },
          { icon: CheckCircle2, label: "Completed", val: resolved.length, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", s.bg, s.text)}><s.icon className="w-6 h-6" /></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Analytics</span>
            </div>
            <div><div className="text-3xl font-black text-slate-900">{s.val}</div><div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Recent Status Updates</h2>
          <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {issues.length > 0 ? issues.slice(0, 5).map(issue => (
            <div key={issue.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className={cn("w-3 h-3 rounded-full ring-4 ring-white shadow-sm", 
                  issue.status === 'resolved' ? 'bg-emerald-500' : 
                  issue.urgency === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                )}></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">{issue.title}</div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1 uppercase tracking-wider">
                    {issue.id} • {issue.category} • {new Date(issue.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("hidden sm:block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", 
                  issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                )}>{issue.status.replace('-', ' ')}</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-slate-400 font-medium">No reports yet. Be the first to report!</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CitizenReport({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [desc, setDesc] = useState("");
  const [landmark, setLandmark] = useState("");
  const [lat, setLat] = useState(20.2960);
  const [lng, setLng] = useState(85.8245);
  const [digiPin, setDigiPin] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachments(prev => [...prev, { id: `ATT-${Date.now()}`, type, name: file.name, url: reader.result as string }]);
    };
    reader.readAsDataURL(file);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setDigiPin(generateDigiPin(position.coords.latitude, position.coords.longitude));
      });
    }
  };

  const performAIAnalysis = async () => {
    setIsClassifying(true);
    try {
      const primaryImage = attachments.find(a => a.type === 'image')?.url;
      // Pass the landmark or area to the Python backend for clustering
      const suggestion = await geminiService.classifyIssue("Citizen Report", desc, landmark || "General Area", primaryImage);
      setAiSuggestion(suggestion);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = () => {
    const newIssue: Issue = {
      id: `ISS-${Date.now()}`,
      title: aiSuggestion?.tag || desc.substring(0, 30),
      description: desc,
      category: aiSuggestion?.category || "other",
      urgency: aiSuggestion?.urgency || "normal",
      urgencyScore: aiSuggestion?.urgencyScore || 50,
      isEmergency: aiSuggestion?.isEmergency || false,
      aiReasoning: aiSuggestion?.reasoning || "Standard report triage.",
      status: 'submitted',
      location: { lat, lng, address: landmark, district: "Central District" },
      digiPin,
      landmark,
      reportedBy: 'CIT-001',
      reporterType: 'citizen',
      attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    db.addIssue(newIssue);
    onSuccess();
  };

  function LocationPicker() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        setDigiPin(generateDigiPin(e.latlng.lat, e.latlng.lng));
      },
    });
    return <Marker position={[lat, lng]} />;
  }

  const steps = [
    { n: 1, l: "Evidence", icon: Camera },
    { n: 2, l: "Description", icon: FileText },
    { n: 3, l: "Location", icon: MapPin },
    { n: 4, l: "DIGIPIN", icon: ShieldCheck },
    { n: 5, l: "Landmark", icon: MapIcon },
    { n: 6, l: "Submit", icon: BrainCircuit }
  ];

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
        {steps.map(s => (
          <div key={s.n} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all border-2",
              step === s.n ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" : 
              step > s.n ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-400 border-slate-200"
            )}>
              {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={cn("text-[8px] font-black uppercase tracking-wider", step >= s.n ? "text-slate-900" : "text-slate-400")}>{s.l}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Step 1: Upload Evidence</h2>
          <p className="text-slate-500 mb-8 font-medium">Capture or upload photos/PDFs of the issue.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer group relative">
              <Camera className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-black text-slate-900">Add Photo Evidence</h3>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="space-y-4">
              {attachments.map(att => (
                <div key={att.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                  {att.type === 'image' ? <img src={att.url} className="w-10 h-10 rounded-lg object-cover" /> : <FileText className="w-10 h-10 p-2 bg-slate-100 rounded-lg" />}
                  <div className="flex-1 truncate"><div className="text-xs font-black text-slate-900 truncate">{att.name}</div><div className="text-[8px] font-bold text-slate-400 uppercase">{att.type}</div></div>
                </div>
              ))}
              {attachments.length === 0 && <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-2xl">No files uploaded</div>}
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <button disabled={attachments.length === 0} onClick={() => setStep(2)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 disabled:opacity-30">Next: Description <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Step 2: Describe the Issue</h2>
          <p className="text-slate-500 mb-8 font-medium">Provide a clear description of the problem you're seeing.</p>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={6} placeholder="Describe the issue in detail..." 
            className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium text-slate-700" />
          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(1)} className="text-sm font-black text-slate-400">Back</button>
            <button disabled={!desc} onClick={() => setStep(3)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 disabled:opacity-30">Next: Location <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Step 3: Mark Location</h2>
          <p className="text-slate-500 mb-8 font-medium">Pin the exact location on the map.</p>
          <div className="h-[300px] rounded-3xl overflow-hidden border border-slate-200 relative mb-6">
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker />
            </MapContainer>
            <button onClick={handleDetectLocation} className="absolute bottom-4 right-4 z-[1000] bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-black flex items-center gap-2 hover:bg-slate-50"><MapPin className="w-4 h-4 text-indigo-600" /> Detect Current</button>
          </div>
          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(2)} className="text-sm font-black text-slate-400">Back</button>
            <button onClick={() => setStep(4)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2">Next: DIGIPIN <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Step 4: DIGIPIN Verification</h2>
          <p className="text-slate-500 mb-8 font-medium">We've generated a DIGIPIN for this location. You can refine it if needed.</p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center mb-8">
            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Automated Digital Address</div>
            <div className="text-4xl font-black text-slate-900 tracking-widest">{digiPin}</div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Manual Correction (Optional)</label>
            <input value={digiPin} onChange={e => setDigiPin(e.target.value)} placeholder="Enter 6-digit DIGIPIN" className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 font-black tracking-[0.2em] text-center text-xl" maxLength={6} />
          </div>
          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(3)} className="text-sm font-black text-slate-400">Back</button>
            <button onClick={() => setStep(5)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2">Next: Landmark <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Step 5: Nearby Landmark</h2>
          <p className="text-slate-500 mb-8 font-medium">Add a nearby landmark to help volunteers find the spot quickly.</p>
          <input value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="e.g. Near Mother Teresa Primary School Gate" className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 font-bold" />
          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(4)} className="text-sm font-black text-slate-400">Back</button>
            <button disabled={!landmark} onClick={() => { setStep(6); performAIAnalysis(); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 disabled:opacity-30 shadow-lg shadow-indigo-100">Review with AI <BrainCircuit className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
          {isClassifying ? (
            <div className="p-20 text-center space-y-6">
              <Loader2 className="w-16 h-16 animate-spin mx-auto text-indigo-600" />
              <h3 className="text-xl font-black text-slate-900">AI Analyzing Your Report...</h3>
              <p className="text-slate-500 font-medium tracking-tight uppercase text-xs">Matching with India Post DIGIPIN clusters</p>
            </div>
          ) : (
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Final Verification</h2>
                  <p className="text-slate-500 font-medium">NeedSense AI has triaged your report.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</div>
                  <div className="text-lg font-black text-slate-900 capitalize">{aiSuggestion?.category}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgency</div>
                  <div className="text-lg font-black text-slate-900 capitalize">{aiSuggestion?.urgency}</div>
                </div>
                <div className="col-span-2 bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden">
                   <div className="relative z-10">
                    <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">AI Reasoning</div>
                    <p className="text-sm font-medium leading-relaxed italic">"{aiSuggestion?.reasoning}"</p>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                <button onClick={() => setStep(5)} className="text-sm font-black text-slate-400">Revise Details</button>
                <button onClick={handleSubmit} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 flex items-center gap-3">Submit Report <Send className="w-5 h-5" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CitizenIssues({ issues }: { issues: Issue[] }) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const statusColors: Record<string, string> = {
    'submitted': 'bg-slate-100 text-slate-600', 
    'assigned': 'bg-indigo-100 text-indigo-700',
    'in-progress': 'bg-orange-100 text-orange-700', 
    'resolved': 'bg-emerald-100 text-emerald-700',
    'closed': 'bg-slate-900 text-white',
  };

  const statusSteps = [
    { key: 'submitted', label: 'Submitted', icon: Send },
    { key: 'assigned', label: 'Dispatched', icon: Crosshair },
    { key: 'in-progress', label: 'On-Site', icon: Loader2 },
    { key: 'resolved', label: 'Fixed', icon: CheckCircle2 },
    { key: 'closed', label: 'Closed', icon: Star },
  ];

  const currentStep = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  const handleReviewSubmit = () => {
    if (!selectedIssue) return;
    db.updateIssue(selectedIssue.id, {
      status: 'closed',
      volunteerReview: {
        rating,
        comment: reviewText,
        createdAt: new Date().toISOString()
      }
    });
    
    const vol = db.getVolunteers().find(v => v.id === selectedIssue.assignedTo);
    if (vol) {
      db.updateVolunteer(vol.id, { impactPoints: (vol.impactPoints || 0) + (rating * 10) });
    }

    setShowReview(false);
    setRating(0);
    setReviewText("");
    setSelectedIssue(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Tracked Issues</h2>
        <div className="flex gap-2">
           <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">{issues.length} TOTAL</span>
        </div>
      </div>

      <div className="space-y-6">
        {issues.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(issue => (
          <div key={issue.id} className="bg-white rounded-[2rem] border border-slate-200/70 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2", 
                    issue.status === 'resolved' || issue.status === 'closed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                    issue.urgency === 'critical' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                  )}>
                    {issue.category === 'waste' ? <FileText className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{issue.id}</span>
                       <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider", 
                         issue.urgency === 'critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                       )}>{issue.urgency} Priority</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5 group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{issue.title}</h3>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm", statusColors[issue.status] || 'bg-slate-50 text-slate-400 border-slate-200')}>
                      {issue.status.replace('-', ' ')}
                   </div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last updated {new Date(issue.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>

              {/* Real-time Status Stepper */}
              <div className="bg-slate-50/50 rounded-[1.5rem] p-6 mb-8 border border-slate-100 relative overflow-hidden">
                <div className="relative flex justify-between">
                   <div className="absolute left-0 top-5 w-full h-1 bg-slate-200 -z-0">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-1000 origin-left" 
                        style={{ width: `${(currentStep(issue.status) / (statusSteps.length - 1)) * 100}%` }}
                      ></div>
                   </div>
                   
                   {statusSteps.map((s, idx) => {
                     const isPast = idx <= currentStep(issue.status);
                     const isCurrent = idx === currentStep(issue.status);
                     return (
                       <div key={s.key} className="relative z-10 flex flex-col items-center gap-2 group/step">
                         <div className={cn(
                           "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                           isCurrent ? "bg-white border-indigo-600 scale-125 shadow-xl shadow-blue-500/20" :
                           isPast ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-300"
                         )}>
                            {isPast && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className={cn("w-4 h-4", isCurrent ? "text-indigo-600" : "text-current")} />}
                         </div>
                         <span className={cn("text-[8px] font-black uppercase tracking-widest text-center max-w-[60px]", isPast ? "text-slate-900" : "text-slate-400")}>{s.label}</span>
                       </div>
                     );
                   })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg"><MapPin className="w-3.5 h-3.5" /> {issue.location.address}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg capitalize"><FileText className="w-3.5 h-3.5" /> {issue.category}</span>
                </div>

                {issue.status === 'resolved' && (
                   <button 
                    onClick={() => { setSelectedIssue(issue); setShowReview(true); }}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95"
                   >
                     <Star className="w-4 h-4" /> Close & Review Task
                   </button>
                )}

                {issue.status === 'closed' && (
                   <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                     <CheckCircle2 className="w-4 h-4" /> Task Closed - Rating: {issue.volunteerReview?.rating}/5
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {issues.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6"><FileText className="w-10 h-10" /></div>
             <h3 className="text-xl font-black text-slate-900">No issues reported yet</h3>
             <p className="text-slate-500 font-medium">Be the first reporter in your community.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReview && selectedIssue && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-10 overflow-hidden">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowReview(false)}></div>
           <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.15)] overflow-y-auto animate-in zoom-in-95 duration-500 border border-slate-100 scrollbar-hide">
              <div className="p-8 sm:p-12 space-y-8">
                 <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 ring-8 ring-indigo-50/50">
                       <Star className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Mission Review</h2>
                    <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">Rate the performance for issue <span className="text-indigo-600 font-bold">{selectedIssue.id}</span>.</p>
                 </div>

                 <div className="flex justify-center gap-3 sm:gap-4 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRating(s)} className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all border-2",
                        rating >= s ? "bg-amber-400 border-amber-400 text-white scale-110 shadow-lg" : "bg-slate-50 border-slate-100 text-slate-300 hover:border-amber-200"
                      )}>
                        <Star className={cn("w-5 h-5 sm:w-6 sm:h-6", rating >= s ? "fill-white" : "")} />
                      </button>
                    ))}
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Feedback</label>
                    <textarea 
                      value={reviewText} 
                      onChange={e => setReviewText(e.target.value)}
                      rows={3} 
                      placeholder="Comment on the resolution quality..." 
                      className="w-full bg-slate-50 px-5 sm:px-6 py-4 sm:py-5 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 outline-none font-medium text-slate-700 transition-all resize-none leading-relaxed text-sm"
                    />
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button onClick={() => setShowReview(false)} className="order-2 sm:order-1 flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors">Cancel</button>
                    <button disabled={rating === 0} onClick={handleReviewSubmit} className="order-1 sm:order-2 flex-[2] py-4 px-10 bg-indigo-600 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-30">Close Issue</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function CitizenNotifications({ notifications }: { notifications: any[] }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Alerts</h2>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark all as read</span>
      </div>
      
      <div className="space-y-4">
        {notifications.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(n => (
          <div key={n.id} className={cn(
            "group bg-white rounded-[2rem] p-6 border shadow-sm flex items-start gap-5 transition-all hover:shadow-md", 
            n.read ? "border-slate-200/60" : "border-blue-200 bg-blue-50/50 shadow-blue-500/5 ring-1 ring-blue-100"
          )}>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-transform group-hover:scale-110",
              n.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              n.type === 'urgent' ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 
              'bg-blue-50 text-blue-600 border-blue-100')}>
              {n.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : n.type === 'urgent' ? <AlertCircle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-black text-slate-900 text-sm tracking-tight">{n.title}</h4>
                <div className="text-[10px] font-bold text-slate-400 capitalize">{new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
              </div>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">{n.message}</p>
              <div className="flex items-center gap-4 mt-3">
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Details</button>
                 {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No new notifications</div>
        )}
      </div>
    </div>
  );
}
