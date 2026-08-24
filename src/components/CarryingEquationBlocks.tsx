import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Minus, RotateCcw, Wand2, Lightbulb, Hand } from 'lucide-react';
import { GameLevel, GamePhase } from '../types';

interface CarryingEquationBlocksProps {
  num1: number;
  num2: number;
  level: GameLevel;
  phase: GamePhase;
  gridAnswerUnits: string | null;
  grid: {
    topTens: string | null;
    topUnits: string | null;
    bottomTens: string | null;
    bottomUnits: string | null;
    answerTens: string | null;
    answerUnits: string | null;
  };
  playSound: (type: 'pop' | 'correct' | 'error' | 'tap' | 'magic') => void;
}

export function CarryingEquationBlocks({
  num1,
  num2,
  level,
  phase,
  gridAnswerUnits,
  grid,
  playSound,
}: CarryingEquationBlocksProps) {
  const tens1 = Math.floor(num1 / 10);
  const units1 = num1 % 10;
  const tens2 = Math.floor(num2 / 10);
  const units2 = num2 % 10;

  const isSubtraction = level === 'subtraction';
  const hasCarry = !isSubtraction && units1 + units2 >= 10;

  // Block display mode: 'smart' (default: intelligent auto-matching question blocks) vs 'diy' (optional: tap to add blocks manually)
  const [mode, setMode] = useState<'smart' | 'diy'>(() => {
    try {
      const saved = localStorage.getItem('elsa_block_mode');
      return saved === 'diy' ? 'diy' : 'smart';
    } catch {
      return 'smart';
    }
  });

  // Switch mode with persistence
  const handleSwitchMode = (newMode: 'smart' | 'diy') => {
    playSound('tap');
    setMode(newMode);
    try {
      localStorage.setItem('elsa_block_mode', newMode);
    } catch {
      // ignore
    }
  };

  // DIY self-building blocks state
  const [diyUnits, setDiyUnits] = useState<number>(0);
  const [diyTens, setDiyTens] = useState<number>(0);

  // Preset reference mode state
  const [bundleState, setBundleState] = useState<'idle' | 'gathering' | 'bundled'>('idle');
  const [clickedUnits, setClickedUnits] = useState<number[]>([]);
  const [clickedTens, setClickedTens] = useState<number[]>([]);

  // When question changes, reset counts
  useEffect(() => {
    setBundleState('idle');
    setClickedUnits([]);
    setClickedTens([]);
    setDiyUnits(0);
    setDiyTens(0);
  }, [num1, num2]);

  // Auto-bundle in preset mode when answer units is entered or phase advances
  useEffect(() => {
    if (
      hasCarry &&
      bundleState === 'idle' &&
      (gridAnswerUnits !== null || phase === 'calc_tens' || phase === 'success')
    ) {
      setBundleState('bundled');
      if (clickedUnits.length < 10) {
        setClickedUnits(Array.from({ length: 10 }, (_, i) => i));
      }
    }
  }, [hasCarry, gridAnswerUnits, phase, bundleState, clickedUnits.length]);

  // --- DIY Actions (親手放積木) ---
  const handleAddDiyUnit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (diyUnits >= 30) return;
    playSound('pop');
    setDiyUnits((prev) => prev + 1);
  };

  const handleRemoveDiyUnit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (diyUnits <= 0) return;
    playSound('tap');
    setDiyUnits((prev) => Math.max(0, prev - 1));
  };

  const handleAddDiyTen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (diyTens >= 9) return;
    playSound('magic');
    setDiyTens((prev) => prev + 1);
  };

  const handleRemoveDiyTen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (diyTens <= 0) return;
    playSound('tap');
    setDiyTens((prev) => Math.max(0, prev - 1));
  };

  const handleBundleDiy = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (diyUnits < 10) return;
    playSound('correct');
    setDiyUnits((prev) => prev - 10);
    setDiyTens((prev) => prev + 1);
  };

  const handleResetDiy = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('tap');
    setDiyUnits(0);
    setDiyTens(0);
  };

  const handlePresetFirstNum = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('magic');
    setDiyTens(tens1);
    setDiyUnits(units1);
  };

  // --- Preset Reference Actions ---
  const handleUnitClick = (index: number) => {
    if (hasCarry && bundleState === 'gathering') return;
    playSound('tap');
    if (!clickedUnits.includes(index)) {
      const newClicked = [...clickedUnits, index];
      setClickedUnits(newClicked);

      if (hasCarry && newClicked.length === 10) {
        setBundleState('gathering');
        playSound('correct');
        setTimeout(() => {
          setBundleState('bundled');
        }, 1200);
      }
    }
  };

  const handleTenClick = (index: number) => {
    playSound('tap');
    if (!clickedTens.includes(index)) {
      setClickedTens([...clickedTens, index]);
    }
  };

  const handleToggleBundle = () => {
    if (!hasCarry) return;
    if (bundleState === 'idle') {
      setClickedUnits(Array.from({ length: 10 }, (_, i) => i));
      setBundleState('gathering');
      setTimeout(() => setBundleState('bundled'), 1200);
    } else {
      setBundleState('idle');
      setClickedUnits([]);
    }
  };

  // Render an Ice Crystal Ten Rod (10 segments)
  const renderTenBlock = (
    index: number,
    isCarried: boolean = false,
    isCrossed: boolean = false,
    isInteractiveDiy: boolean = false
  ) => {
    const isClicked = clickedTens.includes(index);
    const clickNumber = isClicked && !isCrossed ? clickedTens.indexOf(index) + 1 : null;

    return (
      <motion.div
        key={`ten-${index}`}
        onClick={(e) => {
          if (isInteractiveDiy) {
            handleAddDiyTen(e);
          } else if (!isCrossed) {
            handleTenClick(index);
          }
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex items-center justify-center cursor-pointer select-none"
      >
        <div
          className={`w-3.5 sm:w-4 md:w-5 h-11 sm:h-13 md:h-16 rounded-md border-2 shadow-sm flex flex-col justify-between overflow-hidden relative transition-all ${
            isCrossed
              ? 'bg-slate-200/80 border-slate-300 cursor-not-allowed opacity-60'
              : isCarried
              ? 'border-yellow-400 bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-600 ring-3 ring-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.8)]'
              : 'border-cyan-300 bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-600 shadow-[0_2px_6px_rgba(2,132,199,0.3)]'
          } ${isClicked && !isCarried && !isCrossed ? 'brightness-125 ring-2 ring-cyan-200' : ''}`}
        >
          {/* 10 segmented crystal layers */}
          {Array.from({ length: 9 }).map((_, segIdx) => (
            <div
              key={segIdx}
              className={`w-full border-b ${
                isCrossed ? 'border-slate-300' : 'border-cyan-200/60'
              }`}
            />
          ))}
          {isCrossed && (
            <div className="absolute inset-0 flex items-center justify-center text-rose-500 text-lg font-black z-10">
              ×
            </div>
          )}
        </div>
        {clickNumber && (
          <span className="absolute text-white font-black text-[11px] sm:text-[13px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] z-10">
            {clickNumber}
          </span>
        )}
      </motion.div>
    );
  };

  // Render an Amber/Crystal Unit Cube
  const renderUnitBlock = (
    index: number,
    isCrossed: boolean = false,
    isInteractiveDiy: boolean = false
  ) => {
    const isClicked = clickedUnits.includes(index);
    const clickIndex = clickedUnits.indexOf(index);

    let clickNumber: number | null = null;
    if (isInteractiveDiy) {
      clickNumber = index + 1;
    } else if (isClicked && !isCrossed) {
      if (hasCarry) {
        if (clickIndex < 10) {
          clickNumber = clickIndex + 1;
        } else {
          clickNumber = clickIndex - 9;
        }
      } else {
        clickNumber = clickIndex + 1;
      }
    }

    if (!isInteractiveDiy && hasCarry && bundleState === 'bundled' && isClicked && clickIndex < 10) {
      return null;
    }

    const isGatheringTarget =
      !isInteractiveDiy &&
      hasCarry &&
      bundleState === 'gathering' &&
      isClicked &&
      clickIndex < 10;

    return (
      <motion.div
        key={`u-${index}`}
        onClick={(e) => {
          if (isInteractiveDiy) {
            handleAddDiyUnit(e);
          } else if (!isCrossed) {
            handleUnitClick(index);
          }
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={isGatheringTarget ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.88 }}
        transition={{ duration: isGatheringTarget ? 0.4 : 0.2 }}
        className={`relative w-5 h-5 sm:w-6 sm:h-6 md:w-6.5 md:h-6.5 rounded-md border-2 shadow-xs flex items-center justify-center transition-all select-none cursor-pointer ${
          isCrossed
            ? 'bg-slate-200 border-slate-300 cursor-not-allowed opacity-60'
            : isClicked || isInteractiveDiy
            ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 border-amber-600 ring-2 ring-yellow-300 shadow-[0_2px_8px_rgba(245,158,11,0.4)]'
            : 'bg-gradient-to-br from-amber-200 via-amber-300 to-orange-400 border-amber-400 hover:from-amber-100 hover:to-amber-300'
        }`}
      >
        {isCrossed && (
          <div className="absolute inset-0 flex items-center justify-center text-rose-500 text-xs font-black z-10">
            ×
          </div>
        )}
        {clickNumber && (
          <span className="text-amber-950 font-black text-[10px] sm:text-[11px] drop-shadow-xs z-10">
            {clickNumber}
          </span>
        )}
      </motion.div>
    );
  };

  const showTopTens =
    grid.topTens !== null ||
    phase === 'calc_units' ||
    phase === 'calc_tens' ||
    phase === 'success';
  const showTopUnits =
    grid.topUnits !== null ||
    phase === 'calc_units' ||
    phase === 'calc_tens' ||
    phase === 'success';
  const showBottomTens =
    grid.bottomTens !== null ||
    phase === 'calc_units' ||
    phase === 'calc_tens' ||
    phase === 'success';
  const showBottomUnits =
    grid.bottomUnits !== null ||
    phase === 'calc_units' ||
    phase === 'calc_tens' ||
    phase === 'success';

  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-full">
      {/* Top Mode Selector Option Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 p-1 bg-white/70 backdrop-blur-xs rounded-full border border-sky-200/80 shadow-xs">
        <button
          onClick={() => handleSwitchMode('smart')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
            mode === 'smart'
              ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md ring-2 ring-cyan-300 scale-102'
              : 'text-slate-600 hover:text-sky-800 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🌟 智能題目積木</span>
        </button>

        <button
          onClick={() => handleSwitchMode('diy')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
            mode === 'diy'
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 shadow-md ring-2 ring-amber-300 scale-102'
              : 'text-slate-600 hover:text-amber-800 hover:bg-white/60'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>🪄 自選動手放積木</span>
        </button>
      </div>

      {/* ===================== MODE 1: SMART AUTOMATIC QUESTION BLOCKS (PRESERVED & DEFAULT) ===================== */}
      {mode === 'smart' ? (
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-2 sm:gap-3 md:gap-4 items-end justify-center select-none pr-1">
            {/* Tens Column (十位棒區) */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="text-[11px] sm:text-xs font-black text-cyan-700 bg-white/70 px-2 py-0.5 rounded-full mb-1 border border-cyan-200">
                十位棒
              </div>

              {/* Carried Ten Rod Slot at top */}
              <div className="h-10 sm:h-12 md:h-14 flex items-center justify-center w-full">
                {hasCarry && bundleState === 'bundled' && (
                  <motion.div
                    layoutId="bundle-anim"
                    className="relative flex items-center justify-center z-30 cursor-pointer"
                    transition={{ type: 'spring', stiffness: 70, damping: 14 }}
                    onClick={() => handleTenClick(tens1 + tens2)}
                    whileHover={{ scale: !clickedTens.includes(tens1 + tens2) ? 1.1 : 1 }}
                    whileTap={{ scale: !clickedTens.includes(tens1 + tens2) ? 0.9 : 1 }}
                  >
                    <div
                      className={`w-3.5 sm:w-4 md:w-5 h-10 sm:h-12 md:h-14 rounded-md border-2 border-yellow-400 bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-600 shadow-[0_0_12px_rgba(250,204,21,0.8)] flex flex-col justify-between overflow-hidden ring-3 ring-yellow-300 ${
                        clickedTens.includes(tens1 + tens2) ? 'brightness-125' : ''
                      }`}
                    >
                      {Array.from({ length: 9 }).map((_, segIdx) => (
                        <div key={segIdx} className="w-full border-b border-cyan-200/60" />
                      ))}
                    </div>
                    {clickedTens.includes(tens1 + tens2) && (
                      <span className="absolute text-white font-black text-[11px] sm:text-[13px] drop-shadow-md z-10">
                        {clickedTens.indexOf(tens1 + tens2) + 1}
                      </span>
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full shadow-md border border-yellow-600 animate-bounce whitespace-nowrap z-20"
                    >
                      +1 🌟
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Tens Frame Box */}
              <div className="relative border-2 border-dashed border-cyan-300 bg-white/60 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl flex flex-col items-center gap-1.5 min-w-[55px] sm:min-w-[70px] md:min-w-[85px] min-h-[90px] shadow-inner">
                {/* Top Row Tens */}
                <div className="flex flex-wrap gap-1 max-w-[80px] md:max-w-[100px] justify-center min-h-[35px] items-center">
                  {showTopTens &&
                    Array.from({ length: tens1 }).map((_, i) => {
                      const isCrossed = isSubtraction && showBottomTens && i >= tens1 - tens2;
                      return renderTenBlock(i, false, isCrossed);
                    })}
                </div>

                {/* Divider line for addition */}
                {!isSubtraction && showBottomTens && tens2 > 0 && (
                  <div className="w-full border-b-2 border-dashed border-cyan-300/80" />
                )}

                {/* Bottom Row Tens */}
                {!isSubtraction && (
                  <div className="flex flex-wrap gap-1 max-w-[80px] md:max-w-[100px] justify-center min-h-[35px] items-center">
                    {showBottomTens &&
                      Array.from({ length: tens2 }).map((_, i) =>
                        renderTenBlock(tens1 + i, false, false)
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Units Column (個位積木區) */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="text-[11px] sm:text-xs font-black text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-full mb-1 border border-amber-200">
                個位粒
              </div>

              {/* Auto Bundle Toggle Button */}
              <div className="h-10 sm:h-12 md:h-14 flex items-center justify-center">
                {hasCarry && (
                  <button
                    onClick={handleToggleBundle}
                    className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-amber-950 text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-full shadow-md border border-amber-300 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap z-20"
                  >
                    <span>{bundleState !== 'idle' ? '↺ 重數' : '🪄 滿10進位'}</span>
                  </button>
                )}
              </div>

              {/* Units Box */}
              <div className="relative border-2 border-dashed border-amber-300 bg-amber-50/60 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl flex flex-col items-center gap-1.5 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] min-h-[90px] shadow-inner">
                {hasCarry && bundleState === 'gathering' && (
                  <motion.div
                    layoutId="bundle-anim"
                    className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                  >
                    <div className="w-3.5 sm:w-4 md:w-5 h-10 sm:h-12 md:h-14 rounded-md border-2 border-yellow-400 bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-600 shadow-[0_0_16px_rgba(250,204,21,1)] flex flex-col justify-between overflow-hidden ring-3 ring-yellow-300">
                      {Array.from({ length: 9 }).map((_, segIdx) => (
                        <div key={segIdx} className="w-full border-b border-cyan-200/60" />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Units grid */}
                <div className="flex flex-col gap-1.5 items-center">
                  {/* Top row units */}
                  <div className="flex flex-wrap gap-1 max-w-[75px] sm:max-w-[95px] justify-center">
                    {showTopUnits &&
                      Array.from({ length: units1 }).map((_, i) => {
                        const globalIndex = i;
                        const isCrossed = isSubtraction && showBottomUnits && i >= units1 - units2;
                        return renderUnitBlock(globalIndex, isCrossed);
                      })}
                  </div>

                  {/* Divider line for addition */}
                  {!isSubtraction && showBottomUnits && units2 > 0 && bundleState !== 'bundled' && (
                    <div className="w-full border-b-2 border-dashed border-amber-300/80" />
                  )}

                  {/* Bottom row units */}
                  {!isSubtraction && (
                    <div className="flex flex-wrap gap-1 max-w-[75px] sm:max-w-[95px] justify-center">
                      {showBottomUnits &&
                        Array.from({ length: units2 }).map((_, i) => {
                          const globalIndex = units1 + i;
                          return renderUnitBlock(globalIndex, false);
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1.5 text-[10px] sm:text-xs text-sky-800/80 font-bold flex items-center gap-1">
            <span>💡 輕點積木可以發光數數喔！</span>
          </div>
        </div>
      ) : (
        /* ===================== MODE 2: DIY ACTIVE THINKING / TAP-TO-ADD BLOCKS (OPTIONAL) ===================== */
        <div className="flex flex-col items-center w-full">
          {/* Action Toolbar: Add / Remove / Quick-Setup */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-2">
            {/* Big Primary "+1 粒" Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => handleAddDiyUnit(e)}
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black text-xs sm:text-sm px-3 sm:px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(245,158,11,0.45)] border-2 border-white flex items-center gap-1.5 cursor-pointer ring-2 ring-amber-300"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>加 1 粒 (點橙盒)</span>
              <span className="bg-amber-100/90 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {diyUnits}
              </span>
            </motion.button>

            {/* Minus 1 Unit Button */}
            {diyUnits > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleRemoveDiyUnit(e)}
                className="bg-white/80 hover:bg-white text-rose-700 font-black text-xs px-2.5 py-1.5 rounded-full shadow-xs border border-rose-200 flex items-center gap-1 cursor-pointer"
                title="拿走 1 粒個位"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
                <span>減 1 粒</span>
              </motion.button>
            )}

            {/* Bundle into Ten Rod (When units >= 10) */}
            {diyUnits >= 10 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => handleBundleDiy(e)}
                className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-yellow-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-md border-2 border-yellow-200 flex items-center gap-1 cursor-pointer ring-2 ring-yellow-400"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>🪄 滿10粒換十位棒！</span>
              </motion.button>
            )}

            {/* Add 1 Ten Rod (+10) Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleAddDiyTen(e)}
              className="bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-300 hover:to-cyan-400 text-white font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-full shadow-xs border border-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>加十位棒 (點藍盒)</span>
            </motion.button>

            {/* Minus 1 Ten Rod Button */}
            {diyTens > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleRemoveDiyTen(e)}
                className="bg-white/80 hover:bg-white text-cyan-800 font-black text-xs px-2.5 py-1.5 rounded-full shadow-xs border border-cyan-200 flex items-center gap-1 cursor-pointer"
                title="拿走 1 根十位棒"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
                <span>減十位棒</span>
              </motion.button>
            )}

            {/* Reset / Preset helpers */}
            {(diyUnits > 0 || diyTens > 0) && (
              <button
                onClick={(e) => handleResetDiy(e)}
                className="text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                title="清空重新數"
              >
                <RotateCcw className="w-3 h-3" />
                <span>清空</span>
              </button>
            )}

            {diyUnits === 0 && diyTens === 0 && (
              <button
                onClick={(e) => handlePresetFirstNum(e)}
                className="text-cyan-800 hover:text-cyan-950 bg-cyan-100/80 hover:bg-cyan-100 text-[11px] font-black px-2.5 py-1.5 rounded-full border border-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3 text-cyan-600" />
                <span>先放第 1 個數 ({num1})</span>
              </button>
            )}
          </div>

          {/* Interactive Ice Block Counting Board */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 items-end justify-center select-none w-full">
            {/* Tens Column (十位棒區 - 藍色盒) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleAddDiyTen(e)}
              className="flex flex-col items-center justify-center relative cursor-pointer group"
              title="點擊藍色區域任意處即可加 1 根十位棒"
            >
              <div className="text-[11px] sm:text-xs font-black text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full mb-1 border border-cyan-300 shadow-2xs group-hover:bg-cyan-200 transition-colors flex items-center gap-1">
                <span>十位棒 ({diyTens})</span>
                <span className="text-[10px] text-cyan-600 font-normal">+1</span>
              </div>

              {/* Tens Frame Box */}
              <div className="relative border-2 border-dashed border-cyan-400 bg-sky-50/80 group-hover:bg-sky-100/80 group-hover:border-cyan-500 backdrop-blur-xs p-1.5 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[65px] sm:min-w-[80px] md:min-w-[95px] min-h-[110px] shadow-inner transition-all">
                {diyTens === 0 ? (
                  <div className="flex flex-col items-center justify-center py-2 px-1 text-center pointer-events-none">
                    <span className="text-xl sm:text-2xl animate-bounce mb-1">🟦</span>
                    <span className="text-xs font-black text-cyan-800">
                      點藍盒加十位棒
                    </span>
                    <span className="text-[10px] font-bold text-cyan-600/80">
                      (+10)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1 max-w-[85px] md:max-w-[105px] justify-center items-center">
                    {Array.from({ length: diyTens }).map((_, i) =>
                      renderTenBlock(i, false, false, true)
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Units Column (個位積木區 - 橙色盒) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleAddDiyUnit(e)}
              className="flex flex-col items-center justify-center relative cursor-pointer group"
              title="點擊橙色區域任意處即可加 1 粒個位積木"
            >
              <div className="text-[11px] sm:text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full mb-1 border border-amber-300 shadow-2xs group-hover:bg-amber-200 transition-colors flex items-center gap-1">
                <span>個位粒 ({diyUnits})</span>
                <span className="text-[10px] text-amber-700 font-normal">+1</span>
              </div>

              {/* Units Frame Box: Click anywhere to add +1 unit */}
              <div className="relative border-2 border-dashed border-amber-400 bg-amber-50/90 group-hover:bg-amber-100/90 group-hover:border-amber-500 backdrop-blur-xs p-1.5 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[95px] sm:min-w-[130px] md:min-w-[150px] min-h-[110px] shadow-inner transition-all">
                {diyUnits === 0 ? (
                  <div className="flex flex-col items-center justify-center py-2 px-1 text-center pointer-events-none">
                    <span className="text-xl sm:text-2xl animate-bounce mb-1">🧊</span>
                    <span className="text-xs font-black text-amber-800">
                      點橙盒加 1 粒！
                    </span>
                    <span className="text-[10px] font-bold text-amber-700/80">
                      任意位置點擊都能加
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-w-[100px] sm:max-w-[135px] justify-center items-center">
                    {Array.from({ length: diyUnits }).map((_, i) =>
                      renderUnitBlock(i, false, true)
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Child-Friendly Thinking Banner */}
          <div className="mt-2 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-amber-300 shadow-xs text-center flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-xs font-black text-amber-950">
              💡 目前手動數出：
              <span className="text-sm text-orange-600 font-black mx-1">
                {diyTens * 10 + diyUnits}
              </span>
              {diyTens > 0 ? `(${diyTens} 根十位 + ${diyUnits} 粒個位)` : '粒'}
            </span>
            <span className="text-[10px] text-slate-500 font-bold">
              (點橙色/藍色盒任意處都能一直加積木)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

