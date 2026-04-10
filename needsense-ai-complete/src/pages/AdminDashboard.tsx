import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Map, FileText, BarChart2, Users, Plus, Settings, HelpCircle, Search, Bell, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import AdminOverview from "../components/admin/AdminOverview";
import AdminImpactMap from "../components/admin/AdminImpactMap";
import AdminComplaints from "../components/admin/AdminComplaints";
import AdminReports from "../components/admin/AdminReports";
import AdminVolunteers from "../components/admin/AdminVolunteers";

const NAV_ITEMS = [
  { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { id: "impact-map", icon: Map, label: "Impact Map" },
  { id: "complaints", icon: FileText, label: "Complaints / Issue Management" },
  { id: "volunteers", icon: Users, label: "Volunteers" },

  { id: "reports", icon: BarChart2, label: "Reports" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 font-[Inter] overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-black">N</div>
            NeedSense <span className="text-slate-500 font-normal text-sm">/ Admin</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-lg shadow-indigo-900/40 mb-8 active:scale-95">
            <Plus className="w-5 h-5" /> New Initiative
          </button>
          
          <nav className="space-y-1.5">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Management</span>
            </div>
            {NAV_ITEMS.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                  activeTab === item.id 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-colors", activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300")} /> 
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 mt-auto border-t border-slate-800 space-y-1.5">
          <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
            <Settings className="w-5 h-5 text-slate-500" /> Settings
          </button>
          <button onClick={() => { localStorage.removeItem('needsense_auth'); navigate('/login'); }}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5 text-slate-500" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:scale-95">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block w-72 lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Command Center..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none shadow-sm" />
            </div>
            <div className="md:hidden">
               <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Admin</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
              <Bell className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3 group cursor-pointer p-1.5 hover:bg-slate-50 rounded-2xl transition-all">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">Admin User</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Head</div>
              </div>
              <div className="relative">
                 <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border-2 border-white shadow-lg group-hover:border-indigo-500 transition-all" />
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/50 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto min-h-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === "overview" && <AdminOverview />}
              {activeTab === "impact-map" && <AdminImpactMap />}
              {activeTab === "complaints" && <AdminComplaints />}
              {activeTab === "volunteers" && <AdminVolunteers />}
              {activeTab === "reports" && <AdminReports />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
