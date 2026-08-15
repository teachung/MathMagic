import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { GamePhase } from '../types';

interface IceScrollProps {
  phase: GamePhase;
  requireCalc: boolean;
  hasCarry?: boolean;
  onNext: () => void;
  onNumpadClick: (num: number) => void;
}

export function IceScroll({
  phase,
  requireCalc,
  hasCarry = false,
  onNext,
  onNumpadClick,
}: IceScrollProps) {
  const getTitle = () => {
    if (phase === 'success') return '答對了！';
    if (!requireCalc) return '排排隊';
    if (phase === 'calc_units') return '計算個位';
    if (phase === 'calc_tens') return '計算十位';
    return '排排隊';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-5 md:p-6 select-none overflow-hidden">
      {/* Frozen Parchment SVG Background */}
      <svg
        viewBox="0 0 300 400"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full -z-10 drop-shadow-[0_10px_25px_rgba(8,30,60,0.35)]"
      >
        <defs>
          <linearGradient id="parchmentBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8f6ff" />
            <stop offset="40%" stopColor="#cceeff" />
            <stop offset="85%" stopColor="#a8e2fc" />
            <stop offset="100%" stopColor="#8cd6f8" />
          </linearGradient>

          <linearGradient id="scrollCurl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <filter id="iceParchmentGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0284c7" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Main curved scroll body with frosty wave edges */}
        <path
          d="M 32 12
             C 70 8, 230 8, 268 12
             C 288 14, 292 30, 288 55
             C 284 80, 294 130, 288 180
             C 282 230, 292 280, 288 330
             C 284 370, 270 388, 240 388
             C 200 388, 80 386, 45 388
             C 20 388, 8 368, 12 330
             C 16 280, 8 230, 12 180
             C 16 130, 8 80, 12 55
             C 14 30, 20 14, 32 12 Z"
          fill="url(#parchmentBg)"
          stroke="#ffffff"
          strokeWidth="3.5"
          filter="url(#iceParchmentGlow)"
        />

        {/* Top-left corner curl */}
        <path
          d="M 12 55 C 14 25, 35 12, 60 12 C 40 28, 25 35, 12 55 Z"
          fill="url(#scrollCurl)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Bottom-right corner curl */}
        <path
          d="M 288 330 C 285 365, 260 388, 235 388 C 255 370, 270 355, 288 330 Z"
          fill="url(#scrollCurl)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Inner subtle ice frost lines */}
        <path
          d="M 30 40 Q 150 35 270 40"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 30 360 Q 150 365 270 360"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Header Title inside Scroll */}
      <div className="w-full text-center mt-1 sm:mt-2">
        <h3
          className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-wider inline-block"
          style={{
            textShadow: '0 1px 2px rgba(255,255,255,0.9), 0 0 10px rgba(186,230,253,0.8)',
          }}
        >
          {getTitle()}
        </h3>
      </div>

      {/* Scroll Body Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center my-2 sm:my-3">
        {phase === 'success' ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full flex flex-col items-center justify-center gap-3"
          >
            <p className="text-sm sm:text-base md:text-lg font-black text-sky-950 text-center">
              太棒了！你真聰明！🌟
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-full max-w-[220px] py-3.5 sm:py-4 px-6 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 hover:from-amber-300 hover:to-orange-500 text-white rounded-2xl md:rounded-3xl font-black text-xl sm:text-2xl shadow-[0_8px_20px_rgba(234,88,12,0.4)] border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>下一題</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </motion.button>
          </motion.div>
        ) : !requireCalc ? (
          <div className="flex flex-col items-center justify-center text-center px-2 py-4">
            <p className="text-base sm:text-lg md:text-xl font-black text-slate-800 leading-relaxed drop-shadow-sm">
              把橫式程的數字
              <br />
              <br />
              排到正確的格子裡！
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            {/* Calculation guidance banner */}
            {phase === 'calc_units' && (
              <div className="bg-sky-600/20 border border-sky-400/50 text-sky-950 rounded-xl px-2.5 py-1.5 mb-2.5 text-xs sm:text-sm text-center font-bold backdrop-blur-xs w-full shadow-inner flex items-center justify-center gap-1">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {hasCarry
                    ? '滿10進一！自己數數個位剩多少粒？'
                    : '先算個位：加起來是多少？'}
                </span>
              </div>
            )}
            {phase === 'calc_tens' && (
              <div className="bg-sky-600/20 border border-sky-400/50 text-sky-950 rounded-xl px-2.5 py-1.5 mb-2.5 text-xs sm:text-sm text-center font-bold backdrop-blur-xs w-full shadow-inner flex items-center justify-center gap-1">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {hasCarry
                    ? '再算十位：記得加上進位，共是多少？'
                    : '再算十位：加起來是多少？'}
                </span>
              </div>
            )}

            {/* Ice Crystal Numpad */}
            <div
              className={`grid grid-cols-5 gap-1.5 sm:gap-2 w-full transition-opacity duration-300 ${
                phase === 'calc_units' || phase === 'calc_tens'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-40 pointer-events-none'
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onNumpadClick(num)}
                  disabled={phase !== 'calc_units' && phase !== 'calc_tens'}
                  className="aspect-square bg-gradient-to-b from-white via-sky-50 to-sky-100 hover:from-white hover:to-amber-50 text-sky-900 rounded-xl sm:rounded-2xl border-2 border-white/90 shadow-[0_4px_10px_rgba(2,132,199,0.2)] flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black active:translate-y-0.5 active:shadow-xs transition-all cursor-pointer select-none"
                  style={{
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                  }}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subtle bottom note / decoration */}
      <div className="w-full text-center pb-1">
        <span className="text-[11px] font-bold text-sky-800/80">
          ✨ 魔法水晶筆記 ✨
        </span>
      </div>
    </div>
  );
}
