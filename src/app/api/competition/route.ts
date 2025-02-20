import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "competition.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req) {
  const { action } = await req.json();
  const competitionPath = path.join(process.cwd(), "data", "competition.json");
  const liftersPath = path.join(process.cwd(), "data", "lifters.json");

  const competition = JSON.parse(fs.readFileSync(competitionPath, "utf-8"));
  const lifters = JSON.parse(fs.readFileSync(liftersPath, "utf-8"));

  if (action === "next") {
    competition.currentLifterIndex =
      (competition.currentLifterIndex + 1) % lifters.length;
  } else if (action === "previous") {
    competition.currentLifterIndex =
      (competition.currentLifterIndex - 1 + lifters.length) % lifters.length;
  }

  fs.writeFileSync(competitionPath, JSON.stringify(competition, null, 2));
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
