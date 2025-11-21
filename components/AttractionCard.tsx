import React, { useRef, useState, useEffect } from 'react';
import { Attraction } from '../types';
import { Clock, Gauge, ExternalLink, GripVertical } from 'lucide-react';

interface Props {
  attraction: Attraction;
  index: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isDraggable?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnter?: (index: number) => void;
  onDragEnd?: () => void;
}

export const AttractionCard: React.FC<Props> = ({ 
  attraction, 
  index, 
  isDraggable = false,
  onDragStart,
  onDragEnter,
  onDragEnd
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
      className={`group relative flex items-center p-4 bg-white rounded-2xl shadow-sm transition-all duration-300 ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:shadow-md' : ''}`}
    >
      {/* Order Number (Minimalist) */}
      <div className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 w-8 text-center opacity-0 group-hover:opacity-100 transition-opacity md:group-hover:opacity-100">
        {isDraggable ? (
           <GripVertical className="mx-auto text-slate-300" size={20} />
        ) : (
           <span className="text-2xl font-black text-slate-100">{index + 1}</span>
        )}
      </div>

      <div className="flex-shrink-0 relative mr-5">
        <img 
          src={imgSrc} 
          alt={attraction.name} 
          onError={handleImageError}
          className="w-20 h-20 rounded-xl object-cover shadow-sm bg-slate-100"
        />
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow border-2 border-white">
            {index + 1}
        </div>
      </div>

      <div className="flex-grow min-w-0 pr-8">
        <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-bold text-slate-800 text-base truncate mr-2">{attraction.name}</h3>
        </div>
        
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{attraction.land}</p>
        
        <div className="flex flex-wrap gap-2">
          {attraction.avgWait && (
             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-semibold">
               <Clock size={10} /> {attraction.avgWait} min
             </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${getIntensityColor(attraction.intensity)}`}>
             <Gauge size={10} /> {attraction.intensity}
          </span>
        </div>
      </div>

      <a 
        href={attraction.officialUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors p-1"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={16} />
      </a>
    </div>
  );
};