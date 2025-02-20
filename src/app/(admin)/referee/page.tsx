"use client";

import { useState, useEffect } from "react";

export default function RefereePanel() {
    const [currentLifter, setCurrentLifter] = useState(null);
    const [currentAttempt, setCurrentAttempt] = useState(null);

    useEffect(() => {
        fetchLifter();
    }, []);

    const fetchLifter = async () => {
        const compRes = await fetch("/api/competition");
        const { currentLifterIndex } = await compRes.json();

        const liftersRes = await fetch("/api/lifters");
        const lifters = await liftersRes.json();

        const lifter = lifters[currentLifterIndex];

        // Find the next unattempted lift
        let foundAttempt = null;
        for (const liftType of ["squat", "bench", "deadlift"]) {
            for (let i = 0; i < 3; i++) {
                if (!lifter.attempts[liftType][i].attempted) {
                    foundAttempt = { liftType, index: i, ...lifter.attempts[liftType][i] };
                    break;
                }
            }
            if (foundAttempt) break;
        }

        setCurrentLifter(lifter);
        setCurrentAttempt(foundAttempt);
    };

    const handleDecision = async (passed) => {
        if (!currentLifter || !currentAttempt) return;

        await fetch(`/api/lifters/${currentLifter.id}/attempts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                liftType: currentAttempt.liftType,
                attemptIndex: currentAttempt.index,
                passed,
            }),
        });

        fetchLifter(); // Refresh the data after decision
    };

    if (!currentLifter || !currentAttempt) return <p>Loading...</p>;

    return (
        <main className="p-6 max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold">Referee Panel</h1>
            <h2 className="mt-4 text-xl">{currentLifter.name}</h2>
            <p>Weight Class: {currentLifter.weightClass}</p>
            <p>Body Weight: {currentLifter.bodyWeight}kg</p>

            {/* Previous Attempts Section */}
            <div className="mt-6 p-4 border rounded bg-gray-100">
                <h3 className="text-lg font-semibold">Previous Attempts</h3>
                {["squat", "bench", "deadlift"].map((liftType) => (
                    <div key={liftType} className="mt-4">
                        <h4 className="text-md font-semibold capitalize">{liftType}</h4>
                        <ul className="space-y-1">
                            {currentLifter.attempts[liftType].map((attempt, index) => (
                                <li
                                    key={index}
                                    className={`p-2 rounded ${attempt.attempted
                                            ? attempt.passed
                                                ? "bg-green-200"
                                                : "bg-red-200"
                                            : "bg-gray-200"
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
            </div>

            {/* Current Attempt Section */}
            <div className="mt-6 p-4 border rounded bg-gray-200">
                <h3 className="text-lg font-semibold uppercase">{currentAttempt.liftType} Attempt</h3>
                <p className="text-2xl font-bold">{currentAttempt.weight}kg</p>
            </div>

            {/* Decision Buttons */}
            <div className="mt-4 space-x-4">
                <button
                    onClick={() => handleDecision(true)}
                    className="px-6 py-3 bg-green-500 text-white font-bold text-xl rounded"
                >
                    ✅ LIFT
                </button>
                <button
                    onClick={() => handleDecision(false)}
                    className="px-6 py-3 bg-red-500 text-white font-bold text-xl rounded"
                >
                    ❌ NO LIFT
                </button>
            </div>
        </main>
    );
}
