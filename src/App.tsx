import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Question, Operator, GamePhase, GameLevel, CastleMilestone } from './types';
import { generateQuestion } from './utils';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { IceKingdomStory } from './components/IceKingdomStory';
import { StoryMilestoneModal } from './components/StoryMilestoneModal';
import { CastlePhotoAlbumModal } from './components/CastlePhotoAlbumModal';
import { CASTLE_MILESTONES } from './storyData';

// Web Audio API Synthesizer for child-friendly crystal sound effects
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

function playSound(type: 'pop' | 'correct' | 'error' | 'tap' | 'magic') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'tap' || type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      // Crystal chime chords (C - E - G - C high)
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.2, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.22);
      });
    } else if (type === 'magic') {
      // Magical Frozen Ice Arpeggio (F - A - C - E - G)
      [349.23, 440.0, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.18, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
        o.start(now + i * 0.05);
        o.stop(now + i * 0.05 + 0.35);
      });
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
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
  const [question, setQuestion] = useState<Question | null>(null);
  const [phase, setPhase] = useState<GamePhase>('arrange');
  const [showCastleStory, setShowCastleStory] = useState(false);
  const [showCastleAlbum, setShowCastleAlbum] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<CastleMilestone | null>(null);

  const [stars, setStars] = useState<number>(() => {
    try {
      const saved =
        typeof window !== 'undefined'
          ? localStorage.getItem('math_game_stars')
          : null;
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [seenMilestoneIds, setSeenMilestoneIds] = useState<string[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('math_seen_milestones') : null;
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('math_game_stars', stars.toString());
      }
    } catch {
      // Ignore storage restrictions
    }
  }, [stars]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('math_seen_milestones', JSON.stringify(seenMilestoneIds));
      }
    } catch {
      // Ignore storage restrictions
    }
  }, [seenMilestoneIds]);

  // Check and trigger milestone when stars change
  const awardStar = () => {
    setStars((prevStars) => {
      const nextStars = prevStars + 1;
      // Check if nextStars triggers a new milestone
      const newMilestone = CASTLE_MILESTONES.find(
        (m) => m.starsRequired === nextStars && !seenMilestoneIds.includes(m.id)
      );
      if (newMilestone) {
        setTimeout(() => {
          playSound('magic');
          setActiveMilestone(newMilestone);
          setSeenMilestoneIds((prev) => [...prev, newMilestone.id]);
        }, 600);
      }
      return nextStars;
    });
  };

  // Grid state for individual digits
  const [grid, setGrid] = useState<{
    topTens: string | null;
    topUnits: string | null;
    bottomTens: string | null;
    bottomUnits: string | null;
    answerTens: string | null;
    answerUnits: string | null;
  }>({
    topTens: null,
    topUnits: null,
    bottomTens: null,
    bottomUnits: null,
    answerTens: null,
    answerUnits: null,
  });

  const [placedDigits, setPlacedDigits] = useState<{
    num1Tens: boolean;
    num1Units: boolean;
    num2Tens: boolean;
    num2Units: boolean;
  }>({
    num1Tens: false,
    num1Units: false,
    num2Tens: false,
    num2Units: false,
  });

  const [activeDigit, setActiveDigit] = useState<{
    source: 'num1' | 'num2';
    place: 'tens' | 'units';
    value: string;
  } | null>(null);
  const [errorCell, setErrorCell] = useState<
    | 'topTens'
    | 'topUnits'
    | 'bottomTens'
    | 'bottomUnits'
    | 'answerTens'
    | 'answerUnits'
    | null
  >(null);
  const [errorDigit, setErrorDigit] = useState<{
    source: 'num1' | 'num2';
    place: 'tens' | 'units';
  } | null>(null);

  const resetTurn = () => {
    setPhase('arrange');
    setGrid({
      topTens: null,
      topUnits: null,
      bottomTens: null,
      bottomUnits: null,
      answerTens: null,
      answerUnits: null,
    });
    setPlacedDigits({
      num1Tens: false,
      num1Units: false,
      num2Tens: false,
      num2Units: false,
    });
    setActiveDigit(null);
    setErrorCell(null);
    setErrorDigit(null);
  };

  const startGame = (level: GameLevel) => {
    setGameLevel(level);
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
            particleCount: 6,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.7 },
            colors: ['#38bdf8', '#fbbf24', '#f472b6', '#a78bfa', '#ffffff'],
          });
          confetti({
            particleCount: 6,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.7 },
            colors: ['#38bdf8', '#fbbf24', '#f472b6', '#a78bfa', '#ffffff'],
          });
        } catch {
          // ignore
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

  const handleGridCellClick = (
    cellName: 'topTens' | 'topUnits' | 'bottomTens' | 'bottomUnits'
  ) => {
    if (!question || !activeDigit) return;

    const isCorrectCell =
      (activeDigit.source === 'num1' &&
        activeDigit.place === 'tens' &&
        cellName === 'topTens') ||
      (activeDigit.source === 'num1' &&
        activeDigit.place === 'units' &&
        cellName === 'topUnits') ||
      (activeDigit.source === 'num2' &&
        activeDigit.place === 'tens' &&
        cellName === 'bottomTens') ||
      (activeDigit.source === 'num2' &&
        activeDigit.place === 'units' &&
        cellName === 'bottomUnits');

    if (isCorrectCell) {
      playSound('pop');
      setGrid((prev) => ({ ...prev, [cellName]: activeDigit.value }));

      const newPlaced = {
        ...placedDigits,
        [`${activeDigit.source}${
          activeDigit.place === 'tens' ? 'Tens' : 'Units'
        }`]: true,
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
          awardStar();
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

  const handleDigitClick = (
    source: 'num1' | 'num2',
    place: 'tens' | 'units',
    value: string
  ) => {
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
        setGrid((prev) => ({ ...prev, answerUnits: num.toString() }));
        if (ansTens > 0) {
          setPhase('calc_tens');
        } else {
          playSound('correct');
          setPhase('success');
          awardStar();
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
        setGrid((prev) => ({ ...prev, answerTens: num.toString() }));
        setPhase('success');
        awardStar();
        triggerConfetti();
      } else {
        playSound('error');
        setErrorCell('answerTens');
        setTimeout(() => setErrorCell(null), 600);
      }
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-[#11375d] via-[#164b7c] to-[#0a2644] font-sans flex flex-col items-center justify-center p-1 sm:p-3 md:p-6 overflow-x-hidden overflow-y-auto select-none">
      {/* Background Floating Snowflakes & Sparkles Pattern (Optimized static background with crisp stars) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-6 left-8 text-cyan-200 text-xl opacity-70">❄️</div>
        <div className="absolute top-20 right-12 text-cyan-100 text-2xl opacity-60">❄️</div>
        <div className="absolute bottom-16 left-12 text-cyan-200 text-xl opacity-60">❄️</div>
        <div className="absolute bottom-24 right-16 text-cyan-100 text-2xl opacity-70">❄️</div>
        
        <div className="absolute top-1/4 left-1/5 text-amber-200 text-sm opacity-60">✨</div>
        <div className="absolute top-1/3 right-1/4 text-white text-base opacity-70">✨</div>
        <div className="absolute bottom-1/3 left-1/3 text-cyan-200 text-xs opacity-50">✨</div>
        <div className="absolute top-2/3 right-1/5 text-amber-200 text-sm opacity-60">✨</div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        {gameState === 'menu' ? (
          <MainMenu
            onStart={startGame}
            stars={stars}
            requireCalc={requireCalc}
            setRequireCalc={setRequireCalc}
            onOpenCastle={() => setShowCastleStory(true)}
            onOpenAlbum={() => setShowCastleAlbum(true)}
          />
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
              setRequireCalc((prev) => {
                const nextVal = !prev;
                if (!nextVal && (phase === 'calc_units' || phase === 'calc_tens')) {
                  playSound('correct');
                  setPhase('success');
                  awardStar();
                  triggerConfetti();
                }
                return nextVal;
              });
            }}
            playSound={playSound}
            onOpenCastle={() => setShowCastleStory(true)}
            onOpenAlbum={() => setShowCastleAlbum(true)}
          />
        )}
      </div>

      {/* Interactive Ice Kingdom Castle Story Modal */}
      <IceKingdomStory
        stars={stars}
        isOpen={showCastleStory}
        onClose={() => setShowCastleStory(false)}
        onOpenAlbum={() => setShowCastleAlbum(true)}
        onPlaySound={playSound}
      />

      {/* Castle Growth Photo Album Modal */}
      <CastlePhotoAlbumModal
        isOpen={showCastleAlbum}
        stars={stars}
        onClose={() => setShowCastleAlbum(false)}
        onPlaySound={playSound}
      />

      {/* Story Milestone Celebration Modal */}
      {activeMilestone && (
        <StoryMilestoneModal
          milestone={activeMilestone}
          onClose={() => setActiveMilestone(null)}
          onOpenCastle={() => {
            setActiveMilestone(null);
            setShowCastleStory(true);
          }}
        />
      )}
    </div>
  );
}

