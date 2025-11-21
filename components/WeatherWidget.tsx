import React from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Moon } from 'lucide-react';
import { WEATHER_FORECAST } from '../constants';

const getWeatherIcon = (icon: string, className: string) => {
  switch(icon) {
    case 'cloud': return <Cloud className={className} />;
    case 'cloud-rain': return <CloudRain className={className} />;
    case 'sun': return <Sun className={className} />;
    case 'cloud-sun': return <CloudSun className={className} />;
    case 'moon': return <Moon className={className} />;
    default: return <Sun className={className} />;
  }
};

export const WeatherWidget: React.FC = () => {
  return (
    <div className="w-full mb-8 overflow-hidden">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="flex flex-col">
           <h3 className="text-lg font-bold text-slate-800 leading-none">Météo Disneyland</h3>
           <span className="text-xs font-medium text-slate-400 tracking-wide">09 DEC 2025</span>
        </div>
        <div className="h-px flex-grow bg-slate-100 mx-2"></div>
      </div>
      
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 no-scrollbar snap-x">
        {WEATHER_FORECAST.map((item, index) => (
          <div 
            key={index} 
            className="snap-start flex flex-col items-center justify-center min-w-[70px] h-[90px] bg-white rounded-2xl border border-slate-100 shadow-sm flex-shrink-0 transition-transform hover:-translate-y-1"
          >
            <span className="text-[11px] font-medium text-slate-400 mb-1.5">{item.hour}</span>
            <div className="text-slate-600 mb-1">
               {getWeatherIcon(item.icon, "w-5 h-5")}
            </div>
            <span className="text-sm font-bold text-slate-800">{item.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};