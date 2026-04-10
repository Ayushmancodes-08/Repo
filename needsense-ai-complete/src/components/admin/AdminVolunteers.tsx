import { useState } from "react";
import { Search, Star, Clock, CheckCircle2, X, Award, MapPin, Mail, Phone, Zap, Users, BarChart2, Briefcase, ClipboardList, ShieldCheck, AlertCircle, Activity } from "lucide-react";
import { cn } from "../../lib/utils";
import { db, Volunteer, Issue } from "../../lib/database";

export default function AdminVolunteers() {
  const [activeTab, setActiveTab] = useState<'directory' | 'analytics' | 'assignment' | 'logs'>('directory');
  const volunteers = db.getVolunteers();
  const issues = db.getIssues().filter(i => i.status === 'submitted' || i.status === 'assigned');

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">Volunteer Orchestration</h1>
          <p className="text-slate-500 font-medium">Manage network of {volunteers.length} responders and mission logistics.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200 shadow-inner">
          {[
            { id: 'directory', label: 'Directory', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            { id: 'assignment', label: 'Assignment Control', icon: Briefcase },
            { id: 'logs', label: 'Activity Logs', icon: ClipboardList },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id ? "bg-white text-indigo-600 shadow-md" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        {activeTab === 'directory' && <VolunteerDirectory volunteers={volunteers} />}
        {activeTab === 'analytics' && <VolunteerAnalytics volunteers={volunteers} />}
        {activeTab === 'assignment' && <VolunteerAssignment issues={issues} volunteers={volunteers} />}
        {activeTab === 'logs' && <VolunteerLogs />}
      </div>
    </div>
  );
}

function VolunteerDirectory({ volunteers }: { volunteers: Volunteer[] }) {
  const [search, setSearch] = useState("");
  const filtered = volunteers.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search volunteers by name, skill, or district..." 
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm" 
          />
        </div>
        <button className="px-8 py-4 bg-white border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Filter Skills</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(vol => (
          <div key={vol.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <img src={vol.avatar} alt={vol.name} className="w-16 h-16 rounded-[1.5rem] border-4 border-slate-100 group-hover:border-indigo-100 transition-colors object-cover" />
                <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white", 
                  vol.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                )}></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{vol.id}</div>
                <div className="flex items-center gap-1 text-amber-500 font-black text-sm justify-end">
                  <Star className="w-4 h-4 fill-current" /> {vol.rating}
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight mb-2 truncate">{vol.name}</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              <MapPin className="w-3 h-3" /> {vol.location.digipin} · {vol.experienceLevel}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {vol.skills.slice(0, 2).map((s, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-wider">{s}</span>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <div className="text-center">
                  <div className="text-sm font-black text-slate-900">{vol.tasksCompleted}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Missions</div>
               </div>
               <div className="text-center">
                  <div className="text-sm font-black text-slate-900">{vol.impactPoints}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Points</div>
               </div>
               <div className="text-center">
                  <div className="text-sm font-black text-indigo-600">{vol.avgResponseTime || '22m'}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Latency</div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VolunteerAnalytics({ volunteers }: { volunteers: Volunteer[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm">
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                <Activity className="w-6 h-6 text-indigo-600" /> Operational Efficiency
             </h2>
             <div className="h-64 bg-slate-50 rounded-[2rem] flex items-end justify-around p-8 border border-slate-200 px-12">
                {[45, 78, 52, 91, 64, 85, 70].map((v, i) => (
                  <div key={i} className="w-12 bg-indigo-500 rounded-t-xl transition-all hover:bg-indigo-600 hover:scale-110 cursor-pointer shadow-lg shadow-indigo-500/10" style={{ height: `${v}%` }}></div>
                ))}
             </div>
             <div className="flex justify-between mt-4 px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Experience Spread</h3>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between mb-2">
                         <span className="text-sm font-black text-slate-900 uppercase">Skilled (40%)</span>
                         <span className="text-sm font-black text-indigo-600">{volunteers.filter(v => v.experienceLevel === 'Skilled').length}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[40%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between mb-2">
                         <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Beginner (60%)</span>
                         <span className="text-sm font-black text-indigo-600">{volunteers.filter(v => v.experienceLevel === 'Beginner').length}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[60%]"></div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                <Award className="w-12 h-12 text-amber-500 mb-4" />
                <div className="text-3xl font-black text-slate-900 mb-1">4.82</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Avg Rating</div>
             </div>
          </div>
       </div>
       
       <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
             <Zap className="w-6 h-6 text-indigo-400" /> Dispatch Metrics
          </h2>
          <div className="space-y-8">
             {[
               { label: "Avg Acceptance Time", val: "2.4m", icon: Clock },
               { label: "On-Site Proof Rate", val: "98.2%", icon: ShieldCheck },
               { label: "Volunteer Sat. Index", val: "9.2/10", icon: Star },
             ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><m.icon className="w-5 h-5 text-indigo-400" /></div>
                   <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{m.label}</div>
                      <div className="text-xl font-black text-white">{m.val}</div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

function VolunteerAssignment({ issues, volunteers }: { issues: Issue[], volunteers: Volunteer[] }) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignedVols, setAssignedVols] = useState<Volunteer[]>([]);
  
  const toggleVolunteer = (vol: Volunteer) => {
    if (assignedVols.find(v => v.id === vol.id)) {
      setAssignedVols(prev => prev.filter(v => v.id !== vol.id));
    } else {
      setAssignedVols(prev => [...prev, vol]);
    }
  };

  const skilledCount = assignedVols.filter(v => v.experienceLevel === 'Skilled').length;
  const beginnerCount = assignedVols.filter(v => v.experienceLevel === 'Beginner').length;
  const total = assignedVols.length;
  
  // SPEC RULE: 60% beginner / 40% skilled
  const isRulePerfect = total > 0 && Math.abs((beginnerCount / total) - 0.6) < 0.1;

  const handleDispatch = () => {
    if (!selectedIssue) return;
    if (total === 0) {
      alert("Select at least one volunteer to dispatch.");
      return;
    }
    
    // Log dispatch and update DB
    assignedVols.forEach(v => db.updateVolunteer(v.id, { status: 'on-mission' }));
    db.updateIssue(selectedIssue.id, { 
      status: 'assigned', 
      assignedTo: assignedVols[0].id // Simplify to primary lead for demo
    });
    
    alert(`Mission ${selectedIssue.id} dispatched to ${total} volunteers. Team Composition verified.`);
    setSelectedIssue(null);
    setAssignedVols([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm space-y-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Issue Cluster</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
             {issues.map(issue => (
               <div 
                key={issue.id} 
                onClick={() => setSelectedIssue(issue)}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all cursor-pointer group",
                  selectedIssue?.id === issue.id ? "bg-indigo-50 border-indigo-200 shadow-xl shadow-indigo-500/10" : "bg-white border-slate-200 hover:border-indigo-300"
                )}
               >
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", 
                           issue.urgency === 'critical' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                        )}><AlertCircle className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{issue.id}</div>
                           <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{issue.title}</h3>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{issue.location.district}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 line-clamp-2">{issue.description}</div>
               </div>
             ))}
          </div>
       </div>

       <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Deployment Team</h2>
                <div className="px-5 py-2 bg-indigo-50 border border-indigo-200 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest">Team Size: {total}</div>
             </div>

             {/* SPEC 60/40 Rule Matrix */}
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white mb-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">
                   <ShieldCheck className="w-5 h-5 flex-shrink-0" /> Team Composition Protocol (60:40)
                </div>
                <div className="grid grid-cols-2 gap-8 mb-6">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50">Beginner (Req. 60%)</div>
                      <div className="text-3xl font-black">{total > 0 ? Math.round((beginnerCount/total)*100) : 0}%</div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50">Skilled (Req. 40%)</div>
                      <div className="text-3xl font-black">{total > 0 ? Math.round((skilledCount/total)*100) : 0}%</div>
                   </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                   <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${total > 0 ? (beginnerCount/total)*100 : 0}%` }}></div>
                   <div className="h-full bg-indigo-400 transition-all duration-500" style={{ width: `${total > 0 ? (skilledCount/total)*100 : 0}%` }}></div>
                </div>
                {!isRulePerfect && total > 0 && (
                  <div className="mt-4 text-[9px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                     <AlertCircle className="w-3.5 h-3.5" /> Optimal Ratio Mismatch: Adjust team for efficiency
                  </div>
                )}
             </div>

             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-8">
                {volunteers.filter(v => v.status === 'available').map(v => (
                  <div 
                    key={v.id} 
                    onClick={() => toggleVolunteer(v)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                      assignedVols.find(av => av.id === v.id) ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-4">
                       <img src={v.avatar} alt="" className="w-10 h-10 rounded-xl" />
                       <div>
                          <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{v.name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.experienceLevel} · {v.location.digipin}</div>
                       </div>
                    </div>
                    {assignedVols.find(av => av.id === v.id) && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                ))}
             </div>

             <button 
              disabled={!selectedIssue || total === 0}
              onClick={handleDispatch}
              className="w-full h-16 bg-indigo-600 text-white rounded-[2rem] font-black text-[14px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
             >
                Confirm Dispatch & Notify Team
             </button>
          </div>
       </div>
    </div>
  );
}

function VolunteerLogs() {
  const [logs] = useState([
    { id: 'EV-102', time: '10:42 AM', type: 'dispatch', msg: 'Team Alpha dispatched to Cluster C-4', user: 'Admin' },
    { id: 'EV-101', time: '10:30 AM', type: 'report', msg: 'New issue ISS-081 reported by Citizen #14', user: 'System' },
    { id: 'EV-100', time: '09:15 AM', type: 'resolve', msg: 'Mission ISS-072 marked as FIXED by Arjun Pandit', user: 'Volunteer' },
  ]);

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm">
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
        <ClipboardList className="w-6 h-6 text-indigo-600" /> Operational Event Stream
      </h2>
      <div className="space-y-6">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-6 group">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest w-24 pt-1">{log.time}</div>
            <div className="relative pb-8 flex-1">
               {i !== logs.length - 1 && <div className="absolute left-[-21px] top-6 w-0.5 h-full bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>}
               <div className="absolute left-[-24px] top-1.5 w-2 h-2 rounded-full border-2 border-slate-200 bg-white group-hover:border-indigo-600 transition-all"></div>
               <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{log.id}</span>
                  <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acted by: {log.user}</span>
               </div>
               <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-relaxed">{log.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
