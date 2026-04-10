import { AlertTriangle, Plus, Minus, Crosshair, Layers, Share2, MapPin, BrainCircuit, Activity } from "lucide-react";
import { db, Issue } from "../../lib/database";
import { useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { cn } from "../../lib/utils";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function AdminImpactMap() {
  const stats = db.getStats();
  const clusters = db.getClusters();
  const allIssues = db.getIssues().filter(i => i.status !== 'resolved' && i.status !== 'closed');
  
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [activeLayers, setActiveLayers] = useState({ clusters: true, predictions: true });

  const getClusterColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'; // Red
      case 'urgent': return '#f97316';   // Orange
      default: return '#eab308';         // Yellow
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Impact Control Hub</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Geospatial district triage & crisis escalation clusters</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden flex relative min-h-[700px]">
        {/* Intelligence Panel */}
        <div className="w-[380px] bg-slate-50 border-r border-slate-200 flex flex-col z-10 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* AI Risk Alert */}
            <div className="bg-indigo-950 text-white rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-300 tracking-[0.2em] uppercase">Neural Prediction</span>
              </div>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                <span className="text-white font-black">District 4</span> shows 84% probability of <span className="text-red-400">Escalation Priority</span>. Dispatching skilled units recommended.
              </p>
              <div className="mt-6 flex items-center justify-between">
                 <div className="text-[10px] font-black uppercase text-indigo-400">Risk Index: 9.2/10</div>
                 <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
            </div>

            {/* Layer Toggles */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Overlay Control</h3>
              <div className="space-y-4">
                {[
                  { id: 'clusters', label: "District Incident Clusters", color: "bg-red-500" },
                  { id: 'predictions', label: "AI Crisis Forecast Zones", color: "bg-indigo-600" },
                ].map((layer) => (
                  <button 
                    key={layer.id}
                    onClick={() => setActiveLayers(prev => ({ ...prev, [layer.id as keyof typeof activeLayers]: !prev[layer.id as keyof typeof activeLayers] }))}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                      activeLayers[layer.id as keyof typeof activeLayers] ? "bg-white border-indigo-200 shadow-sm" : "bg-slate-100 border-transparent opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", layer.color)}></div>
                      <span className="text-xs font-black text-slate-700">{layer.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Clusters List */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Active Clusters ({clusters.length})</h3>
              <div className="space-y-3">
                {clusters.map((cluster, i) => (
                   <div 
                    key={i} 
                    onClick={() => setSelectedCluster(cluster)}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-xl hover:border-indigo-400 cursor-pointer transition-all group"
                   >
                     <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase tracking-widest">{cluster.district}</span>
                        <div className="flex items-center gap-1.5">
                           <div className={cn("w-2 h-2 rounded-full", cluster.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500')}></div>
                           <span className="text-[10px] font-black uppercase text-slate-400">{cluster.count} Issues</span>
                        </div>
                     </div>
                     <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate">
                        {cluster.issues[0]?.title || 'Cluster Base'}
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-100">
          <MapContainer 
            center={[20.2961, 85.8245]} 
            zoom={13} 
            className="w-full h-full grayscale-[0.2]"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {activeLayers.predictions && (
               <Circle 
                 center={[20.2961, 85.8245]} 
                 radius={2000} 
                 pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }} 
               />
            )}

            {activeLayers.clusters && clusters.map((cluster, idx) => (
              <Circle 
                key={idx}
                center={[cluster.center.lat, cluster.center.lng]} 
                radius={800} 
                eventHandlers={{ click: () => setSelectedCluster(cluster) }}
                pathOptions={{ 
                  color: getClusterColor(cluster.severity), 
                  fillColor: getClusterColor(cluster.severity), 
                  fillOpacity: 0.2,
                  weight: 2
                }} 
              />
            ))}

            {allIssues.map(issue => (
              <Marker 
                key={issue.id} 
                position={[issue.location.lat, issue.location.lng]}
              >
                <Popup className="custom-popup">
                   <div className="p-2 space-y-3 min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded uppercase tracking-widest">{issue.id}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{issue.status}</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">{issue.title}</h4>
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DIGIPIN GRID</div>
                        <div className="text-[10px] font-black text-indigo-600 tracking-widest">{issue.digiPin}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LANDMARK</div>
                        <div className="text-[10px] font-black text-slate-700">{issue.landmark || 'Near Main Gate'}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">urgency score</div>
                         <div className="text-xs font-black text-red-600">{issue.urgencyScore}%</div>
                      </div>
                   </div>
                </Popup>
              </Marker>
            ))}

            <MapController center={selectedCluster ? [selectedCluster.center.lat, selectedCluster.center.lng] : [20.2961, 85.8245]} />
          </MapContainer>
          
          {/* Cluster Summary Card Overaly */}
          {selectedCluster && (
            <div className="absolute top-8 left-8 right-8 flex justify-center z-[1000] pointer-events-none">
               <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/50 w-full max-w-2xl flex items-center justify-between pointer-events-auto animate-in slide-in-from-top-10 duration-500">
                  <div className="flex items-center gap-8">
                     <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center text-white", 
                        selectedCluster.severity === 'critical' ? 'bg-red-600 shadow-xl shadow-red-500/20' : 'bg-orange-600 shadow-xl shadow-orange-500/20'
                     )}>
                        <AlertTriangle className="w-10 h-10" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{selectedCluster.district} Cluster</span>
                           <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedCluster.count} PRIORITY ALERTS</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Cluster Resolution Required</h2>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Dispatch Task</button>
                     <button onClick={() => setSelectedCluster(null)} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <Plus className="w-6 h-6 rotate-45" />
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-[1000]">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
              <button className="p-4 hover:bg-slate-50 text-slate-700 border-b border-slate-100"><Plus className="w-5 h-5" /></button>
              <button className="p-4 hover:bg-slate-50 text-slate-700"><Minus className="w-5 h-5" /></button>
            </div>
            <button className="p-4 bg-indigo-600 rounded-2xl shadow-2xl text-white hover:bg-indigo-700 shadow-indigo-600/30">
               <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
