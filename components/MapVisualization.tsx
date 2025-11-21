import React, { useState } from 'react';
import { Attraction } from '../types';
import { Map as MapIcon, Satellite, ExternalLink } from 'lucide-react';

interface Props {
  path: string[]; // IDs in order
  attractions: Attraction[];
}

export const MapVisualization: React.FC<Props> = ({ path, attractions }) => {
  const [viewMode, setViewMode] = useState<'schematic' | 'satellite'>('schematic');

  const pathAttractions = path
    .map(id => attractions.find(a => a.id === id))
    .filter((a): a is Attraction => !!a);

  if (pathAttractions.length === 0) return (
    <div className="w-full h-full min-h-[300px] bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
        Chargement du plan...
    </div>
  );

  // SVG overlay content (Only for Schematic view)
  const points = pathAttractions.map((attr, index) => (
    <g key={attr.id} className="group cursor-pointer hover:z-50">
      {/* Halo */}
      <circle 
        cx={attr.x} 
        cy={attr.y} 
        r={6} 
        className="fill-white/50 animate-pulse"
      />
      {/* Pin */}
      <circle 
        cx={attr.x} 
        cy={attr.y} 
        r={3.5} 
        className={`${index === 0 ? 'fill-emerald-500' : index === pathAttractions.length - 1 ? 'fill-rose-500' : 'fill-indigo-600'} stroke-white stroke-[1.5] drop-shadow-md`} 
      />
      
      {/* Label */}
      <g className={`${index === 0 || index === pathAttractions.length - 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
        <rect 
            x={attr.x - 20} 
            y={attr.y - 12} 
            width="40" 
            height="8" 
            rx="2"
            className="fill-slate-900/90 drop-shadow-sm"
        />
        <text 
            x={attr.x} 
            y={attr.y - 7} 
            textAnchor="middle" 
            className="text-[3px] font-bold fill-white select-none pointer-events-none"
        >
            {index + 1}. {attr.name.substring(0, 15)}
        </text>
        {/* Triangle pointer */}
        <path d={`M${attr.x},${attr.y-4} L${attr.x-2},${attr.y-5} L${attr.x+2},${attr.y-5} Z`} className="fill-slate-900/90" />
      </g>
    </g>
  ));

  const lines = pathAttractions.map((attr, index) => {
    if (index === pathAttractions.length - 1) return null;
    const next = pathAttractions[index + 1];
    return (
      <line
        key={`line-${index}`}
        x1={attr.x}
        y1={attr.y}
        x2={next.x}
        y2={next.y}
        className="stroke-indigo-400 stroke-[1] stroke-dashed"
        strokeDasharray="2 2"
      />
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('schematic')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'schematic' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <MapIcon size={14} /> Itinéraire
            </button>
            <button 
                onClick={() => setViewMode('satellite')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'satellite' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Satellite size={14} /> Satellite
            </button>
        </div>
        
        <a 
            href="https://www.disneylandparis.com/fr-fr/cartes/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
            Plan Officiel <ExternalLink size={12} />
        </a>
      </div>

      {/* Content */}
      <div className="relative flex-grow w-full bg-[#f8fafc] overflow-hidden group">
        
        {viewMode === 'schematic' ? (
            <div className="relative w-full h-full bg-slate-50">
                {/* CSS Map Geography Simulation */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Rivers of America (Frontierland/Adventureland) */}
                <div className="absolute top-[45%] left-[20%] w-[25%] h-[25%] border-[3px] border-blue-200 bg-blue-50 rounded-full opacity-60"></div>
                {/* Central Hub */}
                <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] border-[3px] border-pink-200 bg-pink-50 rounded-full opacity-60"></div>
                {/* Main Street */}
                <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 w-[6%] h-[35%] bg-slate-100 border-x border-slate-200"></div>
                
                {/* Zone Labels */}
                <div className="absolute inset-0 pointer-events-none select-none font-bold text-[9px] uppercase tracking-widest font-mono z-0">
                    <span className="absolute bottom-[12%] left-[50%] -translate-x-1/2 text-slate-400 rotate-[-90deg] origin-center">Main Street</span>
                    <span className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-pink-400">Château</span>
                    <span className="absolute top-[65%] left-[15%] text-amber-700/30 -rotate-12">Frontierland</span>
                    <span className="absolute top-[30%] left-[20%] text-green-700/30">Adventureland</span>
                    <span className="absolute top-[25%] left-[50%] -translate-x-1/2 text-purple-700/30">Fantasyland</span>
                    <span className="absolute top-[55%] right-[15%] text-blue-700/30 rotate-12">Discoveryland</span>
                </div>

                {/* Interactive SVG Layer */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10">
                    {lines}
                    {points}
                </svg>

                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] text-slate-400 z-10 border border-slate-100">
                    Vue Schématique
                </div>
            </div>
        ) : (
            <div className="w-full h-full">
                {/* Google Maps Embed centered on DLP */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5199.507897309379!2d2.7768696!3d48.8712333!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e61d19ca79fdd3%3A0x6872c6f387408e1d!2sParc%20Disneyland!5e0!3m2!1sfr!2sfr!4v1709123456789!5m2!1sfr!2sfr&maptype=satellite" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="filter contrast-[1.1]"
                ></iframe>
            </div>
        )}
      </div>
    </div>
  );
};
