import React from 'react';
import { motion } from 'motion/react';

interface SnowflakeBurstProps {
  value: string | number;
  isSolved?: boolean;
  size?: number;
  className?: string;
}

export function SnowflakeBurst({
  value,
  isSolved = false,
  size = 110,
  className = '',
}: SnowflakeBurstProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Starburst SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full absolute inset-0 overflow-visible"
        animate={{ rotate: isSolved ? [0, 360] : [0, 8, 0, -8, 0] }}
        transition={{
          rotate: {
            duration: isSolved ? 12 : 6,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        <defs>
          <linearGradient id="crystalOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="45%" stopColor="#60a5fa" />
            <stop offset="85%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          <linearGradient id="crystalInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#e0f2fe" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>

          <filter id="iceBurstGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer large crystal spikes (12-pointed starburst) */}
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            return (
              <path
                key={`spike-${i}`}
                d="M 100 100 L 92 48 L 100 12 L 108 48 Z"
                fill="url(#crystalOuter)"
                stroke="#e0f2fe"
                strokeWidth="1.2"
                transform={`rotate(${angle}, 100, 100)`}
                opacity={i % 2 === 0 ? 0.95 : 0.8}
              />
            );
          })}
        </g>

        {/* Medium inner crystal facets (offset 15 deg) */}
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12 + 15;
            return (
              <polygon
                key={`inner-facet-${i}`}
                points="100,100 94,62 100,32 106,62"
                fill="url(#crystalInner)"
                stroke="#ffffff"
                strokeWidth="1"
                transform={`rotate(${angle}, 100, 100)`}
                opacity="0.9"
              />
            );
          })}
        </g>

        {/* Central crystal disc with radial shine */}
        <circle cx="100" cy="100" r="46" fill="url(#centerGlow)" />
        <circle cx="100" cy="100" r="42" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Small sparkling diamond stars at points */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 360) / 6;
          return (
            <polygon
              key={`sparkle-${i}`}
              points="100,24 102,28 100,32 98,28"
              fill="#ffffff"
              transform={`rotate(${angle}, 100, 100)`}
            />
          );
        })}
      </motion.svg>

      {/* Foreground Content: ? or Solved Number */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.span
          key={String(value)}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-black tracking-tight select-none ${
            isSolved
              ? 'text-cyan-700 drop-shadow-[0_2px_10px_rgba(255,255,255,1)] text-3xl sm:text-4xl md:text-5xl'
              : 'text-cyan-600 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] text-4xl sm:text-5xl md:text-6xl'
          }`}
          style={{
            textShadow: '0 0 12px #ffffff, 0 0 20px #a5f3fc, 0 2px 4px rgba(3,105,161,0.5)',
          }}
        >
          {value}
        </motion.span>
      </div>
    </div>
  );
}
