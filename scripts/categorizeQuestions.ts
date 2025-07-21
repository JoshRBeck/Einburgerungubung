import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Question = {
  question: string;
  answers: string[];
  correct_answer: string;
  index: number;
  category?: string;
};

const categories = [
  { name: "Grundrechte & Verfassung", keywords: ["Grundgesetz", "Grundrecht", "Verfassung", "Menschenwürde", "Meinungsfreiheit", "Rechtsstaat", "Artikel", "Freiheit", "Gleichbehandlung", "Asyl", "Pressefreiheit"] },
  { name: "Politisches System & Demokratie", keywords: ["Bundestag", "Bundesrat", "Demokratie", "Republik", "Staatsform", "Parlament", "Regierung", "Opposition", "Koalition", "Ministerpräsident", "Bundeskanzler", "Bundespräsident", "Wahl", "Abgeordnete", "Fraktion", "Staatsgewalt", "Gesetzgebung", "Exekutive", "Judikative", "Legislative", "Wahlen", "Parteien", "5%-Hürde", "Wahlrecht"] },
  { name: "Deutsche Geschichte", keywords: ["Nationalsozialismus", "Hitler", "DDR", "Mauer", "Zweiter Weltkrieg", "Erster Weltkrieg", "Wiedervereinigung", "Stasi", "Besatzungszone", "Alliierte", "Drittes Reich", "Adenauer", "Brandt", "Kohl", "Stunde Null", "Wirtschaftswunder", "Montagsdemonstration", "Warschauer Pakt", "Planwirtschaft", "Gründung", "Juden", "Holocaust", "Synagoge", "NS-Staat", "1945", "1933", "1989", "1990", "SED", "Volksaufstand", "Ostverträge"] },
  { name: "Bundesländer & Verwaltung", keywords: ["Bundesland", "Berlin", "Brandenburg", "Sachsen", "Thüringen", "Mecklenburg", "Landesparlament", "Ministerpräsident", "Gemeindeverwaltung", "Stadtstaat", "Bezirksverordnetenversammlung", "Landesflagge", "Senator", "Regierungschef", "Einwohnermeldeamt", "Jugendamt", "Ordnungsamt", "Finanzamt"] },
  { name: "Soziales & Gesellschaft", keywords: ["Sozialversicherung", "Krankenversicherung", "Kindergeld", "Elterngeld", "Mutterschutz", "Schulpflicht", "Erziehung", "Jugendamt", "Arbeitslosigkeit", "Betriebsrat", "Kündigung", "Arbeit", "Gewerkschaft", "Arbeitsgericht", "Soziale Marktwirtschaft", "Rentenversicherung", "Pflegeversicherung", "Abitur", "Schule", "Kindergarten", "Eltern", "Familie", "Scheidung", "Hausordnung", "Steuererklärung", "Kirchensteuer", "Ehescheidung", "Berufsinformationszentrum", "Weiterbildung", "Arbeitsverhältnis", "Kündigungsfrist"] },
  { name: "Religion & Kultur", keywords: ["Religion", "Kirche", "Christentum", "Moschee", "Synagoge", "Weihnachten", "Ostern", "Pfingsten", "Advent", "Brauch", "Kultur", "Tannenbaum", "Eier bemalen", "Fahne", "Feiertag", "Glaubensfreiheit", "religiösen Toleranz"] },
  { name: "Diskriminierung & Gleichbehandlung", keywords: ["Diskriminierung", "Antisemitismus", "Gleichbehandlung", "Behinderung", "Rassismus", "Mutter", "Rollstuhl", "Hautfarbe", "Juden", "Holocaust", "Opfer", "Stolpersteine"] },
  { name: "Arbeit & Wirtschaft", keywords: ["Arbeit", "Wirtschaft", "Soziale Marktwirtschaft", "Planwirtschaft", "Gastarbeiter", "Arbeitsverhältnis", "Betriebsrat", "Kündigung", "Arbeitsgericht", "Gewerkschaft", "Rentenversicherung", "Pflegeversicherung", "Sozialversicherung", "Beruf", "Lehrstellensuche", "Arbeitslosigkeit", "Betriebsrat", "Kündigungsfrist"] },
  { name: "Europa & EU", keywords: ["Europäische Union", "EU", "Schengener Abkommen", "Euro", "Europawahl", "Europäisches Parlament", "Römische Verträge", "Mitgliedstaaten", "Integration", "Luxemburg", "Straßburg", "Brüssel", "Frieden", "Sicherheit", "EWG"] }
];

function categorize(questionText: string): string {
  for (const cat of categories) {
    for (const keyword of cat.keywords) {
      if (questionText.toLowerCase().includes(keyword.toLowerCase())) {
        return cat.name;
      }
    }
  }
  return "Sonstiges";
}

const questionsPath = path.resolve(__dirname, "../src/questions.json");
const outputPath = path.resolve(__dirname, "./questions.categorized.json");

const questions: Question[] = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

const categorized = questions.map(q => ({
  ...q,
  category: categorize(q.question)
}));

fs.writeFileSync(outputPath, JSON.stringify(categorized, null, 2), "utf-8");

console.log(`Categorization complete! Output: ${outputPath}`);