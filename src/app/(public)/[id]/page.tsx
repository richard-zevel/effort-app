import fs from "fs";
import path from "path";

export default async function LifterPage({ params }: { params: { id: string } }) {
    const filePath = path.join(process.cwd(), "data", "lifters.json");
    const lifters = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const lifter = lifters.find((l) => l.id.toString() === params.id);

    if (!lifter) return <p>Lifter not found.</p>;

    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">{lifter.name} - {lifter.weightClass}</h1>
            <p className="text-gray-500">Status: {lifter.status}</p>

            {["squat", "bench", "deadlift"].map((liftType) => (
                <div key={liftType} className="mt-6">
                    <h2 className="text-xl font-semibold capitalize">{liftType}</h2>
                    <ul className="mt-2 space-y-2">
                        {lifter.attempts[liftType].map((attempt, index) => (
                            <li
                                key={index}
                                className={`p-2 rounded-md ${attempt.attempted
                                    ? attempt.passed
                                        ? "bg-green-200"
                                        : "bg-red-200"
                                    : "bg-gray-100"
                                    }`}
                            >
                                Attempt {index + 1}: {attempt.weight}kg -{" "}
                                {attempt.attempted
                                    ? attempt.passed
                                        ? "✅ Passed"
                                        : "❌ Failed"
                                    : "⏳ Not Attempted"}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
    );
}
