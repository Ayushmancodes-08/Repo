import { Calendar, Download, ChevronDown, BarChart3, TrendingDown, Users, PieChart, MapPin } from "lucide-react";
import { db } from "../../lib/database";

export default function AdminReports() {
  const stats = db.getStats();

  return (
    <div className="flex flex-col gap-8 pb-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Comprehensive analytics on civic data, AI performance, and resource allocation.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
            <Calendar className="w-4 h-4" /> Last 30 Days <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: BarChart3, label: "Total Data Points", val: "1,284,092", change: "+14.2%", color: "indigo" },
          { icon: PieChart, label: "Prediction Accuracy", val: "94.8%", change: "+2.1%", color: "violet" },
          { icon: TrendingDown, label: "Response Trend", val: "-4.2 hrs", change: "Faster resolution", color: "emerald" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600`}><s.icon className="w-5 h-5" /></div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-2">{s.val}</div>
            <div className="text-sm font-medium text-emerald-600">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues Over Time Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Issues Over Time</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-600"></span><span className="text-xs font-medium text-slate-600">Reported</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-xs font-medium text-slate-600">Resolved</span></div>
            </div>
          </div>
          <div className="h-64 relative w-full flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />
              <path d="M0 80 Q 10 70, 20 75 T 40 60 T 60 40 T 80 50 T 100 30" fill="none" stroke="#4f46e5" strokeWidth="2" />
              <path d="M0 90 Q 10 85, 20 80 T 40 70 T 60 55 T 80 60 T 100 45" fill="none" stroke="#10b981" strokeWidth="2" />
              <path d="M0 80 Q 10 70, 20 75 T 40 60 T 60 40 T 80 50 T 100 30 L 100 100 L 0 100 Z" fill="url(#grad1)" opacity="0.1" />
              <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#4f46e5" stopOpacity="0" /></linearGradient></defs>
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] font-bold text-slate-400 uppercase transform translate-y-6">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Category Breakdown</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-44 h-44 rounded-full border-[14px] border-slate-100 relative">
              <div className="absolute inset-[-14px] rounded-full border-[14px] border-indigo-600" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
              <div className="absolute inset-[-14px] rounded-full border-[14px] border-violet-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)' }}></div>
              <div className="absolute inset-[-14px] rounded-full border-[14px] border-orange-400" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{stats.issuesByCategory.waste}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Waste</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Waste Mgmt", color: "bg-indigo-600", val: `${stats.issuesByCategory.waste}` },
              { label: "Water", color: "bg-violet-500", val: `${stats.issuesByCategory.water}` },
              { label: "Road & Traffic", color: "bg-orange-400", val: `${stats.issuesByCategory.road + stats.issuesByCategory.traffic}` },
              { label: "Safety & Health", color: "bg-slate-300", val: `${stats.issuesByCategory.safety + stats.issuesByCategory.health}` },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${c.color}`}></span><span className="text-sm font-medium text-slate-700">{c.label}</span></div>
                <span className="text-sm font-bold text-slate-900">{c.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Heatmap Density</h3>
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden relative min-h-[200px]">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-red-500/40 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-orange-500/30 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-500/40 rounded-full blur-lg"></div>
          </div>
        </div>

        {/* AI Insights Summary */}
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">AI Insights Summary</h3>
          <div className="space-y-3 flex-1">
            {db.getAIInsights().slice(0, 3).map((insight, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${insight.severity === 'critical' ? 'text-red-500' : insight.type === 'efficiency' ? 'text-emerald-500' : 'text-indigo-500'}`}>{insight.type}</div>
                <p className="text-sm text-slate-700 font-medium">{insight.description.substring(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Engagement */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Volunteer Activity</h3>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 flex items-end gap-3 h-48">
            {[40, 60, 45, 80, 65, 90, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-indigo-100 rounded-t-md relative h-full">
                  <div className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded-t-md transition-all duration-300 hover:bg-indigo-500" style={{ height: `${val}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
