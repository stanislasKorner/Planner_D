import React, { useState, useEffect } from 'react';
import { Attraction, AppConfig, UserRanking } from '../types';
import { saveAttractionConfig, saveAppConfig } from '../services/storageService';
import { Save, Image as ImageIcon, Youtube, Settings, LayoutTemplate, Upload, X, Table2, BarChart3 } from 'lucide-react';
import { USERS_LIST } from '../constants';

interface Props {
  attractions: Attraction[];
  currentAppConfig?: AppConfig;
  allRankings?: UserRanking[];
}

export const AdminPanel: React.FC<Props> = ({ attractions, currentAppConfig, allRankings = [] }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'stats'>('config');
  const [imgInputs, setImgInputs] = useState<Record<string, string>>({});
  const [ytInputs, setYtInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, 'idle' | 'saving' | 'success'>>({});
  const [appName, setAppName] = useState("Korner chez Mickey");
  const [appIcon, setAppIcon] = useState("");
  const [configStatus, setConfigStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    if (currentAppConfig) {
        setAppName(currentAppConfig.appName);
        setAppIcon(currentAppConfig.appIconUrl);
    }
  }, [currentAppConfig]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1.5 * 1024 * 1024) { alert("Image trop lourde"); return; }
          const reader = new FileReader();
          reader.onloadend = () => setAppIcon(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  const handleSaveConfig = async () => {
      setConfigStatus('saving');
      try { await saveAppConfig({ appName, appIconUrl: appIcon }); setConfigStatus('success'); setTimeout(() => setConfigStatus('idle'), 2000); } 
      catch (e) { setConfigStatus('idle'); alert("Erreur"); }
  };

  const handleSaveAttr = async (id: string) => {
    const img = imgInputs[id]; const yt = ytInputs[id];
    if (!img && !yt) return;
    setStatus(prev => ({ ...prev, [id]: 'saving' }));
    try {
      await saveAttractionConfig({ attractionId: id, customImageUrl: img || '', customYoutubeUrl: yt });
      setStatus(prev => ({ ...prev, [id]: 'success' })); setTimeout(() => setStatus(prev => ({ ...prev, [id]: 'idle' })), 2000);
    } catch (e) { setStatus(prev => ({ ...prev, [id]: 'idle' })); }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-xl shadow border inline-flex">
              <button onClick={() => setActiveTab('config')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeTab === 'config' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Configuration</button>
              <button onClick={() => setActiveTab('stats')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Analyse</button>
          </div>
      </div>

      {activeTab === 'config' && (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2"><LayoutTemplate className="text-indigo-600"/> Identité</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Nom</label><input type="text" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={appName} onChange={e => setAppName(e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Logo</label><div className="flex gap-2"><label className="flex-grow flex items-center justify-center px-4 py-3 bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-indigo-500"><Upload size={18} className="mr-2"/> Fichier <input type="file" accept="image/*" className="hidden" onChange={handleFileChange}/></label>{appIcon && <img src={appIcon} className="w-12 h-12 rounded-lg object-contain bg-white border"/>}</div></div>
                </div>
                <div className="mt-4 flex justify-end"><button onClick={handleSaveConfig} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl"><Save size={18} className="inline mr-2"/> Sauvegarder</button></div>
            </div>

            <div className="grid gap-4">
                {attractions.map(attr => (
                    <div key={attr.id} className="bg-white p-4 rounded-2xl shadow-sm border flex gap-4 items-start">
                        <img src={imgInputs[attr.id] || attr.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-slate-100"/>
                        <div className="flex-grow space-y-2">
                            <h3 className="font-bold text-sm">{attr.name}</h3>
                            <div className="flex gap-2"><ImageIcon size={14} className="text-slate-400 mt-2"/><input type="text" placeholder="URL Image..." className="w-full text-xs p-2 bg-slate-50 rounded-lg" value={imgInputs[attr.id] || ''} onChange={e => setImgInputs({...imgInputs, [attr.id]: e.target.value})} /></div>
                            <div className="flex gap-2"><Youtube size={14} className="text-slate-400 mt-2"/><input type="text" placeholder="URL YouTube..." className="w-full text-xs p-2 bg-slate-50 rounded-lg" value={ytInputs[attr.id] || ''} onChange={e => setYtInputs({...ytInputs, [attr.id]: e.target.value})} /></div>
                        </div>
                        <button onClick={() => handleSaveAttr(attr.id)} className="p-2 bg-indigo-600 text-white rounded-lg"><Save size={16}/></button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border p-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Table2 className="text-indigo-600"/> Matrice</h2>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs">
                    <tr><th className="p-3">Attraction</th>{USERS_LIST.map(u => <th key={u} className="p-3 text-center">{u.substring(0,3)}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                    {attractions.map(attr => (
                        <tr key={attr.id}>
                            <td className="p-3 font-bold">{attr.name}</td>
                            {USERS_LIST.map(u => {
                                const rank = allRankings.find(r => r.userName === u)?.rankedAttractionIds.indexOf(attr.id);
                                return <td key={u} className="p-3 text-center">{rank !== undefined && rank !== -1 ? rank + 1 : '-'}</td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};