import React from 'react';
import { motion } from 'motion/react';

interface IceFairyProps {
  pose?: 'idle' | 'pointing' | 'carrying' | 'cheering' | 'thinking';
  carryingValue?: string | number;
  className?: string;
  size?: number;
}

export function IceFairy({
  pose = 'idle',
  carryingValue,
  className = '',
  size = 64,
}: IceFairyProps) {
  return (
    <motion.div
      animate={
        pose === 'cheering'
          ? { y: [-6, 6, -6], rotate: [-4, 4, -4] }
          : { y: [-3, 3, -3] }
      }
      transition={{
        duration: pose === 'cheering' ? 1.2 : 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Thought bubble if carrying/thinking */}
      {carryingValue !== undefined && carryingValue !== null && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="absolute -top-7 -left-5 bg-white/95 backdrop-blur-sm border-2 border-cyan-300 rounded-full px-2.5 py-0.5 shadow-[0_0_12px_rgba(56,189,248,0.5)] flex items-center justify-center z-20"
        >
          <span className="text-sm font-black text-cyan-600 drop-shadow-sm">{carryingValue}</span>
          <div className="absolute -bottom-1.5 right-2 w-2 h-2 bg-white border-r-2 border-b-2 border-cyan-300 transform rotate-45" />
        </motion.div>
      )}

      {/* SVG Sprite */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible drop-shadow-[0_4px_10px_rgba(56,189,248,0.4)]"
      >
        <defs>
          <linearGradient id="fairyBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#d5f1ff" />
            <stop offset="100%" stopColor="#9be0ff" />
          </linearGradient>
          <linearGradient id="fairyCrown" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f7ff" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="fairyWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>
          <filter id="iceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Wings */}
        <g className="animate-pulse" style={{ transformOrigin: '50% 50%' }}>
          {/* Left Wing */}
          <path
            d="M 40 45 C 20 30 10 40 18 55 C 25 65 38 52 42 48 Z"
            fill="url(#fairyWing)"
            stroke="#bae6fd"
            strokeWidth="1.2"
          />
          <path
            d="M 38 50 C 22 55 18 68 28 72 C 35 74 40 60 40 52 Z"
            fill="url(#fairyWing)"
            stroke="#bae6fd"
            strokeWidth="1"
          />
          {/* Right Wing */}
          <path
            d="M 60 45 C 80 30 90 40 82 55 C 75 65 62 52 58 48 Z"
            fill="url(#fairyWing)"
            stroke="#bae6fd"
            strokeWidth="1.2"
          />
          <path
            d="M 62 50 C 78 55 82 68 72 72 C 65 74 60 60 60 52 Z"
            fill="url(#fairyWing)"
            stroke="#bae6fd"
            strokeWidth="1"
          />
        </g>

        {/* Ice Crown / Spiky Crystal Hair */}
        <path
          d="M 30 36 L 36 20 L 44 32 L 50 14 L 56 32 L 64 20 L 70 36 Z"
          fill="url(#fairyCrown)"
          stroke="#e0f2fe"
          strokeWidth="1.2"
        />
        {/* Diamond jewel on forehead */}
        <polygon points="50,22 54,28 50,34 46,28" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />

        {/* Head / Body */}
        <ellipse cx="50" cy="52" rx="22" ry="20" fill="url(#fairyBody)" stroke="#7dd3fc" strokeWidth="1.5" />

        {/* Cute Face */}
        {/* Blush */}
        <ellipse cx="38" cy="58" rx="4" ry="2.2" fill="#fda4af" opacity="0.75" />
        <ellipse cx="62" cy="58" rx="4" ry="2.2" fill="#fda4af" opacity="0.75" />

        {/* Eyes */}
        <ellipse cx="41" cy="50" rx="3" ry="4.2" fill="#0369a1" />
        <circle cx="42.2" cy="48.5" r="1.4" fill="#ffffff" />
        <circle cx="39.8" cy="52.2" r="0.7" fill="#ffffff" />

        <ellipse cx="59" cy="50" rx="3" ry="4.2" fill="#0369a1" />
        <circle cx="60.2" cy="48.5" r="1.4" fill="#ffffff" />
        <circle cx="57.8" cy="52.2" r="0.7" fill="#ffffff" />

        {/* Mouth */}
        {pose === 'cheering' ? (
          <path d="M 46 56 Q 50 63 54 56 Z" fill="#e11d48" stroke="#be123c" strokeWidth="0.8" />
        ) : (
          <path d="M 47 56 Q 50 60 53 56" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Little Ice Hands */}
        {pose === 'carrying' ? (
          <>
            <circle cx="32" cy="62" r="4.5" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="68" cy="62" r="4.5" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1" />
          </>
        ) : (
          <>
            <circle cx="34" cy="64" r="3.8" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="66" cy="64" r="3.8" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1" />
          </>
        )}

        {/* Magic Wand if pointing or idle */}
        {(pose === 'pointing' || pose === 'idle') && (
          <g transform="translate(64, 52) rotate(25)">
            <line x1="0" y1="0" x2="16" y2="-12" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
            <polygon points="18,-14 21,-12 18,-10 15,-12" fill="#fef08a" stroke="#facc15" strokeWidth="1" />
            <circle cx="18" cy="-12" r="1.5" fill="#ffffff" />
          </g>
        )}

        {/* Sparkles around */}
        <g opacity="0.85">
          <polygon points="22,25 24,28 22,31 20,28" fill="#e0f2fe" />
          <polygon points="78,22 80,25 78,28 76,25" fill="#e0f2fe" />
          <circle cx="28" cy="74" r="1.5" fill="#7dd3fc" />
          <circle cx="72" cy="76" r="1.5" fill="#7dd3fc" />
        </g>
      </svg>
    </motion.div>
  );
}
