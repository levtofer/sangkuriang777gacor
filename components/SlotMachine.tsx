"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "user" | "admin";

type Profile = {
    id: string;
    username: string;
    role: Role;
    credits: number;
};

type SpinRow = {
    id: string;
    bet_amount: number;
    symbols: string[];
    payout: number;
    created_at: string;
};

const SYMBOLS = ["7", "BAR", "★", "♦", "♠", "CHERRY"];
const BET = 10;

function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function calcPayout([a, b, c]: string[]) {
    if (a === b && b === c) return a === "7" ? 100 : 50;
    if (a === b || b === c || a === c) return 20;
    if ([a, b, c].includes("★")) return 15;
    return 0;
}

export default function SlotMachine() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [reels, setReels] = useState<string[]>([
        randomSymbol(),
        randomSymbol(),
        randomSymbol(),
    ]);
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState("Ready");
    const [history, setHistory] = useState<SpinRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        void bootstrap();
    }, []);

    async function logout() {
        await supabase.auth.signOut();
        window.location.href = "/auth";
    }

    async function bootstrap() {
        setLoading(true);

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            window.location.href = "/auth";
            return;
        }

        const { data: profileData, error } = await supabase
            .from("profiles")
            .select("id, username, role, credits")
            .eq("id", userData.user.id)
            .single();

        if (error) {
            console.error("Profile load error:", error);
            setLoading(false);
            return;
        }

        setProfile(profileData);
        setLoading(false);

        await loadHistory();
    }

    async function loadHistory() {
        setHistoryLoading(true);

        const { data, error } = await supabase
            .from("spins")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(12);

        if (error) {
            console.error("History load error:", error);
        } else {
            setHistory((data ?? []) as SpinRow[]);
        }

        setHistoryLoading(false);
    }

    async function spin() {
        if (!profile || spinning) return;

        if (profile.credits < BET) {
            setMessage("Not enough credits");
            return;
        }

        setSpinning(true);
        setMessage("Spinning...");

        const final = [randomSymbol(), randomSymbol(), randomSymbol()];
        const frameTimer = setInterval(() => {
            setReels([randomSymbol(), randomSymbol(), randomSymbol()]);
        }, 75);

        await new Promise((r) => setTimeout(r, 900));
        clearInterval(frameTimer);

        setReels(final);

        await new Promise((r) => setTimeout(r, 700));

        const payout = calcPayout(final);
        const nextCredits = profile.credits - BET + payout;

        const { error: profileError } = await supabase
            .from("profiles")
            .update({ credits: nextCredits })
            .eq("id", profile.id);

        if (profileError) {
            console.error("Credit update error:", profileError);
            setMessage("Credit update failed");
            setSpinning(false);
            return;
        }

        const { error: spinError } = await supabase.from("spins").insert({
            user_id: profile.id,
            bet_amount: BET,
            symbols: final,
            payout,
        });

        if (spinError) {
            console.error("Spin log error:", spinError);
            setMessage("Spin log failed");
            setSpinning(false);
            return;
        }

        setProfile({ ...profile, credits: nextCredits });
        setMessage(payout > 0 ? `Win +${payout}` : "No win");
        setSpinning(false);

        await loadHistory();
    }

    if (loading) {
        return (
            <main className="grid min-h-screen place-items-center bg-zinc-950 text-white">
                Loading...
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="grid min-h-screen place-items-center bg-zinc-950 text-white">
                Please sign in.
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 p-6 text-white">
            <div className="mx-auto max-w-5xl space-y-6">
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-white/60">Logged in as</p>
                                <h1 className="text-3xl font-bold">{profile.username}</h1>
                                <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
                                    {profile.role}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className="rounded bg-red-500 px-4 py-2 text-sm text-white"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3">
                            <p className="text-xs text-white/60">Credits</p>
                            <p className="text-3xl font-bold text-yellow-300">
                                {profile.credits}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="grid grid-cols-3 gap-4">
                            {reels.map((symbol, index) => (
                                <div
                                    key={index}
                                    className={`flex h-32 items-center justify-center rounded-2xl border text-4xl font-black ${spinning
                                        ? "border-yellow-400 bg-yellow-400/10"
                                        : "border-white/10 bg-black/30"
                                        }`}
                                >
                                    <div className={spinning ? "animate-pulse" : ""}>{symbol}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                                onClick={spin}
                                disabled={spinning}
                                className="rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-black disabled:opacity-50"
                            >
                                {spinning ? "Spinning..." : `Spin (-${BET})`}
                            </button>
                            <p className="text-white/70">{message}</p>
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-semibold">Recent spins</h2>

                        <div className="mt-4 space-y-3">
                            {historyLoading ? (
                                <p className="text-white/60">Loading...</p>
                            ) : history.length === 0 ? (
                                <p className="text-white/60">No spins yet.</p>
                            ) : (
                                history.map((row) => (
                                    <div
                                        key={row.id}
                                        className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span>{row.symbols.join(" | ")}</span>
                                            <span className={row.payout > 0 ? "text-green-400" : "text-red-300"}>
                                                {row.payout > 0 ? `+${row.payout}` : `-${row.bet_amount}`}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {profile.role === "admin" && (
                            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm">
                                Admin mode active. Add an admin page to inspect all users and all spins.
                            </div>
                        )}
                    </aside>
                </section>
            </div>
        </main>
    );
}