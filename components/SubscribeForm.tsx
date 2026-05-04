"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const Schema = z.object({ email: z.email() });

type Props = { size?: "sm" | "lg" };

export default function SubscribeForm({ size = "sm" }: Props) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Schema.safeParse({ email });
    if (!parsed.success) {
      toast.error("Enter a valid email");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      if (data.alreadyConfirmed) {
        toast.success("You're already subscribed.");
      } else {
        toast.success("Check your inbox to confirm.");
      }
      setConfirmed(true);
      setEmail("");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (size === "lg") {
    return (
      <form onSubmit={submit} className="space-y-3" aria-label="Subscribe">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-widest text-outline mb-2 block">
            Email
          </span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-surface-container border border-white/10 px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary text-on-primary font-bold text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "Sending…" : confirmed ? "Sent — check inbox" : "Subscribe"}
        </button>
        <p className="text-[10px] font-mono text-outline">
          Double opt-in. We send a confirmation email before activating.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2" aria-label="Subscribe">
      <p className="text-xs font-mono uppercase tracking-widest text-outline">
        Newsletter
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 min-w-0 bg-surface-container border border-white/10 px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-on-primary font-bold text-[10px] uppercase tracking-widest px-4 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "…" : confirmed ? "Sent" : "Join"}
        </button>
      </div>
    </form>
  );
}
