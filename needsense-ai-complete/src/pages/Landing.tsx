import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Users, Camera, BrainCircuit, CheckCircle2, MapPin, Activity, ShieldAlert, ShieldCheck, BarChart3, ArrowRight, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-[Inter] text-slate-900 selection:bg-indigo-200 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 z-[100] w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-xl shadow-indigo-500/20">N</div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">NEEDSENSE AI</span>
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-slate-400 mt-1 uppercase">Civic Intelligence Engine</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 font-bold text-sm text-slate-500">
            <a href="#solutions" className="hover:text-indigo-600 transition-all hover:scale-105">Solutions</a>
            <a href="#roles" className="hover:text-indigo-600 transition-all hover:scale-105">Join Network</a>
            <a href="#impact" className="hover:text-indigo-600 transition-all hover:scale-105">Global Impact</a>
            <Link to="/login" className="hover:text-indigo-600 transition-all hover:scale-105">Admin Portal</Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/login" className="hidden sm:flex bg-slate-900 hover:bg-black text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xl shadow-slate-900/20 items-center gap-2 active:scale-95 uppercase tracking-widest">
              Launch App
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all active:scale-90"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={cn(
          "lg:hidden fixed inset-0 top-[80px] sm:top-[96px] bg-white z-[90] transition-all duration-500 ease-in-out transform",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}>
          <div className="p-8 space-y-8 h-full flex flex-col">
            <nav className="flex flex-col gap-6">
              {[
                { label: 'Solutions', href: '#solutions' },
                { label: 'Join Network', href: '#roles' },
                { label: 'Global Impact', href: '#impact' },
                { label: 'Admin Portal', href: '/login', isLink: true },
              ].map((item, i) => (
                item.isLink ? (
                  <Link 
                    key={i} 
                    to={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black text-slate-900 hover:text-indigo-600 transition-all"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a 
                    key={i} 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black text-slate-900 hover:text-indigo-600 transition-all"
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>
            <div className="mt-auto space-y-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-center text-lg shadow-2xl shadow-indigo-600/30">
                REPORT AN ISSUE
              </Link>
              <div className="flex justify-between items-center px-4 py-2 border-t border-slate-100 pt-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect with us</span>
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">𝕏</div>
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative pt-32 sm:pt-48 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white -z-10" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 animate-pulse" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/5 text-indigo-600 text-[10px] sm:text-xs font-black tracking-[0.15em] mb-10 border border-indigo-500/10 uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                </span>
                Standard Intelligence Mode Active
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tight text-slate-900 leading-[0.95] mb-8">
                Building the <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">Responsive City</span><br/>
                Through AI.
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                The world's first <strong className="text-slate-900 font-black">AI-Driven Civic Engine</strong> that bridges the gap between community reports and rapid volunteer resolution.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2.5xl text-base font-black transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95 group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Start Reporting
                </Link>
                <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2.5xl text-base font-black transition-all flex items-center justify-center gap-3 shadow-sm hover:border-slate-300 active:scale-95">
                  <Users className="w-5 h-5" /> Join Network
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative aspect-square max-h-[560px] flex items-center justify-center">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/40 via-transparent to-transparent" />
                <svg className="absolute inset-0 w-full h-full text-slate-800" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M20,80 Q50,40 80,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M30,10 Q60,60 90,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  {[10,50,90,20,80,40,70,30,60].map((cx,i) => <circle key={i} cx={cx} cy={[50,50,50,80,80,30,30,60,20][i]} r="1" fill="#818cf8" />)}
                </svg>
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 border border-white/10">
                  <BrainCircuit className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">NEEDSENSE AI</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Detected <span className="text-indigo-400 font-bold">14 duplicate reports</span> in District 4. Consolidating into <span className="text-violet-400 font-mono text-xs">Priority #0317</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-14 border-y border-slate-200/60 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { val: '1,200+', label: 'Issues Resolved' },
                { val: '500+', label: 'Active Volunteers' },
                { val: '24h', label: 'Avg. Response Time' },
                { val: '98.4%', label: 'AI Accuracy' },
              ].map((s,i) => (
                <div key={i} className="flex flex-col items-center justify-center py-4">
                  <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">{s.val}</div>
                  <div className="text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resolution Pipeline */}
        <section id="solutions" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Resolution Engine</h2>
              <p className="text-lg text-slate-600">A seamless pipeline from local concern to verifiable solution.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 -z-10" />
              {[
                { icon: Camera, title: '1. Report', desc: 'Snap a photo and describe the issue. Our platform captures GPS and category metadata automatically.', color: 'slate' },
                { icon: BrainCircuit, title: '2. AI Analysis', desc: 'NEEDSENSE AI prioritizes issues, detects urgency, and routes them to the correct volunteer team.', color: 'indigo' },
                { icon: CheckCircle2, title: '3. Resolution', desc: 'Real-time status tracking until the problem is fixed. Transparency at every step for the community.', color: 'emerald' },
              ].map((step,i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-${step.color}-100 flex items-center justify-center mb-6`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Find Your Role</h2>
              <p className="text-lg text-slate-600">Join the ecosystem rebuilding our cities from the ground up.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: 'Citizen', desc: 'Be the eyes of your community. Report issues, track resolution.', btn: 'Start Reporting', link: '/login', dark: false },
                { icon: Users, title: 'Volunteer', desc: 'Join forces to solve verified community needs. Make real impact.', btn: 'Join The Network', link: '/login', dark: true },
                { icon: ShieldCheck, title: 'Admin / NGO', desc: 'Scale your impact with data-driven AI predictions & analytics.', btn: 'Access Dashboard', link: '/login', dark: false },
              ].map((role,i) => (
                <div key={i} className={`rounded-3xl p-8 border flex flex-col ${role.dark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20 md:-translate-y-4' : 'bg-white border-slate-200 shadow-lg'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${role.dark ? 'bg-indigo-500/20' : 'bg-slate-100'}`}>
                    <role.icon className={`w-6 h-6 ${role.dark ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${role.dark ? 'text-white' : 'text-slate-900'}`}>{role.title}</h3>
                  <p className={`mb-8 flex-grow ${role.dark ? 'text-slate-300' : 'text-slate-600'}`}>{role.desc}</p>
                  <Link to={role.link} className={`w-full py-3.5 rounded-xl font-bold text-center block transition-colors ${role.dark ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20' : 'border-2 border-slate-200 text-slate-900 hover:bg-slate-50'}`}>
                    {role.btn}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative flex justify-center">
                <div className="relative w-[300px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                    <div className="w-32 h-full bg-slate-800 rounded-b-xl"></div>
                  </div>
                  <div className="absolute inset-0 bg-slate-100 flex flex-col">
                    <div className="pt-12 pb-4 px-6 bg-white shadow-sm z-10">
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600" /> SAFE CITY MAP
                      </h4>
                    </div>
                    <div className="flex-grow relative bg-slate-200">
                      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          <span className="text-xs font-bold text-slate-500 tracking-wider">LIVE MAP FEED</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">New pothole reported on NH-16.</p>
                        <p className="text-xs text-slate-500 mt-1">Just now · District 1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Real-Time Transparency</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Watch your community transform in real-time. Our live map provides unprecedented visibility into civic issues and their resolution status.
                </p>
                <ul className="space-y-6">
                  {[
                    { icon: Activity, title: 'Live Issue Tracking', desc: 'Follow every report from submission to resolution.', color: 'indigo' },
                    { icon: BarChart3, title: 'Impact Analytics', desc: 'See the tangible difference volunteers are making.', color: 'orange' },
                  ].map((f,i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${f.color}-100 flex items-center justify-center shrink-0`}>
                        <f.icon className={`w-6 h-6 text-${f.color}-600`} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{f.title}</h4>
                        <p className="text-slate-600">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">N</div>
                <span className="font-bold text-lg tracking-tight text-white">NEEDSENSE AI</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">Empowering communities through intelligent automation and transparent civic action.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div>
                <h4 className="text-white font-bold mb-4">Platform</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  {['Dashboard', 'Complaints', 'AI Predictions', 'Volunteer Network'].map(l => (
                    <li key={l}><a href="#" className="hover:text-indigo-400 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  {['About Us', 'Careers', 'Press', 'Contact'].map(l => (
                    <li key={l}><a href="#" className="hover:text-indigo-400 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 NeedSense AI. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
