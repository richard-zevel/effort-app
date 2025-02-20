import fs from "fs";
import path from "path";

export async function POST(req, { params }) {
  const { liftType, attemptIndex, passed } = await req.json();
  const lifterId = params.id;

  const liftersPath = path.join(process.cwd(), "data", "lifters.json");
  const lifters = JSON.parse(fs.readFileSync(liftersPath, "utf-8"));

  const lifterIndex = lifters.findIndex(
    (l) => lifters[lifterIndex].id.toString() === lifterId
  );
  if (lifterIndex === -1)
    return new Response("Lifter not found", { status: 404 });

  // Update attempt
  lifters[lifterIndex].attempts[liftType][attemptIndex] = {
    ...lifters[lifterIndex].attempts[liftType][attemptIndex],
    attempted: true,
    passed,
  };

  fs.writeFileSync(liftersPath, JSON.stringify(lifters, null, 2));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
