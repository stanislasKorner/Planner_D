import React, { useState, useEffect } from 'react';
import { User, UserRanking } from './types';
import { USERS_LIST, ATTRACTIONS } from './constants';
import { loginUser, logoutUser, getCurrentUser, subscribeToRankings, saveRanking, getUserRanking } from './services/storageService';
import { RankingList } from './components/RankingList';
import { GlobalResults } from './components/GlobalResults';
import { LogOut, Crown, Loader2, Check, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'rank' | 'global'>('rank');
  const [myOrder, setMyOrder] = useState<string[]>([]);
  const [allRankings, setAllRankings] = useState<UserRanking[]>([]);
  const [selectedName, setSelectedName] = useState(USERS_LIST[0]);
  const [hasVoted, setHasVoted] = useState(false);
  
  // 'idle' | 'saving' | 'success'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  // 1. Initialize Session
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserData(currentUser.name);
    }
  }, []);

  // 2. Subscribe to Global Data (Real-time)
  useEffect(() => {
    // This listener runs automatically whenever Firebase data changes
    const unsubscribe = subscribeToRankings((data) => {
      setAllRankings(data);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Load the specific user's previous vote from Firebase
  const loadUserData = async (name: string) => {
    const myRanking = await getUserRanking(name);
    if (myRanking) {
      setMyOrder(myRanking.rankedAttractionIds);
      setHasVoted(true);
    } else {
      // Default order if no vote yet
      setMyOrder(ATTRACTIONS.map(a => a.id));
      setHasVoted(false);
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
    setView('rank');
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
      setHasVoted(true); // Unlock results
      
      // Reset back to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch (error) {
      alert("Erreur lors de la sauvegarde. Vérifiez votre connexion.");
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
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team Disney</h1>
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
            
            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50 h-16 flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="font-black text-lg tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <Crown size={16} className="text-white" />
            </div>
            <span className="hidden sm:inline">Team Disney</span>
          </div>
          
          <div className="bg-slate-100 p-1 rounded-full flex items-center">
             <button 
                onClick={() => setView('rank')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === 'rank' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Mon Vote
             </button>
             <button 
                onClick={() => setView('global')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === 'global' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Résultats
             </button>
          </div>

          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6">
        {view === 'rank' ? (
          <>
            <RankingList 
                attractions={ATTRACTIONS} 
                currentOrder={myOrder} 
                onUpdateOrder={setMyOrder} 
            />
            
            {/* Floating Save Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <button 
                    id="save-btn"
                    onClick={handleSaveRanking}
                    disabled={saveStatus === 'saving' || saveStatus === 'success'}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-2xl transition-all active:scale-95 disabled:opacity-100 disabled:cursor-default
                        ${saveStatus === 'success' 
                            ? 'bg-emerald-500 text-white shadow-emerald-200' 
                            : 'bg-slate-900 text-white shadow-slate-400 hover:bg-black'
                        }
                    `}
                >
                    {saveStatus === 'saving' && <Loader2 className="animate-spin" size={20} />}
                    {saveStatus === 'success' && <Check size={20} />}
                    
                    {saveStatus === 'idle' && 'Sauvegarder mes choix'}
                    {saveStatus === 'saving' && 'Sauvegarde...'}
                    {saveStatus === 'success' && 'Sauvegardé !'}
                </button>
            </div>
          </>
        ) : (
            /* Global Results View with Access Control */
            hasVoted ? (
                <GlobalResults 
                    attractions={ATTRACTIONS} 
                    allRankings={allRankings} 
                    currentUser={user.name}
                    myOrder={myOrder}
                />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <Lock className="text-slate-400 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3">Résultats verrouillés</h2>
                    <p className="text-slate-500 max-w-md mb-8">
                        Pour découvrir le classement global de l'équipe et l'itinéraire optimisé, tu dois d'abord soumettre ton propre vote !
                    </p>
                    <button 
                        onClick={() => setView('rank')}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Fais ton choix maintenant
                    </button>
                </div>
            )
        )}
      </main>
    </div>
  );
};

export default App;