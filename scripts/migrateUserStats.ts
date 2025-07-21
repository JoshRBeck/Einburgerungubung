import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
const { default: admin } = await import("firebase-admin");


// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account and questions.json
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./serviceAccountKey.json"), "utf-8"));
const questionsPath = path.resolve(__dirname, "../src/questions.json");
const questions: { category: string }[] = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

interface UserStats {
  email: string;
  answersCorrect: number;
  answersWrong: number;
  questionsAnswered: number;
  categoryStats: {
    [category: string]: {
      correct: number;
      wrong: number;
    };
  };
}

const categories: string[] = Array.from(new Set(questions.map(q => String(q.category))));

const getInitialCategoryStats = (): Record<string, { correct: number; wrong: number }> => {
  const stats: Record<string, { correct: number; wrong: number }> = {};
  categories.forEach((cat) => {
    stats[cat] = { correct: 0, wrong: 0 };
  });
  return stats;
};

async function migrateUserStats() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    const patched: Partial<UserStats> = {
      email: typeof data.email === "string" ? data.email : "unknown@example.com",
      answersCorrect: typeof data.answersCorrect === "number" ? data.answersCorrect : 0,
      answersWrong: typeof data.answersWrong === "number" ? data.answersWrong : 0,
      questionsAnswered: typeof data.questionsAnswered === "number" ? data.questionsAnswered : 0,
      categoryStats: typeof data.categoryStats === "object" && data.categoryStats !== null
        ? { ...getInitialCategoryStats(), ...data.categoryStats }
        : getInitialCategoryStats(),
    };

    await doc.ref.set(patched, { merge: true });
    console.log(`Patched user ${doc.id}:`, patched);
  }
  console.log("Migration complete!");
}

migrateUserStats().catch(console.error);