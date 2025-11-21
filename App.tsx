import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRanking, QuizAnswers, Attraction, AttractionConfig } from './types';
import { USERS_LIST, ATTRACTIONS } from './constants';
import { loginUser, logoutUser, getCurrentUser, subscribeToRankings, saveRanking, getUserRanking, subscribeToAttractionConfigs } from './services/storageService';
import { RankingList } from './components/RankingList';
import { GlobalResults } from './components/GlobalResults';
import { UserProfileQuiz } from './components/UserProfileQuiz';
import { AdminPanel } from './components/AdminPanel'; // Import du panel
import { LogOut, Crown, Loader2, Check, Lock, UserCircle, Settings } from 'lucide-react'; // Import Settings icon

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'rank' | 'global' | 'admin'>('rank'); // Ajout view admin
  const [myOrder, setMyOrder] = useState<string[]>([]);
  const [allRankings, setAllRankings] = useState<UserRanking[]>([]);
  const [attractionConfigs, setAttractionConfigs] = useState<AttractionConfig[]>([]);
  const [selectedName, setSelectedName] = useState(USERS_LIST[0]);
  const [hasVoted, setHasVoted] = useState(false);
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [showQuiz, setShowQuiz] = useState(false);

  // 1. Initialize Session
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserData(currentUser.name);
    }
  }, []);

  // 2. Subscribe to Global Data (Rankings + Configs Images)
  useEffect(() => {
    const unsubRankings = subscribeToRankings(setAllRankings);
    const unsubConfigs = subscribeToAttractionConfigs(setAttractionConfigs);
    return () => {
        unsubRankings();
        unsubConfigs();
    };
  }, []);

  // 3. Fusion des images custom (Admin) avec les données statiques
  const mergedAttractions = useMemo(() => {
    return ATTRACTIONS.map(attr => {
        const config = attractionConfigs.find(c => c.attractionId === attr.id);
        if (config && config.customImageUrl) {
            return { ...attr, imageUrl: config.customImageUrl };
        }
        return attr;
    });
  }, [attractionConfigs]); // Se recalcule quand les configs changent

  const loadUserData = async (name: string) => {
    const myRanking = await getUserRanking(name);
    if (myRanking) {
      setMyOrder(myRanking.rankedAttractionIds);
      setHasVoted(true);
      setShowQuiz(false);
    } else {
      setHasVoted(false);
      setShowQuiz(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { name: selectedName };
    loginUser(newUser);
    setUser(newUser);
    loadUserData(newUser.name);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setHasVoted(false);
    setShowQuiz(false);
    setView('rank');
  };

  const handleQuizSubmit = (answers: QuizAnswers) => {
    // Utiliser mergedAttractions ici pour avoir les bonnes images si besoin
    const scoredAttractions = mergedAttractions.map(attr => {
        let score = 0;
        if (answers.attractionType === 'classic' && (attr.land === 'Fantasyland' || attr.land === 'Adventureland' || attr.intensity === 'Calme')) score += 5;
        if (answers.attractionType === 'adventure' && (attr.land === 'Frontierland' || attr.name.includes('Star'))) score += 5;
        if (answers.attractionType === 'thrill' && (attr.intensity === 'Sensations fortes')) score += 10;
        if (answers.attractionType === 'story' && (attr.intensity === 'Modéré' || attr.intensity === 'Calme')) score += 3;
        if (answers.adrenalineLevel === 'chill' && attr.intensity === 'Calme') score += 8;
        if (answers.adrenalineLevel === 'medium' && attr.intensity === 'Modéré') score += 8;
        if (answers.adrenalineLevel === 'fast' && (attr.intensity === 'Sensations fortes' || attr.intensity === 'Modéré')) score += 5;
        if (answers.adrenalineLevel === 'extreme' && attr.intensity === 'Sensations fortes') score += 10;
        if (answers.avoidance === 'heights' && (attr.name.includes('Orbitron') || attr.name.includes('Robinson'))) score -= 10;
        if (answers.avoidance === 'loops' && (attr.name.includes('Indiana') || attr.name.includes('Hyperspace'))) score -= 20;
        if (answers.avoidance === 'dark' && (attr.name.includes('Phantom') || attr.name.includes('Pirates') || attr.land === 'Fantasyland')) score -= 5;
        return { id: attr.id, score };
    });
    scoredAttractions.sort((a, b) => b.score - a.score);
    const newOrder = scoredAttractions.map(a => a.id);
    setMyOrder(newOrder);
    setShowQuiz(false);
  };

  const handleSaveRanking = async () => {
    if (!user) return;
    setSaveStatus('saving');
    const ranking: UserRanking = {
      userName: user.name,
      rankedAttractionIds: myOrder,
      timestamp: Date.now()
    };
    try {
      await saveRanking(ranking);
      setSaveStatus('success');
      setHasVoted(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      alert("Erreur sauvegarde");
      setSaveStatus('idle');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Crown className="text-white w-8 h-8" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Korner chez Mickey</h1>
             <p className="text-slate-500 mt-2">Sélectionnez votre profil pour commencer.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <select 
                className="w-full px-4 py-4 bg-white border-none rounded-2xl text-slate-900 font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-center cursor-pointer hover:shadow-md transition-shadow"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              >
                {USERS_LIST.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200">Entrer</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      {showQuiz && <UserProfileQuiz onSubmit={handleQuizSubmit} />}

      <nav className="fixed top-0 left-0 right-0 bg-indigo-900 text-white shadow-lg z-50 h-16 flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="font-black text-lg tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
               <Crown size={16} className="text-indigo-900" />
            </div>
            <span className="hidden sm:inline">Korner chez Mickey</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-indigo-800 p-1 rounded-full flex items-center border border-indigo-700">
               <button onClick={() => setView('rank')} className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${view === 'rank' ? 'bg-white shadow-sm text-indigo-900' : 'text-indigo-200 hover:text-white'}`}>Mon Vote</button>
               <button onClick={() => setView('global')} className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${view === 'global' ? 'bg-white shadow-sm text-indigo-900' : 'text-indigo-200 hover:text-white'}`}>Résultats</button>
               {/* BOUTON ADMIN POUR RAPHAEL */}
               {user.name === 'Raphaël' && (
                   <button onClick={() => setView('admin')} className={`px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${view === 'admin' ? 'bg-white shadow-sm text-indigo-900' : 'text-indigo-200 hover:text-white'}`}>
                       <Settings size={16} />
                   </button>
               )}
            </div>

            <div className="h-6 w-px bg-indigo-800 mx-1"></div>
            <button onClick={() => setShowQuiz(true)} className="p-2 text-indigo-300 hover:text-white transition-colors rounded-full hover:bg-indigo-800" title="Refaire mon profil"><UserCircle size={20} /></button>
            <button onClick={handleLogout} className="p-2 text-indigo-300 hover:text-red-400 transition-colors rounded-full hover:bg-indigo-800"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6">
        {view === 'rank' && (
          <>
            <RankingList attractions={mergedAttractions} currentOrder={myOrder} onUpdateOrder={setMyOrder} />
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <button id="save-btn" onClick={handleSaveRanking} disabled={saveStatus === 'saving' || saveStatus === 'success'} className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-2xl transition-all active:scale-95 disabled:opacity-100 disabled:cursor-default ${saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white shadow-slate-400 hover:bg-black'}`}>
                    {saveStatus === 'saving' && <Loader2 className="animate-spin" size={20} />}
                    {saveStatus === 'success' && <Check size={20} />}
                    {saveStatus === 'idle' && 'Sauvegarder mes choix'}
                    {saveStatus === 'saving' && 'Sauvegarde...'}
                    {saveStatus === 'success' && 'Sauvegardé !'}
                </button>
            </div>
          </>
        )}

        {view === 'global' && (
            hasVoted ? (
                <GlobalResults attractions={mergedAttractions} allRankings={allRankings} currentUser={user.name} myOrder={myOrder} />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner"><Lock className="text-slate-400 w-10 h-10" /></div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3">Résultats verrouillés</h2>
                    <p className="text-slate-500 max-w-md mb-8">Vote d'abord !</p>
                    <button onClick={() => setView('rank')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Fais ton choix maintenant</button>
                </div>
            )
        )}

        {/* VUE ADMIN */}
        {view === 'admin' && user.name === 'Raphaël' && (
            <AdminPanel attractions={mergedAttractions} />
        )}
      </main>
    </div>
  );
};

export default App;