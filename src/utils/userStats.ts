import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

type StatKey = "answersCorrect" | "answersWrong" | "questionsAnswered";
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
    await updateDoc(userDocRef, updates);
    console.log("User stats updated.");
  } catch (err) {
    console.error("Error updating stats:", err);
  }
};