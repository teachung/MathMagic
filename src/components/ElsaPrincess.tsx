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
        className="relative cursor-pointer flex items-center justify-center drop-shadow-[0_6px_16px_rgba(8,47,73,0.3)] transform-gpu"
        style={{ width: size * 0.85, height: size * 1.38 }}
      >
        {/* Frost / Aurora Backlight Aura (Static GPU-accelerated gradient) */}
        <div
          className="absolute -inset-2 bg-gradient-to-tr from-cyan-400/20 via-sky-300/25 to-purple-400/15 rounded-full pointer-events-none -z-10"
        />

        {/* Ice Magic Swirls (When Clicked) */}
        {isSparkling && (
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={i}
                style={{
                  transform: `translate(${Math.cos((deg * Math.PI) / 180) * (size * 0.45)}px, ${Math.sin((deg * Math.PI) / 180) * (size * 0.45)}px)`,
                }}
                className="absolute text-cyan-200 text-sm animate-ping font-bold"
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* ================= SVG ELSA PRINCESS (SLENDER & ELEGANT) ================= */}
        <svg
          viewBox="0 0 160 240"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gown Royal Gradient */}
            <linearGradient id="elsaGownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f7fe" />
              <stop offset="25%" stopColor="#81d8fd" />
              <stop offset="65%" stopColor="#1e9ce1" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Bodice Sparkle Gradient */}
            <linearGradient id="elsaBodiceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f7fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Translucent Floating Ice Cape Gradient */}
            <linearGradient id="elsaCapeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#bae6fd" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.15" />
            </linearGradient>

            {/* Hair Platinum Gradient */}
            <linearGradient id="elsaHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fdfbf0" />
              <stop offset="80%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>

            {/* Hair Shadow/Strand Gradient */}
            <linearGradient id="elsaHairShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            {/* Porcelain Skin Gradient */}
            <linearGradient id="elsaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff9f5" />
              <stop offset="50%" stopColor="#fff2eb" />
              <stop offset="100%" stopColor="#ffe4d6" />
            </linearGradient>

            {/* Elsa's Signature Magenta/Purple Smoky Eyeshadow Gradient */}
            <linearGradient id="elsaEyeshadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.6" />
            </linearGradient>

            {/* Elsa's Crystalline Ice Blue Iris Gradient */}
            <radialGradient id="elsaIrisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0ea5e9" />
              <stop offset="80%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>

            {/* Elsa's Rose Berry Lips Gradient */}
            <linearGradient id="elsaLipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>

            {/* Ice Tiara Diamond Gradient */}
            <linearGradient id="tiaraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Shimmering Slipper Gradient */}
            <linearGradient id="slipperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>

          {/* 1. FLOWING TRANSLUCENT ICE CAPE (Back Layer - Slender & Floating) */}
          <g>
            <motion.path
              d="M 68 76 Q 36 150 28 226 Q 80 234 132 226 Q 124 150 92 76 Z"
              fill="url(#elsaCapeGrad)"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.85"
              animate={{
                d: [
                  'M 68 76 Q 36 150 28 226 Q 80 234 132 226 Q 124 150 92 76 Z',
                  'M 68 76 Q 32 154 22 228 Q 80 232 138 228 Q 128 154 92 76 Z',
                  'M 68 76 Q 36 150 28 226 Q 80 234 132 226 Q 124 150 92 76 Z',
                ],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Delicate Snowflake & Frost Motifs on Cape */}
            <circle cx="50" cy="175" r="2" fill="#ffffff" opacity="0.8" />
            <circle cx="110" cy="180" r="2" fill="#ffffff" opacity="0.8" />
            <circle cx="80" cy="205" r="2.5" fill="#ffffff" opacity="0.9" />
            <path d="M 80 200 L 80 210 M 75 205 L 85 205" stroke="#7dd3fc" strokeWidth="1" />
            <circle cx="40" cy="210" r="1.5" fill="#bae6fd" />
            <circle cx="120" cy="215" r="1.5" fill="#bae6fd" />
          </g>

          {/* 2. CRYSTALLINE ICE SLIPPERS (Peeking out at bottom) */}
          <g>
            <ellipse cx="74" cy="227" rx="5" ry="2.5" fill="url(#slipperGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="86" cy="227" rx="5" ry="2.5" fill="url(#slipperGrad)" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="74" cy="226" r="1" fill="#ffffff" />
            <circle cx="86" cy="226" r="1" fill="#ffffff" />
          </g>

          {/* 3. SLENDER GOWN / SKIRT (Mermaid Silhouette) */}
          <g>
            {/* Long Graceful Mermaid Skirt */}
            <path
              d="M 71 102 Q 67 135 63 170 Q 56 200 48 226 Q 80 232 112 226 Q 104 200 97 170 Q 93 135 89 102 Z"
              fill="url(#elsaGownGrad)"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            {/* Shimmering Vertical Gown Highlights */}
            <path
              d="M 80 102 L 80 228 M 74 104 Q 71 165 64 227 M 86 104 Q 89 165 96 227"
              stroke="#ffffff"
              strokeWidth="0.9"
              strokeOpacity="0.45"
              strokeDasharray="3 3"
            />
            {/* Elegant Side Slit Shimmer Line */}
            <path
              d="M 88 125 Q 92 165 98 226"
              stroke="#e0f2fe"
              strokeWidth="1.2"
              fill="none"
              strokeOpacity="0.75"
            />
          </g>

          {/* 4. SLENDER BODICE & WAIST (Hourglass / Corset Cut) */}
          <g>
            {/* Slender Tapered Bodice */}
            <path
              d="M 68 74 Q 80 77 92 74 L 89 102 Q 80 105 71 102 Z"
              fill="url(#elsaBodiceGrad)"
              stroke="#bae6fd"
              strokeWidth="0.8"
            />
            {/* Sweetheart Ice Diamond Sequins */}
            <polygon points="80,78 84,86 80,94 76,86" fill="#ffffff" opacity="0.8" />
            <polygon points="73,81 76,87 73,93 70,87" fill="#e0f2fe" opacity="0.75" />
            <polygon points="87,81 90,87 87,93 84,87" fill="#e0f2fe" opacity="0.75" />
            {/* Thin Crystalline Belt */}
            <path
              d="M 71 101 Q 80 105 89 101"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <polygon points="80,102 82,104.5 80,107 78,104.5" fill="#38bdf8" />
          </g>

          {/* 5. ILLUSION MESH NECKLINE & SLENDER NECK */}
          <g>
            {/* Sheer Mesh Neckline */}
            <path
              d="M 69 74 Q 80 68 91 74 L 88 66 Q 80 62 72 66 Z"
              fill="#ffffff"
              fillOpacity="0.5"
            />
            {/* Slender Princess Neck */}
            <rect x="76" y="56" width="8" height="13" fill="url(#elsaSkinGrad)" rx="3" />
          </g>

          {/* 6. HEAD & ELSA'S ICONIC DISNEY FROZEN FACE */}
          <g>
            {/* Beautiful Elsa Oval / Heart Jawline */}
            <path
              d="M 64 42 C 64 25 96 25 96 42 C 96 56 89 65 80 67 C 71 65 64 56 64 42 Z"
              fill="url(#elsaSkinGrad)"
            />

            {/* Soft Porcelain Cheek Blush */}
            <ellipse cx="68" cy="52" rx="4" ry="2.2" fill="#fb7185" opacity="0.3" />
            <ellipse cx="92" cy="52" rx="4" ry="2.2" fill="#fb7185" opacity="0.3" />

            {/* --- ELSA'S SIGNATURE PURPLE/MAGENTA SMOKY EYESHADOW --- */}
            <path
              d="M 66 43.5 Q 72.5 37.5 78.5 42 Q 77 40 71 40 Q 66 41 66 43.5 Z"
              fill="url(#elsaEyeshadowGrad)"
            />
            <path
              d="M 81.5 42 Q 87.5 37.5 94 43.5 Q 94 41 89 40 Q 83 40 81.5 42 Z"
              fill="url(#elsaEyeshadowGrad)"
            />

            {/* Delicate Double Eyelid Crease */}
            <path d="M 68 40.5 Q 73 38.5 77.5 41" fill="none" stroke="#be185d" strokeWidth="0.6" strokeOpacity="0.5" />
            <path d="M 82.5 41 Q 87 38.5 92 40.5" fill="none" stroke="#be185d" strokeWidth="0.6" strokeOpacity="0.5" />

            {/* --- ELSA'S ALMOND ICE-BLUE EYES --- */}
            {/* Sclera (Eye Whites) */}
            <path d="M 67 44.5 Q 72.5 41 78 44.5 Q 72.5 48.5 67 44.5 Z" fill="#ffffff" />
            <path d="M 82 44.5 Q 87.5 41 93 44.5 Q 87.5 48.5 82 44.5 Z" fill="#ffffff" />

            {/* Crystal Ice Blue Irises */}
            <ellipse cx="73" cy="44.8" rx="3.3" ry="3.6" fill="url(#elsaIrisGrad)" />
            <ellipse cx="87" cy="44.8" rx="3.3" ry="3.6" fill="url(#elsaIrisGrad)" />

            {/* Deep Pupil */}
            <circle cx="73" cy="44.8" r="1.8" fill="#082f49" />
            <circle cx="87" cy="44.8" r="1.8" fill="#082f49" />

            {/* Ice Sparkle inside Iris */}
            <circle cx="72" cy="45.5" r="0.7" fill="#67e8f9" />
            <circle cx="86" cy="45.5" r="0.7" fill="#67e8f9" />

            {/* Catchlight Highlights (Elsa's bright lively gaze) */}
            <circle cx="71.8" cy="43.2" r="1.2" fill="#ffffff" />
            <circle cx="85.8" cy="43.2" r="1.2" fill="#ffffff" />
            <circle cx="74.2" cy="46" r="0.6" fill="#ffffff" />
            <circle cx="88.2" cy="46" r="0.6" fill="#ffffff" />

            {/* Bold Black Upper Eyeliner & Winged Lashes */}
            <path
              d="M 66 44 Q 72.5 40 78.5 44"
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M 81.5 44 Q 87.5 40 94 44"
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Outer Wing Lashes */}
            <path d="M 78.5 44 L 80 42" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 94 44 L 95.5 42" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 66 44 L 64.5 42.5" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />

            {/* Soft Lower Eyelash Accent */}
            <path d="M 68.5 46.5 Q 73 48 76.5 46.5" fill="none" stroke="#475569" strokeWidth="0.6" />
            <path d="M 83.5 46.5 Q 87 48 91.5 46.5" fill="none" stroke="#475569" strokeWidth="0.6" />

            {/* --- ELSA'S ARCHED TAUPE-BROWN EYEBROWS (Confident & Kind) --- */}
            <path
              d="M 67.5 38 Q 72.5 34 77.5 36.5"
              fill="none"
              stroke="#5c3818"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 82.5 36.5 Q 87.5 34 92.5 38"
              fill="none"
              stroke="#5c3818"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* --- ELSA'S CUTE BUTTON NOSE --- */}
            <path
              d="M 79 46.5 Q 80 50.5 81.5 51.5"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <ellipse cx="80" cy="51.5" rx="1.8" ry="0.9" fill="#f87171" opacity="0.3" />
            <circle cx="79.5" cy="50.8" r="0.6" fill="#ffffff" opacity="0.6" />

            {/* --- ELSA'S ROSY BERRY LIPS & GENTLE SMILE --- */}
            {pose === 'cheering' ? (
              // Joyful Open Smile with Teeth
              <g>
                <path
                  d="M 75 56 Q 80 55 85 56 Q 86 62 80 63 Q 74 62 75 56 Z"
                  fill="url(#elsaLipGrad)"
                />
                <path d="M 76.5 56.8 Q 80 56.5 83.5 56.8 Q 80 59 76.5 56.8 Z" fill="#ffffff" />
                {/* Lip Corner Dimples */}
                <circle cx="74.5" cy="56.5" r="0.6" fill="#9f1239" />
                <circle cx="85.5" cy="56.5" r="0.6" fill="#9f1239" />
              </g>
            ) : (
              // Elsa's Signature Elegant & Warm Princess Smile
              <g>
                {/* Upper Lip with Cupid's Bow */}
                <path
                  d="M 75.5 57 Q 78 55.5 80 56.3 Q 82 55.5 84.5 57 Q 80 58.5 75.5 57 Z"
                  fill="url(#elsaLipGrad)"
                />
                {/* Lower Full Lip */}
                <path
                  d="M 76 57.2 Q 80 61.2 84 57.2 Q 80 59.5 76 57.2 Z"
                  fill="#f43f5e"
                />
                {/* Lip Gloss Shimmer */}
                <ellipse cx="80" cy="58.6" rx="1.8" ry="0.6" fill="#ffffff" opacity="0.75" />
                {/* Soft Smile Outline */}
                <path
                  d="M 75 57 Q 80 60.5 85 57"
                  fill="none"
                  stroke="#9f1239"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>

          {/* 7. PLATINUM BLONDE HAIR & ELEGANT SWEPT-BACK POMPADOUR */}
          <g>
            {/* Voluminous Swept-Back Crown Hair with Elsa's high crest */}
            <path
              d="M 61 42 C 57 20 72 16 80 18 C 88 16 103 20 99 42 C 92 27 88 25 80 25 C 72 25 68 27 61 42 Z"
              fill="url(#elsaHairGrad)"
              stroke="#fef08a"
              strokeWidth="0.8"
            />
            {/* Distinct Signature Hair Strands & Texture */}
            <path d="M 74 18 Q 80 26 84 19" fill="none" stroke="url(#elsaHairShadowGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 68 22 Q 74 30 78 24" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 92 22 Q 86 30 82 24" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 63 32 Q 70 28 75 36" fill="none" stroke="url(#elsaHairShadowGrad)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 97 32 Q 90 28 85 36" fill="none" stroke="url(#elsaHairShadowGrad)" strokeWidth="1.2" strokeLinecap="round" />

            {/* Soft wisps framing the face */}
            <path d="M 63 43 Q 62 49 64 53" fill="none" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />
            <path d="M 97 43 Q 98 49 96 53" fill="none" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />

            {/* Iconic French Braid gracefully draping over left shoulder */}
            <g>
              <ellipse cx="61" cy="54" rx="5" ry="7" fill="url(#elsaHairGrad)" transform="rotate(-15 61 54)" />
              <circle cx="58" cy="55" r="2" fill="#38bdf8" /> {/* Ice hairpin */}
              <ellipse cx="56" cy="67" rx="4.5" ry="6.5" fill="url(#elsaHairGrad)" transform="rotate(-18 56 67)" />
              <circle cx="54" cy="68" r="1.5" fill="#ffffff" />
              <ellipse cx="52" cy="79" rx="4" ry="6" fill="url(#elsaHairGrad)" transform="rotate(-22 52 79)" />
              <ellipse cx="49" cy="90" rx="3.5" ry="5.5" fill="url(#elsaHairGrad)" transform="rotate(-18 49 90)" />
              <circle cx="48" cy="91" r="1.5" fill="#38bdf8" />
              <ellipse cx="48" cy="100" rx="3" ry="4.5" fill="url(#elsaHairGrad)" transform="rotate(-10 48 100)" />
              {/* Braid Blue Ribbon Tip */}
              <path d="M 46 103 Q 47 110 48 105" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          </g>

          {/* 8. SPARKLING ICE CRYSTAL TIARA / CROWN */}
          <g>
            <polygon
              points="70,22 74,13 80,20 86,13 90,22 80,23"
              fill="url(#tiaraGrad)"
              stroke="#ffffff"
              strokeWidth="0.9"
            />
            <circle cx="80" cy="17" r="1.6" fill="#0284c7" />
            <circle cx="74" cy="15" r="1" fill="#ffffff" />
            <circle cx="86" cy="15" r="1" fill="#ffffff" />
          </g>

          {/* 9. SLENDER ARMS & DELICATE HANDS (Graceful Poses) */}
          <g>
            {pose === 'casting' ? (
              // Both slender hands raised forward casting magic
              <g>
                <path d="M 68 76 Q 50 70 42 54" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 92 76 Q 110 70 118 54" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                {/* Magic Frost Orbs on Hands */}
                <circle cx="42" cy="52" r="5" fill="#e0f2fe" opacity="0.9" />
                <circle cx="118" cy="52" r="5" fill="#e0f2fe" opacity="0.9" />
                <path d="M 42 47 L 42 57 M 37 52 L 47 52" stroke="#0284c7" strokeWidth="1.5" />
                <path d="M 118 47 L 118 57 M 113 52 L 123 52" stroke="#0284c7" strokeWidth="1.5" />
              </g>
            ) : pose === 'cheering' ? (
              // Slender hands waving up joyfully
              <g>
                <path d="M 68 76 Q 48 60 44 42" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 92 76 Q 112 60 116 42" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="44" cy="40" r="3.2" fill="url(#elsaSkinGrad)" />
                <circle cx="116" cy="40" r="3.2" fill="url(#elsaSkinGrad)" />
              </g>
            ) : pose === 'guiding' ? (
              // One hand pointing to the math equation gracefully
              <g>
                <path d="M 68 76 Q 58 90 56 100" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 92 76 Q 114 76 130 68" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="132" cy="67" r="3.2" fill="url(#elsaSkinGrad)" />
                <circle cx="136" cy="65" r="2.2" fill="#38bdf8" />
              </g>
            ) : (
              // Idle: Slender hands gracefully folded at the waist
              <g>
                <path d="M 68 76 Q 72 94 77 98" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 92 76 Q 88 94 83 98" fill="none" stroke="url(#elsaSkinGrad)" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="80" cy="99" r="3.5" fill="url(#elsaSkinGrad)" />
              </g>
            )}
          </g>
        </svg>

        {/* Small floating fairy sparkles on click */}
        {isSparkling && (
          <motion.div
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: 1.4, opacity: 0, y: -35 }}
            transition={{ duration: 0.9 }}
            className="absolute top-0 flex items-center gap-1 text-cyan-300 font-black text-xs pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>冰雪魔法！</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

