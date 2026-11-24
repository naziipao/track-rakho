'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  CalendarX2,
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { Attendance, Course } from '@/lib/types';

interface AttendanceViewProps {
  courses: Course[];
  attendances: Attendance[];
  activeSemester: string;
  saving: boolean;
  onAddAttendance: (payload: {
    course_id: string;
    missed_date: string;
    note: string;
  }) => Promise<boolean>;
  onUpdateAttendance: (
    id: string,
    payload: { course_id: string; missed_date: string; note: string }
  ) => Promise<boolean>;
  onDeleteAttendance: (id: string) => Promise<void>;
  onUpdateCourseTotalClasses: (courseId: string, totalClasses: number) => Promise<void>;
}

const getTodayISO = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDisplayDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function AttendanceView({
  courses,
  attendances,
  activeSemester,
  saving,
  onAddAttendance,
  onUpdateAttendance,
  onDeleteAttendance,
  onUpdateCourseTotalClasses,
}: AttendanceViewProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');

  // Form state (supports both Add and Edit)
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCourseId, setFormCourseId] = useState<string>(courses[0]?.id || '');
  const [formDate, setFormDate] = useState<string>(getTodayISO());
  const [formNote, setFormNote] = useState<string>('');

  // Inline Total Classes editor state
  const [editingTotalCourseId, setEditingTotalCourseId] = useState<string | null>(null);
  const [totalClassesInput, setTotalClassesInput] = useState<string>('24');

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const effectiveSelectedCourseId =
    selectedCourseId !== 'ALL' && !courses.some((c) => c.id === selectedCourseId)
      ? 'ALL'
      : selectedCourseId;

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === effectiveSelectedCourseId) || null,
    [courses, effectiveSelectedCourseId]
  );

  const openAddForm = (defaultCourseId?: string) => {
    setEditingId(null);
    setFormCourseId(
      defaultCourseId ||
        (effectiveSelectedCourseId !== 'ALL' ? effectiveSelectedCourseId : courses[0]?.id || '')
    );
    setFormDate(getTodayISO());
    setFormNote('');
    setShowForm(true);
  };

  const openEditForm = (entry: Attendance) => {
    setEditingId(entry.id);
    setFormCourseId(entry.course_id);
    setFormDate(entry.missed_date);
    setFormNote(entry.note || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCourseId || !formDate) return;

    const ok = editingId
      ? await onUpdateAttendance(editingId, {
          course_id: formCourseId,
          missed_date: formDate,
          note: formNote.trim(),
        })
      : await onAddAttendance({
          course_id: formCourseId,
          missed_date: formDate,
          note: formNote.trim(),
        });

    if (ok) {
      setShowForm(false);
      setEditingId(null);
      setFormNote('');
    }
  };

  const startEditTotalClasses = (course: Course) => {
    setEditingTotalCourseId(course.id);
    setTotalClassesInput(String(course.total_classes || 24));
  };

  const saveTotalClasses = async (courseId: string) => {
    const parsed = parseInt(totalClassesInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 200) {
      await onUpdateCourseTotalClasses(courseId, parsed);
    }
    setEditingTotalCourseId(null);
  };

  const visibleAttendances = useMemo(() => {
    const filtered =
      effectiveSelectedCourseId === 'ALL'
        ? attendances
        : attendances.filter((a) => a.course_id === effectiveSelectedCourseId);
    return [...filtered].sort((a, b) => b.missed_date.localeCompare(a.missed_date));
  }, [attendances, effectiveSelectedCourseId]);

  const computeStats = (course: Course) => {
    const total = course.total_classes || 24;
    const missed = attendances.filter((a) => a.course_id === course.id).length;
    const maxMiss90 = Math.floor(total * 0.1);
    const maxMiss70 = Math.floor(total * 0.3);
    const rem90 = maxMiss90 - missed;
    const rem70 = maxMiss70 - missed;
    const currentPct =
      total > 0 ? Math.max(0, Math.round(((total - missed) / total) * 1000) / 10) : 100;

    return { total, missed, maxMiss90, maxMiss70, rem90, rem70, currentPct };
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-stone-100/90 dark:bg-white/[0.06] border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Class Attendance</h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Log missed classes only — track your 90% and 70% absence margins automatically.
          </p>
        </div>
        <button
          onClick={() => openAddForm()}
          disabled={courses.length === 0}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
        >
          <Plus className="w-4 h-4" /> Log Missed Class
        </button>
      </div>

      {/* Course Filter Pills */}
      {courses.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCourseId('ALL')}
            className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border ${
              effectiveSelectedCourseId === 'ALL'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-md shadow-teal-500/25'
                : 'card-surface text-stone-600 dark:text-zinc-400 hover:border-teal-500/45'
            }`}
          >
            All Courses ({courses.length})
          </button>
          {courses.map((c) => {
            const active = effectiveSelectedCourseId === c.id;
            const missedCount = attendances.filter((a) => a.course_id === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-2 ${
                  active
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-md shadow-teal-500/25'
                    : 'card-surface text-stone-700 dark:text-zinc-300 hover:border-teal-500/45'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: active ? '#ffffff' : c.color }}
                />
                <span>{c.code}</span>
                {missedCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                    }`}
                  >
                    -{missedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Inline Add / Edit Missed Class Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden p-5 rounded-2xl bg-white/95 dark:bg-[#12151f]/95 backdrop-blur-xl border border-teal-500/45 dark:border-teal-400/40 shadow-[0_0_32px_-4px_rgba(20,184,166,0.24)] space-y-4"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent"
          />
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">
              {editingId ? 'Edit Missed Class Record' : 'Log a Missed Class'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="p-2 rounded-xl bg-stone-100 dark:bg-white/[0.07] text-stone-500 dark:text-zinc-400 hover:bg-rose-500/15 hover:text-rose-500 active:bg-rose-500/25 active:text-rose-500 active:scale-90 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Course
              </label>
              <select
                value={formCourseId}
                onChange={(e) => setFormCourseId(e.target.value)}
                required
                className={inputClass}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-zinc-900">
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Date Missed
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Reason / Note <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Sick, Overslept, Family"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="btn-tactile px-4 py-2 rounded-xl bg-stone-200/80 dark:bg-white/[0.08] text-stone-700 dark:text-zinc-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-tactile px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-md shadow-teal-500/25"
            >
              {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Save Missed Class'}
            </button>
          </div>
        </form>
      )}

      {courses.length === 0 ? (
        <div className="p-12 rounded-2xl card-surface text-center">
          <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">
            No courses found{activeSemester !== 'All' ? ` in ${activeSemester}` : ''}.
          </p>
          <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
            Add your courses first in &ldquo;My Courses&rdquo; to track attendance.
          </p>
        </div>
      ) : selectedCourse ? (
        /* SINGLE COURSE FOCUSED DASHBOARD */
        (() => {
          const stats = computeStats(selectedCourse);
          const isEditingTotal = editingTotalCourseId === selectedCourse.id;

          return (
            <div className="space-y-4">
              {/* Course Banner + Editable Total Classes */}
              <div className="relative overflow-hidden p-5 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border border-teal-500/35 dark:border-teal-400/35 shadow-[0_0_28px_-4px_rgba(20,184,166,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/30 to-transparent"
                />
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedCourse.color }}
                  />
                  <div>
                    <h3 className="font-bold text-lg">
                      {selectedCourse.code}: {selectedCourse.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                      Current Standing: <strong className="text-teal-600 dark:text-teal-300">{stats.currentPct}%</strong> attendance ({stats.total - stats.missed}/{stats.total} classes)
                    </p>
                  </div>
                </div>

                {/* Editable Total Classes Pill */}
                <div className="flex items-center gap-2 bg-stone-100/90 dark:bg-white/[0.06] px-3.5 py-2 rounded-xl border border-stone-200/80 dark:border-white/10">
                  <BookOpen className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-xs text-stone-500 dark:text-zinc-400">Total Classes:</span>
                  {isEditingTotal ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={200}
                        value={totalClassesInput}
                        onChange={(e) => setTotalClassesInput(e.target.value)}
                        className="w-16 px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-900 border border-teal-500 text-xs font-bold text-center focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveTotalClasses(selectedCourse.id)}
                        className="btn-tactile p-1 rounded-lg bg-teal-600 text-white"
                        title="Save total classes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTotalCourseId(null)}
                        className="btn-tactile p-1 rounded-lg text-stone-400 hover:text-rose-500"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditTotalClasses(selectedCourse)}
                      className="btn-tactile flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-white hover:text-teal-500 dark:hover:text-teal-300"
                      title="Edit total semester classes"
                    >
                      <span>{stats.total}</span>
                      <Pencil className="w-3 h-3 text-teal-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Luminous Metric Boxes: Missed, 90% Allowance, 70% Allowance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Box 1: Days Missed */}
                <div className="relative overflow-hidden p-5 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border border-rose-500/40 dark:border-rose-400/35 shadow-[0_0_26px_-4px_rgba(244,63,94,0.22)]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-rose-500/12 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300 border border-rose-500/25">
                      Days Missed
                    </span>
                    <CalendarX2 className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-3xl font-bold mt-3 text-rose-600 dark:text-rose-400">
                    {stats.missed}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                    {stats.missed === 1 ? '1 class' : `${stats.missed} classes`} missed so far
                  </p>
                </div>

                {/* Box 2: 90% Attendance Target */}
                <div className="relative overflow-hidden p-5 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border border-emerald-500/40 dark:border-emerald-400/35 shadow-[0_0_26px_-4px_rgba(16,185,129,0.22)]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border border-emerald-500/25">
                      For 90% Attendance
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-bold mt-3 text-emerald-600 dark:text-emerald-400">
                    {stats.rem90 >= 0 ? `${stats.rem90} left` : `${Math.abs(stats.rem90)} over`}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                    Max <strong>{stats.maxMiss90}</strong> {stats.maxMiss90 === 1 ? 'miss' : 'misses'} allowed out of {stats.total}
                  </p>
                </div>

                {/* Box 3: 70% Attendance Minimum */}
                <div className="relative overflow-hidden p-5 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border border-amber-500/40 dark:border-amber-400/35 shadow-[0_0_26px_-4px_rgba(245,158,11,0.22)]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/14 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-500/30">
                      For 70% Attendance
                    </span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-3xl font-bold mt-3 text-amber-600 dark:text-amber-400">
                    {stats.rem70 >= 0 ? `${stats.rem70} left` : `${Math.abs(stats.rem70)} over`}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                    Max <strong>{stats.maxMiss70}</strong> {stats.maxMiss70 === 1 ? 'miss' : 'misses'} allowed out of {stats.total}
                  </p>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* ALL COURSES SUMMARY GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const stats = computeStats(course);
            const isEditingTotal = editingTotalCourseId === course.id;

            return (
              <div
                key={course.id}
                className="relative overflow-hidden p-5 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border border-teal-500/35 dark:border-teal-400/35 shadow-[0_0_26px_-4px_rgba(20,184,166,0.2)] hover:border-teal-400/75 hover:shadow-[0_0_36px_-2px_rgba(20,184,166,0.32)] transition-all duration-200"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/30 to-transparent"
                />
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => setSelectedCourseId(course.id)}
                    className="btn-tactile text-left flex items-center gap-2 group"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="font-bold text-base group-hover:text-teal-500 dark:group-hover:text-teal-300 transition-colors">
                      {course.code}: {course.name}
                    </span>
                  </button>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/12 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300 border border-teal-500/25 shrink-0">
                    {stats.currentPct}%
                  </span>
                </div>

                {/* Inline Editable Total Classes */}
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span>Total Classes:</span>
                    {isEditingTotal ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={totalClassesInput}
                          onChange={(e) => setTotalClassesInput(e.target.value)}
                          className="w-14 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-900 border border-teal-500 text-xs font-bold text-center"
                          autoFocus
                        />
                        <button
                          onClick={() => saveTotalClasses(course.id)}
                          className="p-0.5 rounded bg-teal-600 text-white"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingTotalCourseId(null)}
                          className="p-0.5 rounded text-stone-400 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditTotalClasses(course)}
                        className="btn-tactile inline-flex items-center gap-1 font-semibold text-stone-700 dark:text-zinc-200 hover:text-teal-500"
                        title="Edit total classes"
                      >
                        <span>{stats.total}</span>
                        <Pencil className="w-3 h-3 text-teal-500" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => openAddForm(course.id)}
                    className="btn-tactile text-xs font-semibold text-rose-500 hover:text-rose-400 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Miss
                  </button>
                </div>

                {/* Compact 3-column Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-200/70 dark:border-white/[0.08] text-center">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <p className="text-[10px] font-semibold uppercase text-rose-600 dark:text-rose-300">
                      Missed
                    </p>
                    <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {stats.missed}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] font-semibold uppercase text-emerald-700 dark:text-emerald-300">
                      90% Max ({stats.maxMiss90})
                    </p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {stats.rem90 >= 0 ? `${stats.rem90} left` : `${Math.abs(stats.rem90)} over`}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-300">
                      70% Max ({stats.maxMiss70})
                    </p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {stats.rem70 >= 0 ? `${stats.rem70} left` : `${Math.abs(stats.rem70)} over`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Missed Class History Log */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <CalendarX2 className="w-4 h-4 text-rose-500" />
            Missed Class Log ({visibleAttendances.length})
          </h3>
        </div>

        {visibleAttendances.length === 0 ? (
          <div className="p-8 rounded-2xl card-surface text-center">
            <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">
              No missed classes recorded 🎉
            </p>
            <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
              100% attendance so far! Click &ldquo;Log Missed Class&rdquo; only when you miss a class.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleAttendances.map((entry) => {
              const isConfirming = confirmDeleteId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="relative overflow-hidden p-4 rounded-2xl bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-xl border border-rose-500/30 dark:border-rose-400/25 shadow-[0_0_20px_-4px_rgba(244,63,94,0.16)] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: entry.courses?.color || '#f43f5e' }}
                      >
                        {entry.courses?.code}
                      </span>
                      <span className="text-xs font-semibold text-stone-700 dark:text-zinc-200">
                        {formatDisplayDate(entry.missed_date)}
                      </span>
                    </div>
                    {entry.courses?.name && (
                      <p className="text-xs text-stone-500 dark:text-zinc-400 truncate mt-1">
                        {entry.courses.name}
                      </p>
                    )}
                    {entry.note && (
                      <p className="text-xs text-rose-600/90 dark:text-rose-300/90 mt-1">
                        Note: {entry.note}
                      </p>
                    )}
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={async () => {
                          await onDeleteAttendance(entry.id);
                          setConfirmDeleteId(null);
                        }}
                        className="btn-tactile px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="btn-tactile px-2 py-1 rounded-lg bg-stone-200/80 dark:bg-white/[0.08] text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditForm(entry)}
                        title="Edit missed date or note"
                        className="btn-tactile p-2 rounded-xl text-stone-400 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-500/12 active:bg-teal-500/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(entry.id)}
                        title="Delete entry"
                        className="btn-tactile p-2 rounded-xl text-stone-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/12 active:bg-rose-500/25 active:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}