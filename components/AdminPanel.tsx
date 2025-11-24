import React, { useState, useEffect } from 'react';
import { Attraction, AppConfig } from '../types';
import { saveAttractionConfig, saveAppConfig } from '../services/storageService';
import { Save, Image as ImageIcon, Youtube, Settings, LayoutTemplate, Upload, X } from 'lucide-react';

interface Props {
  attractions: Attraction[];
  currentAppConfig?: AppConfig;
}

export const AdminPanel: React.FC<Props> = ({ attractions, currentAppConfig }) => {
  const [imgInputs, setImgInputs] = useState<Record<string, string>>({});
  const [ytInputs, setYtInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, 'idle' | 'saving' | 'success'>>({});

  const [appName, setAppName] = useState(currentAppConfig?.appName || "Korner chez Mickey");
  const [appIcon, setAppIcon] = useState(currentAppConfig?.appIconUrl || "");
  const [configStatus, setConfigStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    if (currentAppConfig) {
        setAppName(currentAppConfig.appName);
        setAppIcon(currentAppConfig.appIconUrl);
    }
  }, [currentAppConfig]);

  // --- GESTION FICHIER LOCAL (ICÔNE) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Limite de taille simple (ex: 1.5MB pour éviter de bloquer Firestore)
          if (file.size > 1.5 * 1024 * 1024) {
              alert("L'image est trop lourde (>1.5Mo). Essayez une image plus petite pour l'icône.");
              return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
              setAppIcon(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveConfig = async () => {
      setConfigStatus('saving');
      try {
          await saveAppConfig({ appName, appIconUrl: appIcon });
          setConfigStatus('success');
          setTimeout(() => setConfigStatus('idle'), 2000);
      } catch (e) {
          setConfigStatus('idle');
          alert("Erreur sauvegarde config. L'image est peut-être trop lourde ?");
      }
  };

  const handleImgChange = (id: string, value: string) => {
    setImgInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleYtChange = (id: string, value: string) => {
    setYtInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (attractionId: string) => {
    const imgUrl = imgInputs[attractionId];
    const ytUrl = ytInputs[attractionId];
    
    if (!imgUrl && !ytUrl) return;

    setStatus(prev => ({ ...prev, [attractionId]: 'saving' }));
    try {
      await saveAttractionConfig({ 
          attractionId, 
          customImageUrl: imgUrl || '',
          customYoutubeUrl: ytUrl 
      });
      setStatus(prev => ({ ...prev, [attractionId]: 'success' }));
      setTimeout(() => setStatus(prev => ({ ...prev, [attractionId]: 'idle' })), 2000);
    } catch (e) {
      setStatus(prev => ({ ...prev, [attractionId]: 'idle' }));
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      
      {/* --- SECTION CONFIG GLOBALE --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <LayoutTemplate className="text-indigo-600" /> Identité de l'Application
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom de l'app</label>
                <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icône / Logo</label>
                
                <div className="space-y-3">
                    {/* Zone d'upload */}
                    <div className="flex items-center gap-3">
                        <label className="flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 text-sm font-bold rounded-xl cursor-pointer transition-all">
                            <Upload size={18} />
                            <span>Choisir une image (fichier)</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* Alternative URL */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><span className="text-[10px] font-bold">URL</span></div>
                        <input 
                            type="text" 
                            placeholder="Ou coller un lien https://..."
                            className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={appIcon}
                            onChange={(e) => setAppIcon(e.target.value)}
                        />
                    </div>

                    {/* Preview */}
                    {appIcon && (
                        <div className="flex items-center gap-4 mt-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <img src={appIcon} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm" />
                            <div className="flex-grow min-w-0">
                                <p className="text-xs font-bold text-slate-700">Aperçu actuel</p>
                                <p className="text-[10px] text-slate-400 truncate">{appIcon.substring(0, 40)}...</p>
                            </div>
                            <button onClick={() => setAppIcon('')} className="p-1 text-slate-400 hover:text-red-500"><X size={16} /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <button 
                onClick={handleSaveConfig}
                disabled={configStatus === 'saving'}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-colors shadow-lg
                    ${configStatus === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 hover:bg-black'}
                `}
            >
                <Save size={18} /> {configStatus === 'saving' ? 'Sauvegarde...' : 'Mettre à jour l\'app'}
            </button>
        </div>
      </div>

      {/* --- SECTION ATTRACTIONS --- */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
            <ImageIcon /> Contenu des Attractions
        </h2>
        <p className="text-slate-400">
            Modifie les images et vidéos des attractions. Les changements sont instantanés pour tous.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {attractions.map(attr => (
          <div key={attr.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
            <div className="w-20 h-20 flex-shrink-0">
                <img 
                    src={imgInputs[attr.id] || attr.imageUrl} 
                    alt={attr.name} 
                    className="w-full h-full object-cover rounded-xl bg-slate-100"
                />
            </div>
            
            <div className="flex-grow min-w-0 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">{attr.name}</h3>
                
                <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="URL Image..."
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={imgInputs[attr.id] || ''}
                        onChange={(e) => handleImgChange(attr.id, e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Youtube size={16} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="URL YouTube..."
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={ytInputs[attr.id] || ''}
                        onChange={(e) => handleYtChange(attr.id, e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={() => handleSave(attr.id)}
                        disabled={status[attr.id] === 'saving' || (!imgInputs[attr.id] && !ytInputs[attr.id])}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors
                            ${status[attr.id] === 'success' ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}
                        `}
                    >
                        <Save size={14} /> Sauvegarder
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};