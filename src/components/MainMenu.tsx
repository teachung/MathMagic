import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Castle, Camera, Download, WifiOff } from 'lucide-react';
import { GameLevel } from '../types';
import { ElsaPrincess } from './ElsaPrincess';
import { LiveIceCastle } from './LiveIceCastle';

interface MainMenuProps {
  onStart: (level: GameLevel) => void;
  stars: number;
  requireCalc: boolean;
  setRequireCalc: (val: boolean) => void;
  onOpenCastle: () => void;
  onOpenAlbum: () => void;
  onOpenPwaModal?: () => void;
  isOnline?: boolean;
}

export function MainMenu({
  onStart,
  stars,
  requireCalc,
  setRequireCalc,
  onOpenCastle,
  onOpenAlbum,
  onOpenPwaModal,
  isOnline = true,
}: MainMenuProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-xl mx-auto my-auto select-none">
      {/* Frosted Tablet Card */}
      <div className="relative w-full bg-gradient-to-b from-[#d8f1ff] via-[#b6e4fa] to-[#88d2f7] rounded-[36px] sm:rounded-[44px] p-4 sm:p-7 shadow-[0_20px_50px_rgba(8,30,60,0.5)] border-4 border-white/90 text-center overflow-hidden">
        {/* Glossy top ice reflection */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[40px]" />

        {/* Decorative corner ice crystals */}
        <div className="absolute top-3 left-4 text-cyan-300 text-lg opacity-80 animate-bounce">❄️</div>
        <div className="absolute top-3 right-5 text-cyan-300 text-sm opacity-80 animate-pulse">✨</div>
        <div className="absolute bottom-4 left-6 text-cyan-400 text-sm opacity-70">💎</div>
        <div className="absolute bottom-4 right-5 text-cyan-400 text-base opacity-70">❄️</div>

        {/* Header Title */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-2">
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-black text-sky-950 tracking-wider"
            style={{
              textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 0 20px rgba(56,189,248,0.7)',
            }}
          >
            冰雪魔法數學
          </h1>
          <p className="text-xs sm:text-sm font-bold text-sky-800 mt-0.5 drop-shadow-xs">
            ❄️ 答對題目，冰雪城堡就會慢慢變大變漂亮！ ❄️
          </p>

          {/* Offline indicator if not online */}
          {!isOnline && (
            <div className="mt-1 inline-flex items-center gap-1 bg-amber-500/90 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs border border-amber-300 animate-pulse">
              <WifiOff className="w-3 h-3" />
              <span>離線模式運作中・隨時暢玩</span>
            </div>
          )}
        </div>

        {/* Elsa & Growing Ice Castle Courtyard Stage */}
        <div className="relative z-10 bg-white/45 backdrop-blur-xs p-3 sm:p-4 rounded-3xl border-2 border-white/80 shadow-inner my-2 flex flex-col items-center justify-center">
          {/* Elsa Voice Greeting Banner */}
          <div className="inline-flex items-center gap-1.5 bg-white/90 text-sky-950 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-sm border border-cyan-200 mb-2">
            <span>👑</span>
            <span>愛莎公主：「跟我一起用數學魔法建造大城堡吧！✨」</span>
          </div>

          <div className="flex items-end justify-center gap-3 sm:gap-6 w-full overflow-visible">
            {/* Elsa Character (Cleanly visible without overlapping text) */}
            <div className="flex flex-col items-center">
              <ElsaPrincess
                pose="cheering"
                showDialogue={false}
                size={window.innerWidth < 640 ? 85 : 110}
              />
              <span className="text-[10px] sm:text-xs font-black text-sky-900 bg-white/80 px-2 py-0.5 rounded-full mt-1 border border-cyan-200">
                愛莎公主 ❄️
              </span>
            </div>

            {/* Interactive Live Castle that grows bigger with stars */}
            <div className="flex flex-col items-center">
              <LiveIceCastle
                stars={stars}
                size={window.innerWidth < 640 ? 'sm' : 'md'}
                interactive={true}
                onClick={onOpenCastle}
                showBadge={true}
              />
            </div>
          </div>
        </div>

        {/* Top Action Pills: Stars Counter, Castle Album, Castle Story & Install App Buttons */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-2 flex-wrap">
          {/* Stars Counter Pill */}
          <div className="inline-flex items-center gap-1 bg-white/85 backdrop-blur-xs px-2.5 sm:px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(2,132,199,0.2)] border-2 border-white">
            <span className="text-sm sm:text-base animate-bounce">⭐</span>
            <span className="text-xs font-black text-amber-600">
              {stars} 顆星星
            </span>
          </div>

          {/* Castle Photo Album Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAlbum}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-amber-950 px-2.5 sm:px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(245,158,11,0.35)] border-2 border-white font-black text-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-900" />
            <span>相簿</span>
          </motion.button>

          {/* Ice Kingdom Castle Story Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCastle}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white px-2.5 sm:px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(2,132,199,0.35)] border-2 border-white font-black text-xs cursor-pointer"
          >
            <Castle className="w-3.5 h-3.5 text-cyan-200" />
            <span>城堡 🏰</span>
          </motion.button>

          {/* PWA Install / Offline WebApp Button */}
          {onOpenPwaModal && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenPwaModal}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 hover:brightness-110 text-white px-2.5 sm:px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(99,102,241,0.35)] border-2 border-white font-black text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-yellow-300" />
              <span>📱 安裝桌面App</span>
            </motion.button>
          )}
        </div>

        {/* Require calculation switch */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-xs px-4 sm:px-5 py-2 rounded-2xl mb-2.5 w-full border-2 border-white/80 shadow-inner">
          <span className="text-xs sm:text-base font-black text-sky-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
            需要計算答案？
          </span>
          <button
            onClick={() => setRequireCalc(!requireCalc)}
            className={`w-12 h-6 sm:w-14 sm:h-8 rounded-full relative transition-colors border-2 shadow-inner cursor-pointer ${
              requireCalc
                ? 'bg-gradient-to-r from-sky-400 to-cyan-500 border-sky-300'
                : 'bg-slate-300 border-slate-400'
            }`}
          >
            <motion.div
              animate={{ x: requireCalc ? (window.innerWidth < 640 ? 22 : 24) : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full absolute top-0.5 shadow-md flex items-center justify-center text-[10px] font-black text-sky-700"
            >
              {requireCalc ? '✓' : ''}
            </motion.div>
          </button>
        </div>

        {/* Game Mode Buttons */}
        <div className="flex flex-col space-y-2 sm:space-y-2.5 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart('addition')}
            className="w-full bg-gradient-to-r from-sky-100 via-white to-sky-100 hover:from-white hover:to-sky-50 text-sky-900 py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl sm:rounded-3xl shadow-[0_6px_16px_rgba(2,132,199,0.2)] border-3 border-white border-b-5 active:border-b-3 transition-all flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-black">不進位加法</span>
              <span className="text-sm sm:text-base">🧊</span>
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-sky-600 mt-0.5">
              基礎加法（個位相加小於 10）
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart('carrying_addition')}
            className="w-full bg-gradient-to-r from-purple-100 via-white to-sky-100 hover:from-white hover:to-purple-50 text-purple-950 py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl sm:rounded-3xl shadow-[0_6px_16px_rgba(168,85,247,0.25)] border-3 border-white border-b-5 active:border-b-3 transition-all flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-black text-purple-900">
                進位加法遊戲
              </span>
              <span className="bg-amber-400 text-amber-950 text-[9px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs border border-amber-300">
                滿十進一 🌟
              </span>
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-purple-600 mt-0.5">
              個位滿 10 粒積木，組裝 1 條十位棒進位！
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart('subtraction')}
            className="w-full bg-gradient-to-r from-cyan-100 via-white to-sky-100 hover:from-white hover:to-cyan-50 text-cyan-950 py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl sm:rounded-3xl shadow-[0_6px_16px_rgba(6,182,212,0.2)] border-3 border-white border-b-5 active:border-b-3 transition-all flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-black text-cyan-900">
                減法遊戲
              </span>
              <span className="text-sm sm:text-base">❄️</span>
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-cyan-700 mt-0.5">
              基礎減法（數一數、劃掉積木）
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

