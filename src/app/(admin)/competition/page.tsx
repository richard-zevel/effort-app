"use client";

import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"; // Pencil Icon

export default function CompetitionAdmin() {
    const [lifters, setLifters] = useState([]);
    const [currentLifterIndex, setCurrentLifterIndex] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const compRes = await fetch("/api/competition");
        const { currentLifterIndex } = await compRes.json();

        const liftersRes = await fetch("/api/lifters");
        const lifters = await liftersRes.json();

        setLifters(lifters);
        setCurrentLifterIndex(currentLifterIndex);
    };

    const changeLifter = async (action) => {
        await fetch("/api/competition", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        fetchData(); // Refresh after changing lifter
    };

    if (lifters.length === 0) return <p>Loading...</p>;

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Competition Admin</h1>

            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => changeLifter("previous")}
                    className="px-6 py-3 bg-gray-500 text-white font-bold text-lg rounded flex items-center"
                >
                    ⬅️ Previous
                </button>
                <button
                    onClick={() => changeLifter("next")}
                    className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded flex items-center"
                >
                    Next ➡️
                </button>
            </div>

            {/* Lifters Progress Table */}
            <table className="w-full border-collapse border border-gray-300 text-center text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Lifter</th>
                        <th className="border p-2">Weight Class</th>
                        <th className="border p-2">Body Weight</th>
                        <th className="border p-2" colSpan="3">Squat</th>
                        <th className="border p-2" colSpan="3">Bench</th>
                        <th className="border p-2" colSpan="3">Deadlift</th>
                    </tr>
                    <tr className="bg-gray-100">
                        <th colSpan="3"></th>
                        <th className="border p-2">Attempt 1</th>
                        <th className="border p-2">Attempt 2</th>
                        <th className="border p-2">Attempt 3</th>
                        <th className="border p-2">Attempt 1</th>
                        <th className="border p-2">Attempt 2</th>
                        <th className="border p-2">Attempt 3</th>
                        <th className="border p-2">Attempt 1</th>
                        <th className="border p-2">Attempt 2</th>
                        <th className="border p-2">Attempt 3</th>
                    </tr>
                </thead>
                <tbody>
                    {lifters.map((lifter, index) => (
                        <tr
                            key={lifter.id}
                            className={`border-t ${index === currentLifterIndex ? "bg-yellow-200 font-bold" : "bg-white"
                                }`}
                        >
                            <td className="border p-2">{lifter.name}</td>
                            <td className="border p-2">{lifter.weightClass}</td>
                            <td className="border p-2">{lifter.bodyWeight}kg</td>

                            {/* Loop through Squat, Bench, Deadlift Attempts */}
                            {["squat", "bench", "deadlift"].map((liftType) =>
                                lifter.attempts[liftType].map((attempt, attemptIndex) => (
                                    <td key={`${liftType}-${attemptIndex}`} className="border p-2">
                                        <div className="flex items-center justify-center space-x-1">
                                            <span
                                                className={`px-2 py-1 rounded ${attempt.attempted
                                                        ? attempt.passed
                                                            ? "bg-green-200"
                                                            : "bg-red-200"
                                                        : "bg-gray-100"
                                                    }`}
                                            >
                                                {attempt.weight}kg{" "}
                                                {attempt.attempted
                                                    ? attempt.passed
                                                        ? "✅"
                                                        : "❌"
                                                    : "⏳"}
                                            </span>
                                            {!attempt.attempted && (
                                                <button
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={() => console.log("Edit attempt", lifter.id, liftType, attemptIndex)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                ))
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
