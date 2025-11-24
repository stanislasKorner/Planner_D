import React, { useState, useRef, useEffect } from 'react';
import { Attraction } from '../types';
import { Map as MapIcon, Satellite, ExternalLink, ZoomIn, ZoomOut, RefreshCcw, Navigation } from 'lucide-react';

interface Props {
  path: string[];
  attractions: Attraction[];
  hoveredId?: string | null;
}

export const MapVisualization: React.FC<Props> = ({ path, attractions, hoveredId }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const pathAttractions = path
    .map(id => attractions.find(a => a.id === id))
    .filter((a): a is Attraction => !!a);

  if (pathAttractions.length === 0) return <div className="w-full h-full flex items-center justify-center text-gray-400">Chargement...</div>;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
  });
  const handleReset = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const openGoogleMapsRoute = () => {
      const origin = "Disneyland Paris Entrance";
      const waypoints = pathAttractions.slice(0, 8).map(a => encodeURIComponent(`${a.name} Disneyland Paris`)).join('|');
      const destination = pathAttractions.length > 8 ? encodeURIComponent(`${pathAttractions[pathAttractions.length-1].name} Disneyland Paris`) : "Sleeping Beauty Castle Disneyland Paris";
      
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;
      window.open(url, '_blank');
  };

  const generatePath = () => {
      if (pathAttractions.length < 2) return "";
      let d = `M ${pathAttractions[0].x} ${pathAttractions[0].y}`;
      for (let i = 0; i < pathAttractions.length - 1; i++) {
          const p1 = pathAttractions[i];
          const p2 = pathAttractions[i+1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          d += ` Q ${midX} ${p1.y}, ${midX} ${midY} T ${p2.x} ${p2.y}`;
      }
      return d;
  };

  return (
    <div className="flex flex-col h-full bg-white relative group overflow-hidden">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-sm border border-slate-200 text-xs font-bold text-slate-500">
            <MapIcon className="inline w-3 h-3 mr-1" /> Plan du Parc
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20">
         <button onClick={openGoogleMapsRoute} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
            <Navigation size={14} /> Ouvrir dans Google Maps
         </button>
      </div>
      <div className="relative w-full h-full overflow-hidden bg-[#F0F4F8]" ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}>
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
            <button onClick={handleZoomIn} className="p-2 bg-white rounded-lg shadow-md text-slate-600 hover:text-indigo-600"><ZoomIn size={18} /></button>
            <button onClick={handleReset} className="p-2 bg-white rounded-lg shadow-md text-slate-600 hover:text-indigo-600"><RefreshCcw size={18} /></button>
            <button onClick={handleZoomOut} className="p-2 bg-white rounded-lg shadow-md text-slate-600 hover:text-indigo-600"><ZoomOut size={18} /></button>
        </div>
        <div className="w-full h-full transition-transform duration-200 ease-out origin-center" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none select-none">
                <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" strokeOpacity="0.03" strokeWidth="0.5"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M 10 60 Q 10 40 30 40 T 40 60 T 30 80 T 10 60" fill="#FDF2E9" stroke="#FB923C" strokeWidth="0.2" opacity="0.5" /><text x="20" y="60" className="text-[1.5px] font-black fill-orange-300 uppercase tracking-widest opacity-60" textAnchor="middle">Frontierland</text>
                <path d="M 10 35 Q 15 20 35 20 T 50 35 T 30 50 T 10 35" fill="#F0FDF4" stroke="#4ADE80" strokeWidth="0.2" opacity="0.5" /><text x="25" y="30" className="text-[1.5px] font-black fill-emerald-300 uppercase tracking-widest opacity-60" textAnchor="middle">Adventureland</text>
                <path d="M 45 35 Q 55 15 75 25 T 80 50 T 55 55 T 45 35" fill="#FAF5FF" stroke="#E879F9" strokeWidth="0.2" opacity="0.5" /><text x="65" y="30" className="text-[1.5px] font-black fill-purple-300 uppercase tracking-widest opacity-60" textAnchor="middle">Fantasyland</text>
                <path d="M 70 60 Q 75 40 95 45 T 90 75 T 65 70 T 70 60" fill="#F0F9FF" stroke="#38BDF8" strokeWidth="0.2" opacity="0.5" /><text x="85" y="60" className="text-[1.5px] font-black fill-sky-300 uppercase tracking-widest opacity-60" textAnchor="middle">Discoveryland</text>
                <path d="M 45 80 L 55 80 L 55 95 L 45 95 Z" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.2" opacity="0.5" /><text x="50" y="92" className="text-[1.5px] font-black fill-rose-300 uppercase tracking-widest opacity-60" textAnchor="middle">Main Street</text>
                <circle cx="50" cy="50" r="3" fill="white" stroke="#EC4899" strokeWidth="0.5" /><text x="50" y="50.5" textAnchor="middle" className="text-[1px] font-bold fill-pink-500">🏰</text>
                <path d={generatePath()} fill="none" stroke="#6366f1" strokeWidth="0.8" strokeDasharray="1.5 1" strokeLinecap="round" className="drop-shadow-md animate-pulse" />
                {pathAttractions.map((attr, index) => {
                    const isHovered = hoveredId === attr.id;
                    return (
                        <g key={attr.id} className="cursor-pointer hover:scale-110 transition-transform">
                            {index === 0 && <circle cx={attr.x} cy={attr.y} r={3} className="fill-emerald-500 animate-ping opacity-30" />}
                            <circle cx={attr.x} cy={attr.y} r={isHovered ? 2.5 : 1.8} fill={isHovered ? '#4f46e5' : '#ffffff'} stroke={index === 0 ? '#10b981' : '#6366f1'} strokeWidth="0.5" className="transition-colors duration-200 shadow-sm" />
                            <text x={attr.x} y={attr.y + 0.4} textAnchor="middle" className={`text-[1px] font-bold ${isHovered ? 'fill-white' : 'fill-slate-700'} pointer-events-none`}>{index + 1}</text>
                            {(isHovered || scale < 1.5) && (
                                <g className="transition-opacity">
                                    <rect x={attr.x - (attr.name.length * 0.4)} y={attr.y - 3.5} width={attr.name.length * 0.8 + 2} height="2.5" rx="0.5" fill="rgba(15, 23, 42, 0.9)" />
                                    <text x={attr.x} y={attr.y - 2} textAnchor="middle" className="text-[1px] fill-white font-medium">{attr.name}</text>
                                    <path d={`M ${attr.x} ${attr.y - 1} L ${attr.x - 0.5} ${attr.y - 1} L ${attr.x} ${attr.y - 0.5} L ${attr.x + 0.5} ${attr.y - 1} Z`} fill="rgba(15, 23, 42, 0.9)" />
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
      </div>
    </div>
  );
};