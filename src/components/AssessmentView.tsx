'use client';

import React from 'react';
import { Plus, Filter, CheckCircle2, Circle, Trash2, MapPin } from 'lucide-react';
import { Assessment, AssessmentType, ASSESSMENT_TAB_META } from '@/lib/types';
import { getCountdownBadge, getTypeBadgeColor } from '@/lib/helpers';

interface AssessmentViewProps {
  activeType: AssessmentType;
  assessments: Assessment[];
  activeSemester: string;
  activeCoursesCount: number;
  showCompleted: boolean;
  setShowCompleted: (val: boolean) => void;
  onOpenAddAssessment: (type: AssessmentType) => void;
  onToggleComplete: (item: Assessment) => void;
  onDeleteAssessment: (id: string) => void;
}

export default function AssessmentView({
  activeType,
  assessments,
  activeSemester,
  activeCoursesCount,
  showCompleted,
  setShowCompleted,
  onOpenAddAssessment,
  onToggleComplete,
  onDeleteAssessment,
}: AssessmentViewProps) {
  const meta = ASSESSMENT_TAB_META[activeType];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{meta.heading}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{meta.subtitle}</p>
        </div>
        <button
          onClick={() => onOpenAddAssessment(activeType)}
          disabled={activeCoursesCount === 0}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> {meta.buttonLabel}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing {assessments.length} {assessments.length === 1 ? 'item' : 'items'}
          {activeSemester !== 'All' && ` in ${activeSemester}`}
        </span>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-xs font-medium flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
        >
          <Filter className="w-3.5 h-3.5" />
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>

      {assessments.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No {meta.plural.toLowerCase()} added yet.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;{meta.buttonLabel}&rdquo; above to add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((item) => {
            const countdown = getCountdownBadge(item.due_date);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-opacity ${
                  item.is_completed ? 'opacity-60' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: item.courses?.color || '#6366f1' }}
                      >
                        {item.courses?.code}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${getTypeBadgeColor(item.type)}`}
                      >
                        {item.type}
                      </span>
                      {item.room && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.room}
                        </span>
                      )}
                    </div>
                    {!item.is_completed && (
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${countdown.style}`}
                      >
                        {countdown.label}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-bold text-base mt-3 ${item.is_completed ? 'line-through' : ''}`}>
                    {item.title}
                  </h3>

                  {item.topics && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      <strong className="text-slate-700 dark:text-slate-300">Topics:</strong>{' '}
                      {item.topics}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {new Date(item.due_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleComplete(item)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        item.is_completed
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.is_completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Circle className="w-3.5 h-3.5" />
                      )}
                      {item.is_completed ? 'Done' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => onDeleteAssessment(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}