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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900">
      <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Track Rakho</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
          Enter your personal PIN to access your schedule.
        </p>
        <form onSubmit={onUnlock} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            placeholder="••••"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center text-2xl tracking-[0.5em] font-semibold py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {pinError && (
            <p className="text-xs font-medium text-rose-500">Incorrect PIN. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all"
          >
            Unlock Workspace
          </button>
        </form>
      </div>
    </div>
  );
}