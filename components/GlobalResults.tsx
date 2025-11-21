import React, { useMemo, useState, useEffect } from 'react';
import { Attraction, UserRanking } from '../types';
import { optimizeItinerary } from '../services/geminiService';
import { resetAllRankings } from '../services/storageService';
import { AttractionCard } from './AttractionCard';
import { MapVisualization } from './MapVisualization';
import { Sparkles, MapPin, LayoutList, Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  attractions: Attraction[];
  allRankings: UserRanking[];
  currentUser: string;
  myOrder: string[]; // Le classement personnel de l'utilisateur courant
}

export const GlobalResults: React.FC<Props> = ({ attractions, allRankings, currentUser, myOrder }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [optimizedPath, setOptimizedPath] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // New state for hover interaction
  const [hoveredAttractionId, setHoveredAttractionId] = useState<string | null>(null);

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

  // Contenu vide
  if (allRankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 relative">
        {/* Admin Reset even if empty */}
        {currentUser === 'Raphaël' && (
            <>
                <button 
                    onClick={openResetModal}
                    className="absolute top-0 right-0 text-xs font-bold text-red-200 hover:text-red-500 transition-colors"
                >
                    Admin Reset
                </button>
                
                {/* Modal for empty state context */}
                {showResetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                                <h3 className="text-xl font-black text-center text-slate-900 mb-2">Zone de Danger</h3>
                                <p className="text-center text-slate-500 text-sm mb-6">
                                    Tu es sur le point de supprimer <strong>tous les votes</strong> de l'équipe.
                                    <br />Cette action est irréversible.
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowResetModal(false)}
                                        className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={confirmReset}
                                        disabled={isResetting}
                                        className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isResetting ? '...' : 'Tout effacer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}
        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-medium">Aucun vote pour le moment</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-4 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2">
           <div>
             <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Résultats</h2>
                {currentUser === 'Raphaël' && (
                    <button 
                        onClick={openResetModal}
                        className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold hover:bg-red-100 transition-colors border border-red-100"
                        title="Réinitialiser toute la session (Admin)"
                    >
                        <Trash2 size={12} /> RAZ
                    </button>
                )}
             </div>
             <p className="text-slate-500 mt-1 text-sm">{allRankings.length} participants ont voté</p>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-xl mt-4 md:mt-0 self-start">
             <button 
               onClick={() => setActiveTab('list')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <LayoutList size={16} /> Liste
             </button>
             <button 
               onClick={() => setActiveTab('map')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'map' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Sparkles size={16} className={isLoadingAI ? "animate-pulse text-indigo-500" : ""} /> Parcours IA
             </button>
           </div>
        </div>

        {activeTab === 'list' && (
            <div className="space-y-5 max-w-2xl mx-auto">
                {globalRanking.map((attraction, index) => {
                    // Calculer la position de l'utilisateur courant pour cette attraction
                    const myRank = myOrder.indexOf(attraction.id) + 1;

                    return (
                        <AttractionCard 
                            key={attraction.id}
                            attraction={attraction}
                            index={index}
                            isDraggable={false}
                            myRank={myRank > 0 ? myRank : undefined}
                        />
                    );
                })}
            </div>
        )}

        {activeTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
                <div className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
                    <h3 className="font-bold text-slate-900 mb-4 px-2">Ordre de visite</h3>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2 no-scrollbar">
                        {mapSidebarList.map((attr, idx) => (
                            <div 
                                key={attr.id} 
                                onMouseEnter={() => setHoveredAttractionId(attr.id)}
                                onMouseLeave={() => setHoveredAttractionId(null)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors group cursor-pointer ${hoveredAttractionId === attr.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                            >
                                <span className={`bg-slate-900 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] transition-transform ${hoveredAttractionId === attr.id ? 'scale-110 bg-indigo-600' : ''}`}>
                                    {idx + 1}
                                </span>
                                <div className="min-w-0 flex-grow">
                                    <p className={`text-sm font-bold truncate transition-colors ${hoveredAttractionId === attr.id ? 'text-indigo-900' : 'text-slate-800'}`}>{attr.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{attr.land}</p>
                                </div>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=Disneyland+Paris+${encodeURIComponent(attr.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-300 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MapPin size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="lg:col-span-8 h-full rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                     <MapVisualization 
                        path={optimizedPath.length > 0 ? optimizedPath : topForAI.map(a => a.id)} 
                        attractions={attractions}
                        hoveredId={hoveredAttractionId}
                     />
                </div>
            </div>
        )}

        {/* Admin Reset Modal */}
        {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-xl font-black text-center text-slate-900 mb-2">Zone de Danger</h3>
                        <p className="text-center text-slate-500 text-sm mb-6">
                            Tu es sur le point de supprimer <strong>tous les votes</strong> de l'équipe.
                            <br />Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowResetModal(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={confirmReset}
                                disabled={isResetting}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {isResetting ? '...' : 'Tout effacer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};