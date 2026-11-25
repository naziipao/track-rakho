'use client';

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  MapPin,
  User,
  AlertCircle,
  Check,
  CheckCircle2,
  X,
} from 'lucide-react';
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
  onToggleDoneAssessment?: (id: string, isDone: boolean) => void;
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

const DONE_CARD_STYLE =
  'bg-emerald-50/85 dark:bg-emerald-950/30 border-emerald-500/55 dark:border-emerald-400/50 shadow-[0_0_24px_-4px_rgba(16,185,129,0.22)] dark:shadow-[0_0_28px_-4px_rgba(52,211,153,0.25)] hover:border-emerald-500/80 dark:hover:border-emerald-300/75 hover:shadow-[0_0_36px_-2px_rgba(16,185,129,0.35)]';

export default function TodayView({
  todayDateLabel,
  todayName,
  activeSemester,
  pendingCounts,
  todaysClasses,
  upcomingAssessments,
  setActiveTab,
  onOpenNoteModal,
  onToggleDoneAssessment,
}: TodayViewProps) {
  const [confirmDoneItem, setConfirmDoneItem] = useState<Assessment | null>(null);

  const handleConfirmToggleDone = () => {
    if (!confirmDoneItem) return;
    onToggleDoneAssessment?.(confirmDoneItem.id, !confirmDoneItem.is_done);
    setConfirmDoneItem(null);
  };

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
                const isDone = Boolean(item.is_done);
                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden p-4 rounded-2xl backdrop-blur-xl border ring-1 ring-inset ring-white/60 dark:ring-white/[0.08] transition-all duration-200 hover:-translate-y-0.5 flex items-start gap-3.5 ${
                      isDone
                        ? DONE_CARD_STYLE
                        : `bg-white/90 dark:bg-[#11131a]/90 ${getCardGlowStyle(item.type)}`
                    }`}
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

                        {isDone ? (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 inline-flex items-center gap-1 bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-400/40">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${countdown.style}`}
                          >
                            {countdown.label}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm mt-2.5 flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: isDone
                              ? '#10b981'
                              : item.courses?.color || '#14b8a6',
                          }}
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

                      <div className="flex items-center justify-between gap-2 mt-2.5">
                        <p className="text-[11px] text-stone-400 dark:text-zinc-500">
                          {new Date(item.due_date).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>

                        {onToggleDoneAssessment && (
                          <button
                            type="button"
                            onClick={() => setConfirmDoneItem(item)}
                            title={isDone ? 'Marked as done' : 'Mark as done'}
                            className={`btn-tactile px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-colors ${
                              isDone
                                ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                                : 'bg-stone-100/90 dark:bg-white/[0.06] text-stone-600 dark:text-zinc-300 border-stone-200/80 dark:border-white/10 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/10'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-stone-400/70 dark:border-zinc-500'
                              }`}
                            >
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span>{isDone ? 'Done' : 'Mark Done'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Custom "Are you sure?" Confirmation Popup */}
      {confirmDoneItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
          onClick={() => setConfirmDoneItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl bg-white/95 dark:bg-[#11131a]/95 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-2xl p-6"
          >
            <button
              type="button"
              onClick={() => setConfirmDoneItem(null)}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                Are you sure?
              </h3>

              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-2 leading-relaxed">
                {confirmDoneItem.is_done ? (
                  <>
                    Do you want to unmark{' '}
                    <span className="font-semibold text-stone-800 dark:text-zinc-200">
                      {confirmDoneItem.courses?.code || confirmDoneItem.type}
                      {confirmDoneItem.title ? ` (${confirmDoneItem.title})` : ''}
                    </span>{' '}
                    as done?
                  </>
                ) : (
                  <>
                    Do you want to mark{' '}
                    <span className="font-semibold text-stone-800 dark:text-zinc-200">
                      {confirmDoneItem.courses?.code || confirmDoneItem.type}
                      {confirmDoneItem.title ? ` (${confirmDoneItem.title})` : ''}
                    </span>{' '}
                    as done?
                  </>
                )}
              </p>

              <div className="w-full flex items-center gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setConfirmDoneItem(null)}
                  className="btn-tactile flex-1 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-white/[0.08] hover:bg-stone-200/80 dark:hover:bg-white/[0.14] text-stone-700 dark:text-zinc-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmToggleDone}
                  className="btn-tactile flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25"
                >
                  {confirmDoneItem.is_done ? 'Yes, Unmark' : 'Yes, Mark Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}