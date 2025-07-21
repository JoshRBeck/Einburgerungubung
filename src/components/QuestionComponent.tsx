import React, { useState } from "react";
import { updateUserStats } from "../utils/userStats";
import { useAuth } from "../context/auth-context";

interface QuestionProps {
  index: number;
  question: string;
  answers: string[];
  correctAnswer: string;
  category: string;
  onAnswer: (wasCorrect: boolean, category: string) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  answers,
  correctAnswer,
  index,
  category,
  onAnswer,
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
      onAnswer(isCorrect, category);

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
    <section
      className="bg-surface text-text rounded-lg p-6 shadow-lg max-w-xl mx-auto"
      aria-labelledby={`question-title-${index}`}
    >
      <div className="flex flex-col gap-2 mb-4">
        <h1 id={`question-title-${index}`} className="text-xl font-semibold">
          Aufgabe {index + 1}
        </h1>
        {category && (
          <span
            className="inline-block self-start bg-muted text-accent px-3 py-1 rounded-full text-xs font-medium tracking-wide"
            aria-label={`Kategorie: ${category}`}
            tabIndex={0}
          >
            {category}
          </span>
        )}
      </div>
      <h2 className="text-lg mb-6 text-center">{question}</h2>
      <ul className="grid gap-4">
        {answers.map((answer, i) => {
          const isSelected = selectedAnswer === answer;
          return (
            <li key={i}>
              <button
                className={`w-full text-left px-4 py-2 rounded-md border transition duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent
                  ${
                    isSelected
                      ? "bg-accent/10 border-accent"
                      : "bg-surface border-border"
                  }`}
                onClick={() => handleSelectAnswer(answer)}
                disabled={showFeedback || isSubmitting}
                aria-pressed={isSelected}
                aria-label={`Antwort ${i + 1}: ${answer}`}
              >
                {answer}
              </button>
            </li>
          );
        })}
      </ul>
      {isSubmitting && (
        <div className="mt-4 text-center text-accent" aria-live="polite">
          Saving your answer...
        </div>
      )}
      {submitSuccess && (
        <div
          className="mt-4 text-center text-correct-500 font-semibold"
          aria-live="polite"
        >
          {submitSuccess}
        </div>
      )}
      {submitError && (
        <div
          className="mt-4 text-center text-wrong-500 font-semibold"
          aria-live="polite"
        >
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
            aria-live="polite"
          >
            {selectedAnswer === correctAnswer
              ? "✅ Correct!"
              : `❌ Incorrect. The correct answer is: ${correctAnswer}`}
          </p>
        </div>
      )}
      {!user && showFeedback && (
        <div className="mt-2 text-center text-muted" aria-live="polite">
          Sign up or log in to save your progress!
        </div>
      )}
    </section>
  );
};

export default QuestionComponent;
