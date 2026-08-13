import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Play, Star, Plus, Minus, Check, ArrowRight, Smile, Lightbulb, Volume2 } from 'lucide-react';
import { Question, Operator, GamePhase, GameLevel } from './types';
import { generateQuestion } from './utils';

// Web Audio API Synthesizer for child-friendly sound effects
let globalAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
      globalAudioCtx = new AudioCtx();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
    return globalAudioCtx;
  } catch {
    return null;
  }
}

function playSound(type: 'pop' | 'correct' | 'error' | 'tap') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    if (type === 'tap' || type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.15, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.18);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.18);
      });
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // Web Audio blocked or unsupported
  }
}

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [gameLevel, setGameLevel] = useState<GameLevel>('addition');
  const [requireCalc, setRequireCalc] = useState(false);
  const [operator, setOperator] = useState<Operator>('+');
  const [question, setQuestion] = useState<Question | null>(null);
  const [phase, setPhase] = useState<GamePhase>('arrange');
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('math_game_stars') : null;
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('math_game_stars', stars.toString());
      }
    } catch {
      // Ignore storage restrictions in cross-origin sandboxed iframes
    }
  }, [stars]);

  // Grid state for individual digits
  const [grid, setGrid] = useState<{ topTens: string | null, topUnits: string | null, bottomTens: string | null, bottomUnits: string | null, answerTens: string | null, answerUnits: string | null }>({
    topTens: null,
    topUnits: null,
    bottomTens: null,
    bottomUnits: null,
    answerTens: null,
    answerUnits: null
  });

  const [placedDigits, setPlacedDigits] = useState<{ num1Tens: boolean, num1Units: boolean, num2Tens: boolean, num2Units: boolean }>({
    num1Tens: false,
    num1Units: false,
    num2Tens: false,
    num2Units: false,
  });

  const [activeDigit, setActiveDigit] = useState<{ source: 'num1' | 'num2', place: 'tens' | 'units', value: string } | null>(null);
  const [errorCell, setErrorCell] = useState<'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits' | 'answerTens' | 'answerUnits' | null>(null);
  const [errorDigit, setErrorDigit] = useState<{source: 'num1' | 'num2', place: 'tens' | 'units'} | null>(null);

  const resetTurn = () => {
    setPhase('arrange');
    setGrid({ topTens: null, topUnits: null, bottomTens: null, bottomUnits: null, answerTens: null, answerUnits: null });
    setPlacedDigits({ num1Tens: false, num1Units: false, num2Tens: false, num2Units: false });
    setActiveDigit(null);
    setErrorCell(null);
    setErrorDigit(null);
  };

  const startGame = (level: GameLevel) => {
    const op = level === 'subtraction' ? '-' : '+';
    setGameLevel(level);
    setOperator(op);
    setQuestion(generateQuestion(level, stars));
    resetTurn();
    setGameState('playing');
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion(gameLevel, stars));
    resetTurn();
  };

  const triggerConfetti = () => {
    try {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        try {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffb703', '#fb8500', '#8ecae6', '#219ebc']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffb703', '#fb8500', '#8ecae6', '#219ebc']
          });
        } catch {
          // ignore confetti error
        }

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // ignore
    }
  };

  const handleGridCellClick = (cellName: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits') => {
    if (!question || !activeDigit) return;

    const isCorrectCell = 
      (activeDigit.source === 'num1' && activeDigit.place === 'tens' && cellName === 'topTens') ||
      (activeDigit.source === 'num1' && activeDigit.place === 'units' && cellName === 'topUnits') ||
      (activeDigit.source === 'num2' && activeDigit.place === 'tens' && cellName === 'bottomTens') ||
      (activeDigit.source === 'num2' && activeDigit.place === 'units' && cellName === 'bottomUnits');

    if (isCorrectCell) {
      playSound('pop');
      setGrid(prev => ({ ...prev, [cellName]: activeDigit.value }));
      
      const newPlaced = {
        ...placedDigits,
        [`${activeDigit.source}${activeDigit.place === 'tens' ? 'Tens' : 'Units'}`]: true
      };
      setPlacedDigits(newPlaced);
      setActiveDigit(null);
      setErrorCell(null);

      const num1TensRequired = question.num1 > 9;
      const num2TensRequired = question.num2 > 9;

      const isComplete = 
        newPlaced.num1Units &&
        newPlaced.num2Units &&
        (!num1TensRequired || newPlaced.num1Tens) &&
        (!num2TensRequired || newPlaced.num2Tens);

      if (isComplete) {
        if (!requireCalc) {
          playSound('correct');
          setPhase('success');
          setStars(s => s + 1);
          triggerConfetti();
        } else {
          setPhase('calc_units');
        }
      }
    } else {
      playSound('error');
      setErrorCell(cellName);
      setTimeout(() => setErrorCell(null), 600);
    }
  };

  const handleDigitClick = (source: 'num1' | 'num2', place: 'tens' | 'units', value: string) => {
    if (phase !== 'arrange') return;

    playSound('tap');
    if (activeDigit?.source === source && activeDigit?.place === place) {
      setActiveDigit(null);
      setErrorDigit(null);
    } else {
      setActiveDigit({ source, place, value });
      setErrorDigit(null);
    }
  };

  const handleNumpadClick = (num: number) => {
    if (!question || (phase !== 'calc_units' && phase !== 'calc_tens')) return;
    
    const ansUnits = question.answer % 10;
    const ansTens = Math.floor(question.answer / 10);

    if (phase === 'calc_units') {
      if (num === ansUnits) {
        playSound('pop');
        setGrid(prev => ({ ...prev, answerUnits: num.toString() }));
        if (ansTens > 0) {
          setPhase('calc_tens');
        } else {
          playSound('correct');
          setPhase('success');
          setStars(s => s + 1);
          triggerConfetti();
        }
      } else {
        playSound('error');
        setErrorCell('answerUnits');
        setTimeout(() => setErrorCell(null), 600);
      }
    } else if (phase === 'calc_tens') {
      if (num === ansTens) {
        playSound('correct');
        setGrid(prev => ({ ...prev, answerTens: num.toString() }));
        setPhase('success');
        setStars(s => s + 1);
        triggerConfetti();
      } else {
        playSound('error');
        setErrorCell('answerTens');
        setTimeout(() => setErrorCell(null), 600);
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F0F9FF] font-sans flex flex-col items-center justify-center p-0 md:p-4 lg:p-8 overflow-y-auto w-full">
      <div className="w-full flex-1 max-w-6xl flex flex-col">
      {gameState === 'menu' ? (
        <MainMenu onStart={startGame} stars={stars} requireCalc={requireCalc} setRequireCalc={setRequireCalc} />
      ) : (
        <GameScreen
          question={question!}
          phase={phase}
          grid={grid}
          placedDigits={placedDigits}
          activeDigit={activeDigit}
          stars={stars}
          level={gameLevel}
          errorCell={errorCell}
          errorDigit={errorDigit}
          onGridCellClick={handleGridCellClick}
          onDigitClick={handleDigitClick}
          onNumpadClick={handleNumpadClick}
          onNext={nextQuestion}
          onBack={() => setGameState('menu')}
          requireCalc={requireCalc}
          onToggleRequireCalc={() => {
            setRequireCalc(prev => {
              const nextVal = !prev;
              if (!nextVal && (phase === 'calc_units' || phase === 'calc_tens')) {
                setPhase('success');
                setStars(s => s + 1);
                triggerConfetti();
              }
              return nextVal;
            });
          }}
        />
      )}
      </div>
    </div>
  );
}

function MainMenu({ onStart, stars, requireCalc, setRequireCalc }: { onStart: (level: GameLevel) => void, stars: number, requireCalc: boolean, setRequireCalc: (val: boolean) => void }) {
  return (
    <div className="flex flex-col items-center bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl w-full max-w-lg border-4 border-blue-100 text-center mx-2">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2 md:mb-4 drop-shadow-sm">數學小精靈</h1>
      <p className="text-lg md:text-xl text-blue-500 mb-6 md:mb-8 font-medium">學習直式加減法！</p>
      
      <div className="flex items-center space-x-2 bg-white px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-md border-b-4 border-orange-200 mb-6 md:mb-8">
        <Star className="text-yellow-400 fill-yellow-400 w-8 md:w-10 h-8 md:h-10" />
        <span className="text-2xl md:text-3xl font-black text-orange-500">{stars} 顆星星</span>
      </div>

      <div className="flex items-center justify-between bg-blue-50 px-6 py-4 rounded-2xl mb-8 w-full border-2 border-blue-100">
        <span className="text-xl font-bold text-blue-800">需要計算答案？</span>
        <button 
          onClick={() => setRequireCalc(!requireCalc)}
          className={`w-16 h-8 rounded-full relative transition-colors border-2 shadow-inner ${requireCalc ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'}`}
        >
          <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${requireCalc ? 'translate-x-8' : 'translate-x-1'}`}></div>
        </button>
      </div>

      <div className="flex flex-col space-y-3 w-full px-0 md:px-2">
        <button
          onClick={() => onStart('addition')}
          className="bg-white hover:bg-green-50 active:translate-y-1 active:border-b-4 border-b-6 border-green-200 text-green-600 py-3.5 md:py-4 px-4 md:px-6 rounded-3xl shadow-md transition-all flex flex-col items-center justify-center"
        >
          <span className="text-xl md:text-2xl font-black">不進位加法</span>
          <span className="text-xs md:text-sm font-bold text-green-500 mt-0.5">基礎加法（個位小於 10）</span>
        </button>
        <button
          onClick={() => onStart('carrying_addition')}
          className="bg-white hover:bg-purple-50 active:translate-y-1 active:border-b-4 border-b-6 border-purple-200 text-purple-600 py-3.5 md:py-4 px-4 md:px-6 rounded-3xl shadow-md transition-all flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black">進位加法遊戲</span>
            <span className="bg-yellow-400 text-yellow-950 text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full shadow-sm">滿十進一 🌟</span>
          </div>
          <span className="text-xs md:text-sm font-bold text-purple-400 mt-0.5">個位滿 10 要進 1 到十位！</span>
        </button>
        <button
          onClick={() => onStart('subtraction')}
          className="bg-white hover:bg-orange-50 active:translate-y-1 active:border-b-4 border-b-6 border-orange-200 text-orange-600 py-3.5 md:py-4 px-4 md:px-6 rounded-3xl shadow-md transition-all flex flex-col items-center justify-center"
        >
          <span className="text-xl md:text-2xl font-black">減法遊戲</span>
          <span className="text-xs md:text-sm font-bold text-orange-400 mt-0.5">基礎減法（不退位）</span>
        </button>
      </div>
    </div>
  );
}

function GameScreen({
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
}: {
  question: Question;
  phase: GamePhase;
  grid: { topTens: string | null; topUnits: string | null; bottomTens: string | null; bottomUnits: string | null; answerTens: string | null; answerUnits: string | null };
  placedDigits: { num1Tens: boolean; num1Units: boolean; num2Tens: boolean; num2Units: boolean };
  activeDigit: { source: 'num1' | 'num2'; place: 'tens' | 'units'; value: string } | null;
  stars: number;
  level: GameLevel;
  errorCell: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits' | 'answerTens' | 'answerUnits' | null;
  errorDigit: { source: 'num1' | 'num2'; place: 'tens' | 'units' } | null;
  onGridCellClick: (cell: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits') => void;
  onDigitClick: (source: 'num1' | 'num2', place: 'tens' | 'units', value: string) => void;
  onNumpadClick: (num: number) => void;
  onNext: () => void;
  onBack: () => void;
  requireCalc: boolean;
  onToggleRequireCalc: () => void;
}) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border-4 border-blue-100 text-center my-auto">
        <p className="text-xl font-bold text-blue-900 mb-4">載入題目中...</p>
        <button onClick={onBack} className="bg-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow-md">
          返回主選單
        </button>
      </div>
    );
  }

  const hasCarry = question.operator === '+' && ((question.num1 % 10) + (question.num2 % 10) >= 10);
  const unitSum = (question.num1 % 10) + (question.num2 % 10);
  const tens1 = Math.floor(question.num1 / 10);
  const tens2 = Math.floor(question.num2 / 10);

  return (
    <div className="flex flex-col w-full flex-1 h-[100dvh] md:h-auto md:min-h-[90vh] bg-[#F0F9FF] md:bg-white md:shadow-2xl md:border-4 md:border-blue-100 md:rounded-[40px] rounded-2xl p-4 md:p-8 select-none overflow-y-auto md:overflow-visible">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 md:w-14 md:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-white transition-all active:scale-95 font-bold text-xs md:text-sm shrink-0"
          >
            返回
          </button>
          <div>
            <h1 className="text-base md:text-2xl font-bold text-blue-900">數學小精靈</h1>
            <div className="flex gap-1 mt-0.5 md:mt-1">
              <div className="h-1.5 md:h-2 w-16 md:w-32 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-blue-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Require calculation switch inside GameScreen header */}
        <div className="flex items-center gap-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-2xl shadow-sm border-2 border-blue-100">
          <span className="text-xs md:text-sm font-bold text-blue-800">需要計算答案？</span>
          <button 
            onClick={onToggleRequireCalc}
            className={`w-11 h-6 md:w-14 md:h-7 rounded-full relative transition-colors border shadow-inner ${requireCalc ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'}`}
          >
            <div className={`w-5 h-5 md:w-6 md:h-6 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${requireCalc ? 'translate-x-5 md:translate-x-7' : 'translate-x-0.5'}`}></div>
          </button>
        </div>

        <div className="flex gap-2 md:gap-4 shrink-0">
          <div className="bg-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-xl md:rounded-2xl shadow-md border-b-4 border-orange-200 flex items-center gap-1 md:gap-2">
            <span className="text-lg md:text-2xl">⭐</span>
            <span className="text-base md:text-xl font-black text-orange-500">{stars}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-8 min-h-0 md:min-h-min overflow-y-auto md:overflow-visible pb-4 lg:pb-0 pr-1">
        {/* Left Column - Equations */}
        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6 pt-2">
          {/* Horizontal Equation */}
          <div className="bg-white rounded-3xl md:rounded-[40px] p-3 sm:p-6 md:p-8 shadow-xl border-4 border-blue-100 flex flex-col items-center justify-center relative shrink-0 mt-3 md:mt-4">
            <div className="absolute -top-3.5 md:-top-4 left-4 md:left-10 bg-blue-500 text-white px-4 md:px-6 py-1 md:py-1.5 rounded-full font-bold shadow-lg text-xs md:text-sm whitespace-nowrap z-10">
              {phase === 'arrange' ? "第一步：把橫式的數字排到直式" : "橫式"}
            </div>
            
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-6 text-4xl sm:text-5xl md:text-7xl font-black text-blue-900 tracking-normal sm:tracking-widest mt-5 sm:mt-4">
              <NumberGroup 
                num={question.num1}
                source="num1"
                activeDigit={activeDigit}
                placedDigits={placedDigits}
                errorDigit={errorDigit}
                onDigitClick={onDigitClick}
              />
              <span className="text-blue-400">{question.operator}</span>
              <NumberGroup 
                num={question.num2}
                source="num2"
                activeDigit={activeDigit}
                placedDigits={placedDigits}
                errorDigit={errorDigit}
                onDigitClick={onDigitClick}
              />
              <span className="text-blue-400">=</span>
              <div className="w-12 h-14 sm:w-16 sm:h-20 md:w-24 md:h-24 bg-blue-50 border-4 border-dashed border-blue-200 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-200 text-4xl sm:text-5xl md:text-7xl shrink-0">
                {phase === 'success' ? question.answer : '?'}
              </div>
            </div>
          </div>

          {/* Vertical Grid */}
          <div className="bg-white rounded-3xl md:rounded-[40px] p-6 md:p-8 shadow-xl border-4 border-green-100 flex-1 flex flex-col items-center justify-center relative shrink-0 min-h-[300px] mt-3 md:mt-4">
            <div className="absolute -top-3.5 md:-top-4 left-4 md:left-10 bg-green-500 text-white px-4 md:px-6 py-1 md:py-1.5 rounded-full font-bold shadow-lg text-xs md:text-sm whitespace-nowrap z-10">
              {phase === 'arrange' ? "點擊數字把它排到直式" : 
               !requireCalc && phase === 'success' ? "排得真好！" :
               phase === 'calc_units' ? "第二步：先計算個位數" : 
               phase === 'calc_tens' ? "第三步：再計算十位數" : "太棒了！"}
            </div>

            <div className="relative flex flex-col items-center mt-4 md:mt-6 w-full">
              {/* Vertical structure */}
              <div className="relative text-6xl md:text-8xl font-black text-blue-900 leading-tight tracking-tighter w-full max-w-[420px] md:max-w-2xl flex items-center justify-end gap-2 md:gap-6">
                
                {/* Left Side: Visual Blocks Area */}
                {requireCalc && (
                  <div className="flex-1 flex justify-end">
                    <CarryingEquationBlocks
                      num1={question.num1}
                      num2={question.num2}
                      level={level}
                      phase={phase}
                      gridAnswerUnits={grid.answerUnits}
                      grid={grid}
                    />
                  </div>
                )}

                {/* Right Side: Math Numbers Grid */}
                <div className="flex flex-col items-end shrink-0">
                  {/* Headers */}
                  <div className="flex justify-end w-full mb-2">
                    <div className="flex gap-2 md:gap-4 text-center opacity-50 text-lg md:text-2xl font-bold text-blue-600 tracking-normal pr-2 md:pr-4">
                      <span className="w-12 md:w-16 relative">
                        十位
                        <AnimatePresence>
                          {hasCarry && (grid.answerUnits !== null || phase === 'calc_tens' || phase === 'success') && (
                            <motion.span
                              initial={{ scale: 0, y: 10 }}
                              animate={{ scale: 1, y: 0 }}
                              className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 font-black text-xs md:text-sm px-2 py-0.5 rounded-full shadow-md border-2 border-yellow-500 z-20 whitespace-nowrap animate-bounce opacity-100"
                            >
                              +1
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="w-12 md:w-16">個位</span>
                    </div>
                  </div>

                  {/* Top Row */}
                  <div className="flex justify-end items-center gap-2 md:gap-4 h-20 md:h-24 pr-2 md:pr-4">
                    <GridDigitCell
                      value={grid.topTens}
                      isTarget={activeDigit !== null}
                      isError={errorCell === 'topTens'}
                      showEmptyBox={phase === 'arrange'}
                      onClick={() => onGridCellClick('topTens')}
                    />
                    <GridDigitCell
                      value={grid.topUnits}
                      isTarget={activeDigit !== null}
                      isError={errorCell === 'topUnits'}
                      showEmptyBox={phase === 'arrange'}
                      onClick={() => onGridCellClick('topUnits')}
                    />
                  </div>
                  
                  {/* Bottom Row */}
                  <div className="flex justify-end items-center gap-2 md:gap-4 relative mt-2 h-20 md:h-24 pr-2 md:pr-4">
                    <span className="absolute left-[-28px] md:left-[-36px] text-5xl md:text-6xl text-orange-500 self-center">{question.operator}</span>
                    <GridDigitCell
                      value={grid.bottomTens}
                      isTarget={activeDigit !== null}
                      isError={errorCell === 'bottomTens'}
                      showEmptyBox={phase === 'arrange'}
                      onClick={() => onGridCellClick('bottomTens')}
                    />
                    <GridDigitCell
                      value={grid.bottomUnits}
                      isTarget={activeDigit !== null}
                      isError={errorCell === 'bottomUnits'}
                      showEmptyBox={phase === 'arrange'}
                      onClick={() => onGridCellClick('bottomUnits')}
                    />
                  </div>
                  
                  {/* Divider Line */}
                  <div className="h-1.5 md:h-2 bg-blue-900 w-full mt-3 md:mt-4 rounded-full self-end"></div>
                  
                  {/* Answer Row */}
                  <div className="flex justify-end gap-2 md:gap-4 mt-2 md:mt-4 h-20 md:h-24 items-center pr-2 md:pr-4">
                    {(phase === 'calc_units' || phase === 'calc_tens' || phase === 'success') && requireCalc ? (
                      <>
                        {Math.floor(question.answer / 10) > 0 && (
                          <GridDigitCell
                            value={grid.answerTens}
                            isTarget={phase === 'calc_tens'}
                            isError={errorCell === 'answerTens'}
                            showEmptyBox={phase === 'calc_tens' || phase === 'success'}
                            onClick={() => {}}
                            textColorClass={phase === 'success' ? 'text-green-500' : 'text-blue-600'}
                          />
                        )}
                        <GridDigitCell
                          value={grid.answerUnits}
                          isTarget={phase === 'calc_units'}
                          isError={errorCell === 'answerUnits'}
                          showEmptyBox={phase === 'calc_units' || phase === 'calc_tens' || phase === 'success'}
                          onClick={() => {}}
                          textColorClass={phase === 'success' ? 'text-green-500' : 'text-blue-600'}
                        />
                      </>
                    ) : <div className="w-12 h-16 md:w-16 md:h-24 shrink-0"></div>}
                  </div>
                </div>
              </div>

              {/* Success Overlay Animation */}
              <AnimatePresence>
                {phase === 'success' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-green-200">
                      <Smile className="w-24 h-24 md:w-32 md:h-32 text-green-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 shrink-0">
          <div className="bg-blue-600 rounded-3xl md:rounded-[40px] p-4 md:p-6 shadow-2xl flex-1 flex flex-col min-h-[200px] lg:min-h-0">
            <h3 className="text-white text-center font-bold text-lg md:text-xl mb-2 md:mb-4 italic">
              {!requireCalc && phase !== 'success' ? '排排隊' : 
               phase === 'success' ? '答對了！' : '選出正確數字'}
            </h3>
            
            {phase === 'success' ? (
              <div className="flex-1 flex items-center justify-center">
                <button
                  onClick={onNext}
                  className="w-full h-20 md:h-32 bg-orange-500 text-white rounded-[24px] md:rounded-3xl font-black text-2xl md:text-4xl shadow-lg border-b-4 md:border-b-8 border-orange-700 active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center"
                >
                  下一題 <ArrowRight className="ml-2 md:ml-4 w-8 h-8 md:w-12 md:h-12" />
                </button>
              </div>
            ) : !requireCalc ? (
              <div className="flex-1 flex items-center justify-center p-2 md:p-4 text-center">
                <p className="text-lg md:text-2xl font-bold text-blue-200">
                  把橫式裡的數字<br/><br/>
                  排到正確的格子裡！
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                {phase === 'calc_units' && (
                  <div className="bg-blue-500/40 text-white rounded-xl p-2 mb-2 text-xs md:text-sm text-center font-bold backdrop-blur-sm animate-pulse">
                    {hasCarry ? '💡 看個位積木：滿 10 個積木組裝進位後，個位還剩下幾個積木？' : '💡 點擊橘色積木可以練習數數喔！大數記心裡，小數往上數！'}
                  </div>
                )}
                {phase === 'calc_tens' && (
                  <div className="bg-blue-500/40 text-white rounded-xl p-2 mb-2 text-xs md:text-sm text-center font-bold backdrop-blur-sm animate-pulse">
                    {hasCarry ? '💡 看十位棒：加上進位的 1 條十位棒，十位現在一共有幾條十位棒？' : '💡 數數看有幾條藍色十位棒（一條代表10）！'}
                  </div>
                )}
                <div className={`grid grid-cols-5 lg:grid-cols-2 gap-2 md:gap-4 flex-1 transition-opacity duration-500 ${(phase === 'calc_units' || phase === 'calc_tens') ? 'opacity-100 pointer-events-auto' : 'opacity-40 pointer-events-none'}`}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                    <button
                      key={num}
                      onClick={() => onNumpadClick(num)}
                      disabled={phase !== 'calc_units' && phase !== 'calc_tens'}
                      className="bg-white hover:bg-yellow-50 rounded-xl md:rounded-3xl shadow-sm md:shadow-lg border-b-4 md:border-b-8 border-gray-200 flex items-center justify-center text-2xl md:text-4xl font-black text-blue-600 active:translate-y-1 active:border-b-2 md:active:border-b-4 transition-all py-2 md:py-0"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl md:rounded-[40px] p-4 md:p-6 shadow-xl border-4 border-pink-50 flex items-center gap-4 overflow-hidden relative shrink-0">
            <div className="z-10 flex-1">
              <h4 className="font-bold text-pink-600 text-sm md:text-base">小小收藏家</h4>
              <p className="text-xs md:text-sm text-pink-400">再對 {3 - (stars % 3)} 題拿恐龍蛋！</p>
            </div>
            <div className="flex justify-end relative shrink-0">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-pink-100 rounded-full flex items-center justify-center text-2xl md:text-4xl shadow-inner">
                {stars >= 3 && stars % 3 === 0 && phase === 'success' ? '🦖' : '🥚'}
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 text-lg md:text-2xl">✨</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberGroup({
  num, source, activeDigit, placedDigits, errorDigit, onDigitClick
}: {
  num: number, source: 'num1'|'num2', 
  activeDigit: {source: 'num1'|'num2', place: 'tens'|'units', value: string} | null,
  placedDigits: Record<string, boolean>,
  errorDigit: {source: 'num1'|'num2', place: 'tens'|'units'} | null,
  onDigitClick: (s: 'num1'|'num2', p: 'tens'|'units', v: string) => void
}) {
  const tens = Math.floor(num / 10);
  const units = num % 10;
  const hasTens = num > 9;

  return (
    <div className="flex gap-1 md:gap-2">
      {hasTens && (
        <DigitBox
          value={tens.toString()}
          isActive={activeDigit?.source === source && activeDigit?.place === 'tens'}
          isPlaced={placedDigits[`${source}Tens`]}
          isError={errorDigit?.source === source && errorDigit?.place === 'tens'}
          onClick={() => onDigitClick(source, 'tens', tens.toString())}
        />
      )}
      <DigitBox
        value={units.toString()}
        isActive={activeDigit?.source === source && activeDigit?.place === 'units'}
        isPlaced={placedDigits[`${source}Units`]}
        isError={errorDigit?.source === source && errorDigit?.place === 'units'}
        onClick={() => onDigitClick(source, 'units', units.toString())}
      />
    </div>
  )
}

function DigitBox({ value, isActive, isPlaced, isError, onClick }: { value: string, isActive: boolean, isPlaced: boolean, isError: boolean, onClick: () => void }) {
  if (isPlaced) {
    return (
      <div className="w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-24 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-4xl sm:text-5xl md:text-7xl font-bold text-gray-300 border-4 border-dashed border-gray-200 shrink-0">
        {value}
      </div>
    );
  }

  return (
    <motion.button
      animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center text-4xl sm:text-5xl md:text-7xl font-bold shadow-md transition-all border-4 active:translate-y-1 active:shadow-sm shrink-0
        ${isActive ? 'bg-yellow-50 border-yellow-400 text-yellow-600 ring-4 ring-yellow-200' : 
          isError ? 'bg-red-50 border-red-400 text-red-600 ring-4 ring-red-200' :
          'bg-white border-blue-200 text-blue-900 hover:bg-blue-50 cursor-pointer'}`}
    >
      {value}
    </motion.button>
  );
}

function GridDigitCell({ value, isTarget, isError, showEmptyBox, onClick, textColorClass = 'text-blue-900' }: { value: string | null, isTarget: boolean, isError: boolean, showEmptyBox: boolean, onClick: () => void, textColorClass?: string }) {
  if (value !== null) {
    return (
      <div className={`w-12 h-16 md:w-16 md:h-24 rounded-lg md:rounded-xl flex items-center justify-center text-5xl md:text-7xl font-black shrink-0 ${textColorClass}`}>
        {value}
      </div>
    );
  }

  if (!showEmptyBox) {
    return <div className="w-12 h-16 md:w-16 md:h-24 shrink-0"></div>;
  }

  let baseClass = 'w-12 h-16 md:w-16 md:h-24 rounded-lg md:rounded-xl flex items-center justify-center transition-all border-4 shrink-0 ';
  
  if (isError) {
    baseClass += 'bg-red-50 border-red-400 border-dashed ring-4 ring-red-200 text-red-900';
  } else if (isTarget) {
    baseClass += 'bg-green-50 border-green-300 border-dashed animate-pulse ring-4 ring-green-100 cursor-pointer';
  } else {
    baseClass += 'bg-transparent border-gray-200 border-dashed opacity-50';
  }

  return (
    <motion.button
      animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      disabled={!isTarget && !isError}
      className={baseClass}
    />
  );
}

function VisualBlocks({ 
  num, 
  isCrossedOut = 0
}: { 
  num: number, 
  isCrossedOut?: number
}) {
  const tens = Math.floor(num / 10);
  const units = num % 10;
  
  const crossedTens = Math.floor(isCrossedOut / 10);
  const crossedUnits = isCrossedOut % 10;

  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  const handleUnitClick = (i: number) => {
    playSound('tap');
    setTappedIndex(i);
    setTimeout(() => setTappedIndex(null), 300);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 md:gap-3 items-center justify-end shrink-0 select-none">
      {/* Tens: Rendered as Ten Rods (十位棒, 1 bar = 1 ten = 10 units) */}
      {tens > 0 && (
        <div className="flex gap-1 md:gap-1.5 items-center">
          {Array.from({ length: tens }).map((_, i) => {
            const crossed = i >= tens - crossedTens;
            return (
              <div key={`ten-${i}`} className="relative flex items-center justify-center">
                <div className={`w-3.5 h-12 md:w-4.5 md:h-16 rounded-md border-2 flex flex-col justify-between overflow-hidden shadow-sm ${crossed ? 'bg-gray-100 border-gray-300' : 'bg-blue-500 border-blue-600'}`}>
                  {/* 10 segmented segments */}
                  {Array.from({ length: 9 }).map((_, segIdx) => (
                    <div key={segIdx} className={`w-full border-b ${crossed ? 'border-gray-200' : 'border-blue-400/60'}`} />
                  ))}
                </div>
                {crossed && <div className="absolute inset-0 flex items-center justify-center text-red-500 text-2xl md:text-3xl font-black z-10">×</div>}
              </div>
            )
          })}
        </div>
      )}
      {/* Units: Rendered as clean Unit Cubes (個位積木, 5-group aligned) */}
      {units > 0 && (
        <div className={`grid ${units > 5 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 md:gap-1.5 content-center`}>
          {Array.from({ length: units }).map((_, i) => {
            const crossed = i >= units - crossedUnits;
            const isTapped = tappedIndex === i;
            return (
              <motion.div 
                key={`unit-${i}`} 
                onClick={() => handleUnitClick(i)}
                whileTap={{ scale: 1.25 }}
                className="relative flex items-center justify-center cursor-pointer"
              >
                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-[4px] md:rounded-md border-2 transition-transform ${isTapped ? 'scale-125 ring-2 ring-yellow-400' : ''} ${crossed ? 'bg-gray-200 border-gray-300' : 'bg-amber-400 border-amber-500 hover:bg-amber-300'} shadow-sm`} />
                {crossed && <div className="absolute inset-0 flex items-center justify-center text-red-500 text-base md:text-xl font-black z-10">×</div>}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function CarryingEquationBlocks({
  num1,
  num2,
  level,
  phase,
  gridAnswerUnits,
  grid
}: {
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
}) {
  const tens1 = Math.floor(num1 / 10);
  const units1 = num1 % 10;
  const tens2 = Math.floor(num2 / 10);
  const units2 = num2 % 10;

  const isSubtraction = level === 'subtraction';
  const hasCarry = !isSubtraction && (units1 + units2 >= 10);

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

  // Auto-bundle when the answer is provided to ensure UI consistency
  useEffect(() => {
    if (hasCarry && bundleState === 'idle' && (gridAnswerUnits !== null || phase === 'calc_tens' || phase === 'success')) {
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
        playSound('correct'); // Play a chime when reaching 10
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
      // manual bundle
      setClickedUnits(Array.from({ length: 10 }, (_, i) => i));
      setBundleState('gathering');
      setTimeout(() => setBundleState('bundled'), 1200);
    } else {
      setBundleState('idle');
      setClickedUnits([]);
    }
  };

  const renderTenBlock = (index: number, isCarried: boolean = false, isCrossed: boolean = false) => {
    const isClicked = clickedTens.includes(index);
    const clickNumber = isClicked && !isCrossed ? clickedTens.indexOf(index) + 1 : null;

    const blockClass = `w-3.5 h-10 md:w-4.5 md:h-14 rounded-md border-2 shadow-sm flex flex-col justify-between overflow-hidden relative transition-colors ${
      isCrossed
        ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60'
        : isCarried
        ? 'border-yellow-500 bg-blue-500 ring-4 ring-yellow-300 shadow-lg cursor-pointer'
        : 'border-blue-600 bg-blue-500 cursor-pointer'
    } ${isClicked && !isCarried && !isCrossed ? 'brightness-110' : ''}`;

    return (
      <motion.div
        key={`ten-${index}`}
        onClick={() => !isCrossed && handleTenClick(index)}
        whileHover={{ scale: !isCrossed && !isClicked ? 1.1 : 1 }}
        whileTap={{ scale: !isCrossed && !isClicked ? 0.9 : 1 }}
        className="relative flex items-center justify-center"
      >
        <div className={blockClass}>
          {Array.from({ length: 9 }).map((_, segIdx) => (
            <div key={segIdx} className={`w-full border-b ${isCrossed ? 'border-gray-300' : 'border-blue-400/60'}`} />
          ))}
          {isCrossed && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 text-lg font-black z-10">×</div>
          )}
        </div>
        {clickNumber && (
          <span className="absolute text-white font-black text-[12px] md:text-[14px] drop-shadow-md z-10">
            {clickNumber}
          </span>
        )}
      </motion.div>
    );
  };

  const renderUnitBlock = (index: number, isCrossed: boolean = false) => {
    const isClicked = clickedUnits.includes(index);
    const clickIndex = clickedUnits.indexOf(index);
    
    let clickNumber = null;
    if (isClicked && !isCrossed) {
      if (hasCarry) {
        if (clickIndex < 10) {
          clickNumber = clickIndex + 1;
        } else {
          clickNumber = clickIndex - 9; // 10th index -> 1
        }
      } else {
        clickNumber = clickIndex + 1;
      }
    }

    // Hide the ones that were part of the 10 when bundled
    if (hasCarry && bundleState === 'bundled' && isClicked && clickIndex < 10) {
      return null;
    }

    // When gathering, shrink the 10 units so they look like they disappear into the rod
    const isGatheringTarget = hasCarry && bundleState === 'gathering' && isClicked && clickIndex < 10;

    return (
      <motion.div
        key={`u-${index}`}
        onClick={() => !isCrossed && handleUnitClick(index)}
        animate={isGatheringTarget ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        whileHover={{ scale: !isCrossed && !isClicked ? 1.1 : 1 }}
        whileTap={{ scale: !isCrossed && !isClicked ? 0.9 : 1 }}
        transition={{ duration: isGatheringTarget ? 0.4 : 0 }}
        className={`relative w-5 h-5 md:w-7 md:h-7 border rounded-sm shadow-sm flex items-center justify-center transition-colors ${
          isCrossed
            ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60'
            : isClicked
            ? 'bg-amber-500 border-amber-600 cursor-pointer'
            : 'bg-amber-300 border-amber-400 hover:bg-amber-400 cursor-pointer'
        }`}
      >
        {isCrossed && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs font-black z-10">×</div>
        )}
        {clickNumber && (
          <span className="text-white font-black text-[10px] md:text-[12px] drop-shadow-sm z-10">
            {clickNumber}
          </span>
        )}
      </motion.div>
    );
  };

  const showTopTens = grid.topTens !== null || phase === 'calc_units' || phase === 'calc_tens' || phase === 'success';
  const showTopUnits = grid.topUnits !== null || phase === 'calc_units' || phase === 'calc_tens' || phase === 'success';
  const showBottomTens = grid.bottomTens !== null || phase === 'calc_units' || phase === 'calc_tens' || phase === 'success';
  const showBottomUnits = grid.bottomUnits !== null || phase === 'calc_units' || phase === 'calc_tens' || phase === 'success';

  return (
    <div className="flex gap-3 md:gap-5 items-end justify-end select-none pr-1 md:pr-2">
      {/* Tens Column (十位棒區) */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Header Label */}
        <div className="text-xs font-black text-blue-600 mb-1">十位棒</div>

        {/* Carried Ten Rod at top slot */}
        <div className="h-12 md:h-16 flex items-center justify-center w-full">
          {hasCarry && bundleState === 'bundled' && (
            <motion.div
              layoutId="bundle-anim"
              className="relative flex items-center justify-center z-50 cursor-pointer"
              transition={{ type: "spring", stiffness: 60, damping: 12 }}
              onClick={() => handleTenClick(tens1 + tens2)}
              whileHover={{ scale: !clickedTens.includes(tens1 + tens2) ? 1.1 : 1 }}
              whileTap={{ scale: !clickedTens.includes(tens1 + tens2) ? 0.9 : 1 }}
            >
              <div className={`w-3.5 h-10 md:w-4.5 md:h-14 rounded-md border-2 border-yellow-500 bg-blue-500 shadow-lg flex flex-col justify-between overflow-hidden ring-4 ring-yellow-300 ${clickedTens.includes(tens1 + tens2) ? 'brightness-110' : ''}`}>
                {Array.from({ length: 9 }).map((_, segIdx) => (
                  <div key={segIdx} className="w-full border-b border-blue-400/60" />
                ))}
              </div>
              {clickedTens.includes(tens1 + tens2) && (
                <span className="absolute text-white font-black text-[12px] md:text-[14px] drop-shadow-md z-10">
                  {clickedTens.indexOf(tens1 + tens2) + 1}
                </span>
              )}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.5 }}
                className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-950 font-black text-[9px] md:text-xs px-1.5 py-0.5 rounded-full shadow-md border border-yellow-600 animate-bounce whitespace-nowrap"
              >
                +1 🌟
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Tens Frame Box */}
        <div className="relative border-2 border-dashed border-blue-400 bg-blue-50/90 p-2 md:p-3 rounded-2xl flex flex-col items-center gap-1.5 md:gap-2 min-w-[70px] md:min-w-[100px] min-h-[100px]">
          {/* Top Row Tens */}
          <div className="flex flex-wrap gap-1 max-w-[90px] md:max-w-[120px] justify-center min-h-[40px] items-center">
            {showTopTens && Array.from({ length: tens1 }).map((_, i) => {
              const isCrossed = isSubtraction && showBottomTens && i >= tens1 - tens2;
              return renderTenBlock(i, false, isCrossed);
            })}
          </div>

          {/* Divider line for addition */}
          {!isSubtraction && showBottomTens && tens2 > 0 && (
            <div className="w-full border-b-2 border-dashed border-blue-300/80" />
          )}

          {/* Bottom Row Tens (addition only) */}
          {!isSubtraction && (
            <div className="flex flex-wrap gap-1 max-w-[90px] md:max-w-[120px] justify-center min-h-[40px] items-center">
              {showBottomTens && Array.from({ length: tens2 }).map((_, i) => renderTenBlock(tens1 + i, false, false))}
            </div>
          )}
        </div>
      </div>

      {/* Units Column (個位粒粒區 & 滿10組裝進位) */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Header Label */}
        <div className="text-xs font-black text-amber-600 mb-1">個位粒</div>

        {/* Interactive Bundle Toggle Button slot */}
        <div className="h-12 md:h-16 flex items-center justify-center">
          {hasCarry && (
            <button
              onClick={handleToggleBundle}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 active:scale-95 text-amber-950 text-[10px] md:text-xs font-black px-2.5 py-1 rounded-full shadow-md border border-amber-300 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap z-10"
            >
              <span>{bundleState !== 'idle' ? '↺ 重新數' : '🪄 自動數滿 10 個'}</span>
            </button>
          )}
        </div>

        {/* Units Cubes Container */}
        <div className="relative border-2 border-dashed border-amber-400 bg-amber-50/90 p-2 md:p-3 rounded-2xl flex flex-col items-center gap-1.5 md:gap-2 min-w-[100px] md:min-w-[140px] min-h-[100px]">

          {hasCarry && bundleState === 'gathering' && (
            <motion.div
              layoutId="bundle-anim"
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-3.5 h-10 md:w-4.5 md:h-14 rounded-md border-2 border-yellow-500 bg-blue-500 shadow-[0_0_15px_rgba(253,224,71,1)] flex flex-col justify-between overflow-hidden ring-4 ring-yellow-300">
                  {Array.from({ length: 9 }).map((_, segIdx) => (
                    <div key={segIdx} className="w-full border-b border-blue-400/60" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Units grid */}
          <div className="flex flex-col gap-1.5 md:gap-2 items-center">
            {/* Top row units */}
            <div className="flex flex-wrap gap-1 md:gap-1.5 max-w-[90px] md:max-w-[120px] justify-center">
              {showTopUnits && Array.from({ length: units1 }).map((_, i) => {
                const globalIndex = i;
                const isCrossed = isSubtraction && showBottomUnits && i >= units1 - units2;
                return renderUnitBlock(globalIndex, isCrossed);
              })}
            </div>

            {/* Divider line for addition */}
            {!isSubtraction && showBottomUnits && units2 > 0 && bundleState !== 'bundled' && (
              <div className="w-full border-b-2 border-dashed border-amber-300/80" />
            )}

            {/* Bottom row units (addition only) */}
            {!isSubtraction && (
              <div className="flex flex-wrap gap-1 md:gap-1.5 max-w-[90px] md:max-w-[120px] justify-center">
                {showBottomUnits && Array.from({ length: units2 }).map((_, i) => {
                  const globalIndex = units1 + i;
                  return renderUnitBlock(globalIndex, false);
                })}
              </div>
            )}
          </div>

          {hasCarry && bundleState === 'bundled' && remainingUnits > 0 && (
             <span className="text-[10px] md:text-xs font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 mt-1 rounded-md whitespace-nowrap">
               剩下 {remainingUnits} 個
             </span>
          )}
        </div>
      </div>
    </div>
  );
}


