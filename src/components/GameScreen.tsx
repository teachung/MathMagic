import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Smile, Castle } from 'lucide-react';
import { Question, GameLevel, GamePhase } from '../types';
import { IceFairy } from './IceFairy';
import { ElsaPrincess } from './ElsaPrincess';
import { SnowflakeBurst } from './SnowflakeBurst';
import { IceScroll } from './IceScroll';
import { IceCastleGrowthCard } from './IceCastleGrowthCard';
import { CastleGrowthCelebrationModal } from './CastleGrowthCelebrationModal';
import { CarryingEquationBlocks } from './CarryingEquationBlocks';
import { CASTLE_MILESTONES, ELSA_QUOTES } from '../storyData';

interface GameScreenProps {
  question: Question;
  phase: GamePhase;
  grid: {
    topTens: string | null;
    topUnits: string | null;
    bottomTens: string | null;
    bottomUnits: string | null;
    answerTens: string | null;
    answerUnits: string | null;
  };
  placedDigits: {
    num1Tens: boolean;
    num1Units: boolean;
    num2Tens: boolean;
    num2Units: boolean;
  };
  activeDigit: {
    source: 'num1' | 'num2';
    place: 'tens' | 'units';
    value: string;
  } | null;
  stars: number;
  level: GameLevel;
  errorCell:
    | 'topTens'
    | 'topUnits'
    | 'bottomTens'
    | 'bottomUnits'
    | 'answerTens'
    | 'answerUnits'
    | null;
  errorDigit: { source: 'num1' | 'num2'; place: 'tens' | 'units' } | null;
  onGridCellClick: (
    cell: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits'
  ) => void;
  onDigitClick: (
    source: 'num1' | 'num2',
    place: 'tens' | 'units',
    value: string
  ) => void;
  onNumpadClick: (num: number) => void;
  onNext: () => void;
  onBack: () => void;
  requireCalc: boolean;
  onToggleRequireCalc: () => void;
  playSound: (type: 'pop' | 'correct' | 'error' | 'tap' | 'magic') => void;
  onOpenCastle: () => void;
  onOpenAlbum?: () => void;
}

export function GameScreen({
  question,
  phase,
  grid,
  placedDigits,
  activeDigit,
  stars,
  level,
  errorCell,
  errorDigit,
  onGridCellClick,
  onDigitClick,
  onNumpadClick,
  onNext,
  onBack,
  requireCalc,
  onToggleRequireCalc,
  playSound,
  onOpenCastle,
  onOpenAlbum,
}: GameScreenProps) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-sky-100 rounded-3xl shadow-xl border-4 border-white text-center my-auto">
        <p className="text-xl font-bold text-sky-900 mb-4">載入題目中...</p>
        <button
          onClick={onBack}
          className="bg-sky-500 text-white font-bold px-6 py-2 rounded-xl shadow-md cursor-pointer"
        >
          返回主選單
        </button>
      </div>
    );
  }

  const hasCarry =
    question.operator === '+' &&
    (question.num1 % 10) + (question.num2 % 10) >= 10;

  // Calculate current castle stage (0 to 5)
  let currentStage = 0;
  CASTLE_MILESTONES.forEach((m) => {
    if (stars >= m.starsRequired) {
      currentStage = m.castleStage;
    }
  });

  // Dynamic Elsa quote based on phase
  let elsaDialogue = '冰雪魔法！加油！❄️';
  if (phase === 'arrange') {
    elsaDialogue = '把橫式數字排到直式格子裡吧！';
  } else if (phase === 'calc_units') {
    elsaDialogue = hasCarry
      ? '個位滿十進一囉！算算個位剩幾粒？'
      : '太好了！先算算看個位數是多少！';
  } else if (phase === 'calc_tens') {
    elsaDialogue = hasCarry
      ? '加上進位的魔法棒，十位共是多少？'
      : '現在來計算十位數是多少！';
  } else if (phase === 'success') {
    elsaDialogue = '太神奇了！城堡的冰晶又更璀璨了！✨';
  }

  return (
    <div className="relative flex flex-col w-full flex-1 max-w-6xl mx-auto select-none p-2 sm:p-4 md:p-6">
      {/* ===================== TOP HEADER BAR ===================== */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4 px-1 flex-wrap">
        {/* Left: Heraldic Shield Back Button + Title */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Shield Back Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onBack}
            className="relative w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-18 flex flex-col items-center justify-center cursor-pointer drop-shadow-[0_4px_10px_rgba(8,30,60,0.4)] shrink-0"
          >
            <svg
              viewBox="0 0 60 70"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="50%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              <path
                d="M 6 4 L 54 4 C 54 4, 56 38, 30 66 C 4 38, 6 4, 6 4 Z"
                fill="url(#shieldGrad)"
                stroke="#ffffff"
                strokeWidth="3.5"
              />
              <path
                d="M 12 10 L 48 10 C 48 10, 50 36, 30 58 C 10 36, 12 10, 12 10 Z"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </svg>
            <span
              className="relative z-10 text-white font-black text-xs sm:text-sm tracking-wider mb-1"
              style={{
                textShadow: '0 1px 3px rgba(2,132,199,0.9), 0 0 8px rgba(0,0,0,0.4)',
              }}
            >
              返回
            </span>
          </motion.button>

          {/* Title */}
          <div className="flex items-center gap-1 sm:gap-2">
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide"
              style={{
                textShadow:
                  '0 2px 8px rgba(2,132,199,0.9), 0 0 16px rgba(56,189,248,0.8), 0 1px 2px #000000',
              }}
            >
              冰雪魔法數學
            </h1>
          </div>
        </div>

        {/* Center: Castle Story Progress Quick Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenCastle}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-600/90 via-cyan-600/90 to-blue-700/90 hover:from-sky-500 hover:to-cyan-500 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-cyan-200 shadow-[0_4px_15px_rgba(2,132,199,0.4)] cursor-pointer text-white"
        >
          <Castle className="w-4 h-4 text-cyan-200" />
          <span className="text-xs sm:text-sm font-black">
            🏰 冰雪城堡 (階段 {currentStage}/5)
          </span>
          <span className="bg-cyan-400 text-sky-950 text-[10px] font-black px-2 py-0.2 rounded-full">
            查看王國 ✨
          </span>
        </motion.button>

        {/* Right: Calculation Switch + Star Counter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle Require Calc Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/30 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-white/80 shadow-[0_4px_12px_rgba(8,30,60,0.3)]">
            <span
              className="text-xs sm:text-sm font-black text-white hidden md:inline-block drop-shadow-xs"
              style={{ textShadow: '0 1px 2px rgba(2,132,199,0.8)' }}
            >
              需要計算答案？
            </span>
            <span className="text-xs font-bold text-white md:hidden">計算</span>
            <button
              onClick={onToggleRequireCalc}
              className={`w-11 h-6 sm:w-13 sm:h-7 rounded-full relative transition-colors border-2 shadow-inner cursor-pointer ${
                requireCalc
                  ? 'bg-gradient-to-r from-cyan-400 to-sky-500 border-white'
                  : 'bg-slate-400/80 border-slate-300'
              }`}
            >
              <motion.div
                animate={{ x: requireCalc ? (window.innerWidth < 640 ? 20 : 24) : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 bg-white rounded-full absolute top-0.5 shadow-md flex items-center justify-center text-[9px] font-black text-sky-700"
              >
                {requireCalc ? '✓' : ''}
              </motion.div>
            </button>
          </div>

          {/* Star Counter Badge with 3D Star */}
          <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-white/80 shadow-[0_4px_12px_rgba(8,30,60,0.3)]">
            <span className="text-xl sm:text-2xl animate-bounce">⭐</span>
            <span
              className="text-base sm:text-xl font-black text-white"
              style={{ textShadow: '0 1px 3px rgba(2,132,199,0.9)' }}
            >
              {stars}
            </span>
          </div>
        </div>
      </div>

      {/* ===================== MAIN CONTENT GRID ===================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 items-stretch">
        {/* ----------------- LEFT 8 COLS: EQUATIONS & BLOCKS ----------------- */}
        <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-4">
          {/* TOP CARD: Horizontal Equation & Elsa Companion */}
          <div className="relative bg-gradient-to-b from-[#dff2ff] via-[#b9e5fa] to-[#8fd4f8] rounded-3xl sm:rounded-[36px] p-3 sm:p-4 md:p-5 shadow-[0_12px_30px_rgba(8,30,60,0.35)] border-3 sm:border-4 border-white/90 flex flex-col items-center justify-center overflow-visible">
            {/* Top-Left Step Badge */}
            <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-8 bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full font-black shadow-[0_4px_10px_rgba(2,132,199,0.5)] border-2 border-white text-xs sm:text-sm whitespace-nowrap z-20">
              {phase === 'arrange'
                ? '第一步：把橫式的數字排到直式'
                : '橫式魔法'}
            </div>

            {/* Glossy top ice reflection */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

            {/* Elsa Character and Equation Container */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-3 sm:mt-2 mb-1 gap-2 sm:gap-3">
              {/* Left Side: Princess Elsa Mascot with Live Speech Ribbon */}
              <div className="shrink-0 flex items-center gap-2 pl-1 sm:pl-2">
                <ElsaPrincess
                  pose={phase === 'success' ? 'cheering' : phase === 'arrange' ? 'idle' : 'casting'}
                  showDialogue={false}
                  size={window.innerWidth < 640 ? 54 : 68}
                  onClick={() => playSound('magic')}
                />
                <div className="bg-white/85 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-2xl border border-cyan-200 shadow-xs max-w-[180px] sm:max-w-[220px]">
                  <span className="text-[9px] font-black text-cyan-800 bg-cyan-100/90 px-1.5 py-0.2 rounded-full">
                    愛莎 👑
                  </span>
                  <p className="text-[11px] sm:text-xs font-black text-sky-950 leading-tight mt-0.5">
                    {elsaDialogue}
                  </p>
                </div>
              </div>

              {/* Horizontal Formula */}
              <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 flex-wrap">
                {/* Num1 Bubble Digits */}
                <NumberGroup
                  num={question.num1}
                  source="num1"
                  phase={phase}
                  activeDigit={activeDigit}
                  placedDigits={placedDigits}
                  errorDigit={errorDigit}
                  onDigitClick={onDigitClick}
                  onGridCellClick={onGridCellClick}
                />

                {/* Operator */}
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] px-0.5"
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.9), 0 2px 4px rgba(2,132,199,0.4)',
                  }}
                >
                  {question.operator}
                </div>

                {/* Num2 Bubble Digits */}
                <NumberGroup
                  num={question.num2}
                  source="num2"
                  phase={phase}
                  activeDigit={activeDigit}
                  placedDigits={placedDigits}
                  errorDigit={errorDigit}
                  onDigitClick={onDigitClick}
                  onGridCellClick={onGridCellClick}
                />

                {/* Equals sign */}
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] px-0.5"
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.9), 0 2px 4px rgba(2,132,199,0.4)',
                  }}
                >
                  =
                </div>

                {/* Result: Multi-layered Snowflake Burst */}
                <SnowflakeBurst
                  value={phase === 'success' ? question.answer : '?'}
                  isSolved={phase === 'success'}
                  size={window.innerWidth < 640 ? 64 : 84}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM CARD: Vertical Equation & Blocks Tablet */}
          <div className="relative flex-1 bg-gradient-to-b from-[#d8f0ff] via-[#b0e0f8] to-[#88d0f6] rounded-3xl sm:rounded-[36px] p-3 sm:p-5 md:p-6 shadow-[0_12px_30px_rgba(8,30,60,0.35)] border-3 sm:border-4 border-white/90 flex flex-col justify-between overflow-visible min-h-[300px]">
            {/* Top-Left Step/Instruction Pill */}
            <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-8 bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full font-black shadow-[0_4px_10px_rgba(2,132,199,0.5)] border-2 border-white text-xs sm:text-sm whitespace-nowrap z-20">
              {phase === 'arrange'
                ? '點擊數字把它排到直式'
                : !requireCalc && phase === 'success'
                ? '排得真好！'
                : phase === 'calc_units'
                ? '第二步：先計算個位數'
                : phase === 'calc_tens'
                ? '第三步：再計算十位數'
                : '太棒了！'}
            </div>

            {/* Glossy diagonal reflection bar across the tablet */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-3xl" />
            <div className="absolute -top-12 -left-12 w-48 h-96 bg-white/15 transform rotate-35 pointer-events-none" />

            {/* Middle Container: Vertical Math Columns & Blocks Tablet (Mobile-optimized: Math Grid is on TOP on mobile to keep distance minimal) */}
            <div className="relative z-10 flex flex-col-reverse sm:flex-row items-center sm:items-end justify-around gap-3 sm:gap-4 my-auto pt-3 sm:pt-6 pb-2 w-full">
              {/* LEFT/BOTTOM SIDE: Visual Base-10 Blocks Area */}
              <div className="flex flex-col items-center justify-center shrink-0 w-full sm:w-auto">
                <CarryingEquationBlocks
                  num1={question.num1}
                  num2={question.num2}
                  level={level}
                  phase={phase}
                  gridAnswerUnits={grid.answerUnits}
                  grid={grid}
                  playSound={playSound}
                />
              </div>

              {/* RIGHT/TOP SIDE: Vertical Math Columns Grid */}
              <div className="relative flex flex-col items-center sm:items-end shrink-0 w-full sm:w-auto pl-0 sm:pl-6">
                {/* Column Headers ("十位", "個位") in Frost Capsules */}
                <div className="flex justify-end gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="w-14 sm:w-16 md:w-20 text-center relative">
                    <div className="bg-white/80 backdrop-blur-xs border-2 border-cyan-300 rounded-full py-0.5 sm:py-1 shadow-xs text-xs sm:text-sm md:text-base font-black text-sky-900">
                      十位
                    </div>
                    {/* Carry Badge (+1) */}
                    <AnimatePresence>
                      {hasCarry &&
                        (grid.answerUnits !== null ||
                          phase === 'calc_tens' ||
                          phase === 'success') && (
                          <motion.div
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md border-2 border-yellow-500 z-20 whitespace-nowrap animate-bounce"
                          >
                            +1 🌟
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                  <div className="w-14 sm:w-16 md:w-20 text-center">
                    <div className="bg-white/80 backdrop-blur-xs border-2 border-cyan-300 rounded-full py-0.5 sm:py-1 shadow-xs text-xs sm:text-sm md:text-base font-black text-sky-900">
                      個位
                    </div>
                  </div>
                </div>

                {/* Top Row Grid Cells */}
                <div className="flex justify-end items-center gap-2 sm:gap-3 h-14 sm:h-18 md:h-22">
                  <GridDigitCell
                    id="grid-cell-topTens"
                    value={grid.topTens}
                    isError={errorCell === 'topTens'}
                    isInteractive={phase === 'arrange'}
                    showEmptyBox={phase === 'arrange'}
                    onClick={() => onGridCellClick('topTens')}
                  />
                  <GridDigitCell
                    id="grid-cell-topUnits"
                    value={grid.topUnits}
                    isError={errorCell === 'topUnits'}
                    isInteractive={phase === 'arrange'}
                    showEmptyBox={phase === 'arrange'}
                    onClick={() => onGridCellClick('topUnits')}
                  />
                </div>

                {/* Bottom Row Grid Cells with Operator */}
                <div className="relative flex justify-end items-center gap-2 sm:gap-3 h-14 sm:h-18 md:h-22 mt-1 sm:mt-2">
                  {/* Operator Symbol */}
                  <span
                    className="absolute -left-8 sm:-left-10 text-3xl sm:text-4xl md:text-5xl font-black text-sky-900 drop-shadow-xs select-none"
                    style={{
                      textShadow: '0 0 10px rgba(255,255,255,0.9), 0 2px 4px rgba(2,132,199,0.3)',
                    }}
                  >
                    {question.operator}
                  </span>

                  <GridDigitCell
                    id="grid-cell-bottomTens"
                    value={grid.bottomTens}
                    isError={errorCell === 'bottomTens'}
                    isInteractive={phase === 'arrange'}
                    showEmptyBox={phase === 'arrange'}
                    onClick={() => onGridCellClick('bottomTens')}
                  />
                  <GridDigitCell
                    id="grid-cell-bottomUnits"
                    value={grid.bottomUnits}
                    isError={errorCell === 'bottomUnits'}
                    isInteractive={phase === 'arrange'}
                    showEmptyBox={phase === 'arrange'}
                    onClick={() => onGridCellClick('bottomUnits')}
                  />
                </div>

                {/* Silver/Blue Ice Divider Bar */}
                <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-sky-300 via-sky-600 to-sky-300 rounded-full my-1.5 sm:my-2 shadow-xs border border-white/60" />

                {/* Answer Row Grid Cells */}
                <div className="flex justify-end gap-2 sm:gap-3 h-14 sm:h-18 md:h-22 items-center">
                  {(phase === 'calc_units' ||
                    phase === 'calc_tens' ||
                    phase === 'success') &&
                  requireCalc ? (
                    <>
                      {Math.floor(question.answer / 10) > 0 ? (
                        <GridDigitCell
                          id="grid-cell-answerTens"
                          value={grid.answerTens}
                          isError={errorCell === 'answerTens'}
                          isInteractive={false}
                          showEmptyBox={
                            phase === 'calc_tens' || phase === 'success'
                          }
                          onClick={() => {}}
                          textColorClass={
                            phase === 'success'
                              ? 'text-cyan-600'
                              : 'text-sky-900'
                          }
                        />
                      ) : (
                        <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-18 md:h-22" />
                      )}
                      <GridDigitCell
                        id="grid-cell-answerUnits"
                        value={grid.answerUnits}
                        isError={errorCell === 'answerUnits'}
                        isInteractive={false}
                        showEmptyBox={
                          phase === 'calc_units' ||
                          phase === 'calc_tens' ||
                          phase === 'success'
                        }
                        onClick={() => {}}
                        textColorClass={
                          phase === 'success'
                            ? 'text-cyan-600'
                            : 'text-sky-900'
                        }
                      />
                    </>
                  ) : (
                    <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-18 md:h-22" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Inset Ice Highlight Bar */}
            <div className="w-full h-2.5 sm:h-3.5 bg-white/40 rounded-full border border-white/80 shadow-inner mt-2" />

            {/* Castle Growth Celebration Modal when level/question is cleared */}
            <CastleGrowthCelebrationModal
              isOpen={phase === 'success'}
              stars={stars}
              onNext={onNext}
              onOpenCastle={onOpenCastle}
              onOpenAlbum={onOpenAlbum}
            />
          </div>
        </div>

        {/* ----------------- RIGHT 4 COLS: SCROLL & ICE CASTLE GROWTH CARD ----------------- */}
        <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-4 justify-between">
          {/* TOP RIGHT: Curled Ice Parchment Scroll */}
          <div className="flex-1 min-h-[260px] sm:min-h-[300px]">
            <IceScroll
              phase={phase}
              requireCalc={requireCalc}
              hasCarry={hasCarry}
              onNext={onNext}
              onNumpadClick={onNumpadClick}
            />
          </div>

          {/* BOTTOM RIGHT: Growing Ice Castle Mini Status Card */}
          <div className="shrink-0">
            <IceCastleGrowthCard
              stars={stars}
              phase={phase}
              onOpenCastle={onOpenCastle}
              onOpenAlbum={onOpenAlbum}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- SUB-COMPONENTS -----------------

function NumberGroup({
  num,
  source,
  phase,
  activeDigit,
  placedDigits,
  errorDigit,
  onDigitClick,
  onGridCellClick,
}: {
  num: number;
  source: 'num1' | 'num2';
  phase: GamePhase;
  activeDigit: {
    source: 'num1' | 'num2';
    place: 'tens' | 'units';
    value: string;
  } | null;
  placedDigits: Record<string, boolean>;
  errorDigit: { source: 'num1' | 'num2'; place: 'tens' | 'units' } | null;
  onDigitClick: (
    s: 'num1' | 'num2',
    p: 'tens' | 'units',
    v: string
  ) => void;
  onGridCellClick: (
    cell: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits'
  ) => void;
}) {
  const tens = Math.floor(num / 10);
  const units = num % 10;
  const hasTens = num > 9;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {hasTens && (
        <DigitBubble
          value={tens.toString()}
          source={source}
          place="tens"
          phase={phase}
          isActive={
            activeDigit?.source === source && activeDigit?.place === 'tens'
          }
          isPlaced={placedDigits[`${source}Tens`]}
          isError={
            errorDigit?.source === source && errorDigit?.place === 'tens'
          }
          onClick={() => onDigitClick(source, 'tens', tens.toString())}
          onGridCellClick={onGridCellClick}
        />
      )}
      <DigitBubble
        value={units.toString()}
        source={source}
        place="units"
        phase={phase}
        isActive={
          activeDigit?.source === source && activeDigit?.place === 'units'
        }
        isPlaced={placedDigits[`${source}Units`]}
        isError={
          errorDigit?.source === source && errorDigit?.place === 'units'
        }
        onClick={() => onDigitClick(source, 'units', units.toString())}
        onGridCellClick={onGridCellClick}
      />
    </div>
  );
}

function DigitBubble({
  value,
  source,
  place,
  phase,
  isActive,
  isPlaced,
  isError,
  onClick,
  onGridCellClick,
}: {
  value: string;
  source: 'num1' | 'num2';
  place: 'tens' | 'units';
  phase: GamePhase;
  isActive: boolean;
  isPlaced: boolean;
  isError: boolean;
  onClick: () => void;
  onGridCellClick: (
    cell: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits'
  ) => void;
}) {
  if (isPlaced) {
    return (
      <div className="w-12 h-16 sm:w-15 sm:h-20 md:w-18 md:h-24 bg-white/40 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-black text-sky-800/30 border-3 border-dashed border-sky-300/50 shrink-0 select-none">
        {value}
      </div>
    );
  }

  const handleDragEnd = (_: any, info: { point: { x: number; y: number } }) => {
    const cells: ('topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits')[] = [
      'topTens',
      'topUnits',
      'bottomTens',
      'bottomUnits',
    ];
    for (const cell of cells) {
      const el = document.getElementById(`grid-cell-${cell}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const { x, y } = info.point;
        // Generous touch target for children
        if (
          x >= rect.left - 35 &&
          x <= rect.right + 35 &&
          y >= rect.top - 35 &&
          y <= rect.bottom + 35
        ) {
          onGridCellClick(cell);
          return;
        }
      }
    }
  };

  return (
    <motion.button
      drag={phase === 'arrange'}
      dragSnapToOrigin
      dragElastic={0.15}
      whileDrag={{
        scale: 1.2,
        zIndex: 99,
        filter: 'drop-shadow(0 12px 24px rgba(2,132,199,0.7))',
      }}
      onDragStart={onClick}
      onDragEnd={handleDragEnd}
      animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`w-12 h-16 sm:w-15 sm:h-20 md:w-18 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-black shrink-0 transition-all cursor-grab active:cursor-grabbing border-3 select-none touch-none ${
        isActive
          ? 'bg-sky-100 border-sky-500 text-sky-950 scale-105 shadow-md'
          : isError
          ? 'bg-red-100 border-red-400 text-red-700 ring-4 ring-red-300'
          : 'bg-gradient-to-b from-white via-sky-100 to-sky-200 border-white text-sky-900 shadow-[0_8px_18px_rgba(2,132,199,0.3)] hover:brightness-110'
      }`}
      style={{
        textShadow:
          '0 2px 4px rgba(255,255,255,0.9), 0 0 10px rgba(56,189,248,0.5)',
      }}
    >
      {value}
    </motion.button>
  );
}

function GridDigitCell({
  id,
  value,
  isError,
  isInteractive,
  showEmptyBox,
  onClick,
  textColorClass = 'text-sky-900',
}: {
  id?: string;
  value: string | null;
  isError: boolean;
  isInteractive: boolean;
  showEmptyBox: boolean;
  onClick: () => void;
  textColorClass?: string;
}) {
  if (value !== null) {
    return (
      <div
        id={id}
        className={`w-14 sm:w-16 md:w-20 h-14 sm:h-18 md:h-22 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-b from-white via-sky-50 to-sky-200 border-3 border-white shadow-[0_8px_18px_rgba(2,132,199,0.3)] ${textColorClass} select-none`}
        style={{
          textShadow:
            '0 2px 4px rgba(255,255,255,0.9), 0 0 10px rgba(56,189,248,0.5)',
        }}
      >
        {value}
      </div>
    );
  }

  if (!showEmptyBox) {
    return <div id={id} className="w-14 sm:w-16 md:w-20 h-14 sm:h-18 md:h-22" />;
  }

  let cellClass =
    'w-14 sm:w-16 md:w-20 h-14 sm:h-18 md:h-22 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-black transition-all border-3 relative ';

  if (isError) {
    cellClass +=
      'bg-red-100/90 border-red-400 ring-4 ring-red-400 text-red-900 cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.6)]';
  } else if (isInteractive) {
    cellClass +=
      'bg-white/40 border-white/90 hover:bg-white/70 hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] cursor-pointer active:scale-95';
  } else {
    cellClass += 'bg-white/20 border-white/50 opacity-60';
  }

  return (
    <motion.button
      id={id}
      animate={isError ? { x: [-6, 6, -6, 6, 0] } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      disabled={!isInteractive && !isError}
      className={cellClass}
    >
      <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-dashed border-sky-400/50 rounded-xl opacity-60" />
    </motion.button>
  );
}

