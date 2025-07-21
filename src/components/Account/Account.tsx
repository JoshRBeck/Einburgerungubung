import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserStats } from "../../types/userStats";
import { isUserStats } from "../../utils/userStats";

const Account: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (isUserStats(data)) {
              setStats(data as UserStats);
              setError(null);
            } else {
              setStats({
                email: user.email || "",
                answersCorrect: 0,
                answersWrong: 0,
                questionsAnswered: 0,
                categoryStats: {},
              });
              setError("User stats data is invalid.");
            }
          } else {
            setStats(null);
            setError("No stats found for this user.");
          }
        } catch (err) {
          setStats(null);
          setError("Failed to fetch user stats.");
          console.error("Failed to fetch user stats:", err);
        }
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></span>
        <span className="ml-2">Loading your stats...</span>
      </div>
    );
  }
  const answersCorrect = stats?.answersCorrect ?? 0;
  const answersWrong = stats?.answersWrong ?? 0;
  const ratio =
    answersCorrect + answersWrong > 0
      ? ((answersCorrect / (answersCorrect + answersWrong)) * 100).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hello {user?.email || "User"}!</h1>
      <h3 className="text-lg">Get back to learning!</h3>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Your Stats</h4>
        <ul>
          <li>Correct Answers: {answersCorrect}</li>
          <li>Wrong Answers: {answersWrong}</li>
          <li>Accuracy: {ratio}%</li>
        </ul>
      </div>
      <div className="bg-muted p-4 rounded-lg mt-4">
        <h4 className="font-semibold mb-2">Performance by Category</h4>
        {stats?.categoryStats && Object.keys(stats.categoryStats).length > 0 ? (
          <ul>
            {Object.entries(stats.categoryStats).map(([cat, s]) => (
              <li key={cat} className="mb-1">
                <span className="font-medium">{cat}:</span>{" "}
                <span className="text-correct-500">✅ {s.correct}</span>{" "}
                <span className="text-wrong-500">❌ {s.wrong}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted">No category stats yet.</div>
        )}
      </div>

      <div className="flex gap-4">
        <Link to="/" className="text-accent underline">
          Go to Main Test
        </Link>
        <Link to="/review" className="text-accent underline">
          Review Mistakes
        </Link>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-wrong-500 text-white rounded"
        onClick={() => signOut(auth)}
      >
        Logout
      </button>

      {error && <div className="text-wrong-500 font-semibold">{error}</div>}
    </div>
  );
};

export default Account;
