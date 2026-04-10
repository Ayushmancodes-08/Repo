import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ListTodo, CheckCircle2, MapPin, Clock, Award, Star, 
  Bell, LogOut, ChevronRight, Check, X, Navigation,
  MoveUpRight, Camera, Zap, Shield, Target,
  Flame, TrendingUp, Filter, Search, Loader2, Eye, FileText, Menu, Plus
} from "lucide-react";
import { cn } from "../lib/utils";
import { db, Issue, Volunteer } from "../lib/database";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("available");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // Simulated Logged-in Volunteer (Arjun Pandit)
  const [volunteer, setVolunteer] = useState<Volunteer | undefined>(
    db.getVolunteers().find(v => v.id === 'VOL-001')
  );
  const [issues, setIssues] = useState(db.getIssues());
  
  const refreshData = () => {
    setIssues(db.getIssues());
    setVolunteer(db.getVolunteers().find(v => v.id === 'VOL-001'));
  };

  const availableTasks = issues.filter(i => 
    i.status === 'submitted' && 
    (!i.assignedTo || i.assignedTo === volunteer?.id)
  );

  const activeTask = issues.find(i => 
    i.assignedTo === volunteer?.id && 
    ['assigned', 'in-progress'].includes(i.status)
  );

  const myHistory = issues.filter(i => 
    i.assignedTo === volunteer?.id && i.status === 'resolved'
  );

  // Auto-refresh to detect admin dispatches
  useEffect(() => {
    const interval = setInterval(refreshData, 5000);
    window.addEventListener('storage', refreshData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  // Auto-switch to active task tab if one is assigned by admin
  useEffect(() => {
    if (activeTask && activeTab === 'available') {
      setActiveTab('my-tasks');
    }
  }, [!!activeTask]);

  const onAcceptTask = (id: string) => {
    db.updateIssue(id, { 
      status: 'assigned', 
      assignedTo: volunteer?.id,
      assignedTeam: volunteer?.name,
      updatedAt: new Date().toISOString()
    });
    db.updateVolunteer('VOL-001', { status: 'on-mission', currentStatus: 'en-route' });
    refreshData();
  };

  const onUpdateTaskStatus = (id: string, newStatus: Issue['status'], volStatus: Volunteer['currentStatus']) => {
    db.updateIssue(id, { status: newStatus, updatedAt: new Date().toISOString() });
    db.updateVolunteer('VOL-001', { currentStatus: volStatus });
    refreshData();
  };

  const onCompleteTask = (id: string, proofImage: string, notes: string) => {
    db.updateIssue(id, { 
      status: 'resolved', 
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      proofOfWork: { image: proofImage, description: notes, timestamp: new Date().toISOString() }
    });
    // Add points for completion
    const pointsEarned = 100; // Base points
    db.updateVolunteer('VOL-001', { 
      status: 'available',
      currentStatus: 'idle',
      tasksCompleted: (volunteer?.tasksCompleted || 0) + 1,
      impactPoints: (volunteer?.impactPoints || 0) + pointsEarned
    });
    
    db.addNotification({
      id: `NOT-${Date.now()}`,
      title: 'Mission Synchronized',
      message: `Verification proof received. You earned ${pointsEarned} Impact Points.`,
      type: 'success',
      read: false,
      targetRole: 'volunteer',
      createdAt: new Date().toISOString()
    });

    refreshData();
  };

  return (
    <div className="flex h-screen bg-[#0F172A] font-[Inter] overflow-hidden text-slate-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[6000] bg-slate-900/80 backdrop-blur-md lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Pro Design */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-[#1E293B] border-r border-slate-800 flex flex-col shrink-0 z-[6001] transition-transform duration-500 lg:relative lg:translate-x-0 w-[280px]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 font-black text-xl tracking-tighter text-white group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span>NeedSense <span className="text-indigo-400 font-medium">Vol</span></span>
          </Link>
          <button className="lg:hidden p-2 text-slate-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
        </div>
        
        <div className="p-trailing flex-1 overflow-y-auto mt-4 px-4 scrollbar-hide">
          <div className="mb-6 p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img src={volunteer?.avatar} alt="Profile" className="w-12 h-12 rounded-2xl border-2 border-indigo-500/50 object-cover" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1E293B] flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-black text-sm">{volunteer?.name}</h3>
                <div className="flex items-center gap-1 text-amber-400 text-[9px] font-black uppercase tracking-widest mt-1">
                  <Star className="w-3 h-3 fill-current" /> {volunteer?.impactPoints} Points
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
               <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/30">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Rank</div>
                  <div className="text-[10px] font-black text-white flex items-center justify-center gap-1"><Shield className="w-3 h-3 text-indigo-400" /> Pro</div>
               </div>
               <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/30">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Impact</div>
                  <div className="text-[10px] font-black text-white flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Top 5%</div>
               </div>
            </div>
          </div>

          <nav className="space-y-1.5 pb-8">
            {[
              { id: "available", icon: ListTodo, label: "Job Market", count: availableTasks.length },
              { id: "my-tasks", icon: Target, label: "My Registry", active: !!activeTask },
              { id: "leaderboard", icon: Award, label: "Hall of Fame" },
            ].map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={cn("w-full flex items-center justify-between px-5 py-4 lg:py-3.5 rounded-2xl text-base lg:text-sm font-bold transition-all group",
                  activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
                <div className="flex items-center gap-4">
                  <item.icon className={cn("w-6 h-6 lg:w-5 lg:h-5", activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} /> 
                  {item.label}
                </div>
                {item.count ? <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-lg text-[9px] font-black">{item.count}</span> : null}
                {'active' in item && item.active ? <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div> : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-4">
           <button onClick={() => { localStorage.removeItem('needsense_auth'); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-base lg:text-sm font-black text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all group">
            <LogOut className="w-6 h-6 lg:w-5 lg:h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0B0F1A]">
        <header className="h-20 bg-[#1E293B]/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 shadow-lg shadow-black/20">
          <div className="flex items-center gap-5">
            <button 
              className="lg:hidden p-2.5 bg-indigo-600/10 text-indigo-400 rounded-2xl active:scale-90 transition-transform border border-indigo-600/20"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl lg:text-lg font-black text-white tracking-tight italic">
                {activeTab === 'available' ? 'OPERATIONS' : activeTab === 'my-tasks' ? 'LIFECYCLE' : 'LEGENDS'}
              </h2>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5 hidden sm:block">Sector Response Intel Feed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Operational</div>
              <div className="text-[9px] font-bold text-slate-500">BHUBANESWAR SECTOR-4</div>
            </div>
            <button className="relative w-11 h-11 lg:w-10 lg:h-10 bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-slate-700 hover:scale-105 transition-all text-slate-400 group">
              <Bell className="w-5 h-5 lg:w-4 lg:h-4 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full border-4 border-[#0F172A] text-[8px] font-black flex items-center justify-center">2</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === "available" && (
              <AvailableTasksPro 
                tasks={availableTasks} 
                onAccept={onAcceptTask} 
                refresh={refreshData}
                activeTask={activeTask}
              />
            )}
            {activeTab === "my-tasks" && (
              <ActiveTaskFlowPro 
                task={activeTask} 
                onUpdate={onUpdateTaskStatus}
                onComplete={onCompleteTask}
                history={myHistory}
              />
            )}
            {activeTab === "leaderboard" && (
               <div className="max-w-3xl mx-auto">
                 <VolunteerLeaderboardPro />
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function AvailableTasksPro({ tasks, onAccept, activeTask, refresh }: { tasks: Issue[], onAccept: (id: string) => void, activeTask?: Issue, refresh: () => void }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);

  const urgencyLevels: Record<string, { label: string, color: string, icon: any }> = {
    critical: { label: "Emergency", color: "bg-red-500/20 text-red-500 border-red-500/30", icon: Flame },
    urgent: { label: "High Priority", color: "bg-orange-500/20 text-orange-500 border-orange-500/30", icon: TrendingUp },
    developing: { label: "Standard", color: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30", icon: Target },
    normal: { label: "Low Impact", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: Filter },
    // Fallbacks for legacy/mapping
    high: { label: "High Priority", color: "bg-orange-500/20 text-orange-500 border-orange-500/30", icon: TrendingUp },
    medium: { label: "Standard", color: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30", icon: Target },
    low: { label: "Low Impact", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: Filter }
  };

  const filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.urgency === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col md:flex-row gap-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex-1 space-y-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-800">
           <div className="relative w-full sm:w-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input 
              type="text" 
              placeholder="Search by neighborhood or type..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-80 bg-slate-900 border border-slate-800 px-12 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm" 
            />
           </div>
           <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
             {['all', 'critical', 'urgent', 'developing'].map(u => (
               <button 
                key={u} 
                onClick={() => setFilter(u)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", 
                  filter === u ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700")}>
                 {u}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filtered.map(task => {
            const level = urgencyLevels[task.urgency] || urgencyLevels.normal;
            return (
              <div key={task.id} 
                onClick={() => setSelectedTask(task)}
                className={cn(
                  "bg-[#1E293B]/30 rounded-[2.5rem] p-8 border hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden",
                  selectedTask?.id === task.id ? "border-indigo-600 ring-4 ring-indigo-600/10 bg-[#1E293B]/50 shadow-2xl" : "border-slate-800"
                )}>
                
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("px-3 py-1.5 rounded-xl border flex items-center gap-2", level.color)}>
                    <level.icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{level.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-300 transition-colors">
                     <MapPin className="w-3.5 h-3.5" />
                     <span className="text-[10px] font-black uppercase tracking-widest">{task.location.district.toUpperCase()}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white italic group-hover:text-indigo-400 transition-colors leading-tight mb-4">"{task.title}"</h3>
                <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed mb-8">{task.description}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-black text-[10px]">+50</div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Points Potential</span>
                   </div>
                   <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Details</button>
                </div>

                {task.isEmergency && (
                  <div className="absolute -top-1 -right-1 w-12 h-12 bg-red-600 rotate-45 translate-x-6 -translate-y-6 flex items-end justify-center pb-1 shadow-lg">
                    <Flame className="w-4 h-4 text-white -rotate-45 mb-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-[3rem] border border-slate-800 border-dashed">
             <div className="w-24 h-24 bg-slate-800 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-10 h-10" /></div>
             <h3 className="text-xl font-black text-slate-400">Scan Complete: No Tasks Found</h3>
             <p className="text-slate-500 font-medium">Try broadening your search or check different districts.</p>
          </div>
        )}
      </div>

      {/* Task Intelligence Panel */}
      <div className={cn("w-full md:w-[450px] shrink-0 space-y-6 transition-all duration-300", selectedTask ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20 pointer-events-none hidden md:block")}>
        {selectedTask && (
          <div className="sticky top-24 space-y-6 animate-in slide-in-from-right-10 duration-500 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pb-10">
            <div className="bg-[#1E293B] rounded-[3rem] p-10 border border-slate-800 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
               
               <div className="flex justify-between items-start relative z-10">
                 <button onClick={() => setSelectedTask(null)} className="p-3 bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-700 active:scale-90 transition-all"><X className="w-5 h-5" /></button>
                 <div className="text-right">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Impact Score</div>
                    <div className="text-3xl font-black text-white">124 <span className="text-xs text-slate-500 font-medium uppercase tracking-tighter">LVL XP</span></div>
                 </div>
               </div>

               <div className="space-y-4 relative z-10">
                 <h2 className="text-3xl font-black text-white leading-tight tracking-tight">Investigate <span className="text-indigo-400">{selectedTask.id}</span></h2>
                 <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-4 italic">"{selectedTask.description}"</p>
               </div>

               <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-slate-900/80 p-5 rounded-[2rem] border border-slate-800">
                    <Clock className="w-5 h-5 text-indigo-400 mb-2" />
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Duration</div>
                    <div className="text-sm font-black text-white">45 MIN</div>
                  </div>
                  <div className="bg-slate-900/80 p-5 rounded-[2rem] border border-slate-800">
                    <Navigation className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Distance</div>
                    <div className="text-sm font-black text-white">0.4 KM</div>
                  </div>
               </div>

               <div className="space-y-4 relative z-10">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Required Proof-of-Work</h4>
                  <div className="flex items-center gap-3 bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                     <Camera className="w-5 h-5 text-indigo-400" />
                     <span className="text-xs font-bold text-indigo-200">Mandatory "After" Photos Required for AI Validation</span>
                  </div>
               </div>

               <div className="relative z-10 pt-4">
                  <button 
                    disabled={!!activeTask}
                    onClick={() => onAccept(selectedTask.id)}
                    className="w-full bg-white text-slate-900 py-6 rounded-[2rem] font-black text-base hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 disabled:grayscale disabled:opacity-50"
                  >
                    {activeTask ? 'You already have an active job' : 'Deploy To Site Now'}
                    <MoveUpRight className="w-5 h-5" />
                  </button>
                  {activeTask && <p className="text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-4">Resolve your current task to accept another</p>}
               </div>
            </div>

            <div className="bg-indigo-950 p-8 rounded-[2.5rem] border border-indigo-900 flex items-center justify-between group overflow-hidden relative mt-8">
               <div className="absolute inset-0 bg-blue-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
               <div className="relative z-10">
                  <h4 className="text-white font-black text-lg italic">Need assistance?</h4>
                  <p className="text-indigo-300 text-xs font-medium">Request a team-up or special equipment</p>
               </div>
               <div className="relative z-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-indigo-950 transition-all cursor-pointer">
                  <MessageSquarePro className="w-5 h-5" />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveTaskFlowPro({ task, onUpdate, onComplete, history }: { task?: Issue, onUpdate: any, onComplete: any, history: Issue[] }) {
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto py-20 animate-in fade-in duration-700">
         <div className="text-center space-y-12">
            <div className="relative inline-block">
               <div className="w-48 h-48 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                  <Zap className="w-10 h-10 text-slate-800 fill-slate-800" />
               </div>
               <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                  <Target className="w-6 h-6 text-white" />
               </div>
            </div>
            
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-white tracking-tighter">Command Center: Idle</h2>
               <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Awaiting task assignment in sector-4</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
               <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <div className="text-2xl font-black text-white mb-1">{history.length}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lifetime Jobs</div>
               </div>
               <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400 mb-1">0%</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Failure Rate</div>
               </div>
               <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <div className="text-2xl font-black text-indigo-400 mb-1">B+</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Tier</div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  const steps = [
    { key: 'assigned', label: 'En-Route', icon: Navigation, desc: 'Heading to site' },
    { key: 'in-progress', label: 'On-Site', icon: Target, desc: 'Working on solution' },
    { key: 'resolved', label: 'Validation', icon: Shield, desc: 'Submitting proof' }
  ];

  const currentIdx = steps.findIndex(s => s.key === task.status) === -1 ? 0 : steps.findIndex(s => s.key === task.status);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-right-10 duration-700">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
             <div className="bg-[#1E293B] rounded-[3rem] p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="relative z-10 flex flex-col gap-8">
                   <div className="flex justify-between items-start">
                      <div className="bg-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30">LOCKED JOB: {task.id}</div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> LIVE UPDATE ACTIVE
                      </div>
                   </div>

                   <h1 className="text-4xl font-black text-white tracking-tight leading-none italic">"{task.title}"</h1>
                   
                   <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl">
                         <MapPin className="w-4 h-4 text-slate-500" />
                         <span className="text-sm font-bold text-slate-300">{task.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl">
                         <Clock className="w-4 h-4 text-slate-500" />
                         <span className="text-sm font-bold text-slate-300">Started 12m ago</span>
                      </div>
                   </div>

                    {/* Stepper and Map Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                       <div className="space-y-4">
                          {steps.map((s, idx) => {
                            const isPast = idx < currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <div key={s.key} className={cn("flex items-center gap-4 p-5 rounded-[1.5rem] transition-all duration-500 border-2", 
                                isCurrent ? "bg-white border-white scale-[1.02] shadow-xl" : isPast ? "bg-slate-900/50 border-transparent opacity-50" : "bg-slate-900/20 border-slate-800 opacity-30")}>
                                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                                   isCurrent ? "bg-indigo-600 text-white" : isPast ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-600")}>
                                    {isPast ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                                 </div>
                                 <div className="flex-1">
                                    <h4 className={cn("font-black text-[10px] uppercase tracking-widest", isCurrent ? "text-slate-900" : "text-slate-500")}>{s.label}</h4>
                                    <p className={cn("text-[10px] font-medium", isCurrent ? "text-slate-500" : "text-slate-600")}>{s.desc}</p>
                                 </div>
                                 {isCurrent && (
                                    <button 
                                      onClick={() => {
                                        if (idx === 0) onUpdate(task.id, 'in-progress', 'working');
                                        else if (idx === 1) setShowProofModal(true);
                                      }}
                                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-black text-[8px] uppercase tracking-[0.15em] hover:bg-black transition-all"
                                    >
                                      Update
                                    </button>
                                 )}
                              </div>
                            );
                          })}
                       </div>

                       <div className="h-[350px] rounded-[2rem] overflow-hidden border border-slate-700 relative group shadow-2xl">
                          <MissionMap origin={[task.location.lat + 0.005, task.location.lng - 0.005]} destination={[task.location.lat, task.location.lng]} digiPin={task.digiPin} />
                          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                             <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                Live Navigation
                             </div>
                             {task.digiPin && (
                               <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                                  Grid: {task.digiPin}
                               </div>
                             )}
                          </div>
                          <div className="absolute bottom-4 right-4 z-[1000] bg-white text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl border border-slate-200">
                             4m x 4m Precision Area
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

          <div className="space-y-8">
             <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl flex flex-col gap-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Context Provided By AI</h3>
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl">
                   <p className="text-xs font-medium text-indigo-300 italic leading-relaxed">"{task.aiReasoning}"</p>
                </div>

                {/* Evidence Attachments Section */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Citizen Evidence</div>
                     <div className="grid grid-cols-2 gap-3">
                       {task.attachments.map((att, i) => (
                         <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-2xl flex items-center gap-3 group/att relative transition-all hover:bg-slate-800">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                               {att.type === 'image' ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="text-[10px] font-bold text-white truncate">{att.name}</div>
                               <div className="text-[8px] font-medium text-slate-500 uppercase">{att.type}</div>
                            </div>
                            {att.url && att.type === 'image' && (
                              <div className="absolute inset-0 opacity-0 group-hover/att:opacity-100 transition-opacity flex items-center justify-center bg-slate-950/40 rounded-2xl backdrop-blur-[2px]">
                                <button onClick={() => window.open(att.url, '_blank')} className="p-1.5 bg-white text-slate-900 rounded-lg shadow-xl scale-90 hover:scale-100 transition-transform">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                         </div>
                       ))}
                     </div>
                  </div>
                )}

                <div className="space-y-4">
                   <div className="text-xs font-bold text-slate-400">Reporter History</div>
                   <div className="flex items-center gap-3">
                      <img src="https://i.pravatar.cc/150?u=rj" alt="" className="w-10 h-10 rounded-full border border-slate-700" />
                      <div>
                         <div className="text-xs font-black text-white">Rohan Kumar</div>
                         <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Trusted Citizen · 4m Grid Verified</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-emerald-900/20 rounded-[2.5rem] p-10 border border-emerald-500/20 shadow-xl flex flex-col gap-6">
                <div className="flex items-center gap-2">
                   <Target className="w-4 h-4 text-emerald-400" />
                   <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Community Impact</h3>
                </div>
                <div className="text-3xl font-black text-white">+120 <span className="text-xs text-slate-500 font-medium">Points</span></div>
                <p className="text-[10px] font-medium text-emerald-400/60 leading-relaxed uppercase tracking-wider">Completing this job promotes you to "Elite Responder" status in BHU-S4.</p>
             </div>
          </div>
       </div>
    );

      {/* Final Resolution Modal */}
      {showProofModal && task && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-10 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" 
               onClick={() => setShowProofModal(false)}></div>
          
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/20 scrollbar-hide">
            {/* Header */}
            <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white relative z-10">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                     <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-500" />
                  </div>
                  <div>
                     <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">Resolution</h3>
                     <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Mission {task.id}
                     </p>
                  </div>
               </div>
               <button onClick={() => setShowProofModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
                  <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 scrollbar-hide">
               {/* Evidence Upload */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Camera className="w-4 h-4 text-indigo-500" /> Capture Evidence (Required)
                  </label>
                  <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-8 sm:p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-500/30 transition-all cursor-pointer relative min-h-[220px] group overflow-hidden">
                     {proofImage ? (
                       <div className="absolute inset-2 sm:inset-4">
                         <img src={proofImage} alt="Proof" className="w-full h-full object-cover rounded-[1.5rem] shadow-2xl" />
                         <button onClick={(e) => { e.stopPropagation(); setProofImage(null); }} className="absolute -top-2 -right-2 w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-red-500 shadow-xl hover:bg-red-50 active:scale-90 transition-all z-20">
                           <X className="w-5 h-5" />
                         </button>
                       </div>
                     ) : (
                       <>
                         <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all mb-4 border border-slate-50">
                           <Plus className="w-8 h-8" />
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600">Scan or Upload Final Fix</span>
                         <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                       </>
                     )}
                  </div>
               </div>

               {/* Resolution Details */}
               <div className="space-y-4 pb-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <FileText className="w-4 h-4 text-indigo-500" /> Completion Report
                  </label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                    rows={4} 
                    placeholder="Describe implementation details (e.g. 'Repaired pipe fitting, restored street access')..." 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 sm:px-8 sm:py-6 outline-none focus:ring-8 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none leading-relaxed text-sm sm:text-base shadow-inner" 
                  />
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 sm:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
               <button onClick={() => setShowProofModal(false)} className="order-2 sm:order-1 flex-1 py-5 px-8 rounded-2.5xl font-black text-xs sm:text-sm uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all">Go Back</button>
               <button 
                  disabled={!proofImage || !notes}
                  onClick={() => onComplete(task.id, proofImage!, notes)}
                  className="order-1 sm:order-2 flex-[2] py-5 px-10 bg-indigo-600 text-white rounded-2.5xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-[0_15px_30px_rgba(79,70,229,0.3)] disabled:opacity-20 active:scale-95"
               >
                  Verify Execution
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MissionMap({ origin, destination, digiPin }: { origin: [number, number], destination: [number, number], digiPin?: string }) {
  // Generate a simulated path between origin and destination
  const generatePath = () => {
    const points: [number, number][] = [origin];
    const latDiff = (destination[0] - origin[0]) / 4;
    const lngDiff = (destination[1] - origin[1]) / 4;
    
    // Add 3 intermediate points with slight randomness for "street-like" path
    for (let i = 1; i <= 3; i++) {
      points.push([
        origin[0] + (latDiff * i) + (Math.random() - 0.5) * 0.001,
        origin[1] + (lngDiff * i) + (Math.random() - 0.5) * 0.001
      ]);
    }
    points.push(destination);
    return points;
  };

  const path = generatePath();

  return (
    <MapContainer center={destination} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Volunteer Marker */}
      <Marker position={origin}>
        <Popup>Your Current Location</Popup>
      </Marker>
      
      {/* Target Marker (4m x 4m DigiPin Area) */}
      <Marker position={destination}>
        <Popup>
           <div className="text-[10px] font-bold">
              <div className="text-indigo-600 font-black">DigiPin: {digiPin}</div>
              <div>Issue Area Targeted</div>
           </div>
        </Popup>
      </Marker>

      {/* Navigation Path */}
      <Polyline positions={path} color="#6366f1" weight={4} opacity={0.8} dashArray="1, 8" />
    </MapContainer>
  );
}

function VolunteerLeaderboardPro() {
  const volunteers = db.getVolunteers().sort((a, b) => (b.impactPoints || 0) - (a.impactPoints || 0));

  return (
    <div className="bg-[#1E293B] rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10">
          <Award className="w-16 h-16 text-amber-400 mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-bounce" />
          <h2 className="text-4xl font-black text-white tracking-tighter italic">LEGENDS OF THE CITY</h2>
          <p className="text-indigo-200 mt-3 text-sm font-bold uppercase tracking-[0.2em]">Regional Sector Leaderboard</p>
        </div>
      </div>
      
      <div className="p-8 space-y-4">
        {volunteers.map((vol, index) => (
          <div key={vol.id} className={cn(
            "flex items-center gap-6 p-6 rounded-[2rem] transition-all group", 
            index === 0 ? "bg-amber-400/10 border border-amber-400/20 shadow-xl" : "bg-slate-900/30 border border-slate-800 hover:bg-slate-900 hover:border-slate-700"
          )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 border-2 transition-transform group-hover:rotate-12", 
              index === 0 ? "bg-amber-400 border-amber-300 text-amber-950 shadow-lg shadow-amber-400/30" : 
              index === 1 ? "bg-slate-400 border-slate-300 text-slate-950" : 
              index === 2 ? "bg-orange-400 border-orange-300 text-orange-950" : "bg-slate-800 border-slate-700 text-slate-500")}>
              {index + 1}
            </div>
            
            <img src={vol.avatar} alt={vol.name} className="w-16 h-16 rounded-[1.5rem] border-2 border-slate-700 shadow-xl group-hover:scale-110 transition-transform" />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-white text-lg tracking-tight flex items-center gap-2">
                {vol.name}
                {index === 0 && <Flame className="w-4 h-4 text-orange-500 animate-pulse" />}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{vol.district}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{vol.tasksCompleted} Jobs Done</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{vol.impactPoints}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">IMPACT XP</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-slate-900/50 border-t border-slate-800 text-center">
         <p className="text-slate-500 font-bold text-xs uppercase tracking-widest italic">"The city doesn't forget its heroes."</p>
      </div>
    </div>
  );
}

// Pro Components for specialized SVG icons or logic
function MessageSquarePro(props: any) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
