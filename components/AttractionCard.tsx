import React, { useRef, useState, useEffect } from 'react';
import { Attraction } from '../types';
import { Clock, Gauge, ExternalLink, GripVertical, ChevronUp, ChevronDown, Quote, User, Youtube } from 'lucide-react';

interface Props {
  attraction: Attraction;
  index: number;
  isDraggable?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnter?: (index: number) => void;
  onDragEnd?: () => void;
  // New props for manual sorting
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  // Affichage du rang personnel dans la vue globale
  myRank?: number;
}

export const AttractionCard: React.FC<Props> = ({ 
  attraction, 
  index, 
  isDraggable = false,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  myRank
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState(attraction.imageUrl);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(attraction.imageUrl);
    setImgError(false);
  }, [attraction.imageUrl]);

  const getIntensityColor = (intensity: string) => {
    switch(intensity) {
      case 'Calme': return 'text-emerald-600 bg-emerald-50';
      case 'Modéré': return 'text-amber-600 bg-amber-50';
      case 'Sensations fortes': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(index);
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => {
        if (cardRef.current) cardRef.current.classList.add('opacity-40', 'scale-95');
      }, 0);
    }
  };

  const handleDragEnter = () => {
    if (onDragEnter) onDragEnter(index);
  };

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd();
    if (cardRef.current) cardRef.current.classList.remove('opacity-40', 'scale-95');
  };

  const handleImageError = () => {
    if (!imgError) {
        setImgError(true);
        setImgSrc(`https://placehold.co/150x150/e2e8f0/64748b?text=${encodeURIComponent(attraction.name.substring(0, 10))}`);
    }
  };

  return (
    <div 
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDragEnter={isDraggable ? handleDragEnter : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      onDragOver={(e) => e.preventDefault()}
      className={`group relative flex items-start p-3 md:p-4 bg-white rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:z-10 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Drag Handle / Number */}
      <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        {isDraggable ? (
           <GripVertical className="mx-auto text-slate-300" size={20} />
        ) : (
           <span className="text-2xl font-black text-slate-100">{index + 1}</span>
        )}
      </div>

      {/* Image with Rank Badge */}
      <div className="flex-shrink-0 relative mr-3 md:mr-5 mt-1">
        <img 
          src={imgSrc} 
          alt={attraction.name} 
          onError={handleImageError}
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-sm bg-slate-100 select-none pointer-events-none"
        />
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow border-2 border-white z-10">
            {index + 1}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center mb-1 gap-2 flex-wrap">
            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate leading-tight mr-1">{attraction.name}</h3>
            
            {/* Liens Externes */}
            <div className="flex items-center gap-1">
                <a 
                    href={attraction.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-300 hover:text-indigo-600 transition-colors"
                    title="Site officiel"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink size={14} />
                </a>
                <a 
                    href={attraction.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 rounded-md hover:bg-red-50 text-red-200 hover:text-red-600 transition-colors"
                    title="Voir sur YouTube"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Youtube size={16} />
                </a>
            </div>
        </div>
        
        <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 truncate">{attraction.land}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {attraction.avgWait && (
             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-semibold">
               <Clock size={10} /> {attraction.avgWait} min
             </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${getIntensityColor(attraction.intensity)}`}>
             <Gauge size={10} /> {attraction.intensity}
          </span>

          {/* Badge "Mon Choix" si fourni */}
          {myRank && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
               <User size={10} /> Mon choix : #{myRank}
            </span>
          )}
        </div>

        {/* Avis Client */}
        <div className="relative bg-slate-50 rounded-lg p-3 border border-slate-100 mt-1">
             <div className="flex gap-3 items-start">
                <Quote className="text-indigo-300 flex-shrink-0 mt-0.5" size={16} fill="currentColor" />
                <p className="text-[14px] text-slate-600 leading-snug">
                    {attraction.reviewSummary}
                </p>
             </div>
        </div>
      </div>

      {/* Mobile/Touch Sort Controls */}
      {isDraggable && (
          <div className="flex flex-col gap-1 ml-2 pl-2 border-l border-slate-50 shrink-0 self-center">
            <button 
                onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} 
                disabled={isFirst} 
                className="p-1.5 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 transition-colors"
                title="Monter"
            >
                <ChevronUp size={18} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} 
                disabled={isLast} 
                className="p-1.5 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 transition-colors"
                title="Descendre"
            >
                <ChevronDown size={18} />
            </button>
          </div>
      )}
    </div>
  );
};