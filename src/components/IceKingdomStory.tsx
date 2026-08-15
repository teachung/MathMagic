import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, Award, Trophy, Camera } from 'lucide-react';
import { CASTLE_MILESTONES } from '../storyData';

interface IceKingdomStoryProps {
  stars: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenAlbum?: () => void;
  onPlaySound?: (type: 'pop' | 'correct' | 'tap') => void;
}

export function IceKingdomStory({
  stars,
  isOpen,
  onClose,
  onOpenAlbum,
  onPlaySound,
}: IceKingdomStoryProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate current stage (0 to 5)
  let currentStage = 0;
  CASTLE_MILESTONES.forEach((m) => {
    if (stars >= m.starsRequired) {
      currentStage = m.castleStage;
    }
  });

  const nextMilestone = CASTLE_MILESTONES.find((m) => stars < m.starsRequired);

  const handleCharacterClick = (name: string, phrase: string) => {
    if (onPlaySound) onPlaySound('pop');
    setSelectedCharacter(phrase);
    setTimeout(() => setSelectedCharacter(null), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-sky-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#0b335a] via-[#104374] to-[#08233f] rounded-[36px] sm:rounded-[44px] p-5 sm:p-7 border-4 border-cyan-300 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-white overflow-hidden my-auto"
        >
          {/* Background Northern Lights Aurora ribbons (Lightweight CSS gradient) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.35),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.3),transparent_50%)]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/60 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-20"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Header Title */}
          <div className="relative z-10 text-center mb-3 sm:mb-4">
            <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 px-4 py-1 rounded-full border border-cyan-200 shadow-md">
                <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" />
                <span className="text-xs sm:text-sm font-black tracking-wider text-cyan-100">
                  愛莎公主的冰雪奇緣故事
                </span>
              </div>

              {onOpenAlbum && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAlbum();
                  }}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 text-amber-950 px-3.5 py-1 rounded-full border border-white font-black text-xs shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>📸 翻開城堡相簿</span>
                </button>
              )}
            </div>

            <h2
              className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300 drop-shadow-md"
              style={{ textShadow: '0 0 20px rgba(56,189,248,0.8)' }}
            >
              🏰 冰雪水晶魔法城堡
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200 mt-0.5">
              每答對一道數學題，就能為城堡注入魔力！點擊角色會有驚喜互動喔！
            </p>
          </div>

          {/* Character Speech Bubble Toast */}
          <AnimatePresence>
            {selectedCharacter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white text-sky-950 px-4 py-2 rounded-2xl shadow-xl border-2 border-cyan-400 font-black text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap animate-bounce"
              >
                <span>💬</span>
                <span>{selectedCharacter}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= GRAND INTERACTIVE CASTLE STAGE ================= */}
          <div className="relative z-10 w-full h-56 sm:h-64 bg-gradient-to-b from-[#0e3b66] to-[#1a558b] rounded-3xl border-2 border-cyan-400/70 p-3 flex flex-col justify-end items-center overflow-hidden shadow-inner mb-4">
            {/* Stars background */}
            <div className="absolute top-2 left-6 text-xs text-white/70 animate-pulse">✨</div>
            <div className="absolute top-6 right-10 text-xs text-white/70 animate-pulse">✨</div>
            <div className="absolute top-12 left-1/3 text-xs text-cyan-300 animate-pulse">❄️</div>

            {/* Aurora Wave (Stage 5 Unlock) */}
            {currentStage >= 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-teal-400/40 via-purple-400/20 to-transparent pointer-events-none"
              >
                <div className="text-center pt-2 text-xs font-black text-teal-200 flex items-center justify-center gap-1">
                  <span>👑 阿倫黛爾極光綻放！城堡大圓滿！</span>
                </div>
              </motion.div>
            )}

            {/* Castle SVG Illustration */}
            <svg
              viewBox="0 0 400 240"
              className="w-full h-full max-h-56 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="iceCastleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#bae6fd" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="crystalGlint" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Stage 0: Snowy Base Ground */}
              <path
                d="M 0 220 Q 100 200 200 215 Q 300 200 400 220 L 400 240 L 0 240 Z"
                fill="#e0f2fe"
              />
              <path
                d="M 30 225 Q 120 210 210 220 Q 310 210 380 225"
                stroke="#bae6fd"
                strokeWidth="3"
                fill="none"
              />

              {/* Stage 1: Ice Spiral Staircase (Stage >= 1) */}
              {currentStage >= 1 && (
                <g>
                  {/* Left Spiral Ice Stairs */}
                  <path
                    d="M 60 215 C 80 180 120 170 140 180 C 160 190 150 215 150 215"
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 215 C 80 180 120 170 140 180"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Small Ice Steps */}
                  <rect x="75" y="195" width="16" height="4" rx="2" fill="#ffffff" />
                  <rect x="95" y="182" width="16" height="4" rx="2" fill="#ffffff" />
                  <rect x="118" y="176" width="16" height="4" rx="2" fill="#ffffff" />
                </g>
              )}

              {/* Stage 2: Grand Crystal Gates & Side Towers (Stage >= 2) */}
              {currentStage >= 2 && (
                <g>
                  {/* Left Crystal Pillar */}
                  <polygon points="120,215 135,215 130,130 125,130" fill="url(#iceCastleGrad)" />
                  <polygon points="120,130 135,130 127.5,90" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
                  {/* Right Crystal Pillar */}
                  <polygon points="265,215 280,215 275,130 270,130" fill="url(#iceCastleGrad)" />
                  <polygon points="265,130 280,130 272.5,90" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />

                  {/* Grand Gate Archway */}
                  <path
                    d="M 160 215 L 160 145 Q 200 125 240 145 L 240 215 Z"
                    fill="url(#iceCastleGrad)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Ice Door Inner Frost Arch */}
                  <path
                    d="M 175 215 L 175 160 Q 200 145 225 160 L 225 215 Z"
                    fill="#0369a1"
                    stroke="#bae6fd"
                    strokeWidth="2"
                  />
                  {/* Large Ice Crystal Snowflake on Gate */}
                  <circle cx="200" cy="175" r="8" fill="#ffffff" opacity="0.9" />
                  <path d="M 200 162 L 200 188 M 187 175 L 213 175" stroke="#0284c7" strokeWidth="2" />
                </g>
              )}

              {/* Stage 3: High Main Palace Spire & Chandeliers (Stage >= 3) */}
              {currentStage >= 3 && (
                <g>
                  {/* Main Central Tower Body */}
                  <polygon points="170,145 230,145 220,70 180,70" fill="url(#iceCastleGrad)" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Gothic High Tower Spire */}
                  <polygon points="175,70 225,70 200,10" fill="url(#crystalGlint)" stroke="#ffffff" strokeWidth="2" />
                  {/* Top Glowing Magic Diamond */}
                  <polygon points="200,4 204,10 200,16 196,10" fill="#ffffff" />
                  <circle cx="200" cy="10" r="10" fill="#38bdf8" opacity="0.4" />

                  {/* Balcony */}
                  <rect x="175" y="70" width="50" height="8" rx="2" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="185" y1="70" x2="185" y2="78" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="200" y1="70" x2="200" y2="78" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="215" y1="70" x2="215" y2="78" stroke="#0284c7" strokeWidth="1.5" />
                </g>
              )}

              {/* Stage 4: Frozen Magic Fountain (Stage >= 4) */}
              {currentStage >= 4 && (
                <g>
                  {/* Fountain Base */}
                  <ellipse cx="200" cy="222" rx="35" ry="10" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx="200" cy="221" rx="28" ry="7" fill="#0284c7" />
                  {/* Fountain Ice Spout */}
                  <polygon points="196,220 204,220 202,198 198,198" fill="#ffffff" />
                  {/* Water Crystals Spouting Up */}
                  <path
                    d="M 200 198 Q 185 180 175 195 M 200 198 Q 215 180 225 195"
                    fill="none"
                    stroke="#bae6fd"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="175" cy="195" r="3" fill="#ffffff" />
                  <circle cx="225" cy="195" r="3" fill="#ffffff" />
                  <circle cx="200" cy="180" r="3" fill="#ffffff" />
                </g>
              )}

              {/* Stage 5: Nokk Water Spirit Horse Ice Sculpture (Stage >= 5) */}
              {currentStage >= 5 && (
                <g transform="translate(300, 160)">
                  {/* Ice Horse silhouette */}
                  <path
                    d="M 10 50 Q 20 20 40 10 Q 55 5 60 15 Q 55 25 45 28 L 50 50 Z"
                    fill="url(#crystalGlint)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="52" cy="14" r="1.5" fill="#38bdf8" />
                  <text x="12" y="60" fill="#bae6fd" fontSize="10" fontWeight="bold">水之靈 Nokk</text>
                </g>
              )}
            </svg>

            {/* Interactive Characters placed on the castle stage */}
            <div className="absolute bottom-2 inset-x-4 flex items-end justify-between pointer-events-auto">
              {/* Olaf Snowman (Unlocked at Stage 1) */}
              {currentStage >= 1 ? (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCharacterClick('Olaf', '雪寶：「我喜歡溫暖的擁抱！⛄」')}
                  className="flex flex-col items-center cursor-pointer bg-white/30 backdrop-blur-xs p-1.5 rounded-2xl border border-white shadow-md hover:bg-white/50 transition-all"
                >
                  <span className="text-2xl sm:text-3xl animate-bounce">⛄</span>
                  <span className="text-[10px] font-black text-cyan-900 bg-white/90 px-1.5 py-0.2 rounded-full mt-0.5">
                    雪寶
                  </span>
                </motion.button>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-9 h-9 rounded-2xl bg-sky-900/60 border border-dashed border-white/40 flex items-center justify-center text-base">
                    🔒
                  </div>
                  <span className="text-[9px] text-cyan-300 mt-0.5">2⭐解鎖</span>
                </div>
              )}

              {/* Marshmallow Snow Monster (Unlocked at Stage 2) */}
              {currentStage >= 2 ? (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCharacterClick('Marshmallow', '小雪怪：「吼～我守護這座冰雪城堡！❄️」')}
                  className="flex flex-col items-center cursor-pointer bg-white/30 backdrop-blur-xs p-1.5 rounded-2xl border border-white shadow-md hover:bg-white/50 transition-all"
                >
                  <span className="text-2xl sm:text-3xl">❄️</span>
                  <span className="text-[10px] font-black text-cyan-900 bg-white/90 px-1.5 py-0.2 rounded-full mt-0.5">
                    小雪怪
                  </span>
                </motion.button>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-9 h-9 rounded-2xl bg-sky-900/60 border border-dashed border-white/40 flex items-center justify-center text-base">
                    🔒
                  </div>
                  <span className="text-[9px] text-cyan-300 mt-0.5">5⭐解鎖</span>
                </div>
              )}

              {/* Gale Wind Spirit (Unlocked at Stage 3) */}
              {currentStage >= 3 ? (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCharacterClick('Gale', '風之靈 蓋兒：「呼～呼～帶來清脆的微風！🍃」')}
                  className="flex flex-col items-center cursor-pointer bg-white/30 backdrop-blur-xs p-1.5 rounded-2xl border border-white shadow-md hover:bg-white/50 transition-all"
                >
                  <span className="text-2xl sm:text-3xl animate-pulse">🍃</span>
                  <span className="text-[10px] font-black text-cyan-900 bg-white/90 px-1.5 py-0.2 rounded-full mt-0.5">
                    蓋兒
                  </span>
                </motion.button>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-9 h-9 rounded-2xl bg-sky-900/60 border border-dashed border-white/40 flex items-center justify-center text-base">
                    🔒
                  </div>
                  <span className="text-[9px] text-cyan-300 mt-0.5">9⭐解鎖</span>
                </div>
              )}

              {/* Bruni Fire Spirit (Unlocked at Stage 4) */}
              {currentStage >= 4 ? (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCharacterClick('Bruni', '火精靈 布魯尼：「（吐出藍色小火苗）滋滋～🦎🔥」')}
                  className="flex flex-col items-center cursor-pointer bg-white/30 backdrop-blur-xs p-1.5 rounded-2xl border border-white shadow-md hover:bg-white/50 transition-all"
                >
                  <span className="text-2xl sm:text-3xl animate-bounce">🦎</span>
                  <span className="text-[10px] font-black text-cyan-900 bg-white/90 px-1.5 py-0.2 rounded-full mt-0.5">
                    布魯尼
                  </span>
                </motion.button>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-9 h-9 rounded-2xl bg-sky-900/60 border border-dashed border-white/40 flex items-center justify-center text-base">
                    🔒
                  </div>
                  <span className="text-[9px] text-cyan-300 mt-0.5">14⭐解鎖</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= STORY CHAPTERS LIST ================= */}
          <div className="relative z-10 flex flex-col gap-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
            {CASTLE_MILESTONES.map((milestone) => {
              const isUnlocked = stars >= milestone.starsRequired;
              return (
                <div
                  key={milestone.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-sky-900/90 to-cyan-900/90 border-cyan-400 text-white shadow-md'
                      : 'bg-white/10 border-white/20 text-sky-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 font-bold ${
                        isUnlocked
                          ? 'bg-cyan-400 text-sky-950 shadow-inner'
                          : 'bg-white/20 text-white/50'
                      }`}
                    >
                      {isUnlocked ? milestone.characterEmoji : '🔒'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-cyan-200">
                          {milestone.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] bg-cyan-400/30 text-cyan-200 px-2 py-0.2 rounded-full font-bold border border-cyan-400/50">
                            已解鎖 ✨
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-white/90 line-clamp-2 mt-0.5">
                        {isUnlocked ? milestone.storyText : `累積 ${milestone.starsRequired} 顆星星解鎖此章節`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-0.5 justify-end">
                      <span>⭐</span>
                      <span>{milestone.starsRequired}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Goal Footer Banner */}
          <div className="relative z-10 mt-4 bg-white/15 backdrop-blur-xs p-3 rounded-2xl border border-white/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-300 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-cyan-100">
                目前擁有 <strong className="text-amber-300 font-black">{stars}</strong> 顆星星
                {nextMilestone ? `，距離解鎖「${nextMilestone.unlockedItem}」還差 ${nextMilestone.starsRequired - stars} 顆！` : '，城堡已完全建成！太強了！👑'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-sky-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              繼續闖關！
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
