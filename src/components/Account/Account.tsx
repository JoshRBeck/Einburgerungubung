import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Account: React.FC = () => {
  const { user } = useAuth();

  // Example stats, replace with real data if available
  const answersCorrect = 42;
  const answersWrong = 13;
  const ratio = answersCorrect + answersWrong > 0
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

      <div className="flex gap-4">
        <Link to="/" className="text-accent underline">Go to Main Test</Link>
        <Link to="/review" className="text-accent underline">Review Mistakes</Link>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-wrong-500 text-white rounded"
        onClick={() => signOut(auth)}
      >
        Logout
      </button>
    </div>
  );
};

export default Account;