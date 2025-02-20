import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "lifters.json");
  const lifters = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return new Response(JSON.stringify(lifters), { status: 200 });
}
