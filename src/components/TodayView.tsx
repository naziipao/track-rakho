'use client';

import React from 'react';
import { Clock, Plus, MapPin, User, AlertCircle } from 'lucide-react';
import {
  Assessment,
  AssessmentType,
  ASSESSMENT_TABS,
  ASSESSMENT_TAB_META,
  Routine,
  TabId,
} from '@/lib/types';
import { formatTime12Hour, getCountdownBadge, getTypeBadgeColor } from '@/lib/helpers';

interface TodayViewProps {
  todayDateLabel: string;
  todayName: string;
  activeSemester: string;
  pendingCounts: Record<AssessmentType, number>;
  todaysClasses: Routine[];
  upcomingAssessments: Assessment[];
  setActiveTab: (tab: TabId) => void;
  onOpenNoteModal: () => void;
}

export default function TodayView({
  todayDateLabel,
  todayName,
  activeSemester,
  pendingCounts,
  todaysClasses,
  upcomingAssessments,
  setActiveTab,
  onOpenNoteModal,
}: TodayViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {todayDateLabel}
            {activeSemester !== 'All' && ` • ${activeSemester}`}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Today&apos;s Focus
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenNoteModal}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Quick Note
          </button>
        </div>
      </div>

      {/* Quick Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ASSESSMENT_TABS.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all shadow-sm"
          >
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getTypeBadgeColor(type)}`}>
              {ASSESSMENT_TAB_META[type].plural}
            </span>
            <p className="text-2xl font-bold mt-2">{pendingCounts[type]}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Classes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Classes Today ({todayName})
            </h3>
            <button
              onClick={() => setActiveTab('routine')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Full Week →
            </button>
          </div>

          {todaysClasses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No classes scheduled today 🎉
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Enjoy your free time or catch up on notes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-start gap-3.5 relative overflow-hidden"
                >
                  <div
                    className="w-1.5 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: cls.courses?.color || '#6366f1' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm tracking-tight">
                        {cls.courses?.code}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {formatTime12Hour(cls.start_time)} – {formatTime12Hour(cls.end_time)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {cls.courses?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Room {cls.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-500" /> {cls.courses?.faculty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Upcoming Deadlines & Exams
            </h3>
            <button
              onClick={() => setActiveTab(upcomingAssessments[0]?.type || 'Quiz')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All ({upcomingAssessments.length}) →
            </button>
          </div>

          {upcomingAssessments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">
                No quizzes, assignments, or exams scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssessments.slice(0, 6).map((item) => {
                const countdown = getCountdownBadge(item.due_date);
                const isExam = item.type === 'Midterm' || item.type === 'Final';
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-start gap-3.5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setActiveTab(item.type)}
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${getTypeBadgeColor(item.type)}`}
                          >
                            {item.type}
                          </button>
                          {!isExam && item.title && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {item.title}
                            </span>
                          )}
                          {item.room && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.room}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${countdown.style}`}
                        >
                          {countdown.label}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm mt-2 flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.courses?.color || '#6366f1' }}
                        />
                        <span>
                          {item.courses?.code}
                          {item.courses?.name ? `: ${item.courses.name}` : ''}
                        </span>
                      </h4>

                      {item.topics && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            Topics:
                          </span>{' '}
                          {item.topics}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-2">
                        {new Date(item.due_date).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}