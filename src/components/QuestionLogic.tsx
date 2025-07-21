import React, { useState, useMemo } from "react";
import questionItems from "../questions.json";
import QuestionComponent from "./QuestionComponent";

const QuestionLogic: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [performance, setPerformance] = useState<{
    [key: string]: { correct: number; wrong: number };
  }>({});

  // Get unique categories
  const categories = useMemo(() => {
    const allCategories = questionItems.map((q) => q.category);
    return ["All", ...Array.from(new Set(allCategories))];
  }, []);

  // Filter questions based on selected category
  const filteredQuestions = useMemo(() => {
    return selectedCategory === "All"
      ? questionItems
      : questionItems.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      prev < filteredQuestions.length - 1 ? prev + 1 : prev
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
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentQuestionIndex(randomIndex);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentQuestionIndex(0); // reset to first question of that category
  };

  const handleAnswer = (wasCorrect: boolean, category: string) => {
    setPerformance((prev) => {
      const stats = prev[category] || { correct: 0, wrong: 0 };
      return {
        ...prev,
        [category]: {
          correct: stats.correct + (wasCorrect ? 1 : 0),
          wrong: stats.wrong + (wasCorrect ? 0 : 1),
        },
      };
    });
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
            disabled={currentQuestionIndex === filteredQuestions.length - 1}
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

        <div className="flex flex-col lg:flex-col sm:flex-row gap-2 items-center">
          <label className="text-sm text-text">Category:</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="rounded-md border border-border bg-surface text-text px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label htmlFor="question-select" className="text-sm text-text">
            Jump to:
          </label>
          <select
            id="question-select"
            value={currentQuestionIndex}
            onChange={handleSelectQuestion}
            className="rounded-md border border-border bg-surface text-text px-3 py-2"
          >
            {filteredQuestions.map((_, index) => (
              <option key={index} value={index}>
                Question {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <QuestionComponent
          key={currentQuestionIndex}
          index={currentQuestionIndex}
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          correctAnswer={currentQuestion.correct_answer}
          category={currentQuestion.category}
          onAnswer={handleAnswer}
        />
      )}

      {/* Performance */}
      <div className="mt-6 border-t pt-4 text-sm text-text">
        <h2 className="font-semibold mb-2">Performance Summary</h2>
        {Object.entries(performance).map(([cat, stats]) => (
          <div key={cat}>
            <strong>{cat}:</strong> ✅ {stats.correct} | ❌ {stats.wrong}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionLogic;
