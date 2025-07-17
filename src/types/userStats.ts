export interface UserStats {
  email: string;
  answersCorrect: number;
  answersWrong: number;
  questionsAnswered: number;
}

export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}