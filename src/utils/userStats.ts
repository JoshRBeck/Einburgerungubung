import { db } from "../firebase";
import { setDoc, doc, increment } from "firebase/firestore";
import type { UserStats } from "../types/userStats";

type StatKey = keyof Omit<UserStats, "email">;
type StatUpdate = Partial<Record<StatKey, ReturnType<typeof increment>>>;

export const updateUserStats = async (
  uid: string,
  correct: boolean,
  numbersOfQuestion: number
): Promise<void> => {
  const updates: StatUpdate = {};
  if (correct) {
    updates.answersCorrect = increment(1);
  } else {
    updates.answersWrong = increment(1);
  }
  if (numbersOfQuestion > 0) {
    updates.questionsAnswered = increment(1);
  }
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, updates, { merge: true });
    console.log("User stats updated.");
  } catch (err) {
    // We'll improve error handling in the next step!
    console.error("Error updating stats:", err);
  }
};