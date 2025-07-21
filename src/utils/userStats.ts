import { db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import type { UserStats } from "../types/userStats";

export function isUserStats(obj: unknown): obj is UserStats {
  if (!obj || typeof obj !== "object") return false;
  const stats = obj as Record<string, unknown>;
  return (
    typeof stats.email === "string" &&
    typeof stats.answersCorrect === "number" &&
    typeof stats.answersWrong === "number" &&
    typeof stats.questionsAnswered === "number" &&
    typeof stats.categoryStats === "object"
  );
}

export async function updateUserStats(
  uid: string,
  isCorrect: boolean,
  numbersOfQuestion: number,
  email?: string,
  category?: string
): Promise<void> {
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);

  let stats: UserStats | null = null;
  if (docSnap.exists()) {
    stats = docSnap.data() as UserStats;
  }

  // Defensive: initialize if missing
  if (!stats) {
    stats = {
      email: email || "",
      answersCorrect: 0,
      answersWrong: 0,
      questionsAnswered: 0,
      categoryStats: {},
    };
  }

  // Update top-level stats
  stats.answersCorrect += isCorrect ? 1 : 0;
  stats.answersWrong += isCorrect ? 0 : 1;
  stats.questionsAnswered += numbersOfQuestion > 0 ? 1 : 0;

  // Update category stats
  if (category) {
    if (!stats.categoryStats) stats.categoryStats = {};
    if (!stats.categoryStats[category]) stats.categoryStats[category] = { correct: 0, wrong: 0 };
    if (isCorrect) {
      stats.categoryStats[category].correct += 1;
    } else {
      stats.categoryStats[category].wrong += 1;
    }
  }

  // Always ensure email is present
  if (email) stats.email = email;

  try {
    await setDoc(userDocRef, stats, { merge: true });
    console.log("User stats updated.");
  } catch (err) {
    console.error("Error updating stats:", err);
  }
}