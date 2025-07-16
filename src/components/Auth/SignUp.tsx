import React, { useState, useEffect } from "react";
import { UserCredential } from "firebase/auth";
import useSignUp from "../../composables/useSignUp";
import { useAuth } from "../../context/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";



const createUserStats = async (uid: string, email: string) => {
  const auth = getAuth();
  console.log("Current user:", auth.currentUser);
  await setDoc(doc(db, "users", uid), {
    email,
    answersCorrect: 0,
    answersWrong: 0,
    questionsAnswered: 0,
  });
  
};


const SignUpComponent = () => {
  const { error, isPending, signup } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/account");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential: UserCredential = await signup(email, password);
      if (userCredential?.user) {
        try {
          await createUserStats(
            userCredential.user.uid,
            userCredential.user.email || ""
          );
        } catch (statsErr) {
          console.error("Error creating user stats:", statsErr);
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-surface rounded-lg shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-accent mb-2">
        Sign up to QuizMaster
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Sign Up form"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-muted text-text focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-muted text-text focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Your password"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {isPending ? "Signing Up..." : "Sign Up"}
        </button>
        {error && (
          <p className="text-center text-wrong-500 mt-2" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-accent underline hover:text-accent-hover"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpComponent;
