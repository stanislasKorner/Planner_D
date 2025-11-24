import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Attraction, Intensity } from '../types';
import { AttractionCard } from './AttractionCard';
import { WeatherWidget } from './WeatherWidget';
import { Search, LayoutGrid, ListOrdered, ArrowRight, Check, Sparkles, ArrowUpDown, X, PlusCircle, Trash2 } from 'lucide-react';

interface Props {
  attractions: Attraction[];
  currentOrder: string[];
  onUpdateOrder: (newOrder: string[]) => void;
}

type IntensityFilter = 'all' | Intensity;
type SortOrder = 'asc' | 'desc';

const INTENSITY_ORDER: Record<Intensity, number> = {
    'Calme': 1,
    'Modéré': 2,
    'Sensations fortes': 3
};

export const RankingList: React.FC<Props> = ({ attractions, currentOrder, onUpdateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'ranking'>('catalog');
  const [filterIntensity, setFilterIntensity] = useState<IntensityFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const dragItem = useRef<number | null>(null);

  const unrankedAttractions = useMemo(() => {
    let result = attractions.filter(a => !currentOrder.includes(a.id));
    result = result.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIntensity = filterIntensity === 'all' || a.intensity === filterIntensity;
        return matchesSearch && matchesIntensity;
    });
    result.sort((a, b) => {
        const scoreA = INTENSITY_ORDER[a.intensity];
        const scoreB = INTENSITY_ORDER[b.intensity];
        return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    });
    return result;
  }, [attractions, currentOrder, searchTerm, filterIntensity, sortOrder]);

  const rankedAttractions = useMemo(() => 
    currentOrder.map(id => attractions.find(a => a.id === id)).filter((a): a is Attraction => !!a),
  [currentOrder, attractions]);

  const addToRanking = (id: string) => onUpdateOrder([...currentOrder, id]);
  const addAllFiltered = () => onUpdateOrder([...currentOrder, ...unrankedAttractions.map(a => a.id)]);
  const removeFromRanking = (id: string) => onUpdateOrder(currentOrder.filter(itemId => itemId !== id));
  
  const resetMyRanking = () => {
      if (window.confirm("Voulez-vous vraiment vider tout votre classement et recommencer ?")) {
          onUpdateOrder([]);
      }
  };

  const handleDragStart = (index: number) => { dragItem.current = index; };
  const handleDragEnter = (index: number) => {
    if (dragItem.current !== null && dragItem.current !== index) {
      const newOrder = [...currentOrder];
      const item = newOrder.splice(dragItem.current, 1)[0];
      newOrder.splice(index, 0, item);
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
  
  const toggleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="w-full max-w-7xl mx-auto pt-2 space-y-6">
      <div className="max-w-2xl mx-auto"><WeatherWidget /></div>

      <div className="md:hidden sticky top-[64px] z-30 bg-[#FAFAFA]/95 backdrop-blur pb-2">
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            <button onClick={() => setActiveTab('catalog')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'catalog' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}><LayoutGrid size={16} /> Catalogue <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded-full">{unrankedAttractions.length}</span></button>
            <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'ranking' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}><ListOrdered size={16} /> Mon Top <span className="bg-white/20 px-1.5 rounded-full text-[10px]">{rankedAttractions.length}</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className={`md:col-span-7 ${activeTab === 'catalog' ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-[80px] z-20 bg-[#FAFAFA] pb-4 pt-2 space-y-3">
                <div className="relative shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div>
                    <input type="text" placeholder="Rechercher dans le catalogue..." className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <select className={`px-3 py-2 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none ${filterIntensity !== 'all' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`} value={filterIntensity} onChange={(e) => setFilterIntensity(e.target.value as IntensityFilter)}>
                        <option value="all">Toutes intensités</option>
                        <option value="Calme">🟢 Calme</option>
                        <option value="Modéré">🟠 Modéré</option>
                        <option value="Sensations fortes">🔴 Sensations fortes</option>
                    </select>
                    <button onClick={toggleSort} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors whitespace-nowrap"><ArrowUpDown size={14} /> {sortOrder === 'asc' ? 'Calme → Fort' : 'Fort → Calme'}</button>
                    {unrankedAttractions.length > 0 && <button onClick={addAllFiltered} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold hover:bg-emerald-100 transition-colors whitespace-nowrap ml-auto"><PlusCircle size={14} /> Tout ajouter</button>}
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pb-32">
                {unrankedAttractions.map(attr => <div key={attr.id} className="h-full animate-in fade-in zoom-in duration-300"><AttractionCard attraction={attr} variant="grid" onAdd={() => addToRanking(attr.id)} /></div>)}
                {unrankedAttractions.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center"><Check className="w-10 h-10 mb-2 text-emerald-400" /><p className="font-bold text-slate-600">Tout est classé !</p></div>}
            </div>
        </div>

        <div className={`md:col-span-5 ${activeTab === 'ranking' ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-[80px]">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                        <h2 className="font-bold text-lg flex gap-2 items-center"><ListOrdered size={18}/> Mon Top</h2>
                        <div className="flex items-center gap-3">
                            <span className="bg-indigo-600 text-xs font-bold px-2 py-1 rounded-md">{rankedAttractions.length}</span>
                            {rankedAttractions.length > 0 && (
                                <button onClick={resetMyRanking} className="text-slate-400 hover:text-red-400 transition-colors p-1 hover:bg-slate-800 rounded" title="Tout vider"><Trash2 size={18} /></button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-y-auto p-3 space-y-2 bg-slate-50 flex-grow min-h-[300px]">
                        {rankedAttractions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl text-center"><ArrowRight className="w-8 h-8 mb-2 opacity-50 md:rotate-180" /><p className="text-xs">Clique sur <span className="font-bold text-indigo-500">+</span> à gauche pour ajouter des attractions ici.</p></div>
                        ) : (
                            rankedAttractions.map((attr, index) => <AttractionCard key={attr.id} attraction={attr} index={index} variant="list" isDraggable={true} onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragEnd={handleDragEnd} onRemove={() => removeFromRanking(attr.id)} onMoveUp={() => handleMoveUp(index)} onMoveDown={() => handleMoveDown(index)} isFirst={index === 0} isLast={index === rankedAttractions.length - 1} myRank={index + 1} />)
                        )}
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5"><span>Complétion</span><span>{Math.round((rankedAttractions.length / attractions.length) * 100)}%</span></div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${(rankedAttractions.length / attractions.length) * 100}%` }}></div></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};