import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Castle, Camera } from 'lucide-react';
import { LiveIceCastle } from './LiveIceCastle';
import { CASTLE_MILESTONES } from '../storyData';

interface IceCastleGrowthCardProps {
  stars: number;
  phase: string;
  onOpenCastle: () => void;
  onOpenAlbum?: () => void;
}

export function IceCastleGrowthCard({
  stars,
  phase,
  onOpenCastle,
  onOpenAlbum,
}: IceCastleGrowthCardProps) {
  // Determine current stage (0 to 5)
  let currentStage = 0;
  CASTLE_MILESTONES.forEach((m) => {
    if (stars >= m.starsRequired) {
      currentStage = m.castleStage;
    }
  });

  const nextMilestone = CASTLE_MILESTONES.find((m) => stars < m.starsRequired);
  const remainingForNext = nextMilestone ? nextMilestone.starsRequired - stars : 0;

  return (
    <div className="relative w-full min-h-[140px] sm:min-h-[160px] flex items-center justify-between p-3 sm:p-4 select-none overflow-hidden rounded-3xl md:rounded-[32px] border-3 border-white/90 shadow-[0_12px_30px_rgba(8,30,60,0.4)] bg-gradient-to-b from-[#d5efff] via-[#b2e2fb] to-[#8cd3f8]">
      {/* Glossy top ice reflection */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Left Column: Stage Info & Action Badges */}
      <div className="z-10 flex flex-col justify-center max-w-[55%] pl-1">
        <div className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-0.5 rounded-full border border-white shadow-xs w-fit mb-1">
          <Castle className="w-3.5 h-3.5 text-cyan-700" />
          <span className="text-[10px] sm:text-xs font-black text-sky-950">
            冰雪城堡 第 {currentStage}/5 階
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-black text-sky-950 leading-tight drop-shadow-xs">
          每過一關，城堡變大！
        </h3>

        <p className="text-[10px] sm:text-xs font-bold text-sky-800 mt-1">
          {remainingForNext > 0 ? (
            <>再對 <span className="font-black text-amber-700 bg-white/80 px-1 rounded">{remainingForNext}</span> 題解鎖新篇章！</>
          ) : (
            <span className="text-purple-900 font-black">🌟 城堡已達最輝煌狀態！</span>
          )}
        </p>

        {/* Action Pills: Open Album & Visit Kingdom */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {onOpenAlbum && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAlbum}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs border border-white flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" />
              <span>📸 相簿</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCastle}
            className="bg-sky-500 hover:bg-sky-400 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs border border-white flex items-center gap-1 cursor-pointer"
          >
            <Castle className="w-3 h-3" />
            <span>故事 🏰</span>
          </motion.button>
        </div>
      </div>

      {/* Right Column: Live Scalable Mini Castle Avatar */}
      <div
        onClick={onOpenCastle}
        className="relative z-10 flex items-center justify-end pr-1 cursor-pointer hover:scale-105 transition-transform"
      >
        <LiveIceCastle
          stars={stars}
          size={window.innerWidth < 640 ? 'mini' : 'sm'}
          interactive={false}
          showBadge={false}
          isCelebrating={phase === 'success'}
        />
      </div>
    </div>
  );
}
