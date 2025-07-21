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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSelectAnswer = async (answer: string) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
      setShowFeedback(true);
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      const isCorrect = answer === correctAnswer;

      if (user) {
        try {
          await updateUserStats(
            user.uid,
            isCorrect,
            1,
            user.email || undefined
          );
          setSubmitSuccess("Your answer was saved!");
        } catch (err) {
          console.error("Failed to save your answer:", err);
          setSubmitError("Failed to save your answer. Please try again.");
        }
      }
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-surface text-text rounded-lg p-6 shadow-lg max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Aufgabe {index + 1}</h1>
      <h2 className="text-lg mb-6 text-center">{question}</h2>
      <ul className="grid gap-4">
        {answers.map((answer, i) => {
          const isSelected = selectedAnswer === answer;
          return (
            <li key={i}>
              <button
                className="w-full text-left px-4 py-2 rounded-md border transition duration-300 cursor-pointer"
                onClick={() => handleSelectAnswer(answer)}
                disabled={showFeedback || isSubmitting}
                aria-pressed={isSelected}
              >
                {answer}
              </button>
            </li>
          );
        })}
      </ul>
      {isSubmitting && (
        <div className="mt-4 text-center text-accent">
          Saving your answer...
        </div>
      )}
      {submitSuccess && (
        <div className="mt-4 text-center text-correct-500 font-semibold">
          {submitSuccess}
        </div>
      )}
      {submitError && (
        <div className="mt-4 text-center text-wrong-500 font-semibold">
          {submitError}
        </div>
      )}
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
      {!user && showFeedback && (
        <div className="mt-2 text-center text-muted">
          Sign up or log in to save your progress!
        </div>
      )}
    </section>
  );
};

export default QuestionComponent;
