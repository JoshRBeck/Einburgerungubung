import React, { useState } from "react";
import { updateUserStats } from "../utils/userStats";
import { useAuth } from "../context/auth-context"; 
import { Question } from "../types/question";

interface QuestionProps extends Question {
  index: number;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  answers,
  correctAnswer,
  index,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { user } = useAuth(); 

  const handleSelectAnswer = async (answer: string) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
      setShowFeedback(true);

      if (user) {
        const isCorrect = answer === correctAnswer;
        await updateUserStats(user.uid, isCorrect, 1);
      }
    }
  };

  return (
    <section className="bg-surface text-text rounded-lg p-6 shadow-lg max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        Aufgabe {index + 1}
      </h1>

      <h2 className="text-lg mb-6 text-center">{question}</h2>

      <ul className="grid gap-4">
        {answers.map((answer, i) => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = answer === correctAnswer;

          const baseClasses =
            "w-full text-left px-4 py-2 rounded-md border transition duration-300 cursor-pointer";
          const defaultStyle = "bg-muted text-text border-border hover:bg-muted-hover";
          const correctStyle = "bg-correct-500 text-white border-correct-500";
          const incorrectStyle = "bg-wrong-500 text-white border-wrong-500";

          let answerClass = baseClasses + " " + defaultStyle;

          if (showFeedback) {
            if (isCorrect) answerClass = baseClasses + " " + correctStyle;
            else if (isSelected) answerClass = baseClasses + " " + incorrectStyle;
          }

          return (
            <li key={i}>
              <button
                className={answerClass}
                onClick={() => handleSelectAnswer(answer)}
                disabled={showFeedback}
                aria-pressed={isSelected}
              >
                {answer}
              </button>
            </li>
          );
        })}
      </ul>

      {showFeedback && (
        <div className="mt-6 text-center">
          <p
            className={
              selectedAnswer === correctAnswer
                ? "text-correct-500 font-semibold"
                : "text-wrong-500 font-semibold"
            }
          >
            {selectedAnswer === correctAnswer
              ? "✅ Correct!"
              : `❌ Incorrect. The correct answer is: ${correctAnswer}`}
          </p>
        </div>
      )}
    </section>
  );
};

export default QuestionComponent;