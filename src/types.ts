export type Operator = '+' | '-';

export type GameLevel = 'addition' | 'carrying_addition' | 'subtraction';

export interface Question {
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
}

export type GamePhase = 'arrange' | 'calc_units' | 'calc_tens' | 'success';

export interface CastleMilestone {
  id: number;
  starsRequired: number;
  title: string;
  storyText: string;
  unlockedItem: string;
  characterName: string;
  characterEmoji: string;
  castleStage: number; // 0 to 5
}
