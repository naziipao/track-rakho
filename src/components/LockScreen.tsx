'use client';

import React, { useRef, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface LockScreenProps {
  pinInput: string;
  setPinInput: (val: string) => void;
  pinError: boolean;
  isVerifying?: boolean;
  onUnlock: (pin: string) => void;
}

export default function LockScreen({
  pinInput,
  setPinInput,
  pinError,
  isVerifying = false,
  onUnlock,
}: LockScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [pinError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerifying) return;
    // Allow digits only, max 4
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPinInput(digits);

    if (digits.length === 4) {
      onUnlock(digits);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Track Rakho
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-7">
          Enter your 4-digit PIN
        </p>

        {/* 4-digit PIN boxes backed by a single numeric input */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="relative flex items-center justify-center gap-3 cursor-text select-none"
        >
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={4}
            value={pinInput}
            onChange={handleChange}
            disabled={isVerifying}
            aria-label="4-digit PIN"
            className="absolute inset-0 w-full h-full opacity-0 cursor-text"
          />

          {[0, 1, 2, 3].map((idx) => {
            const filled = idx < pinInput.length;
            const isActive = idx === pinInput.length && !isVerifying;
            return (
              <div
                key={idx}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  pinError
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                    : isActive
                    ? 'border-teal-500 ring-4 ring-teal-500/15 bg-white dark:bg-slate-800'
                    : filled
                    ? 'border-teal-500/60 bg-teal-50/40 dark:bg-teal-950/30'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                }`}
              >
                {filled && (
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-white" />
                )}
              </div>
            );
          })}
        </div>

        {/* Status / Error message */}
        <div className="h-6 mt-5 flex items-center justify-center">
          {isVerifying ? (
            <div className="flex items-center gap-2 text-xs font-medium text-teal-600 dark:text-teal-400">
              <span className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              Checking...
            </div>
          ) : pinError ? (
            <p className="text-sm font-medium text-rose-500">
              Wrong password
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}