import React, { useMemo, useState, useEffect } from 'react';
import { Attraction, UserRanking } from '../types';
import { USERS_LIST } from '../constants';
import { optimizeItinerary } from '../services/geminiService';
import { resetAllRankings } from '../services/storageService';
import { AttractionCard } from './AttractionCard';
import { MapVisualization } from './MapVisualization';
import { Sparkles, MapPin, LayoutList, Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  attractions: Attraction[];
  allRankings: UserRanking[];
  currentUser: string;
  myOrder: string[];
}

export const GlobalResults: React.FC<Props> = ({ attractions, allRankings, currentUser, myOrder }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [optimizedPath, setOptimizedPath] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [hoveredAttractionId, setHoveredAttractionId] = useState<string | null>(null);

  // --- CALCUL DES VOTANTS ---
  const votersList = useMemo(() => {
    const votedNames = allRankings.map(r => r.userName);
    const hasVoted = USERS_LIST.filter(u => votedNames.includes(u));
    const notVoted = USERS_LIST.filter(u => !votedNames.includes(u));
    return { hasVoted, notVoted };
  }, [allRankings]);

  const globalRanking = useMemo(() => {
    if (allRankings.length === 0) return [];
    const scores: Record<string, number> = {};
    attractions.forEach(a => scores[a.id] = 0);
    allRankings.forEach(ranking => {
      ranking.rankedAttractionIds.forEach((id, index) => {
        if (scores[id] !== undefined) scores[id] += (index + 1);
      });
    });
    return [...attractions].sort((a, b) => scores[a.id] - scores[b.id]);
  }, [attractions, allRankings]);

  const topForAI = globalRanking.slice(0, 15);

  useEffect(() => {
    if (activeTab === 'map' && topForAI.length > 0 && optimizedPath.length === 0 && !isLoadingAI) {
      const fetchOptimization = async () => {
        setIsLoadingAI(true);
        const result = await optimizeItinerary(topForAI);
        setOptimizedPath(result.path);
        setIsLoadingAI(false);
      };
      fetchOptimization();
    }
  }, [activeTab, topForAI, optimizedPath.length, isLoadingAI]);

  const openResetModal = () => {
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    try {
        setIsResetting(true);
        await resetAllRankings();
        setShowResetModal(false);
    } catch (e) {
        alert("Erreur lors de la réinitialisation.");
    } finally {
        setIsResetting(false);
    }
  };

  const mapSidebarList = optimizedPath.length > 0 
    ? optimizedPath.map(id => attractions.find(a => a.id === id)).filter(Boolean) as Attraction[]
    : topForAI;

  if (allRankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 relative">
        {currentUser === 'Raphaël' && (
            <button onClick={openResetModal} className="absolute top-0 right-0 text-xs font-bold text-red-200 hover:text-red-500 transition-colors">Admin Reset</button>
        )}
        {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 p-6">
                    <h3 className="text-xl font-black text-center text-slate-900 mb-2">Tout effacer ?</h3>
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100">Annuler</button>
                        <button onClick={confirmReset} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600">Oui</button>
                    </div>
                </div>
            </div>
        )}
        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-medium">Aucun vote pour le moment</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-4 relative">
        {/* VOTERS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm uppercase tracking-wide">
                    <CheckCircle2 size={16} /> Ont voté ({votersList.hasVoted.length})
                </div>
                <div className="flex flex-wrap gap-2">
                    {votersList.hasVoted.map(name => (
                        <span key={name} className="bg-white text-emerald-700 px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-emerald-100">{name}</span>
                    ))}
                </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold text-sm uppercase tracking-wide">
                    <XCircle size={16} /> En attente ({votersList.notVoted.length})
                </div>
                <div className="flex flex-wrap gap-2">
                    {votersList.notVoted.map(name => (
                        <span key={name} className="bg-white text-rose-700 px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-rose-100 opacity-60">{name}</span>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2">
           <div>
             <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Résultats</h2>
                {currentUser === 'Raphaël' && (
                    <button onClick={openResetModal} className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold hover:bg-red-100 transition-colors border border-red-100"><Trash2 size={12} /> RAZ</button>
                )}
             </div>
             <p className="text-slate-500 mt-1 text-sm">Classement consolidé de l'équipe</p>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-xl mt-4 md:mt-0 self-start">
             <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}><LayoutList size={16} /> Liste</button>
             <button onClick={() => setActiveTab('map')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'map' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}><Sparkles size={16} /> Parcours IA</button>
           </div>
        </div>

        {activeTab === 'list' && (
            <div className="space-y-5 max-w-2xl mx-auto">
                {globalRanking.map((attraction, index) => {
                    const myRank = myOrder.indexOf(attraction.id) + 1;
                    return <AttractionCard key={attraction.id} attraction={attraction} index={index} isDraggable={false} myRank={myRank > 0 ? myRank : undefined} />;
                })}
            </div>
        )}

        {activeTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
                <div className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
                    <h3 className="font-bold text-slate-900 mb-4 px-2">Ordre de visite</h3>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2 no-scrollbar">
                        {mapSidebarList.map((attr, idx) => (
                            <div key={attr.id} onMouseEnter={() => setHoveredAttractionId(attr.id)} onMouseLeave={() => setHoveredAttractionId(null)} className={`flex items-center gap-3 p-3 rounded-xl transition-colors group cursor-pointer ${hoveredAttractionId === attr.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                                <span className={`bg-slate-900 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] transition-transform ${hoveredAttractionId === attr.id ? 'scale-110 bg-indigo-600' : ''}`}>{idx + 1}</span>
                                <div className="min-w-0 flex-grow">
                                    <p className={`text-sm font-bold truncate transition-colors ${hoveredAttractionId === attr.id ? 'text-indigo-900' : 'text-slate-800'}`}>{attr.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{attr.land}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-8 h-full rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                     <MapVisualization path={optimizedPath.length > 0 ? optimizedPath : topForAI.map(a => a.id)} attractions={attractions} hoveredId={hoveredAttractionId} />
                </div>
            </div>
        )}
        
        {/* Reset Modal (Admin) */}
        {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 p-6">
                    <h3 className="text-xl font-black text-center text-slate-900 mb-2">Zone de Danger</h3>
                    <p className="text-center text-slate-500 text-sm mb-6">Tout effacer ?</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200">Annuler</button>
                        <button onClick={confirmReset} disabled={isResetting} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700">{isResetting ? '...' : 'Oui'}</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};