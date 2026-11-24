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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tap a day to view or manage your scheduled classes.
          </p>
        </div>
        <button
          onClick={() => onOpenAddRoutine(selectedDay)}
          disabled={activeCoursesCount === 0}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
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
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              {isToday && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}
                />
              )}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
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
          <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No classes added for {selectedDay}.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Click &ldquo;Add Class Slot&rdquo; above to build your schedule.
            </p>
          </div>
        ) : (
          dayRoutines.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-2 h-12 rounded-full shrink-0"
                  style={{ backgroundColor: cls.courses?.color || '#6366f1' }}
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base">{cls.courses?.code}</span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                      {formatTime12Hour(cls.start_time)} – {formatTime12Hour(cls.end_time)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {cls.courses?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Room:{' '}
                      <strong className="text-slate-700 dark:text-slate-200">{cls.room}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-500" /> Faculty:{' '}
                      <strong className="text-slate-700 dark:text-slate-200">
                        {cls.courses?.faculty}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteRoutine(cls.id)}
                className="self-end sm:self-center p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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