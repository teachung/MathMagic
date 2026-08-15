import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

export type ElsaPose = 'idle' | 'casting' | 'cheering' | 'guiding' | 'storytelling';

interface ElsaPrincessProps {
  pose?: ElsaPose;
  dialogue?: string;
  size?: number; // base size in px (e.g. 100 to 180)
  className?: string;
  onClick?: () => void;
  showDialogue?: boolean;
  dialoguePlacement?: 'top' | 'bottom' | 'side' | 'below' | 'none';
}

export function ElsaPrincess({
  pose = 'idle',
  dialogue,
  size = 130,
  className = '',
  onClick,
  showDialogue = true,
  dialoguePlacement = 'top',
}: ElsaPrincessProps) {
  const [isSparkling, setIsSparkling] = useState(false);

  const handleClick = () => {
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 1200);
    if (onClick) onClick();
  };

  const isBubbleVisible = showDialogue && dialogue && dialoguePlacement !== 'none';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-end select-none ${className}`}
      onClick={handleClick}
    >
      {/* Speech / Story Dialogue Bubble - Safely placed above Elsa or to side */}
      <AnimatePresence>
        {isBubbleVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`z-30 pointer-events-none ${
              dialoguePlacement === 'side'
                ? 'absolute left-full ml-2 top-2 max-w-[200px] sm:max-w-[240px]'
                : dialoguePlacement === 'below'
                ? 'mt-2 max-w-[220px] sm:max-w-[280px]'
                : 'absolute bottom-[102%] left-1/2 -translate-x-1/2 mb-1 max-w-[200px] sm:max-w-[260px]'
            } bg-gradient-to-r from-white via-cyan-50 to-sky-50 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-[0_8px_25px_rgba(2,132,199,0.35)] border-2 border-cyan-300 text-center`}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider text-cyan-700 uppercase bg-cyan-100/80 px-2 py-0.2 rounded-full border border-cyan-200">
                愛莎公主 Elsa 👑
              </span>
            </div>
            <p className="text-[11px] sm:text-xs md:text-sm font-black text-sky-950 leading-snug drop-shadow-2xs">
              {dialogue}
            </p>
            {/* Pointer arrow if placed on top */}
            {dialoguePlacement === 'top' && (
              <>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-5 border-x-transparent border-t-5 border-t-cyan-300" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-sky-50" />
              </>
            )}
            {/* Pointer arrow if placed to the side */}
            {dialoguePlacement === 'side' && (
              <>
                <div className="absolute top-4 -left-2 w-0 h-0 border-y-5 border-y-transparent border-r-5 border-r-cyan-300" />
                <div className="absolute top-4 -left-1.5 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-white" />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elsa Character Container with Hover/Click Interactions */}
      <motion.div
        animate={
          pose === 'cheering'
            ? { y: [0, -8, 0] }
            : pose === 'casting'
            ? { scale: [1, 1.03, 1] }
            : { y: [0, -2, 0] }
        }
        transition={{
          duration: pose === 'cheering' ? 0.6 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer flex items-center justify-center drop-shadow-[0_4px_12px_rgba(8,47,73,0.3)] transform-gpu"
        style={{ width: size, height: size * 1.35 }}
      >
        {/* Frost / Aurora Backlight Aura (Static GPU-accelerated gradient) */}
        <div
          className="absolute -inset-2 bg-gradient-to-tr from-cyan-400/25 via-sky-300/30 to-purple-400/20 rounded-full pointer-events-none -z-10"
        />

        {/* Ice Magic Swirls (When Clicked) */}
        {isSparkling && (
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={i}
                style={{
                  transform: `translate(${Math.cos((deg * Math.PI) / 180) * (size * 0.5)}px, ${Math.sin((deg * Math.PI) / 180) * (size * 0.5)}px)`,
                }}
                className="absolute text-cyan-200 text-sm animate-ping font-bold"
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* ================= SVG ELSA PRINCESS ================= */}
        <svg
          viewBox="0 0 160 220"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gown Gradient */}
            <linearGradient id="elsaGownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c7f0ff" />
              <stop offset="40%" stopColor="#70d2fc" />
              <stop offset="85%" stopColor="#1e9be0" />
              <stop offset="100%" stopColor="#0275b8" />
            </linearGradient>

            {/* Translucent Cape Gradient */}
            <linearGradient id="elsaCapeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.25" />
            </linearGradient>

            {/* Hair Platinum Gradient */}
            <linearGradient id="elsaHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fff7d6" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>

            {/* Skin Gradient */}
            <linearGradient id="elsaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff5ee" />
              <stop offset="100%" stopColor="#ffe4d6" />
            </linearGradient>

            {/* Ice Tiara Diamond Gradient */}
            <linearGradient id="tiaraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* 1. FLOWING TRANSLUCENT ICE CAPE (Back Layer) */}
          <g>
            <motion.path
              d="M 52 90 Q 20 150 14 205 Q 80 215 146 205 Q 140 150 108 90 Z"
              fill="url(#elsaCapeGrad)"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              animate={{
                d: [
                  'M 52 90 Q 20 150 14 205 Q 80 215 146 205 Q 140 150 108 90 Z',
                  'M 52 90 Q 15 155 8 208 Q 80 212 152 208 Q 145 155 108 90 Z',
                  'M 52 90 Q 20 150 14 205 Q 80 215 146 205 Q 140 150 108 90 Z',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Cape Snowflake & Frost Decors */}
            <circle cx="45" cy="160" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="115" cy="165" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="80" cy="185" r="4" fill="#ffffff" opacity="0.9" />
            <path d="M 80 180 L 80 190 M 75 185 L 85 185" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="35" cy="190" r="2" fill="#bae6fd" />
            <circle cx="125" cy="195" r="2" fill="#bae6fd" />
          </g>

          {/* 2. GOWN / SKIRT */}
          <g>
            <path
              d="M 56 100 L 104 100 L 126 210 Q 80 216 34 210 Z"
              fill="url(#elsaGownGrad)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Sparkling ice pattern on dress */}
            <path
              d="M 80 100 L 80 212 M 64 100 L 52 210 M 96 100 L 108 210"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeDasharray="4 4"
            />
            {/* Glittering belt at waist */}
            <path
              d="M 56 100 Q 80 108 104 100"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="3.5"
            />
            <polygon points="80,103 84,107 80,111 76,107" fill="#ffffff" />
          </g>

          {/* 3. BODICE & TORSO */}
          <g>
            <path
              d="M 60 72 Q 80 75 100 72 L 104 100 Q 80 106 56 100 Z"
              fill="url(#elsaGownGrad)"
            />
            {/* Diamond Corset Texture */}
            <polygon points="80,78 86,88 80,98 74,88" fill="#ffffff" opacity="0.6" />
            <polygon points="68,82 72,90 68,96 64,90" fill="#bae6fd" opacity="0.7" />
            <polygon points="92,82 96,90 92,96 88,90" fill="#bae6fd" opacity="0.7" />
            {/* Illusion neckline (Translucent Mesh) */}
            <path
              d="M 62 72 Q 80 64 98 72 L 95 64 Q 80 58 65 64 Z"
              fill="#ffffff"
              fillOpacity="0.5"
            />
          </g>

          {/* 4. NECK & HEAD */}
          <g>
            {/* Neck */}
            <rect x="74" y="58" width="12" height="12" fill="url(#elsaSkinGrad)" rx="3" />

            {/* Head / Face */}
            <ellipse cx="80" cy="50" rx="22" ry="24" fill="url(#elsaSkinGrad)" />

            {/* Cute Rosy Cheeks */}
            <circle cx="67" cy="56" r="4.5" fill="#f43f5e" opacity="0.3" />
            <circle cx="93" cy="56" r="4.5" fill="#f43f5e" opacity="0.3" />

            {/* Big Expressive Royal Blue Eyes */}
            <ellipse cx="71" cy="48" rx="4.5" ry="5.5" fill="#0284c7" />
            <ellipse cx="89" cy="48" rx="4.5" ry="5.5" fill="#0284c7" />
            {/* Eye Pupils & Highlights */}
            <circle cx="71" cy="48" r="3" fill="#0369a1" />
            <circle cx="89" cy="48" r="3" fill="#0369a1" />
            <circle cx="69.5" cy="46" r="1.5" fill="#ffffff" />
            <circle cx="87.5" cy="46" r="1.5" fill="#ffffff" />
            <circle cx="72.5" cy="50" r="0.8" fill="#ffffff" />
            <circle cx="90.5" cy="50" r="0.8" fill="#ffffff" />

            {/* Eyelashes */}
            <path d="M 65 44 Q 71 40 76 44" fill="none" stroke="#475569" strokeWidth="1.5" />
            <path d="M 84 44 Q 89 40 95 44" fill="none" stroke="#475569" strokeWidth="1.5" />
            <path d="M 64 43 L 62 41" stroke="#475569" strokeWidth="1.2" />
            <path d="M 96 43 L 98 41" stroke="#475569" strokeWidth="1.2" />

            {/* Eyebrows */}
            <path d="M 66 40 Q 71 37 76 39" fill="none" stroke="#ca8a04" strokeWidth="1.3" />
            <path d="M 84 39 Q 89 37 94 40" fill="none" stroke="#ca8a04" strokeWidth="1.3" />

            {/* Sweet Smile */}
            <path
              d={
                pose === 'cheering'
                  ? 'M 74 58 Q 80 66 86 58 Z'
                  : 'M 75 59 Q 80 64 85 59'
              }
              fill={pose === 'cheering' ? '#e11d48' : 'none'}
              stroke="#e11d48"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>

          {/* 5. PLATINUM BLONDE HAIR & BRAID */}
          <g>
            {/* Voluminous top hair bangs */}
            <path
              d="M 58 48 Q 54 26 80 24 Q 106 26 102 48 Q 94 32 80 32 Q 66 32 58 48 Z"
              fill="url(#elsaHairGrad)"
              stroke="#fef08a"
              strokeWidth="0.8"
            />
            {/* Front swept bangs styling */}
            <path
              d="M 72 26 Q 78 35 84 25"
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            <path
              d="M 62 34 Q 70 30 75 38"
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.2"
            />
            <path
              d="M 98 34 Q 90 30 85 38"
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.2"
            />

            {/* Iconic Side Braid over the left shoulder */}
            <g>
              <ellipse cx="56" cy="62" rx="7" ry="9" fill="url(#elsaHairGrad)" transform="rotate(-15 56 62)" />
              <circle cx="53" cy="63" r="2.5" fill="#38bdf8" /> {/* Snowflake hairpin */}
              <ellipse cx="50" cy="76" rx="6.5" ry="8.5" fill="url(#elsaHairGrad)" transform="rotate(-20 50 76)" />
              <circle cx="48" cy="77" r="2" fill="#ffffff" />
              <ellipse cx="46" cy="90" rx="6" ry="8" fill="url(#elsaHairGrad)" transform="rotate(-25 46 90)" />
              <ellipse cx="44" cy="103" rx="5" ry="7" fill="url(#elsaHairGrad)" transform="rotate(-20 44 103)" />
              <circle cx="43" cy="104" r="2" fill="#38bdf8" />
              <ellipse cx="43" cy="114" rx="4" ry="5.5" fill="url(#elsaHairGrad)" transform="rotate(-10 43 114)" />
              {/* Braid ribbon tip */}
              <path d="M 41 118 Q 43 126 44 120" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
            </g>
          </g>

          {/* 6. ROYAL ICE TIARA / CROWN */}
          <g>
            <polygon
              points="68,26 73,16 80,24 87,16 92,26 80,27"
              fill="url(#tiaraGrad)"
              stroke="#ffffff"
              strokeWidth="1"
            />
            <circle cx="80" cy="20" r="2" fill="#0284c7" />
            <circle cx="73" cy="18" r="1.2" fill="#ffffff" />
            <circle cx="87" cy="18" r="1.2" fill="#ffffff" />
          </g>

          {/* 7. ARMS & HANDS (Dynamic Poses) */}
          <g>
            {pose === 'casting' ? (
              // Both hands raised forward with magic sparks
              <g>
                <path d="M 60 74 Q 40 68 34 52" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <path d="M 100 74 Q 120 68 126 52" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                {/* Magic Frost Orbs on Hands */}
                <circle cx="34" cy="50" r="7" fill="#e0f2fe" opacity="0.9" />
                <circle cx="126" cy="50" r="7" fill="#e0f2fe" opacity="0.9" />
                <path d="M 34 44 L 34 56 M 28 50 L 40 50" stroke="#0284c7" strokeWidth="2" />
                <path d="M 126 44 L 126 56 M 120 50 L 132 50" stroke="#0284c7" strokeWidth="2" />
              </g>
            ) : pose === 'cheering' ? (
              // Hands waving up joyfully
              <g>
                <path d="M 60 74 Q 38 55 36 38" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <path d="M 100 74 Q 122 55 124 38" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <circle cx="36" cy="36" r="4.5" fill="url(#elsaSkinGrad)" />
                <circle cx="124" cy="36" r="4.5" fill="url(#elsaSkinGrad)" />
              </g>
            ) : pose === 'guiding' ? (
              // One hand pointing to the math equation
              <g>
                <path d="M 60 74 Q 48 90 46 100" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <path d="M 100 74 Q 124 75 140 68" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <circle cx="142" cy="67" r="4.5" fill="url(#elsaSkinGrad)" />
                <circle cx="146" cy="65" r="3" fill="#38bdf8" />
              </g>
            ) : (
              // Idle: Hands gently gathered in front
              <g>
                <path d="M 60 74 Q 66 94 76 96" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <path d="M 100 74 Q 94 94 84 96" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="7" strokeLinecap="round" />
                <circle cx="80" cy="97" r="5" fill="url(#elsaSkinGrad)" />
              </g>
            )}
          </g>
        </svg>

        {/* Small floating fairy sparkles on click */}
        {isSparkling && (
          <motion.div
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: 1.5, opacity: 0, y: -40 }}
            transition={{ duration: 0.9 }}
            className="absolute top-0 flex items-center gap-1 text-cyan-300 font-black text-xs pointer-events-none"
          >
            <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span>冰雪魔法！</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
