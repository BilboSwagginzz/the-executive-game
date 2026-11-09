import React from 'react';
import { CrewMember } from '../game/types';

interface CharacterAvatarProps {
  member: CrewMember;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  member,
  size = 'md',
  className = '',
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-sm',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 text-base',
    xl: 'w-36 h-36 sm:w-44 sm:h-44 text-lg',
  }[size];

  // Specific procedural pixel art palettes & icons for each mob character if external photo isn't used
  const getLoreBadge = () => {
    switch (member.id) {
      case 'ralphie':
        return {
          bg: 'bg-amber-950',
          border: 'border-amber-600',
          hair: 'bg-yellow-800',
          jacket: 'bg-amber-900',
          item: '🔥 Ascot & Toupee',
          initials: 'RC',
          accent: 'text-amber-400',
        };
      case 'johnny_sack':
        return {
          bg: 'bg-stone-900',
          border: 'border-slate-500',
          hair: 'bg-stone-950',
          jacket: 'bg-slate-900',
          item: '🚬 NY Cigarette',
          initials: 'JS',
          accent: 'text-sky-400',
        };
      case 'richie':
        return {
          bg: 'bg-stone-950',
          border: 'border-amber-800',
          hair: 'bg-stone-800',
          jacket: 'bg-amber-950',
          item: '🧥 Rocco DiMeo Jacket',
          initials: 'RA',
          accent: 'text-amber-500',
        };
      case 'pussy':
        return {
          bg: 'bg-cyan-950',
          border: 'border-cyan-700',
          hair: 'bg-stone-900',
          jacket: 'bg-slate-800',
          item: '🐟 Ocean Fish / Wire',
          initials: 'BP',
          accent: 'text-cyan-400',
        };
      case 'carmela':
        return {
          bg: 'bg-rose-950',
          border: 'border-amber-400',
          hair: 'bg-amber-200 text-stone-900',
          jacket: 'bg-rose-900',
          item: '✨ Gold Cross & Ziti',
          initials: 'CS',
          accent: 'text-amber-300',
        };
      case 'artie':
        return {
          bg: 'bg-emerald-950',
          border: 'border-emerald-600',
          hair: 'bg-stone-700',
          jacket: 'bg-stone-100 text-stone-900',
          item: '🍷 Vesuvio Chef Coat',
          initials: 'AB',
          accent: 'text-emerald-400',
        };
      case 'mikey':
        return {
          bg: 'bg-red-950',
          border: 'border-red-600',
          hair: 'bg-stone-900',
          jacket: 'bg-stone-900',
          item: '💊 Grab a Midol',
          initials: 'MP',
          accent: 'text-red-400',
        };
      case 'feech':
        return {
          bg: 'bg-stone-900',
          border: 'border-orange-600',
          hair: 'bg-stone-300 text-stone-900',
          jacket: 'bg-stone-800',
          item: '👞 70s Shoe & Peach',
          initials: 'FL',
          accent: 'text-orange-400',
        };
      case 'janice':
        return {
          bg: 'bg-purple-950',
          border: 'border-purple-600',
          hair: 'bg-amber-900',
          jacket: 'bg-purple-900',
          item: '🕉️ Parvati Visual Sense',
          initials: 'JS',
          accent: 'text-purple-300',
        };
      case 'bobby':
        return {
          bg: 'bg-sky-950',
          border: 'border-sky-600',
          hair: 'bg-stone-700',
          jacket: 'bg-emerald-900',
          item: '🚂 Blue Comet Train',
          initials: 'BB',
          accent: 'text-sky-300',
        };
      case 'livia':
        return {
          bg: 'bg-zinc-950',
          border: 'border-zinc-500',
          hair: 'bg-stone-200 text-stone-900',
          jacket: 'bg-zinc-900',
          item: '👵 Silver Platter / Frown',
          initials: 'LS',
          accent: 'text-stone-300',
        };
      case 'melfi':
        return {
          bg: 'bg-stone-900',
          border: 'border-amber-700',
          hair: 'bg-amber-950',
          jacket: 'bg-stone-800',
          item: '🛋️ Lithium & Notepad',
          initials: 'JM',
          accent: 'text-amber-200',
        };
      case 'hesh':
        return {
          bg: 'bg-amber-950',
          border: 'border-amber-600',
          hair: 'bg-stone-300 text-stone-900',
          jacket: 'bg-stone-900',
          item: '💰 10-Point Shylock',
          initials: 'HR',
          accent: 'text-amber-400',
        };
      default:
        return {
          bg: 'bg-stone-900',
          border: 'border-stone-700',
          hair: 'bg-stone-800',
          jacket: 'bg-stone-950',
          item: '🕶️ Mob Soldier',
          initials: member.name.split(' ').map((n) => n[0]).join(''),
          accent: 'text-stone-300',
        };
    }
  };

  const badge = getLoreBadge();

  // If member has a valid image and hasn't failed loading
  if (member.image && !imageFailed) {
    return (
      <div
        className={`relative ${sizeClasses} rounded-xl overflow-hidden border-2 border-amber-600/60 bg-stone-950 shadow-md flex-shrink-0 ${className}`}
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top select-none"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  // Tailored 16-bit styled pixel avatar badge for every member
  return (
    <div
      className={`relative ${sizeClasses} rounded-xl overflow-hidden border-2 ${badge.border} ${badge.bg} shadow-md flex flex-col items-center justify-between p-1 select-none flex-shrink-0 ${className}`}
    >
      {/* Top Hair / Moniker */}
      <div className="w-full flex justify-between items-center px-1 text-[8px] font-mono-numbers">
        <span className="font-bold text-stone-400 truncate">{member.mobRank}</span>
        <span className={badge.accent}>★</span>
      </div>

      {/* Face Frame */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${badge.hair} flex items-center justify-center font-cinzel font-black text-xs sm:text-sm border border-stone-800 shadow`}>
          {badge.initials}
        </div>
        <div className="text-[9px] sm:text-[10px] font-bold text-stone-200 mt-1 leading-tight truncate max-w-full px-1">
          {member.name.split(' ')[0]}
        </div>
      </div>

      {/* Bottom Prop / Lore Tag */}
      <div className="w-full bg-stone-950/90 rounded text-[7px] sm:text-[8px] text-center font-bold truncate text-stone-300 py-0.5 px-0.5 border border-stone-800">
        {badge.item}
      </div>
    </div>
  );
};
