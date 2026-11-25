'use client';

import React from 'react';
import { Plus, MapPin, User, Trash2 } from 'lucide-react';
import { DAYS_OF_WEEK, Routine } from '@/lib/types';
import { formatTime12Hour } from '@/lib/helpers';

interface RoutineViewProps {
  visibleRoutines: Routine[];
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  todayName: string;
  activeCoursesCount: number;
  onOpenAddRoutine: (day: string) => void;
  onDeleteRoutine: (id: string) => void;
}

export default function RoutineView({
  visibleRoutines,
  selectedDay,
  setSelectedDay,
  todayName,
  activeCoursesCount,
  onOpenAddRoutine,
  onDeleteRoutine,
}: RoutineViewProps) {
  const dayRoutines = visibleRoutines.filter((r) => r.day_of_week === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Weekly Class Routine</h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Tap a day to view or manage your scheduled classes.
          </p>
        </div>
        <button
          onClick={() => onOpenAddRoutine(selectedDay)}
          disabled={activeCoursesCount === 0}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" /> Add Class Slot
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS_OF_WEEK.map((day) => {
          const count = visibleRoutines.filter((r) => r.day_of_week === day).length;
          const isSelected = selectedDay === day;
          const isToday = day === todayName;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`btn-tactile px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-md shadow-teal-500/25'
                  : 'card-surface text-stone-700 dark:text-zinc-300 hover:border-teal-500/45 hover:bg-teal-500/5 dark:hover:bg-white/[0.08]'
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              {isToday && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-500'}`}
                />
              )}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200/80 dark:bg-white/[0.08] text-stone-600 dark:text-zinc-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {dayRoutines.length === 0 ? (
          <div className="p-12 rounded-2xl card-surface text-center">
            <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">
              No classes added for {selectedDay}.
            </p>
            <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
              Click &ldquo;Add Class Slot&rdquo; above to build your schedule.
            </p>
          </div>
        ) : (
          dayRoutines.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl card-surface hover:border-teal-500/40 dark:hover:border-teal-400/35 hover:shadow-[0_12px_36px_rgba(20,184,166,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-2 h-12 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: cls.courses?.color || '#14b8a6' }}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base">{cls.courses?.code}</span>
                    {cls.courses?.section && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-white/[0.08] text-stone-700 dark:text-zinc-200 border border-stone-200/70 dark:border-white/10">
                        Sec {cls.courses.section}
                      </span>
                    )}
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-500/12 dark:bg-teal-400/15 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                      {formatTime12Hour(cls.start_time)} – {formatTime12Hour(cls.end_time)}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-zinc-400 mt-0.5">
                    {cls.courses?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-medium text-stone-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-500" /> Room:{' '}
                      <strong className="text-stone-700 dark:text-zinc-200">{cls.room}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-500" /> Faculty:{' '}
                      <strong className="text-stone-700 dark:text-zinc-200">
                        {cls.courses?.faculty}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteRoutine(cls.id)}
                className="btn-tactile self-end sm:self-center p-2.5 rounded-xl text-stone-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/12 active:bg-rose-500/25 active:text-rose-500"
                title="Remove class"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}