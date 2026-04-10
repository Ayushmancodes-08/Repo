import { FileText, AlertTriangle, CheckCircle2, Activity, TrendingUp, TrendingDown, MapPin, Clock, AlertCircle, BrainCircuit, BarChart2, Filter, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { db } from "../../lib/database";
import { geminiService } from "../../lib/gemini";
import { simulationEngine } from "../../lib/simulation";
import { useState, useEffect } from "react";

export default function AdminOverview() {
  const [stats, setStats] = useState(db.getStats());
  const [issues, setIssues] = useState(db.getIssues());
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("Analyzing municipal data for potential risk clusters...");
  const [recentIssues, setRecentIssues] = useState(issues.slice(0, 4));
  const insights = db.getAIInsights().slice(0, 2);

  useEffect(() => {
    const fetchData = async () => {
      const pred = await geminiService.predictCrisis(issues.slice(0, 10));
      setAiAnalysis(pred);
    };
    fetchData();
  }, [issues]);

  const runSimulation = async () => {
    setIsSimulating(true);
    await simulationEngine.runFullCycle();
    setIssues(db.getIssues());
    setStats(db.getStats());
    setRecentIssues(db.getIssues().slice(0, 4));
    setIsSimulating(false);
  };

  const kpis = [
    { icon: FileText, label: "Total Reports", value: stats.totalIssues, change: -12, positive: true, color: "indigo" },
    { icon: AlertTriangle, label: "Critical Priority", value: stats.urgentIssues, change: 5, positive: false, color: "red" },
    { icon: Activity, label: "Field Operations", value: stats.activeIssues, change: 8, positive: false, color: "blue" },
    { icon: Activity, label: "Ready Volunteers", value: stats.activeVolunteers, change: 18, positive: true, color: "emerald" },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-50 text-indigo-600';
      case 'red': return 'bg-red-50 text-red-600';
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">Intelligence Center</h1>
          <p className="text-slate-500 font-medium">Monitoring municipal efficiency and AI-driven mission dispatch.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className={cn("flex items-center gap-2 px-6 py-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-[12px] font-black text-indigo-700 uppercase tracking-widest hover:bg-white transition-all shadow-sm", 
              isSimulating && "opacity-50 cursor-not-allowed")}
          >
            <BrainCircuit className={cn("w-4 h-4", isSimulating && "animate-spin")} /> 
            {isSimulating ? "Simulation Active..." : "Run AI Simulation"}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <BarChart2 className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group border-b-4" style={{borderBottomColor: kpi.color === 'emerald' ? '#10b981' : kpi.color === 'red' ? '#ef4444' : kpi.color === 'blue' ? '#3b82f6' : '#6366f1'}}>
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", getColorClasses(kpi.color))}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className={cn("flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                kpi.positive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50")}>
                {kpi.positive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(kpi.change)}%
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{kpi.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Impact Map Preview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden group">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                Geospatial Impact Control
              </h2>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Analytics →</button>
            </div>
            <div className="h-[320px] bg-slate-50 relative overflow-hidden">
               <div className="absolute inset-0 grayscale opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80)', backgroundSize: 'cover' }}></div>
               <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[1px]"></div>
               
               {/* Hotspots */}
               <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-red-500/30 rounded-full blur-[40px] animate-pulse"></div>
               <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-xl z-10"></div>
               
               <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-indigo-500/20 rounded-full blur-[50px]"></div>
               <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-xl z-10"></div>
               
               {/* Floating Stats */}
               <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 min-w-[160px]">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Latency</div>
                      <div className="text-xl font-black text-indigo-600">24.2 min</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 min-w-[160px]">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Cluster</div>
                      <div className="text-xl font-black text-red-600">District 4</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Recent Operations */}
          <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3"><Clock className="w-6 h-6 text-indigo-600" /> Operational Feed</h2>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Dispatch Log →</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentIssues.map((issue, i) => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2",
                      issue.urgency === "critical" ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{issue.title}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{issue.location.district} <span className="mx-2 opacity-30">|</span> {issue.category}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn("px-3 py-1 text-[8px] font-black rounded-full uppercase tracking-widest border",
                      issue.urgency === "critical" ? "bg-red-100/50 text-red-700 border-red-200" : "bg-slate-100 text-slate-500 border-slate-200")}>
                      {issue.urgency} Priority
                    </span>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter opacity-70">{issue.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Prediction & Analytics Column */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden text-white relative h-full flex flex-col">
            <div className="p-10 space-y-8 flex-1">
              <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
                <BrainCircuit className="w-5 h-5" /> AI Risk Forecast
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 w-3 h-3 rounded-full shrink-0 bg-red-500 animate-ping"></div>
                    <div>
                      <h4 className="font-black text-white text-lg uppercase tracking-tight mb-2">Cluster Escalation</h4>
                      <p className="text-sm font-medium text-slate-400 leading-relaxed mb-4">{aiAnalysis}</p>
                      <div className="flex items-center gap-4">
                         <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[92%] transition-all duration-[2000ms]"></div>
                         </div>
                         <span className="text-[10px] font-black text-red-500">92% CONFIDENCE</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                   <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Sentiment Analytics</h3>
                   <div className="space-y-6">
                    {[
                      { label: "Community Trust", val: 88, color: "bg-indigo-500" },
                      { label: "AI Dispatch Error Rate", val: 0.2, color: "bg-emerald-500" },
                      { label: "Resolution Velocity", val: 74, color: "bg-amber-500" },
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
                          <span>{m.label}</span>
                          <span className="text-white">{m.val}{m.label.includes('Rate') ? '%' : ''}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full transition-all duration-[1500ms] shadow-[0_0_10px_rgba(99,102,241,0.5)]`} style={{ width: `${m.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-indigo-600 mt-auto">
               <button className="w-full text-center text-[12px] font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2 hover:translate-x-1 transition-transform">
                  Access Neural Hub <ChevronDown className="w-4 h-4 -rotate-90" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
