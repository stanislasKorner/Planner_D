import React, { useState, useRef } from 'react';
import { Attraction } from '../types';
import { AttractionCard } from './AttractionCard';
import { WeatherWidget } from './WeatherWidget';
import { Search } from 'lucide-react';

interface Props {
  attractions: Attraction[];
  currentOrder: string[];
  onUpdateOrder: (newOrder: string[]) => void;
}

export const RankingList: React.FC<Props> = ({ attractions, currentOrder, onUpdateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dragItem = useRef<number | null>(null);

  const orderedAttractions = currentOrder
    .map(id => attractions.find(a => a.id === id))
    .filter((a): a is Attraction => !!a);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    if (dragItem.current !== null && dragItem.current !== index) {
      const newOrder = [...currentOrder];
      const draggedItemContent = newOrder[dragItem.current];
      newOrder.splice(dragItem.current, 1);
      newOrder.splice(index, 0, draggedItemContent);
      
      onUpdateOrder(newOrder);
      dragItem.current = index;
    }
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...currentOrder];
    const item = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = item;
    onUpdateOrder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    const item = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = item;
    onUpdateOrder(newOrder);
  };

  const handleBubbleToTop = (id: string) => {
    const newOrder = [...currentOrder];
    const index = newOrder.indexOf(id);
    if (index > 0) {
      newOrder.splice(index, 1);
      newOrder.unshift(id);
      onUpdateOrder(newOrder);
    }
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-4">
      {/* Weather Widget Integration */}
      <WeatherWidget />

      {/* Search Bar - Floating Spotlight Style */}
      <div className="sticky top-4 z-30 mb-8">
        <div className="relative shadow-lg rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text"
            placeholder="Rechercher une attraction..."
            className="block w-full pl-11 pr-4 py-3.5 bg-white/90 backdrop-blur-xl border-none rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm font-medium transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Search Results Dropdown */}
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-40">
              {attractions
                .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleBubbleToTop(a.id)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                  >
                    <span className="font-medium text-slate-700 text-sm">{a.name}</span>
                    <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 bg-indigo-50 px-2 py-1 rounded-full">Placer #1</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-32">
        {orderedAttractions.map((attraction, index) => (
          <AttractionCard 
            key={attraction.id}
            attraction={attraction}
            index={index}
            isDraggable={true}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === orderedAttractions.length - 1}
          />
        ))}
      </div>
    </div>
  );
};