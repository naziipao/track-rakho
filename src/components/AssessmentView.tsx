'use client';

import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Pencil } from 'lucide-react';
import { Assessment, AssessmentType, ASSESSMENT_TAB_META } from '@/lib/types';
import { getCountdownBadge, getTypeBadgeColor } from '@/lib/helpers';

interface AssessmentViewProps {
  activeType: AssessmentType;
  assessments: Assessment[];
  activeSemester: string;
  activeCoursesCount: number;
  onOpenAddAssessment: (type: AssessmentType) => void;
  onEditAssessment: (item: Assessment) => void;
  onDeleteAssessment: (id: string) => void;
}

export default function AssessmentView({
  activeType,
  assessments,
  activeSemester,
  activeCoursesCount,
  onOpenAddAssessment,
  onEditAssessment,
  onDeleteAssessment,
}: AssessmentViewProps) {
  const meta = ASSESSMENT_TAB_META[activeType];
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{meta.heading}</h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">{meta.subtitle}</p>
        </div>
        <button
          onClick={() => onOpenAddAssessment(activeType)}
          disabled={activeCoursesCount === 0}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
        >
          <Plus className="w-4 h-4" /> {meta.buttonLabel}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">
          Showing {assessments.length} {assessments.length === 1 ? 'item' : 'items'}
          {activeSemester !== 'All' && ` in ${activeSemester}`}
        </span>
      </div>

      {assessments.length === 0 ? (
        <div className="p-12 rounded-2xl card-surface text-center">
          <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">
            No {meta.plural.toLowerCase()} added yet.
          </p>
          <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
            Click &ldquo;{meta.buttonLabel}&rdquo; above to add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((item) => {
            const countdown = getCountdownBadge(item.due_date);
            const isExam = item.type === 'Midterm' || item.type === 'Final';
            const isConfirming = confirmDeleteId === item.id;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl card-surface hover:border-teal-500/40 dark:hover:border-teal-400/35 hover:shadow-[0_12px_36px_rgba(20,184,166,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${getTypeBadgeColor(item.type)}`}
                      >
                        {item.type}
                      </span>
                      {!isExam && item.title && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-white/[0.07] text-stone-700 dark:text-zinc-300 border border-stone-200/70 dark:border-white/10">
                          {item.title}
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
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${countdown.style}`}
                    >
                      {countdown.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-base mt-3 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.courses?.color || '#14b8a6' }}
                    />
                    <span>
                      {item.courses?.code}
                      {item.courses?.name ? `: ${item.courses.name}` : ''}
                    </span>
                  </h3>

                  {item.topics && (
                    <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      <strong className="text-stone-700 dark:text-zinc-300">Topics:</strong>{' '}
                      {item.topics}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/70 dark:border-white/[0.07] flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">
                    {new Date(item.due_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>

                  {isConfirming ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-rose-500 dark:text-rose-400 mr-1">
                        Delete?
                      </span>
                      <button
                        onClick={() => {
                          onDeleteAssessment(item.id);
                          setConfirmDeleteId(null);
                        }}
                        className="btn-tactile px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold shadow-sm shadow-rose-500/30"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="btn-tactile px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-white/[0.08] hover:bg-stone-300/80 dark:hover:bg-white/[0.14] text-stone-700 dark:text-zinc-300 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditAssessment(item)}
                        title="Edit"
                        className="btn-tactile p-2 rounded-xl text-stone-400 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-500/12 active:bg-teal-500/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        title="Delete"
                        className="btn-tactile p-2 rounded-xl text-stone-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/12 active:bg-rose-500/25 active:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}