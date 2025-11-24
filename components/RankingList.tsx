import React, { useState, useRef, useMemo } from 'react';
import { Attraction } from '../types';
import { AttractionCard } from './AttractionCard';
import { WeatherWidget } from './WeatherWidget';
import { Search, LayoutGrid, ListOrdered, ArrowRight, Check, Sparkles } from 'lucide-react';

interface Props {
  attractions: Attraction[];
  currentOrder: string[];
  onUpdateOrder: (newOrder: string[]) => void;
}

export const RankingList: React.FC<Props> = ({ attractions, currentOrder, onUpdateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'ranking'>('ranking'); // Mobile tab state
  const dragItem = useRef<number | null>(null);

  // Séparer les attractions classées des non classées
  const rankedAttractions = useMemo(() => 
    currentOrder.map(id => attractions.find(a => a.id === id)).filter((a): a is Attraction => !!a),
  [currentOrder, attractions]);

  const unrankedAttractions = useMemo(() => 
    attractions.filter(a => !currentOrder.includes(a.id))
      .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.land.toLowerCase().includes(searchTerm.toLowerCase())),
  [attractions, currentOrder, searchTerm]);

  // --- ACTIONS ---

  const addToRanking = (id: string) => {
    const newOrder = [...currentOrder, id];
    onUpdateOrder(newOrder);
    // Sur mobile, petite notif ou feedback visuel ?
  };

  const removeFromRanking = (id: string) => {
    const newOrder = currentOrder.filter(itemId => itemId !== id);
    onUpdateOrder(newOrder);
  };

  const handleDragStart = (index: number) => { dragItem.current = index; };
  
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

  const handleDragEnd = () => { dragItem.current = null; };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    onUpdateOrder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onUpdateOrder(newOrder);
  };

  // --- RENDER HELPERS ---

  const progressPercentage = Math.round((rankedAttractions.length / attractions.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto pt-2">
      {/* Weather & Header */}
      <div className="max-w-2xl mx-auto">
        <WeatherWidget />
      </div>

      {/* Mobile Tabs Controller */}
      <div className="md:hidden sticky top-[64px] z-30 bg-[#FAFAFA]/95 backdrop-blur pb-4">
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm mb-4">
            <button 
                onClick={() => setActiveTab('catalog')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'catalog' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}
            >
                <LayoutGrid size={16} /> Catalogue
                {unrankedAttractions.length > 0 && <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded-full">{unrankedAttractions.length}</span>}
            </button>
            <button 
                onClick={() => setActiveTab('ranking')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'ranking' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
            >
                <ListOrdered size={16} /> Mon Classement
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{rankedAttractions.length}</span>
            </button>
        </div>
        
        {/* Progress Bar (Mobile) */}
        {activeTab === 'ranking' && (
            <div className="px-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Progression</span>
                    <span>{rankedAttractions.length} / {attractions.length}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CATALOG (Desktop: Col 1-7, Mobile: Visible if activeTab='catalog') */}
        <div className={`md:col-span-7 ${activeTab === 'catalog' ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-[80px] z-20 bg-[#FAFAFA] pb-4 pt-2">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="text-amber-400 fill-amber-400" /> 
                    Attractions disponibles
                </h2>
                
                <div className="relative shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Rechercher (Pirates, Space Mountain...)"
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {unrankedAttractions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <Check className="w-10 h-10 text-emerald-400 mb-2" />
                    <p className="text-slate-500 font-medium">Toutes les attractions sont classées !</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-32">
                    {unrankedAttractions.map(attraction => (
                        <div key={attraction.id} className="h-full">
                            <AttractionCard 
                                attraction={attraction} 
                                variant="grid"
                                onAdd={() => addToRanking(attraction.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: RANKING (Desktop: Col 8-12, Sticky) */}
        <div className={`md:col-span-5 ${activeTab === 'ranking' ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-[80px]">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <ListOrdered size={18} /> Mon Top
                            </h2>
                            <p className="text-slate-400 text-xs">Glisse pour réorganiser</p>
                        </div>
                        <div className="text-2xl font-black text-indigo-400">
                            {rankedAttractions.length}
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto p-3 space-y-2 bg-slate-50 flex-grow min-h-[300px]">
                        {rankedAttractions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl">
                                <ArrowRight className="w-8 h-8 mb-2 opacity-50 md:rotate-180" />
                                <p className="text-sm">Ajoute des attractions depuis le catalogue {window.innerWidth < 768 ? "via l'onglet Catalogue" : "à gauche"} pour commencer ton classement.</p>
                            </div>
                        ) : (
                            rankedAttractions.map((attraction, index) => (
                                <AttractionCard 
                                    key={attraction.id}
                                    attraction={attraction}
                                    index={index}
                                    variant="list"
                                    isDraggable={true}
                                    onDragStart={handleDragStart}
                                    onDragEnter={handleDragEnter}
                                    onDragEnd={handleDragEnd}
                                    onMoveUp={() => handleMoveUp(index)}
                                    onMoveDown={() => handleMoveDown(index)}
                                    onRemove={() => removeFromRanking(attraction.id)}
                                    isFirst={index === 0}
                                    isLast={index === rankedAttractions.length - 1}
                                />
                            ))
                        )}
                    </div>
                    
                    {/* Footer (Progress) */}
                    <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <span>Complétion</span>
                            <span>{Math.round((rankedAttractions.length / attractions.length) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                                style={{ width: `${(rankedAttractions.length / attractions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};