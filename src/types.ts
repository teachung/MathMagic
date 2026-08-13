export type Operator = '+' | '-';

export type GameLevel = 'addition' | 'carrying_addition' | 'subtraction';

export interface Question {
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
}

export type GamePhase = 'arrange' | 'calc_units' | 'calc_tens' | 'success';
