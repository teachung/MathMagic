import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { CastleMilestone } from '../types';
import { ElsaPrincess } from './ElsaPrincess';

interface StoryMilestoneModalProps {
  milestone: CastleMilestone | null;
  onClose: () => void;
  onOpenCastle: () => void;
}

export function StoryMilestoneModal({
  milestone,
  onClose,
  onOpenCastle,
}: StoryMilestoneModalProps) {
  if (!milestone) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#d5f3fe] via-[#b2e5fa] to-[#7acbf7] rounded-[40px] p-6 sm:p-8 border-4 border-white shadow-[0_25px_60px_rgba(2,132,199,0.7)] text-center text-sky-950 overflow-hidden"
        >
          {/* Top gloss reflection */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[36px]" />

          {/* Ice Crystal & Sparkle decorations */}
          <div className="absolute top-3 left-4 text-cyan-500 text-xl animate-bounce">❄️</div>
          <div className="absolute top-3 right-4 text-amber-400 text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
          <div className="absolute bottom-4 left-6 text-cyan-400 text-lg animate-pulse">💎</div>
          <div className="absolute bottom-4 right-6 text-cyan-400 text-xl animate-pulse">❄️</div>

          {/* Milestone Badge Pill */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-5 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-md border-2 border-white mb-3">
            <Trophy className="w-4 h-4 text-amber-950 fill-amber-950" />
            <span>冰雪魔法突破！新篇章解鎖！</span>
          </div>

          {/* Title */}
          <h2
            className="text-2xl sm:text-3xl font-black text-sky-950 tracking-wide mb-2"
            style={{
              textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 0 15px rgba(56,189,248,0.7)',
            }}
          >
            {milestone.title}
          </h2>

          {/* Elsa Mascot Animation with Casting Pose */}
          <div className="my-2 flex justify-center items-center">
            <ElsaPrincess
              pose="casting"
              size={135}
              showDialogue={false}
            />
          </div>

          {/* Unlocked Reward Box */}
          <div className="bg-white/85 backdrop-blur-xs p-4 rounded-3xl border-2 border-white shadow-inner mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">{milestone.characterEmoji}</span>
              <span className="text-base sm:text-lg font-black text-cyan-800">
                獲得了：{milestone.unlockedItem}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-sky-900 leading-relaxed mt-1">
              {milestone.storyText}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-center">
            <button
              onClick={() => {
                onClose();
                onOpenCastle();
              }}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black py-3 px-5 rounded-2xl shadow-[0_6px_16px_rgba(2,132,199,0.35)] border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 text-sm sm:text-base"
            >
              <span>查看冰雪城堡</span>
              <span>🏰</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-amber-950 font-black py-3 px-5 rounded-2xl shadow-[0_6px_16px_rgba(245,158,11,0.35)] border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 text-sm sm:text-base"
            >
              <span>繼續冒險！</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
