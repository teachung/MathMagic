import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle,
  Maximize2,
  Heart,
  Star,
  Award,
  Crown,
} from 'lucide-react';
import { LiveIceCastle } from './LiveIceCastle';
import { ElsaPrincess } from './ElsaPrincess';
import { CASTLE_ALBUM_ENTRIES, CastlePhotoAlbumEntry } from '../storyData';

interface CastlePhotoAlbumModalProps {
  isOpen: boolean;
  stars: number;
  onClose: () => void;
  onPlaySound?: (type: 'pop' | 'correct' | 'tap' | 'magic') => void;
}

export function CastlePhotoAlbumModal({
  isOpen,
  stars,
  onClose,
  onPlaySound,
}: CastlePhotoAlbumModalProps) {
  // State for which photo is being viewed in full detail mode (null = album grid view)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isPhotoFlashing, setIsPhotoFlashing] = useState(false);
  const [isMagicSparkling, setIsMagicSparkling] = useState(false);

  if (!isOpen) return null;

  const totalEntries = CASTLE_ALBUM_ENTRIES.length;
  const unlockedCount = CASTLE_ALBUM_ENTRIES.filter((e) => stars >= e.starsRequired).length;

  const handleOpenDetail = (index: number) => {
    if (onPlaySound) onPlaySound('pop');
    setSelectedPhotoIndex(index);
  };

  const handleMagicSparkle = () => {
    if (onPlaySound) onPlaySound('magic');
    setIsMagicSparkling(true);
    setTimeout(() => setIsMagicSparkling(false), 2000);
  };

  const handleCameraSnap = () => {
    if (onPlaySound) onPlaySound('magic');
    setIsPhotoFlashing(true);
    setTimeout(() => setIsPhotoFlashing(false), 600);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    if (onPlaySound) onPlaySound('tap');
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + totalEntries) % totalEntries);
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    if (onPlaySound) onPlaySound('tap');
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % totalEntries);
  };

  const activePhoto: CastlePhotoAlbumEntry | null =
    selectedPhotoIndex !== null ? CASTLE_ALBUM_ENTRIES[selectedPhotoIndex] : null;
  const isActiveUnlocked = activePhoto ? stars >= activePhoto.starsRequired : false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-sky-950/80 backdrop-blur-md overflow-y-auto">
        {/* Main Album Book Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-gradient-to-b from-[#0e3b68] via-[#144b7d] to-[#0a2745] rounded-[36px] sm:rounded-[44px] p-4 sm:p-7 border-4 border-cyan-300 shadow-[0_25px_65px_rgba(0,0,0,0.75)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Background Aurora Ribbons (Lightweight radial gradient) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.4),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.3),transparent_50%)]" />

          {/* Top Camera Flash Overlay Effect */}
          {isPhotoFlashing && (
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white z-50 pointer-events-none"
            />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/60 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-30"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* ================= VIEW 1: ALBUM GALLERY GRID ================= */}
          {selectedPhotoIndex === null ? (
            <div className="relative z-10 flex flex-col h-full overflow-hidden">
              {/* Album Header */}
              <div className="text-center mb-3 sm:mb-4 shrink-0">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/80 via-sky-600/80 to-blue-600/80 px-4 py-1 rounded-full border border-cyan-200 shadow-md mb-1.5">
                  <Camera className="w-4 h-4 text-cyan-200 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black tracking-wider text-cyan-100">
                    愛莎公主的冰雪回憶錄
                  </span>
                </div>

                <h2
                  className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300"
                  style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}
                >
                  📸 冰雪城堡魔法相簿
                </h2>

                <p className="text-xs sm:text-sm text-cyan-200 mt-0.5">
                  記錄你用數學魔法建造城堡的每一個精彩瞬間！點擊相片可放大賞玩 ✨
                </p>

                {/* Progress Bar Ribbon */}
                <div className="flex items-center justify-center gap-3 mt-2.5 max-w-md mx-auto">
                  <div className="flex-1 bg-sky-950/80 rounded-full h-3.5 border border-cyan-400/50 p-0.5 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(unlockedCount / totalEntries) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-yellow-300 rounded-full shadow-xs"
                    />
                  </div>
                  <span className="text-xs font-black text-amber-300 whitespace-nowrap bg-sky-900/90 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                    已收集 {unlockedCount} / {totalEntries} 張相片 💎
                  </span>
                </div>
              </div>

              {/* Photo Cards Grid */}
              <div className="flex-1 overflow-y-auto pr-1 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {CASTLE_ALBUM_ENTRIES.map((entry, idx) => {
                  const isUnlocked = stars >= entry.starsRequired;
                  return (
                    <motion.div
                      key={entry.stage}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleOpenDetail(idx)}
                      className={`relative rounded-3xl p-3 sm:p-3.5 border-3 transition-all flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-white/95 via-sky-50/95 to-cyan-100/95 border-cyan-300 text-sky-950 shadow-[0_10px_25px_rgba(2,132,199,0.35)] hover:shadow-[0_15px_35px_rgba(56,189,248,0.5)]'
                          : 'bg-gradient-to-b from-sky-950/60 to-slate-900/60 border-white/20 text-sky-200/60 backdrop-blur-xs opacity-75 hover:opacity-90'
                      }`}
                    >
                      {/* Photo Top Pin / Clip Decors */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-cyan-300/60 rounded-full border border-white/80 shadow-xs" />

                      {/* Polaroid Photo Image Canvas */}
                      <div
                        className={`relative w-full h-32 sm:h-36 rounded-2xl flex items-center justify-center overflow-hidden border-2 mb-2 ${
                          isUnlocked
                            ? 'bg-gradient-to-b from-[#0b335a] via-[#104374] to-[#08233f] border-cyan-200 shadow-inner'
                            : 'bg-slate-900/80 border-dashed border-white/30'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            {/* Render exact stage's scalable castle */}
                            <LiveIceCastle
                              stars={entry.starsRequired}
                              forceStage={entry.stage}
                              size="mini"
                              interactive={false}
                              showBadge={false}
                            />
                            {/* Sticker stamp in corner */}
                            <div className="absolute top-1.5 right-1.5 bg-white/90 text-sky-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-cyan-300 shadow-xs">
                              {entry.sticker}
                            </div>
                            {/* Click to zoom indicator */}
                            <div className="absolute bottom-1.5 right-1.5 bg-sky-950/70 text-cyan-200 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <Maximize2 className="w-2.5 h-2.5" />
                              <span>賞玩</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-3">
                            <div className="w-10 h-10 rounded-2xl bg-sky-900/70 border border-white/30 flex items-center justify-center mb-1 text-white/80">
                              <Lock className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black text-amber-300">
                              需 {entry.starsRequired} 顆 ⭐
                            </span>
                            <span className="text-[10px] text-cyan-200/70 mt-0.5">
                              答題解鎖相片
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Photo Description Bottom Info */}
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4
                            className={`text-xs sm:text-sm font-black truncate ${
                              isUnlocked ? 'text-sky-950' : 'text-white/70'
                            }`}
                          >
                            {entry.photoTitle}
                          </h4>
                          {isUnlocked ? (
                            <span className="shrink-0 text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-300">
                              已收藏 ✓
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-black text-amber-300 bg-sky-900/90 px-1.5 py-0.2 rounded-full border border-amber-400/40">
                              {entry.starsRequired}⭐
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-[11px] leading-tight line-clamp-2 ${
                            isUnlocked ? 'text-sky-800' : 'text-white/50'
                          }`}
                        >
                          {isUnlocked ? entry.subtitle : `再獲得 ${entry.starsRequired - stars} 顆星星即可揭曉這張城堡照片！`}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: FULL DETAIL POLAROID INSPECTOR ================= */
            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-full border border-white/60 text-xs sm:text-sm font-black cursor-pointer transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>返回相簿目錄</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-cyan-200 bg-sky-900/80 px-3 py-1 rounded-full border border-cyan-400/40">
                    第 {selectedPhotoIndex + 1} / {totalEntries} 頁
                  </span>
                </div>
              </div>

              {/* Central Large Photo Frame */}
              <motion.div
                key={selectedPhotoIndex}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gradient-to-b from-white via-sky-50 to-cyan-50 rounded-3xl sm:rounded-[36px] p-4 sm:p-5 border-4 border-cyan-300 shadow-[0_20px_50px_rgba(2,132,199,0.45)] text-sky-950 flex flex-col items-center overflow-hidden my-auto"
              >
                {/* Floating Magical Sparkles Animation */}
                {isMagicSparkling && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{
                          opacity: [1, 1, 0],
                          scale: [0.5, 1.4, 0.8],
                          x: (Math.random() - 0.5) * 320,
                          y: (Math.random() - 0.5) * 240,
                        }}
                        transition={{ duration: 1.5, delay: i * 0.05 }}
                        className="absolute text-xl sm:text-2xl text-cyan-400"
                      >
                        {i % 2 === 0 ? '✨' : '❄️'}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Polaroid Upper Photo Canvas with Real Scalable Castle */}
                <div className="relative w-full h-52 sm:h-64 bg-gradient-to-b from-[#0b335a] via-[#104374] to-[#08233f] rounded-2xl border-2 border-cyan-300 shadow-inner flex flex-col items-center justify-end overflow-hidden p-2">
                  {/* Photo Corner Label Badge */}
                  <div className="absolute top-2.5 left-3 z-10 bg-white/90 text-sky-950 px-2.5 py-1 rounded-full text-xs font-black border border-cyan-300 shadow-sm flex items-center gap-1">
                    <span>{activePhoto.characterEmoji}</span>
                    <span>{activePhoto.unlockedCharacter}</span>
                  </div>

                  <div className="absolute top-2.5 right-3 z-10 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 px-3 py-1 rounded-full text-xs font-black shadow-sm border border-white">
                    {activePhoto.sticker}
                  </div>

                  {isActiveUnlocked ? (
                    <LiveIceCastle
                      stars={activePhoto.starsRequired}
                      forceStage={activePhoto.stage}
                      size={window.innerWidth < 640 ? 'sm' : 'md'}
                      interactive={false}
                      showBadge={false}
                      isCelebrating={isMagicSparkling}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center my-auto p-4 text-center">
                      <div className="w-14 h-14 rounded-3xl bg-sky-900/80 border-2 border-dashed border-white/40 flex items-center justify-center text-2xl text-white/80 mb-2">
                        <Lock className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-black text-amber-300">
                        這張城堡相片尚未解鎖
                      </h4>
                      <p className="text-xs text-cyan-200 mt-1 max-w-xs">
                        目前擁有 {stars} 顆星星，還需要 {activePhoto.starsRequired - stars} 顆魔法星星解鎖！
                      </p>
                    </div>
                  )}
                </div>

                {/* Photo Story & Elsa Voice Note */}
                <div className="w-full mt-3 text-left">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-black text-sky-950 flex items-center gap-1.5">
                      <span>{activePhoto.photoTitle}</span>
                      {isActiveUnlocked && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </h3>
                    <span className="text-xs font-black text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full">
                      第 {activePhoto.stage} 階段城堡 🏰
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                    {activePhoto.description}
                  </p>

                  {/* Elsa Memory Speech Ribbon */}
                  {isActiveUnlocked && (
                    <div className="mt-2.5 bg-gradient-to-r from-cyan-100 via-sky-100 to-white p-2.5 sm:p-3 rounded-2xl border-2 border-cyan-200 shadow-xs flex items-start gap-2.5">
                      <span className="text-2xl shrink-0 animate-bounce">👑</span>
                      <div>
                        <span className="text-[10px] font-black text-cyan-800 bg-cyan-200/80 px-2 py-0.2 rounded-full">
                          愛莎公主的回憶留言 💬
                        </span>
                        <p className="text-xs sm:text-sm font-black text-sky-950 mt-0.5">
                          {activePhoto.elsaMemoryQuote}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Interactive Action Controls */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 w-full flex-wrap">
                  {isActiveUnlocked && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleMagicSparkle}
                        className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-200" />
                        <span>施放冰雪魔法 ❄️</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCameraSnap}
                        className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-amber-950" />
                        <span>拍立得快照 📸</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Bottom Carousel Arrow Controls */}
              <div className="flex items-center justify-between gap-3 mt-2 shrink-0">
                <button
                  onClick={handlePrev}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-2xl border border-white/50 text-xs sm:text-sm font-black flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一張</span>
                </button>

                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="bg-gradient-to-r from-cyan-400 to-sky-500 text-sky-950 py-2 px-5 rounded-2xl font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95"
                >
                  相簿清單
                </button>

                <button
                  onClick={handleNext}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-2xl border border-white/50 text-xs sm:text-sm font-black flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <span>下一張</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
