"use client";

import { useState, useEffect } from "react";

export default function Scoreboard() {
    const [currentLifter, setCurrentLifter] = useState(null);

    useEffect(() => {
        fetchLifter();
    }, []);

    const fetchLifter = async () => {
        const compRes = await fetch("/api/competition");
        const { currentLifterIndex } = await compRes.json();

        const liftersRes = await fetch("/api/lifters");
        const lifters = await liftersRes.json();

        setCurrentLifter(lifters[currentLifterIndex]);
    };

    if (!currentLifter) return <p>Loading...</p>;

    return (
        <main className="p-6 max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold">{currentLifter.name}</h1>
            <h2 className="text-2xl">Weight Class: {currentLifter.weightClass}</h2>
            <h2 className="text-2xl">Body Weight: {currentLifter.bodyWeight}kg</h2>
        </main>
    );
}
