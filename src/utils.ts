import { Question, GameLevel } from './types';

export function generateQuestion(level: GameLevel, stars: number): Question {
  let num1 = 0;
  let num2 = 0;
  const operator = level === 'subtraction' ? '-' : '+';

  // 0-2 stars: 1-digit and 2-digit (or vice versa)
  // 3+ stars: 2-digit and 2-digit
  const isLevel2 = stars >= 3;

  if (level === 'addition') {
    // Addition without carry (unit1 + unit2 < 10)
    if (!isLevel2) {
      const unit1 = Math.floor(Math.random() * 8) + 1; // 1-8
      const unit2 = Math.floor(Math.random() * (9 - unit1)) + 1; // 1 to (9-unit1)
      const ten1 = Math.floor(Math.random() * 3) + 1; // 1-3
      
      if (Math.random() > 0.5) {
        num1 = unit1;
        num2 = ten1 * 10 + unit2;
      } else {
        num1 = ten1 * 10 + unit1;
        num2 = unit2;
      }
    } else {
      const unit1 = Math.floor(Math.random() * 8) + 1; // 1-8
      const unit2 = Math.floor(Math.random() * (9 - unit1)) + 1;
      const ten1 = Math.floor(Math.random() * 4) + 1; // 1-4
      const ten2 = Math.floor(Math.random() * (5 - ten1)) + 1; // 1 to (5-ten1)
      
      num1 = ten1 * 10 + unit1;
      num2 = ten2 * 10 + unit2;
    }
  } else if (level === 'carrying_addition') {
    // Addition WITH carry (unit1 + unit2 >= 10, 滿十進一)
    if (!isLevel2) {
      const unit1 = Math.floor(Math.random() * 5) + 5; // 5-9
      const minUnit2 = 10 - unit1;
      const unit2 = Math.floor(Math.random() * (9 - minUnit2 + 1)) + minUnit2; // minUnit2 to 9
      const ten1 = Math.floor(Math.random() * 3) + 1; // 1-3
      
      if (Math.random() > 0.5) {
        num1 = unit1;
        num2 = ten1 * 10 + unit2;
      } else {
        num1 = ten1 * 10 + unit1;
        num2 = unit2;
      }
    } else {
      const unit1 = Math.floor(Math.random() * 5) + 5; // 5-9
      const minUnit2 = 10 - unit1;
      const unit2 = Math.floor(Math.random() * (9 - minUnit2 + 1)) + minUnit2; // minUnit2 to 9
      const ten1 = Math.floor(Math.random() * 3) + 1; // 1-3
      const ten2 = Math.floor(Math.random() * (4 - ten1)) + 1; // 1 to (4-ten1)
      
      num1 = ten1 * 10 + unit1;
      num2 = ten2 * 10 + unit2;
    }
  } else {
    // Subtraction
    if (!isLevel2) {
      const unit1 = Math.floor(Math.random() * 8) + 2; // 2-9
      const unit2 = Math.floor(Math.random() * (unit1 - 1)) + 1; // 1 to unit1-1
      const ten1 = Math.floor(Math.random() * 3) + 1; // 1-3
      
      num1 = ten1 * 10 + unit1;
      num2 = unit2;
    } else {
      const unit1 = Math.floor(Math.random() * 8) + 2; // 2-9
      const unit2 = Math.floor(Math.random() * (unit1 - 1)) + 1;
      const ten1 = Math.floor(Math.random() * 4) + 2; // 2-5
      const ten2 = Math.floor(Math.random() * (ten1 - 1)) + 1;
      
      num1 = ten1 * 10 + unit1;
      num2 = ten2 * 10 + unit2;
    }
  }

  return {
    num1,
    num2,
    operator,
    answer: operator === '+' ? num1 + num2 : num1 - num2,
  };
}

