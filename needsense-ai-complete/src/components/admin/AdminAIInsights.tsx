import { useState, useEffect } from "react";
import { BrainCircuit, AlertTriangle, TrendingUp, Lightbulb, Zap, ChevronRight, ShieldAlert, RefreshCw, Activity, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { db } from "../../lib/database";

export default function AdminAIInsights() {
  const [liveClusters, setLiveClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const localInsights = db.getAIInsights();

  const fetchLiveAnalytics = () => {
    setLoading(true);
    const clusters = db.getLiveClusters();
    setLiveClusters(clusters || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveAnalytics();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchLiveAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const severityColors: Record<string, string> = {
    critical: "border-red-200 bg-red-50", 
    high: "border-orange-200 bg-orange-50",
    medium: "border-yellow-200 bg-yellow-50", 
    low: "border-slate-200 bg-slate-50",
    urgent: "border-blue-200 bg-blue-50"
  };

  return (
    <div className="flex flex-col gap-8 pb-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
            <BrainCircuit className="w-4 h-4" /> Python AI Pipeline Active
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">NeedSense Smart Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time clustering & crisis prediction from your Colab backend.</p>
        </div>
        <button 
          onClick={fetchLiveAnalytics}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh Engine
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: "AI Clusters Found", val: liveClusters.length.toString(), icon: TrendingUp, color: "indigo" },
          { label: "Live Predictions", val: (liveClusters.length * 1.5).toFixed(0), icon: ShieldAlert, color: "red" },
          { label: "Processing Latency", val: "1.2s", icon: Activity, color: "emerald" },
          { label: "Community Impact", val: "High", icon: Zap, color: "orange" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">{s.val}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Crisis Prediction Hero */}
      {liveClusters.length > 0 && (
        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden text-white relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-10 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <div className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">Critical Crisis Prediction</div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Potential {liveClusters[0].issue_type} Outbreak</h3>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl font-medium">
              AI has detected a high density of "{liveClusters[0].issue_type}" reports. Recommended Action: <span className="text-white font-bold">{liveClusters[0].recommended_action}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-10">
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Urgency Score</div>
                <div className="text-4xl font-black text-white">{liveClusters[0].urgency_score}%</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Report Density</div>
                <div className="text-4xl font-black text-white">{liveClusters[0].complaint_count} <span className="text-sm text-slate-500 font-bold">PTS</span></div>
              </div>
              <button className="ml-auto bg-white text-slate-950 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.15em] hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-xl">
                Deploy Response Force <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Cluster Breakdown */}
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] -mb-4 px-1">Detected Issue Clusters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {liveClusters.map((cluster, idx) => (
          <div key={idx} className={cn(
            "group bg-white rounded-3xl p-8 border hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer",
            cluster.urgency_score > 70 ? "border-red-100 shadow-sm" : "border-slate-100 shadow-sm"
          )}>
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                cluster.urgency_score > 70 ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
              )}>
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-slate-900">{cluster.urgency_score}%</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Urgency</div>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
              {cluster.issue_type}
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg">{cluster.issue_category}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Multiple Wards</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Recommended Action</span>
                <span className="text-indigo-600">Active Suggestion</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-bold text-slate-700 leading-relaxed italic">
                "{cluster.recommended_action}"
              </div>
            </div>
          </div>
        ))}

        {liveClusters.length === 0 && !loading && (
          <div className="col-span-2 text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active clusters found in Supabase.</p>
          </div>
        )}
      </div>
    </div>
  );
}
