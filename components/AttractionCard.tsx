
import React, { useRef, useState, useEffect } from 'react';
import { Attraction } from '../types';
import { Clock, Gauge, ExternalLink, GripVertical, ChevronUp, ChevronDown, Quote, Youtube, Plus, Trash2, Trophy, Medal, Crown, Sparkles } from 'lucide-react';

interface Props {
  attraction: Attraction;
  index?: number;
  variant?: 'list' | 'grid';
  isDraggable?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnter?: (index: number) => void;
  onDragEnd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  myRank?: number;
  topOneCount?: number;
  topOneVoters?: string[];
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
  myRank,
  topOneCount = 0,
  topOneVoters = []
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

  const renderRankBadge = (rank: number) => {
      if (rank === 1) return <div className="flex flex-col items-center"><Trophy className="text-yellow-500 drop-shadow-sm mb-1" size={24} fill="currentColor" /><span className="text-xs font-black text-yellow-600">#1</span></div>;
      if (rank === 2) return <div className="flex flex-col items-center"><Trophy className="text-slate-400 drop-shadow-sm mb-1" size={20} fill="currentColor" /><span className="text-xs font-black text-slate-500">#2</span></div>;
      if (rank === 3) return <div className="flex flex-col items-center"><Trophy className="text-amber-700 drop-shadow-sm mb-1" size={20} fill="currentColor" /><span className="text-xs font-black text-amber-800">#3</span></div>;
      if (rank <= 5) return <div className="flex flex-col items-center"><Medal className="text-indigo-400 mb-1" size={18} /><span className="text-xs font-bold text-indigo-600">#{rank}</span></div>;
      return <span className="text-lg font-black text-slate-400">#{rank}</span>;
  };

  // MODE CATALOGUE (GRILLE)
  if (variant === 'grid') {
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:z-10">
        <div className="relative h-32 w-full overflow-hidden">
            <img src={imgSrc} alt={attraction.name} onError={handleImageError} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
            <div className="absolute bottom-2 left-3 right-3">
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">{attraction.land}</span>
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">{attraction.name}</h3>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onAdd?.(); }} className="absolute top-2 right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95" title="Ajouter au classement">
                <Plus size={18} strokeWidth={3} />
            </button>
        </div>
        <div className="p-3 flex flex-col flex-grow justify-between gap-2">
            <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getIntensityColor(attraction.intensity)}`}>{attraction.intensity}</span>
                    {attraction.aiTags?.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{tag}</span>
                    ))}
                </div>
            </div>
            
            <div className="flex gap-3 border-t border-slate-50 pt-2 mt-1 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                {attraction.youtubeUrl && <a href={attraction.youtubeUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500"><Youtube size={14} /></a>}
                <a href={attraction.officialUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-500"><ExternalLink size={14} /></a>
            </div>
        </div>
      </div>
    );
  }

  // MODE LISTE (CLASSEMENT)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(index);
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => { if (cardRef.current) cardRef.current.classList.add('opacity-40', 'scale-95'); }, 0);
    }
  };
  const handleDragEnter = () => { if (onDragEnter) onDragEnter(index); };
  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd();
    if (cardRef.current) cardRef.current.classList.remove('opacity-40', 'scale-95');
  };

  return (
    <div ref={cardRef} draggable={isDraggable} onDragStart={isDraggable ? handleDragStart : undefined} onDragEnter={isDraggable ? handleDragEnter : undefined} onDragEnd={isDraggable ? handleDragEnd : undefined} onDragOver={(e) => e.preventDefault()} className={`group relative flex items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01] hover:border-indigo-100 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <div className="flex flex-col items-center justify-center mr-3 self-center gap-1 min-w-[40px]">
        {myRank ? renderRankBadge(myRank) : <span className="text-lg font-black text-slate-300">{index + 1}</span>}
        {isDraggable && <GripVertical className="text-slate-200 group-hover:text-slate-400 mt-1 transition-colors" size={14} />}
      </div>
      <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 mr-3 relative group-hover:ring-2 ring-indigo-50 transition-all">
        <img src={imgSrc} alt={attraction.name} onError={handleImageError} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow min-w-0 self-center">
        <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{attraction.name}</h3>
            {topOneCount > 0 && (
                <div className="group/tooltip relative ml-2">
                    <div className="flex items-center gap-1 bg-yellow-100 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full cursor-help">
                        <Crown size={10} fill="currentColor" />
                        <span className="text-[10px] font-bold">{topOneCount}</span>
                    </div>
                    <div className="absolute bottom-full right-0 mb-2 w-max max-w-[200px] bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                        <div className="font-bold mb-1 text-yellow-400 border-b border-white/10 pb-1">Favori n°1 de :</div>
                        <div className="flex flex-wrap gap-1">{topOneVoters.map(v => <span key={v} className="bg-white/20 px-1 rounded">{v}</span>)}</div>
                        <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                </div>
            )}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{attraction.land}</p>
        <div className="flex items-center gap-2 mb-1">
             <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${getIntensityColor(attraction.intensity)}`}>{attraction.intensity}</span>
             {attraction.aiTags?.slice(0, 2).map(tag => (
                 <span key={tag} className="hidden sm:inline-flex text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">{tag}</span>
             ))}
        </div>
        {attraction.aiAnalysis && (
             <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-tight mt-1 p-1.5 bg-indigo-50/50 rounded-lg border border-indigo-50">
                <Sparkles size={10} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{attraction.aiAnalysis}</span>
             </div>
        )}
      </div>
      <div className="flex flex-col gap-1 ml-2 pl-2 border-l border-slate-50 shrink-0 self-center">
        {onRemove && <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors mb-1" title="Retirer"><Trash2 size={16} /></button>}
        {isDraggable && (
            <div className="flex flex-col md:hidden">
                <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} disabled={isFirst} className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-10"><ChevronUp size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} disabled={isLast} className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-10"><ChevronDown size={16} /></button>
            </div>
        )}
      </div>
    </div>
  );
};
