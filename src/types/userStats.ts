export interface UserStats {
  email: string;
  answersCorrect: number;
  answersWrong: number;
  questionsAnswered: number;
  categoryStats: {
    [category: string]: {
      correct: number;
      wrong: number;
    };
  };
}

export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}