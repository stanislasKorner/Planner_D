import React, { useState } from 'react';
import { Attraction } from '../types';
import { saveAttractionConfig } from '../services/storageService';
import { Save, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface Props {
  attractions: Attraction[];
}

export const AdminPanel: React.FC<Props> = ({ attractions }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, 'idle' | 'saving' | 'success'>>({});

  const handleChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (attractionId: string) => {
    const url = inputs[attractionId];
    if (!url) return;

    setStatus(prev => ({ ...prev, [attractionId]: 'saving' }));
    try {
      await saveAttractionConfig({ attractionId, customImageUrl: url });
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
            <ImageIcon /> Gestion des Images (Admin)
        </h2>
        <p className="text-slate-400">
            Colle ici les liens d'images pour remplacer celles par défaut.
            <br />Les modifications sont instantanées pour tous les utilisateurs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {attractions.map(attr => (
          <div key={attr.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
            <div className="w-16 h-16 flex-shrink-0">
                <img 
                    src={inputs[attr.id] || attr.imageUrl} 
                    alt={attr.name} 
                    className="w-full h-full object-cover rounded-xl bg-slate-100"
                />
            </div>
            
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-800 text-sm">{attr.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <input 
                        type="text" 
                        placeholder="Coller nouvelle URL image ici..."
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={inputs[attr.id] || ''}
                        onChange={(e) => handleChange(attr.id, e.target.value)}
                    />
                    <button 
                        onClick={() => handleSave(attr.id)}
                        disabled={status[attr.id] === 'saving' || !inputs[attr.id]}
                        className={`p-2 rounded-lg text-white transition-colors flex-shrink-0
                            ${status[attr.id] === 'success' ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}
                        `}
                    >
                        <Save size={16} />
                    </button>
                </div>
                <div className="mt-1 text-[10px] text-slate-400 truncate">
                    Actuelle : {attr.imageUrl.substring(0, 50)}...
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};