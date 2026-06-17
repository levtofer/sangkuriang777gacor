"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  async function handleAuth() {
    setMessage("");

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Account created. You can now log in.");
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Logged in successfully.");

      window.location.href = "/";
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        <input
          className="w-full rounded border border-white/10 bg-black/40 p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded border border-white/10 bg-black/40 p-2"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="w-full rounded bg-yellow-400 py-2 font-semibold text-black"
        >
          {mode === "login" ? "Login" : "Create account"}
        </button>

        <button
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          className="w-full text-sm text-white/60"
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>

        {message && (
          <p className="text-sm text-white/70">{message}</p>
        )}
      </div>
    </main>
  );
}