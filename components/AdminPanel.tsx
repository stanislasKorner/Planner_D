import React, { useState } from 'react';
import { Attraction } from '../types';
import { saveAttractionConfig } from '../services/storageService';
import { Save, Image as ImageIcon, Youtube } from 'lucide-react';

interface Props {
  attractions: Attraction[];
}

export const AdminPanel: React.FC<Props> = ({ attractions }) => {
  const [imgInputs, setImgInputs] = useState<Record<string, string>>({});
  const [ytInputs, setYtInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, 'idle' | 'saving' | 'success'>>({});

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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-slate-900 text-white p-6 rounded-3xl mb-8 shadow-xl">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
            <ImageIcon /> Administration Contenu
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