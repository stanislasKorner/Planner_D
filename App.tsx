import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRanking, QuizAnswers, Attraction, AttractionConfig, AppConfig } from './types';
import { USERS_LIST, ATTRACTIONS } from './constants';
import { loginUser, logoutUser, getCurrentUser, subscribeToRankings, saveRanking, getUserRanking, subscribeToAttractionConfigs, subscribeToAppConfig } from './services/storageService';
import { RankingList } from './components/RankingList';
import { GlobalResults } from './components/GlobalResults';
import { UserProfileQuiz } from './components/UserProfileQuiz';
import { AdminPanel } from './components/AdminPanel';
import { LogOut, Crown, Loader2, Check, Lock, UserCircle, Settings, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'rank' | 'global' | 'admin'>('rank');
  const [myOrder, setMyOrder] = useState<string[]>([]);
  const [allRankings, setAllRankings] = useState<UserRanking[]>([]);
  const [attractionConfigs, setAttractionConfigs] = useState<AttractionConfig[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [selectedName, setSelectedName] = useState(USERS_LIST[0]);
  const [hasVoted, setHasVoted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserData(currentUser.name);
    }
  }, []);

  useEffect(() => {
    const unsubRankings = subscribeToRankings((rankings) => {
        setAllRankings(rankings);
        // Reset auto si admin vide la base
        if (rankings.length === 0 && hasVoted) {
            setHasVoted(false);
            setMyOrder([]);
            setShowQuiz(true);
            setView('rank');
        }
    });
    const unsubConfigs = subscribeToAttractionConfigs(setAttractionConfigs);
    const unsubApp = subscribeToAppConfig(setAppConfig);
    return () => {
        unsubRankings();
        unsubConfigs();
        unsubApp();
    };
  }, [hasVoted]);

  // Update Title & Favicon
  useEffect(() => {
    if (appConfig) {
        document.title = appConfig.appName;
        if (appConfig.appIconUrl) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = appConfig.appIconUrl;
        }
    }
  }, [appConfig]);

  const mergedAttractions = useMemo(() => {
    return ATTRACTIONS.map(attr => {
        const config = attractionConfigs.find(c => c.attractionId === attr.id);
        let newAttr = { ...attr };
        if (config) {
            if (config.customImageUrl) newAttr.imageUrl = config.customImageUrl;
            if (config.customYoutubeUrl) newAttr.youtubeUrl = config.customYoutubeUrl;
        }
        return newAttr;
    });
  }, [attractionConfigs]);

  const loadUserData = async (name: string) => {
    const myRanking = await getUserRanking(name);
    if (myRanking) {
      setMyOrder(myRanking.rankedAttractionIds);
      setHasVoted(true);
      setShowQuiz(false);
    } else {
      setMyOrder([]); 
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
    setMyOrder([]); 
    setShowQuiz(false);
    setView('rank');
  };

  const handleQuizSubmit = (answers: QuizAnswers) => {
    setShowQuiz(false);
  };

  const handleSaveRanking = async () => {
    if (!user) return;
    
    if (myOrder.length < ATTRACTIONS.length) {
        alert(`Il reste ${ATTRACTIONS.length - myOrder.length} attractions à classer !`);
        return;
    }

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

  const appName = appConfig?.appName || "Korner chez Mickey";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
             {appConfig?.appIconUrl ? (
                 <img src={appConfig.appIconUrl} alt="Logo" className="w-20 h-20 mx-auto mb-6 rounded-3xl shadow-lg object-cover bg-indigo-600" />
             ) : (
                 <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Crown className="text-white w-8 h-8" />
                 </div>
             )}
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">{appName}</h1>
             <p className="text-slate-500 mt-2">Sélectionnez votre profil pour commencer.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <select className="w-full px-4 py-4 bg-white border-none rounded-2xl text-slate-900 font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-center cursor-pointer hover:shadow-md transition-shadow" value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
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

  const isComplete = myOrder.length === ATTRACTIONS.length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      {showQuiz && <UserProfileQuiz onSubmit={handleQuizSubmit} />}

      <nav className="fixed top-0 left-0 right-0 bg-indigo-900 text-white shadow-lg z-50 h-16 flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="font-black text-lg tracking-tight flex items-center gap-2">
            {appConfig?.appIconUrl ? (
                 <img src={appConfig.appIconUrl} alt="Logo" className="w-8 h-8 rounded-lg bg-white object-cover" />
             ) : (
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                   <Crown size={16} className="text-indigo-900" />
                </div>
             )}
            <span className="hidden sm:inline">{appName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-indigo-800 p-1 rounded-full flex items-center border border-indigo-700">
               <button onClick={() => setView('rank')} className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${view === 'rank' ? 'bg-white shadow-sm text-indigo-900' : 'text-indigo-200 hover:text-white'}`}>Mon Vote</button>
               <button onClick={() => setView('global')} className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${view === 'global' ? 'bg-white shadow-sm text-indigo-900' : 'text-indigo-200 hover:text-white'}`}>Résultats</button>
               {user.name === 'Raphaël' && (
                   <button onClick={() => setView('admin')} className={`px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${view === 'admin' ? 'bg-white shadow-sm text-indigo-900' : 'text-indigo-200 hover:text-white'}`} title="Admin">
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
            
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4">
                <button 
                    id="save-btn" 
                    onClick={handleSaveRanking} 
                    disabled={saveStatus === 'saving' || saveStatus === 'success'} 
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold shadow-2xl transition-all active:scale-95
                        ${!isComplete 
                            ? 'bg-slate-800 text-slate-300 cursor-not-allowed opacity-90' 
                            : saveStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }
                    `}
                >
                    {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={20} /> : 
                     saveStatus === 'success' ? <Check size={20} /> : 
                     !isComplete ? <AlertCircle size={20} className="text-amber-400" /> : null}
                    
                    {saveStatus === 'success' ? 'Sauvegardé !' : 
                     !isComplete ? `Reste ${ATTRACTIONS.length - myOrder.length} à classer` : 'Valider mon classement'}
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

        {view === 'admin' && user.name === 'Raphaël' && (
            <AdminPanel 
                attractions={mergedAttractions} 
                currentAppConfig={appConfig || undefined}
                allRankings={allRankings} 
            />
        )}
      </main>
    </div>
  );
};

export default App;