import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Castle, Camera, Trophy } from 'lucide-react';
import { LiveIceCastle } from './LiveIceCastle';
import { ElsaPrincess } from './ElsaPrincess';
import { CASTLE_MILESTONES } from '../storyData';

interface CastleGrowthCelebrationModalProps {
  isOpen: boolean;
  stars: number;
  onNext: () => void;
  onOpenCastle: () => void;
  onOpenAlbum?: () => void;
}

export function CastleGrowthCelebrationModal({
  isOpen,
  stars,
  onNext,
  onOpenCastle,
  onOpenAlbum,
}: CastleGrowthCelebrationModalProps) {
  if (!isOpen) return null;

  // Calculate milestone details
  let currentStage = 0;
  CASTLE_MILESTONES.forEach((m) => {
    if (stars >= m.starsRequired) {
      currentStage = m.castleStage;
    }
  });

  const nextMilestone = CASTLE_MILESTONES.find((m) => stars < m.starsRequired);
  const remainingForNext = nextMilestone ? nextMilestone.starsRequired - stars : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-sky-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#d5f3fe] via-[#b0e4fa] to-[#76c9f7] rounded-[36px] sm:rounded-[44px] p-5 sm:p-7 border-4 border-white shadow-[0_25px_60px_rgba(2,132,199,0.7)] text-center text-sky-950 overflow-hidden"
        >
          {/* Top gloss reflection */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[40px]" />

          {/* Corner Sparkles */}
          <div className="absolute top-3 left-4 text-cyan-400 text-xl animate-bounce">❄️</div>
          <div className="absolute top-3 right-4 text-amber-400 text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
          <div className="absolute bottom-4 left-6 text-cyan-400 text-lg animate-pulse">💎</div>
          <div className="absolute bottom-4 right-6 text-cyan-400 text-xl animate-pulse">❄️</div>

          {/* Reward Header Pill */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-md border-2 border-white mb-2">
            <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950 animate-spin" />
            <span>魔法成功！冰雪城堡長大囉！🏰</span>
          </div>

          {/* Live Scaling Ice Castle Preview (Hero element) */}
          <div className="relative my-2 py-2 flex flex-col items-center justify-center">
            <LiveIceCastle
              stars={stars}
              size="md"
              isCelebrating={true}
              showBadge={true}
            />
          </div>

          {/* Stars & Progress Notification Box */}
          <div className="bg-white/85 backdrop-blur-xs p-3 sm:p-4 rounded-3xl border-2 border-white shadow-inner mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xl sm:text-2xl animate-bounce">⭐</span>
              <span className="text-base sm:text-lg font-black text-amber-600">
                +1 顆魔法星星已注入城堡！
              </span>
            </div>

            <p className="text-xs sm:text-sm font-black text-cyan-800 leading-snug">
              愛莎公主：「太棒了！你的數學魔法讓城堡的水晶更耀眼了！✨」
            </p>

            {remainingForNext > 0 ? (
              <div className="mt-2 text-[11px] sm:text-xs font-bold text-sky-700 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200 inline-block">
                再答對 <span className="font-black text-sky-950 text-xs sm:text-sm">{remainingForNext}</span> 題解鎖下一個故事新篇章！📜
              </div>
            ) : (
              <div className="mt-2 text-[11px] sm:text-xs font-black text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200 inline-block animate-pulse">
                👑 恭喜你完成了整座冰雪魔法城堡！
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 justify-center items-center">
            {onOpenAlbum && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenAlbum}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-amber-950 font-black py-2.5 sm:py-3 px-3.5 rounded-2xl shadow-md border-2 border-white flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <Camera className="w-4 h-4 text-amber-900" />
                <span>📸 城堡相簿</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenCastle}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black py-2.5 sm:py-3 px-3.5 rounded-2xl shadow-[0_6px_16px_rgba(2,132,199,0.3)] border-2 border-white flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <Castle className="w-4 h-4 text-cyan-200" />
              <span>城堡故事 🏰</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-amber-950 font-black py-3 sm:py-3.5 px-4 rounded-2xl shadow-[0_8px_20px_rgba(245,158,11,0.4)] border-2 border-white flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm animate-pulse"
            >
              <span>下一題</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
