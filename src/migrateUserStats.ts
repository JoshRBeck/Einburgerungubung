import * as admin from "firebase-admin";
import { UserStats } from "../src/types/userStats";

import serviceAccount from "../scripts/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function migrateUserStats() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Patch missing fields with defaults
    const patched: Partial<UserStats> = {
      email: typeof data.email === "string" ? data.email : "unknown@example.com",
      answersCorrect: typeof data.answersCorrect === "number" ? data.answersCorrect : 0,
      answersWrong: typeof data.answersWrong === "number" ? data.answersWrong : 0,
      questionsAnswered: typeof data.questionsAnswered === "number" ? data.questionsAnswered : 0,
    };

    await doc.ref.set(patched, { merge: true });
    console.log(`Patched user ${doc.id}:`, patched);
  }
  console.log("Migration complete!");
}

migrateUserStats().catch(console.error);