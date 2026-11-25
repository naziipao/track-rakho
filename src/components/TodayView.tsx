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

const getCardGlowStyle = (type: AssessmentType) => {
  switch (type) {
    case 'Quiz':
      return 'border-cyan-500/35 dark:border-cyan-400/35 shadow-[0_0_24px_-4px_rgba(34,211,238,0.18)] dark:shadow-[0_0_28px_-4px_rgba(34,211,238,0.22)] hover:border-cyan-400/75 dark:hover:border-cyan-300/70 hover:shadow-[0_0_36px_-2px_rgba(34,211,238,0.34)]';
    case 'Assignment':
      return 'border-emerald-500/35 dark:border-emerald-400/35 shadow-[0_0_24px_-4px_rgba(16,185,129,0.18)] dark:shadow-[0_0_28px_-4px_rgba(52,211,153,0.22)] hover:border-emerald-400/75 dark:hover:border-emerald-300/70 hover:shadow-[0_0_36px_-2px_rgba(52,211,153,0.34)]';
    case 'Midterm':
      return 'border-amber-500/40 dark:border-amber-400/35 shadow-[0_0_24px_-4px_rgba(245,158,11,0.18)] dark:shadow-[0_0_28px_-4px_rgba(251,191,36,0.22)] hover:border-amber-400/80 dark:hover:border-amber-300/75 hover:shadow-[0_0_36px_-2px_rgba(251,191,36,0.34)]';
    case 'Final':
      return 'border-rose-500/35 dark:border-rose-400/35 shadow-[0_0_24px_-4px_rgba(244,63,94,0.18)] dark:shadow-[0_0_28px_-4px_rgba(251,113,133,0.22)] hover:border-rose-400/75 dark:hover:border-rose-300/70 hover:shadow-[0_0_36px_-2px_rgba(251,113,133,0.34)]';
  }
};

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
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
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
            className="btn-tactile px-4 py-2 rounded-xl card-surface hover:border-teal-500/50 dark:hover:border-teal-400/40 hover:bg-teal-500/5 dark:hover:bg-teal-400/10 text-xs sm:text-sm font-medium flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Quick Note
          </button>
        </div>
      </div>

      {/* Quick Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ASSESSMENT_TABS.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`btn-tactile relative overflow-hidden p-4 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border ring-1 ring-inset ring-white/60 dark:ring-white/[0.08] transition-all duration-200 hover:-translate-y-0.5 text-left group ${getCardGlowStyle(type)}`}
          >
            {/* Top-edge specular light reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/30 to-transparent"
            />
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getTypeBadgeColor(type)}`}>
              {ASSESSMENT_TAB_META[type].plural}
            </span>
            <p className="text-2xl font-bold mt-2.5 transition-colors">
              {pendingCounts[type]}
            </p>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-0.5">Scheduled</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Classes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              Classes Today ({todayName})
            </h3>
            <button
              onClick={() => setActiveTab('routine')}
              className="btn-tactile text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 px-2 py-1 rounded-lg hover:bg-teal-500/10"
            >
              Full Week →
            </button>
          </div>

          {todaysClasses.length === 0 ? (
            <div className="p-8 rounded-2xl card-surface border-teal-500/25 dark:border-teal-400/25 shadow-[0_0_24px_-4px_rgba(20,184,166,0.14)] text-center">
              <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">
                No classes scheduled today 🎉
              </p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
                Enjoy your free time or catch up on notes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-2xl card-surface card-interactive border-teal-500/30 dark:border-teal-400/30 shadow-[0_0_24px_-4px_rgba(20,184,166,0.18)] flex items-start gap-3.5 relative overflow-hidden"
                >
                  <div
                    className="w-1.5 self-stretch rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: cls.courses?.color || '#14b8a6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-sm tracking-tight">
                          {cls.courses?.code}
                        </span>
                        {cls.courses?.section && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-white/[0.08] text-stone-700 dark:text-zinc-200 border border-stone-200/70 dark:border-white/10 shrink-0">
                            Sec {cls.courses.section}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-stone-100/90 dark:bg-white/[0.07] text-stone-700 dark:text-zinc-300 border border-stone-200/70 dark:border-white/10 shrink-0">
                        {formatTime12Hour(cls.start_time)} – {formatTime12Hour(cls.end_time)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                      {cls.courses?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-stone-600 dark:text-zinc-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-500" /> Room {cls.room}
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
              <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Upcoming Deadlines & Exams
            </h3>
            <button
              onClick={() => setActiveTab(upcomingAssessments[0]?.type || 'Quiz')}
              className="btn-tactile text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 px-2 py-1 rounded-lg hover:bg-teal-500/10"
            >
              View All ({upcomingAssessments.length}) →
            </button>
          </div>

          {upcomingAssessments.length === 0 ? (
            <div className="p-8 rounded-2xl card-surface text-center">
              <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">All caught up!</p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
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
                    className={`relative overflow-hidden p-4 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border ring-1 ring-inset ring-white/60 dark:ring-white/[0.08] transition-all duration-200 hover:-translate-y-0.5 flex items-start gap-3.5 ${getCardGlowStyle(item.type)}`}
                  >
                    {/* Top-edge specular light reflection */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/30 to-transparent"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setActiveTab(item.type)}
                            className={`btn-tactile text-xs font-semibold px-2.5 py-0.5 rounded-md ${getTypeBadgeColor(item.type)}`}
                          >
                            {item.type}
                          </button>
                          {(item.type === 'Assignment' || isExam) && item.category && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-500/12 dark:bg-teal-400/15 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                              {item.category}
                            </span>
                          )}
                          {!isExam && item.title && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-white/[0.07] text-stone-700 dark:text-zinc-300 border border-stone-200/70 dark:border-white/10">
                              {item.title}
                            </span>
                          )}
                          {isExam && item.courses?.section && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-white/[0.07] text-stone-700 dark:text-zinc-200 border border-stone-200/70 dark:border-white/10">
                              Sec {item.courses.section}
                            </span>
                          )}
                          {item.room && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-white/[0.07] text-stone-600 dark:text-zinc-300 border border-stone-200/70 dark:border-white/10 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-teal-500" />
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

                      <h4 className="font-bold text-sm mt-2.5 flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.courses?.color || '#14b8a6' }}
                        />
                        <span>
                          {item.courses?.code}
                          {item.courses?.name ? `: ${item.courses.name}` : ''}
                        </span>
                      </h4>

                      {item.topics && (
                        <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1.5">
                          <span className="font-medium text-stone-700 dark:text-zinc-300">
                            Topics:
                          </span>{' '}
                          {item.topics}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-2">
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