import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, MapPin, Users, ArrowRight, BrainCircuit, Lock, Building2, Phone, Map as MapIcon, Star, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { db } from "../lib/database";

type Role = "citizen" | "volunteer" | "admin";

export default function Login() {
  const [role, setRole] = useState<Role>("citizen");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Citizen specific
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [ward, setWard] = useState("");

  // Admin specific
  const [ngoName, setNgoName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [ngoCategory, setNgoCategory] = useState<any>("Sanitation");
  const [hqAddress, setHqAddress] = useState("");
  const [operationalRegion, setOperationalRegion] = useState("");

  // Volunteer specific
  const [mobile, setMobile] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [digipin, setDigipin] = useState("");
  const [radius, setRadius] = useState(5);
  const [availability, setAvailability] = useState<any>("Always Available");
  const [experience, setExperience] = useState<any>("Beginner");
  const [volNgoName, setVolNgoName] = useState("");

  const skillOptions = ["Sanitation / Cleaning", "Medical / First Aid", "Disaster Relief", "Food Distribution", "Counseling", "Logistics", "Technical Support"];
  const ngoCategories = ["Healthcare", "Sanitation", "Disaster Relief", "Child Welfare", "Environment"];

  useEffect(() => {
    setError("");
    if (isLogin) {
      if (role === "admin") { setEmail("admin@needsense.ai"); setPassword("admin123"); }
      else if (role === "citizen") { setEmail("rohan@mail.com"); setPassword("citizen123"); }
      else { setEmail("arjun@mail.com"); setPassword("volunteer123"); }
    } else {
      setEmail(""); setPassword("");
    }
  }, [role, isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Mock auth logic
      const authData = { role, email, name: role === 'admin' ? 'NGO Head' : 'User' };
      localStorage.setItem('needsense_auth', JSON.stringify(authData));
      navigate(role === "admin" ? "/admin" : role === "citizen" ? "/citizen" : "/volunteer");
    } else {
      // Signup logic - simple local storage save for demo
      if (role === "citizen") {
        db.addIssue({} as any); // just a placeholder for now to test DB access if needed
        localStorage.setItem('needsense_auth', JSON.stringify({ role, email, name }));
      }
      navigate(role === "admin" ? "/admin" : role === "citizen" ? "/citizen" : "/volunteer");
    }
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-[Inter] selection:bg-indigo-200 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-white -z-10" />
      
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left Branding */}
        <div className="md:w-4/12 bg-slate-900 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-3xl -z-10" />
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12 inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">N</div>
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">NEEDSENSE AI</span>
            </Link>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Empowering <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Civic Intelligence</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">Join the platform connecting citizens, NGOs, and volunteers for a better city.</p>
          </div>
          <div className="relative z-10 mt-12 space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-slate-300 font-medium">"NeedSense bridge the gap between reporting and resolution with AI-driven clustering."</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-8/12 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col overflow-y-auto max-h-[85vh] md:max-h-[90vh] scrollbar-hide">
          <div className="max-w-2xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  {isLogin ? "Welcome Back" : `Join as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                </h3>
                <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest">
                  {isLogin ? "Neural uplink ready" : "Registering new operative"}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                className="text-xs sm:text-sm font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl transition-all active:scale-95 w-fit"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              {[
                { id: "citizen", icon: MapPin, label: "Citizen" },
                { id: "volunteer", icon: Users, label: "Volunteer" },
                { id: "admin", icon: ShieldCheck, label: "NGO Admin" },
              ].map(r => (
                <button 
                  key={r.id} 
                  type="button"
                  onClick={() => setRole(r.id as Role)}
                  className={cn(
                    "flex flex-row sm:flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all active:scale-95",
                    role === r.id 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xl shadow-indigo-600/10" 
                      : "border-slate-100 hover:border-slate-200 text-slate-400"
                  )}
                >
                  <r.icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest truncate">{r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                 <div className="space-y-2.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Access Email</label>
                   <input 
                     type="email" 
                     value={email} 
                     onChange={e => setEmail(e.target.value)} 
                     placeholder="name@needsense.ai"
                     className="w-full px-5 py-4 sm:py-5 rounded-2xl border-2 border-slate-100 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 focus:border-indigo-500 focus:bg-white bg-slate-50 placeholder:text-slate-300 text-sm sm:text-base" 
                     required 
                   />
                 </div>
                 <div className="space-y-2.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Security Key</label>
                   <input 
                     type="password" 
                     value={password} 
                     onChange={e => setPassword(e.target.value)} 
                     placeholder="••••••••"
                     className="w-full px-5 py-4 sm:py-5 rounded-2xl border-2 border-slate-100 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 focus:border-indigo-500 focus:bg-white bg-slate-50 placeholder:text-slate-300 text-sm sm:text-base" 
                     required 
                   />
                 </div>
              </div>

              {!isLogin && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  {/* Role Specific Signup Fields */}
                  {role === "citizen" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Area / Ward</label>
                        <input type="text" value={area} onChange={e => setArea(e.target.value)} placeholder="Sector 4 / Ward 12"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Residential Address</label>
                        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address details"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" rows={2} required />
                      </div>
                    </div>
                  )}

                  {role === "admin" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">NGO Name</label>
                        <input type="text" value={ngoName} onChange={e => setNgoName(e.target.value)} placeholder="Save The City NGO"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">NGO Registration Number</label>
                        <input type="text" value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="NGO/2026/XXXX"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">NGO Category</label>
                        <select value={ngoCategory} onChange={e => setNgoCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium">
                          {ngoCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Operational City / Region</label>
                        <input type="text" value={operationalRegion} onChange={e => setOperationalRegion(e.target.value)} placeholder="Bhubaneswar"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Headquarters Address</label>
                        <input type="text" value={hqAddress} onChange={e => setHqAddress(e.target.value)} placeholder="Plot 42, Saheed Nagar"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                    </div>
                  )}

                  {role === "volunteer" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Arjun Pandit"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mobile Number</label>
                        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Current Location (DIGIPIN)</label>
                        <input type="text" value={digipin} onChange={e => setDigipin(e.target.value)} placeholder="India Post DIGIPIN"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Working Radius (km)</label>
                        <input type="number" value={radius} onChange={e => setRadius(parseInt(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Availability Type</label>
                        <select value={availability} onChange={e => setAvailability(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                          <option>Always Available</option>
                          <option>Weekends Only</option>
                          <option>Evenings Only</option>
                          <option>Morning Only</option>
                          <option>Emergency Only</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Experience Level</label>
                        <select value={experience} onChange={e => setExperience(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                          <option>Beginner</option>
                          <option>Skilled</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Skills (Multi-select)</label>
                        <div className="flex flex-wrap gap-2">
                          {skillOptions.map(skill => (
                            <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                              className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                skills.includes(skill) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300")}>
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-base hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
                {isLogin ? "Sign In to Dashboard" : "Complete Registration"} <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {isLogin && (
              <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Demo Access</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { l: 'Admin', e: 'admin@needsense.ai', p: 'admin123' },
                    { l: 'Citizen', e: 'rohan@mail.com', p: 'citizen123' },
                    { l: 'Volunteer', e: 'arjun@mail.com', p: 'volunteer123' },
                  ].map(d => (
                    <button key={d.l} type="button" onClick={() => { setRole(d.l.toLowerCase() as Role); setEmail(d.e); setPassword(d.p); }}
                      className="text-left p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 transition-all group">
                      <div className="text-[10px] font-black text-indigo-600 uppercase mb-1">{d.l}</div>
                      <div className="text-[10px] font-bold text-slate-500 truncate">{d.e}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
