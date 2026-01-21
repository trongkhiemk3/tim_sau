import React from 'react';
import { Worm as WormType, WormColor } from '../types';

interface WormProps {
  worm: WormType;
  onCatch: (id: string) => void;
}

export const Worm: React.FC<WormProps> = ({ worm, onCatch }) => {
  if (worm.isCaught) return null;

  // Visual styles based on color
  // Camouflage Logic: 
  // Green worm opacity increased by ~25% as requested.
  // Previously fill-green-500/40 and opacity-60. 
  // Now fill-green-500/60 and opacity-90.
  const getWormStyle = () => {
    switch (worm.color) {
      case WormColor.GREEN:
        return {
          body: 'fill-green-500/60', 
          stroke: 'stroke-green-600/40', 
          eyes: 'fill-green-800/30', 
          containerClass: 'opacity-90' 
        };
      case WormColor.RED:
        return {
          body: 'fill-red-500',
          stroke: 'stroke-red-700',
          eyes: 'fill-black',
          containerClass: ''
        };
      case WormColor.YELLOW:
        return {
          body: 'fill-yellow-400',
          stroke: 'stroke-yellow-600',
          eyes: 'fill-black',
          containerClass: ''
        };
      default:
        return {
          body: 'fill-gray-500',
          stroke: 'stroke-gray-700',
          eyes: 'fill-black',
          containerClass: ''
        };
    }
  };

  const style = getWormStyle();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onCatch(worm.id);
      }}
      className={`absolute w-10 h-10 md:w-12 md:h-12 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${style.containerClass}`}
      style={{
        left: `${worm.x}%`,
        top: `${worm.y}%`,
        transform: `translate(-50%, -50%) rotate(${worm.rotation}deg)`,
        filter: worm.color === WormColor.GREEN ? 'none' : 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))'
      }}
    >
      <svg viewBox="0 0 100 60" className={`w-full h-full animate-wiggle overflow-visible`}>
        {/* Legs - tiny details */}
        <path d="M20 40 L20 50 M40 40 L40 50 M60 40 L60 50 M80 40 L80 50" stroke="currentColor" strokeWidth="3" className={style.stroke} />
        
        {/* Body Segments */}
        <circle cx="90" cy="30" r="12" className={`${style.body} ${style.stroke}`} strokeWidth="2" />
        <circle cx="70" cy="30" r="13" className={`${style.body} ${style.stroke}`} strokeWidth="2" />
        <circle cx="50" cy="30" r="14" className={`${style.body} ${style.stroke}`} strokeWidth="2" />
        <circle cx="30" cy="30" r="13" className={`${style.body} ${style.stroke}`} strokeWidth="2" />
        
        {/* Head */}
        <circle cx="12" cy="30" r="12" className={`${style.body} ${style.stroke}`} strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="8" cy="25" r="2" className={style.eyes} />
        <circle cx="8" cy="35" r="2" className={style.eyes} />
        
        {/* Antennae */}
        <path d="M5 20 Q 0 10 5 5" fill="none" stroke="currentColor" strokeWidth="2" className={style.stroke} />
        <path d="M5 40 Q 0 50 5 55" fill="none" stroke="currentColor" strokeWidth="2" className={style.stroke} />
      </svg>
    </div>
  );
};