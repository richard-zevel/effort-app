import fs from "fs";
import path from "path";

export default async function HomePage() {
  const filePath = path.join(process.cwd(), "data", "lifters.json");
  const lifters = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return (
    <main>
      <h1>Powerlifting Scoreboard</h1>
      <ul>
        {lifters.map((lifter) => (
          <li key={lifter.id}>
            {lifter.name} - {lifter.weightClass}
          </li>
        ))}
      </ul>
    </main>
  );
}