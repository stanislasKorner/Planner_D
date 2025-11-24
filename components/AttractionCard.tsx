import React, { useRef, useState, useEffect } from 'react';
import { Attraction } from '../types';
import { Clock, Gauge, ExternalLink, GripVertical, ChevronUp, ChevronDown, Quote, Youtube, Plus, Trash2, MapPin } from 'lucide-react';

interface Props {
  attraction: Attraction;
  index?: number;
  variant?: 'list' | 'grid'; // Mode liste (classement) ou grille (catalogue)
  isDraggable?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnter?: (index: number) => void;
  onDragEnd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAdd?: () => void;     // Action pour ajouter au classement
  onRemove?: () => void;  // Action pour retirer du classement
  isFirst?: boolean;
  isLast?: boolean;
  myRank?: number;
}

export const AttractionCard: React.FC<Props> = ({ 
  attraction, 
  index = 0, 
  variant = 'list',
  isDraggable = false,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onAdd,
  onRemove,
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

  const handleImageError = () => {
    if (!imgError) {
        setImgError(true);
        setImgSrc(`https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(attraction.name)}`);
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch(intensity) {
      case 'Calme': return 'text-emerald-600 bg-emerald-50';
      case 'Modéré': return 'text-amber-600 bg-amber-50';
      case 'Sensations fortes': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  // --- MODE GRILLE (Catalogue à ajouter) ---
  if (variant === 'grid') {
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
        {/* Image Header */}
        <div className="relative h-32 w-full overflow-hidden">
            <img 
                src={imgSrc} 
                alt={attraction.name} 
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
            <div className="absolute bottom-2 left-3 right-3">
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">{attraction.land}</span>
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">{attraction.name}</h3>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
                className="absolute top-2 right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95"
                title="Ajouter au classement"
            >
                <Plus size={18} strokeWidth={3} />
            </button>
        </div>

        {/* Mini Infos */}
        <div className="p-3 flex flex-col flex-grow justify-between gap-2">
            <div className="flex gap-2 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getIntensityColor(attraction.intensity)}`}>
                    {attraction.intensity}
                </span>
                {attraction.avgWait !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium flex items-center gap-1">
                        <Clock size={10} /> {attraction.avgWait} min
                    </span>
                )}
            </div>
            
            {/* Liens discrets */}
            <div className="flex gap-3 border-t border-slate-50 pt-2 mt-1 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                {attraction.youtubeUrl && (
                    <a href={attraction.youtubeUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500"><Youtube size={14} /></a>
                )}
                <a href={attraction.officialUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-500"><ExternalLink size={14} /></a>
            </div>
        </div>
      </div>
    );
  }

  // --- MODE LISTE (Classement Drag & Drop) ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(index);
      e.dataTransfer.effectAllowed = "move";
      // Petit hack pour cacher l'élément original pendant le drag (optionnel)
      setTimeout(() => {
        if (cardRef.current) cardRef.current.classList.add('opacity-40', 'scale-95');
      }, 0);
    }
  };

  const handleDragEnter = () => { if (onDragEnter) onDragEnter(index); };
  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd();
    if (cardRef.current) cardRef.current.classList.remove('opacity-40', 'scale-95');
  };

  return (
    <div 
      ref={cardRef}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDragEnter={isDraggable ? handleDragEnter : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      onDragOver={(e) => e.preventDefault()}
      className={`group relative flex items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md hover:border-indigo-100 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Numéro / Drag Handle */}
      <div className="flex flex-col items-center justify-center mr-3 self-center gap-1 min-w-[24px]">
        {isDraggable && <GripVertical className="text-slate-300 group-hover:text-indigo-400" size={16} />}
        <span className={`text-lg font-black ${myRank ? 'text-indigo-600' : 'text-slate-900'}`}>
            {myRank ? `#${myRank}` : index + 1}
        </span>
      </div>

      {/* Image Thumbnail */}
      <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 mr-3 relative group-hover:ring-2 ring-indigo-50 transition-all">
        <img src={imgSrc} alt={attraction.name} onError={handleImageError} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 self-center">
        <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{attraction.name}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{attraction.land}</p>
        
        {/* Tags compacts */}
        <div className="flex items-center gap-2">
             <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${getIntensityColor(attraction.intensity)}`}>
                {attraction.intensity}
             </span>
             {attraction.reviewSummary && (
                 <span className="hidden sm:inline-flex text-[9px] text-slate-400 italic border-l border-slate-200 pl-2 truncate max-w-[150px]">
                    "{attraction.reviewSummary.substring(0, 40)}..."
                 </span>
             )}
        </div>
      </div>

      {/* Actions (Remove / Sort) */}
      <div className="flex flex-col gap-1 ml-2 pl-2 border-l border-slate-50 shrink-0 self-center">
        {onRemove && (
            <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors mb-1"
                title="Retirer du classement"
            >
                <Trash2 size={16} />
            </button>
        )}
        
        {/* Mobile Sort Buttons */}
        {isDraggable && (
            <div className="flex flex-col md:hidden">
                <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} disabled={isFirst} className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-10">
                    <ChevronUp size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} disabled={isLast} className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-10">
                    <ChevronDown size={16} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};