import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  playSound: (type: 'pop' | 'correct' | 'error' | 'tap') => void;
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

  const totalUnits = units1 + units2;
  const remainingUnits = totalUnits % 10;

  const [bundleState, setBundleState] = useState<'idle' | 'gathering' | 'bundled'>('idle');
  const [clickedUnits, setClickedUnits] = useState<number[]>([]);
  const [clickedTens, setClickedTens] = useState<number[]>([]);

  useEffect(() => {
    setBundleState('idle');
    setClickedUnits([]);
    setClickedTens([]);
  }, [num1, num2]);

  // Auto-bundle when answer units is entered or phase advances
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
  const renderTenBlock = (index: number, isCarried: boolean = false, isCrossed: boolean = false) => {
    const isClicked = clickedTens.includes(index);
    const clickNumber = isClicked && !isCrossed ? clickedTens.indexOf(index) + 1 : null;

    return (
      <motion.div
        key={`ten-${index}`}
        onClick={() => !isCrossed && handleTenClick(index)}
        whileHover={{ scale: !isCrossed && !isClicked ? 1.08 : 1 }}
        whileTap={{ scale: !isCrossed && !isClicked ? 0.92 : 1 }}
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
  const renderUnitBlock = (index: number, isCrossed: boolean = false) => {
    const isClicked = clickedUnits.includes(index);
    const clickIndex = clickedUnits.indexOf(index);

    let clickNumber = null;
    if (isClicked && !isCrossed) {
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

    if (hasCarry && bundleState === 'bundled' && isClicked && clickIndex < 10) {
      return null;
    }

    const isGatheringTarget =
      hasCarry && bundleState === 'gathering' && isClicked && clickIndex < 10;

    return (
      <motion.div
        key={`u-${index}`}
        onClick={() => !isCrossed && handleUnitClick(index)}
        animate={isGatheringTarget ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        whileHover={{ scale: !isCrossed && !isClicked ? 1.15 : 1 }}
        whileTap={{ scale: !isCrossed && !isClicked ? 0.88 : 1 }}
        transition={{ duration: isGatheringTarget ? 0.4 : 0 }}
        className={`relative w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 rounded-md border-2 shadow-xs flex items-center justify-center transition-all select-none cursor-pointer ${
          isCrossed
            ? 'bg-slate-200 border-slate-300 cursor-not-allowed opacity-60'
            : isClicked
            ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 border-amber-600 ring-2 ring-yellow-300'
            : 'bg-gradient-to-br from-amber-200 via-amber-300 to-orange-400 border-amber-400 hover:from-amber-100 hover:to-amber-300'
        }`}
      >
        {isCrossed && (
          <div className="absolute inset-0 flex items-center justify-center text-rose-500 text-xs font-black z-10">
            ×
          </div>
        )}
        {clickNumber && (
          <span className="text-amber-950 font-black text-[9px] sm:text-[11px] drop-shadow-xs z-10">
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
  );
}
