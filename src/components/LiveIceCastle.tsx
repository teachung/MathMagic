import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Castle } from 'lucide-react';
import { CASTLE_MILESTONES } from '../storyData';

interface LiveIceCastleProps {
  stars: number;
  forceStage?: number;
  size?: 'sm' | 'md' | 'lg' | 'mini' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
  showBadge?: boolean;
  className?: string;
  isCelebrating?: boolean;
}

export function LiveIceCastle({
  stars,
  forceStage,
  size = 'md',
  interactive = false,
  onClick,
  showBadge = true,
  className = '',
  isCelebrating = false,
}: LiveIceCastleProps) {
  // Determine current stage (0 to 5)
  let currentStage = 0;
  if (typeof forceStage === 'number') {
    currentStage = forceStage;
  } else {
    CASTLE_MILESTONES.forEach((m) => {
      if (stars >= m.starsRequired) {
        currentStage = m.castleStage;
      }
    });
  }

  // Calculate growth scale safely without lag
  const effectiveStars = typeof forceStage === 'number' ? forceStage * 4 : stars;
  const growthScale = Math.min(1 + effectiveStars * 0.015, 1.25);
  // Only render floating gems on larger standalone views to prevent lag
  const showGems = (size === 'lg' || size === 'xl') && !forceStage;
  const crystalCount = showGems ? Math.min(effectiveStars, 4) : 0;

  const stageTitles = [
    '冰晶地基',
    '冰晶階梯與迴廊',
    '琉璃大門與水晶柱',
    '星光尖塔與宮殿',
    '冰封魔法噴泉',
    '璀璨極光阿倫黛爾',
  ];
  const stageName = stageTitles[currentStage] || '極致水晶王國';

  const sizeClasses = {
    mini: 'w-20 h-20 sm:w-24 sm:h-24',
    sm: 'w-36 h-32 sm:w-44 sm:h-36',
    md: 'w-52 h-44 sm:w-60 sm:h-52',
    lg: 'w-full max-w-md h-60 sm:h-68',
    xl: 'w-full max-w-lg h-68 sm:h-80',
  };

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-end select-none transform-gpu ${interactive ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Aurora Ambient Glow Behind Castle (Optimized static gradient with CSS opacity) */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-sky-400/25 to-purple-500/15 rounded-3xl pointer-events-none -z-10 transition-opacity duration-700 ${
          isCelebrating ? 'opacity-80 scale-105' : 'opacity-40'
        }`}
      />

      {/* Floating Magic Crystal Gems (Only on primary large views, max 4 gems) */}
      {crystalCount > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-visible -z-5">
          {Array.from({ length: crystalCount }).map((_, i) => {
            const angle = (i / crystalCount) * Math.PI * 2;
            const radiusX = 80;
            const radiusY = 45;
            const posX = Math.cos(angle) * radiusX;
            const posY = Math.sin(angle) * radiusY - 15;

            return (
              <div
                key={i}
                style={{
                  left: `calc(50% + ${posX}px)`,
                  top: `calc(45% + ${posY}px)`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-cyan-200 text-xs animate-bounce"
              >
                {i % 2 === 0 ? '💎' : '✨'}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Scalable Castle SVG Canvas */}
      <motion.div
        animate={
          isCelebrating
            ? {
                scale: [growthScale, growthScale * 1.08, growthScale],
                y: [0, -6, 0],
              }
            : { scale: growthScale }
        }
        transition={
          isCelebrating
            ? { duration: 0.9, repeat: Infinity, repeatType: 'reverse' }
            : { duration: 0.3 }
        }
        className={`${sizeClasses[size]} relative flex items-center justify-center transform-gpu`}
      >
        <svg
          viewBox="0 0 320 240"
          className="w-full h-full overflow-visible drop-shadow-[0_4px_12px_rgba(8,47,73,0.35)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Ice Castle Crystal Gradient */}
            <linearGradient id="liveIceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#c5f0fe" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Translucent Crystal Shimmer */}
            <linearGradient id="liveShimmerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#7dd3fc" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
            </linearGradient>

            {/* Aurora Spire Glow */}
            <linearGradient id="auroraGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* ================= STAGE 0: SNOW BASE & FOUNDATION ================= */}
          {/* Snowy Hill Foundation */}
          <path
            d="M 10 225 Q 80 205 160 215 Q 240 205 310 225 L 310 240 L 10 240 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="2"
          />
          <path
            d="M 30 230 Q 160 218 290 230"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Glowing Ice Foundation Stones (Always visible, expands with stars) */}
          <rect x="110" y="212" width="100" height="12" rx="4" fill="url(#liveIceGrad)" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="140" y1="212" x2="140" y2="224" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          <line x1="180" y1="212" x2="180" y2="224" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

          {/* Stage 0 Base Crystals */}
          <polygon points="90,225 100,215 105,225" fill="#bae6fd" />
          <polygon points="215,225 220,215 230,225" fill="#bae6fd" />

          {/* ================= STAGE 1+: ICE SPIRAL STAIRCASE & PILLARS ================= */}
          {(currentStage >= 1 || stars >= 1) && (
            <g>
              {/* Left Ascending Ice Spiral Stair */}
              <path
                d="M 50 225 C 70 195 100 185 125 195"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 50 225 C 70 195 100 185 125 195"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Small Ice Steps */}
              <rect x="62" y="210" width="12" height="3" rx="1.5" fill="#ffffff" />
              <rect x="80" y="198" width="12" height="3" rx="1.5" fill="#ffffff" />
              <rect x="102" y="192" width="12" height="3" rx="1.5" fill="#ffffff" />

              {/* Right Balcony Ice Guard */}
              <rect x="195" y="195" width="40" height="6" rx="2" fill="url(#liveIceGrad)" stroke="#ffffff" strokeWidth="1" />
            </g>
          )}

          {/* ================= STAGE 2+: GRAND CRYSTAL GATE & TOWERS ================= */}
          {(currentStage >= 2 || stars >= 3) && (
            <g>
              {/* Left Outer Crystal Column */}
              <polygon points="95,215 110,215 105,145 100,145" fill="url(#liveIceGrad)" />
              <polygon points="95,145 110,145 102.5,110" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="102.5" cy="110" r="3" fill="#bae6fd" />

              {/* Right Outer Crystal Column */}
              <polygon points="210,215 225,215 220,145 215,145" fill="url(#liveIceGrad)" />
              <polygon points="210,145 225,145 217.5,110" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="217.5" cy="110" r="3" fill="#bae6fd" />

              {/* Main Lower Castle Wall */}
              <rect x="110" y="160" width="100" height="52" fill="url(#liveIceGrad)" stroke="#ffffff" strokeWidth="1.5" />

              {/* Grand Arched Ice Door */}
              <path
                d="M 140 212 L 140 175 Q 160 160 180 175 L 180 212 Z"
                fill="#0369a1"
                stroke="#bae6fd"
                strokeWidth="2"
              />
              {/* Crystalline Door Snowflake Emblem */}
              <circle cx="160" cy="184" r="6" fill="#ffffff" />
              <path d="M 160 175 L 160 193 M 151 184 L 169 184" stroke="#0284c7" strokeWidth="1.5" />
            </g>
          )}

          {/* ================= STAGE 3+: MAIN PALACE & SKY SPIRE ================= */}
          {(currentStage >= 3 || stars >= 5) && (
            <g>
              {/* Mid Palace Chamber */}
              <polygon points="120,160 200,160 190,95 130,95" fill="url(#liveIceGrad)" stroke="#ffffff" strokeWidth="1.5" />

              {/* Stained Ice Windows */}
              <ellipse cx="145" cy="125" rx="6" ry="14" fill="#ffffff" opacity="0.9" />
              <ellipse cx="160" cy="120" rx="7" ry="18" fill="#e0f2fe" opacity="0.95" stroke="#38bdf8" strokeWidth="1" />
              <ellipse cx="175" cy="125" rx="6" ry="14" fill="#ffffff" opacity="0.9" />

              {/* Palace Balcony */}
              <rect x="125" y="95" width="70" height="7" rx="2" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
              <line x1="135" y1="95" x2="135" y2="102" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="150" y1="95" x2="150" y2="102" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="165" y1="95" x2="165" y2="102" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="185" y1="95" x2="185" y2="102" stroke="#0284c7" strokeWidth="1.5" />

              {/* High Center Spire Tower */}
              <polygon points="135,95 185,95 160,25" fill="url(#liveShimmerGrad)" stroke="#ffffff" strokeWidth="2" />

              {/* Crown Top Magic Diamond Star */}
              <polygon points="160,18 165,25 160,32 155,25" fill="#ffffff" />
              <circle cx="160" cy="25" r="8" fill="#38bdf8" opacity="0.5" className="animate-pulse" />
            </g>
          )}

          {/* ================= STAGE 4+: FOUNTAIN & SIDE SPIRES ================= */}
          {(currentStage >= 4 || stars >= 8) && (
            <g>
              {/* Extra Left Side High Spire */}
              <polygon points="75,200 90,200 82.5,120" fill="url(#liveIceGrad)" stroke="#ffffff" strokeWidth="1" />
              <circle cx="82.5" cy="120" r="2.5" fill="#ffffff" />

              {/* Extra Right Side High Spire */}
              <polygon points="230,200 245,200 237.5,120" fill="url(#liveIceGrad)" stroke="#ffffff" strokeWidth="1" />
              <circle cx="237.5" cy="120" r="2.5" fill="#ffffff" />

              {/* Front Magic Ice Fountain */}
              <ellipse cx="160" cy="222" rx="30" ry="8" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="160" cy="221" rx="24" ry="5.5" fill="#0284c7" />
              {/* Fountain Water Spray */}
              <path
                d="M 160 220 Q 150 200 142 212 M 160 220 Q 170 200 178 212"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="142" cy="212" r="2" fill="#ffffff" />
              <circle cx="178" cy="212" r="2" fill="#ffffff" />
              <circle cx="160" cy="202" r="2.5" fill="#ffffff" />
            </g>
          )}

          {/* ================= STAGE 5: GRAND AURORA & ROYAL CROWN ================= */}
          {(currentStage >= 5 || stars >= 12) && (
            <g>
              {/* Top Rainbow Aurora Waves */}
              <path
                d="M 40 20 Q 160 5 280 20 Q 200 35 40 20 Z"
                fill="url(#auroraGlow)"
                opacity="0.65"
              />

              {/* Giant Crowning Brilliant Ice Snowflake above Central Spire */}
              <circle cx="160" cy="16" r="5" fill="#ffffff" />
              <path d="M 160 6 L 160 26 M 150 16 L 170 16" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M 153 9 L 167 23 M 153 23 L 167 9" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Bottom Stage Progress Label */}
      {showBadge && (
        <div className="mt-1.5 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-600/90 via-cyan-600/90 to-blue-700/90 text-white px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-black shadow-md border border-cyan-200">
            <Castle className="w-3.5 h-3.5 text-cyan-200" />
            <span>{stageName}</span>
            <span className="bg-cyan-300 text-sky-950 text-[10px] px-1.5 py-0.2 rounded-full">
              {stars}⭐
            </span>
          </div>
          {interactive && (
            <span className="text-[10px] text-cyan-200/90 font-bold mt-0.5 animate-pulse">
              點擊查看城堡王國 ✨
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
