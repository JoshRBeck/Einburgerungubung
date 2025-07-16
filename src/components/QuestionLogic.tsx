import React, { useState } from "react";
import questionItems from "../questions.json";
import QuestionComponent from "./question";

const QuestionLogic: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questionItems[currentQuestionIndex];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      prev < questionItems.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSelectQuestion = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentQuestionIndex(Number(event.target.value));
  };

  const handleRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionItems.length);
    setCurrentQuestionIndex(randomIndex);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-8 px-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-muted text-text border border-border rounded px-4 py-2 transition hover:bg-muted-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬅️ Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questionItems.length - 1}
            className="bg-muted text-text border border-border rounded px-4 py-2 transition hover:bg-muted-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next ➡️
          </button>

          <button
            onClick={handleRandomQuestion}
            className="bg-accent text-white rounded px-4 py-2 transition hover:bg-accent-hover"
          >
            🎲 Random
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="question-select" className="text-sm text-text">
            Jump to:
          </label>
          <select
            id="question-select"
            value={currentQuestionIndex}
            onChange={handleSelectQuestion}
            className="rounded-md border border-border bg-surface text-text px-3 py-2"
          >
            {questionItems.map((_, index) => (
              <option key={index} value={index}>
                Question {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Question */}
      <QuestionComponent
        key={currentQuestionIndex}
        index={currentQuestionIndex}
        question={currentQuestion.question}
        answers={currentQuestion.answers}
        correctAnswer={currentQuestion.correct_answer}
      />
    </div>
  );
};

export default QuestionLogic;
