'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface LockScreenProps {
  pinInput: string;
  setPinInput: (val: string) => void;
  pinError: boolean;
  onUnlock: (e: React.FormEvent) => void;
}

export default function LockScreen({
  pinInput,
  setPinInput,
  pinError,
  onUnlock,
}: LockScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Focused Center Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[360px] h-[360px] rounded-full bg-teal-500/20 dark:bg-teal-400/15 blur-[110px]"
      />

      <div className="relative w-full max-w-sm card-surface rounded-3xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 ring-1 ring-white/25">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Track Rakho</h1>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1.5 mb-6">
          Enter your personal PIN to access your schedule.
        </p>
        <form onSubmit={onUnlock} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            placeholder="••••"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center text-2xl tracking-[0.5em] font-semibold py-3.5 px-4 rounded-2xl bg-stone-100/90 dark:bg-white/[0.06] border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            autoFocus
          />
          {pinError && (
            <p className="text-xs font-medium text-rose-500">Incorrect PIN. Try again.</p>
          )}
          <button
            type="submit"
            className="btn-tactile w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
          >
            Unlock Workspace
          </button>
        </form>
      </div>
    </div>
  );
}