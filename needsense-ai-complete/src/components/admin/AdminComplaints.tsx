import { useState } from "react";
import { Search, Filter, ChevronDown, Eye, UserPlus, CheckCircle2, XCircle, Clock, AlertCircle, X, CheckCheck, FileText, AlertTriangle, Zap, MapPin, BrainCircuit } from "lucide-react";
import { cn } from "../../lib/utils";
import { db, Issue, Volunteer } from "../../lib/database";

export default function AdminComplaints() {
  const [issues, setIssues] = useState(db.getIssues());
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = issues.filter(i => {
    const matchesFilter = filter === "all" || i.status === filter || i.urgency === filter;
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openDrawer = (issue: Issue) => { setSelectedIssue(issue); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setTimeout(() => setSelectedIssue(null), 300); };

  const updateStatus = (id: string, status: Issue['status']) => {
    db.updateIssue(id, { status, ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}) });
    setIssues(db.getIssues());
    if (selectedIssue?.id === id) setSelectedIssue({ ...selectedIssue, status });
  };

  const dispatchAI = (issue: Issue) => {
    const volunteers = db.getVolunteers();
    const available = volunteers.filter(v => v.status === 'available');
    
    // Simple logic for single dispatch from complaints view
    // Orchestration tab handles complex 60/40 teams
    const primary = available.find(v => v.experienceLevel === 'Skilled') || available[0];
    
    if (primary) {
      db.updateIssue(issue.id, { 
        status: 'assigned', 
        assignedTo: primary.id 
      });
      db.updateVolunteer(primary.id, { status: 'on-mission' });
      
      // Notify
      db.addNotification({
        id: `NOT-${Date.now()}`,
        title: "Manual Dispatch Issued",
        message: `You have been assigned to: ${issue.title}. Check Mission Center.`,
        type: 'info',
        read: false,
        targetRole: 'volunteer',
        createdAt: new Date().toISOString()
      });

      setIssues(db.getIssues());
      if (selectedIssue?.id === issue.id) setSelectedIssue({ ...selectedIssue, status: 'assigned', assignedTo: primary.id });
      alert(`AI allocated mission to ${primary.name}. Dispatch signal sent.`);
    } else {
      alert("No available volunteers found. Scale network via recruitment dashboard.");
    }
  };

  const statusColors: Record<string, string> = {
    'submitted': 'bg-slate-100 text-slate-700', 
    'assigned': 'bg-indigo-100 text-indigo-700',
    'in-progress': 'bg-orange-100 text-orange-700', 
    'resolved': 'bg-emerald-100 text-emerald-700', 
    'closed': 'bg-slate-200 text-slate-500',
  };

  const urgencyColors: Record<string, string> = {
    'critical': 'bg-red-50 text-red-700 border-red-200', 
    'high': 'bg-orange-50 text-orange-700 border-orange-200',
    'medium': 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    'low': 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div className="flex flex-col h-full pb-8 relative gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Report Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Reviewing {filtered.length} incoming signals from municipal sensors.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[320px] relative group">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search by mission ID, district, or keyword..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm" 
          />
        </div>
        <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
           {['all', 'submitted', 'assigned', 'in-progress'].map(f => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", 
                  filter === f ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800")}>
                {f}
              </button>
           ))}
        </div>
      </div>

      {/* Table Interface */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                {['Report ID', 'Issue Summary', 'Zone', 'AI Urgency', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(issue => (
                <tr key={issue.id} className="hover:bg-indigo-50/30 transition-all cursor-pointer group" onClick={() => openDrawer(issue)}>
                  <td className="px-8 py-6">
                    <div className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">{issue.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors truncate max-w-[300px]">{issue.title}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{issue.category}</div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{issue.location.district}</td>
                  <td className="px-8 py-6">
                    <div className={cn("inline-flex px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest", urgencyColors[issue.urgency])}>
                      {issue.urgencyScore || 0}% Score
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest", statusColors[issue.status])}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                       <button onClick={() => openDrawer(issue)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                       {issue.status === 'submitted' && (
                         <button onClick={() => dispatchAI(issue)} className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"><Zap className="w-4 h-4 fill-current" /></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Extension Drawer */}
      {selectedIssue && (
        <>
          <div className={cn("fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity", drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={closeDrawer}></div>
          <div className={cn("fixed top-0 right-0 h-full w-[540px] bg-white shadow-2xl z-[60] transform transition-transform duration-500 overflow-y-auto", drawerOpen ? "translate-x-0" : "translate-x-full")}>
            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between">
                 <div>
                    <div className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">{selectedIssue.id}</div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{selectedIssue.title}</h2>
                 </div>
                 <button onClick={closeDrawer} className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">ZONE CONTROL</div>
                    <div className="text-sm font-black text-slate-900">{selectedIssue.location.district}</div>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">AI CLASSIFICATION</div>
                    <div className="text-sm font-black text-indigo-600">URGENCY {selectedIssue.urgencyScore}%</div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ground Intelligence</h3>
                 <p className="text-lg font-medium text-slate-700 leading-relaxed font-serif italic">"{selectedIssue.description}"</p>
              </div>

              <div className="bg-indigo-950 rounded-[3rem] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-indigo-900/40">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <MapPin className="w-5 h-5 text-indigo-400" />
                       <div className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">DIGIPIN GRID REFERENCE</div>
                    </div>
                    <div className="text-4xl font-black tracking-widest font-mono">{selectedIssue.digiPin}</div>
                    <div>
                       <div className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Landmark Entry</div>
                       <div className="text-lg font-bold text-slate-200">{selectedIssue.landmark || 'Not specified'}</div>
                    </div>
                 </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                 <div className="flex gap-4">
                    {selectedIssue.status === 'submitted' && (
                       <button onClick={() => dispatchAI(selectedIssue)} className="flex-1 h-16 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5 fill-current" /> Dispatch Logic Control
                       </button>
                    )}
                    {selectedIssue.status === 'assigned' && (
                       <button className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                          Track Mission Signal
                       </button>
                    )}
                    <button className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><MapPin className="w-6 h-6" /></button>
                 </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
