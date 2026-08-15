import React from 'react';
import { motion } from 'motion/react';

interface IceChestProps {
  stars: number;
  phase: string;
}

export function IceChest({ stars, phase }: IceChestProps) {
  const needed = 3 - (stars % 3 === 0 && stars > 0 ? 0 : stars % 3);
  const isUnlocked = stars > 0 && stars % 3 === 0;

  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[160px] flex items-center justify-between p-3 sm:p-4 md:p-5 select-none overflow-hidden rounded-3xl md:rounded-[32px] border-3 border-white/90 shadow-[0_12px_30px_rgba(8,30,60,0.4)] bg-gradient-to-b from-[#d5efff] via-[#b2e2fb] to-[#8cd3f8]">
      {/* Glossy ice reflection on chest top */}
      <div className="absolute -top-10 left-0 right-0 h-24 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Left side text */}
      <div className="z-10 flex flex-col justify-center max-w-[60%] pl-1 sm:pl-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-base sm:text-lg md:text-xl font-black text-sky-950 drop-shadow-xs">
            小小收藏家
          </span>
          <span className="text-xs">❄️</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-sky-800 leading-snug">
          {isUnlocked && phase === 'success' ? (
            <span className="text-amber-700 font-extrabold animate-pulse">
              🎉 恭喜收集到晶晶恐龍蛋！
            </span>
          ) : (
            <>再對 <span className="text-sky-950 font-black text-sm sm:text-base px-1 bg-white/70 rounded-md">{needed}</span> 題拿恐龍蛋！</>
          )}
        </p>
      </div>

      {/* Right side: Chest & Dragon Egg in Crystal Nest */}
      <div className="relative z-10 flex items-center justify-end pr-1 sm:pr-2">
        {/* Crystal Nest with Glowing Iridescent Egg */}
        <motion.div
          animate={
            isUnlocked && phase === 'success'
              ? { scale: [1, 1.15, 1], rotate: [-6, 6, -6] }
              : { y: [-2, 2, -2] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Egg SVG */}
          <svg
            viewBox="0 0 100 120"
            className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 overflow-visible drop-shadow-[0_8px_16px_rgba(56,189,248,0.5)]"
          >
            <defs>
              <linearGradient id="eggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fed7aa" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="75%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <radialGradient id="eggHighlight" cx="35%" cy="30%" r="40%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="nestIce" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>

            {/* Crystal Ice Nest / Floral Base */}
            <g transform="translate(0, 75)">
              {/* Petals/Nest crystals */}
              <ellipse cx="50" cy="20" rx="42" ry="12" fill="url(#nestIce)" opacity="0.9" />
              <path
                d="M 12 18 L 18 8 L 26 20 L 34 6 L 44 22 L 52 4 L 62 22 L 72 6 L 80 20 L 88 10 L 92 20 Z"
                fill="#38bdf8"
                stroke="#e0f2fe"
                strokeWidth="1.2"
              />
              <ellipse cx="50" cy="18" rx="36" ry="8" fill="#1e293b" opacity="0.3" />
            </g>

            {/* Dragon Egg Body */}
            <path
              d="M 50 15
                 C 28 15, 18 45, 18 70
                 C 18 95, 32 102, 50 102
                 C 68 102, 82 95, 82 70
                 C 82 45, 72 15, 50 15 Z"
              fill="url(#eggGradient)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Specular Highlight */}
            <ellipse
              cx="38"
              cy="45"
              rx="18"
              ry="26"
              transform="rotate(-15, 38, 45)"
              fill="url(#eggHighlight)"
            />

            {/* Magic Iridescent Speckles */}
            <polygon points="62,38 64,41 62,44 60,41" fill="#ffffff" opacity="0.9" />
            <polygon points="40,75 42,78 40,81 38,78" fill="#ffffff" opacity="0.9" />
            <polygon points="68,68 70,71 68,74 66,71" fill="#ffffff" opacity="0.9" />
          </svg>

          {/* Sparkles around egg */}
          <div className="absolute -top-1 -right-1 text-sm sm:text-base animate-bounce">
            ✨
          </div>
          <div className="absolute top-4 -left-2 text-xs animate-pulse">
            🌟
          </div>
        </motion.div>
      </div>

      {/* Lock emblem centered at chest top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 border-2 border-cyan-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
        <div className="w-2.5 h-3.5 bg-cyan-700 rounded-xs flex flex-col items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full mt-0.5" />
          <div className="w-0.5 h-1 bg-white" />
        </div>
      </div>
    </div>
  );
}
