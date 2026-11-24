'use client';

import React from 'react';
import { X } from 'lucide-react';
import {
  AssessmentType,
  Course,
  COURSE_COLORS,
  DAYS_OF_WEEK,
  ModalType,
} from '@/lib/types';

interface ModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  saving: boolean;
  editingAssessmentId: string | null;
  uniqueSemesters: string[];
  courses: Course[];
  activeCourses: Course[];
  courseForm: {
    semester: string;
    code: string;
    name: string;
    faculty: string;
    color: string;
  };
  setCourseForm: React.Dispatch<
    React.SetStateAction<{
      semester: string;
      code: string;
      name: string;
      faculty: string;
      color: string;
    }>
  >;
  onAddCourse: (e: React.FormEvent) => void;
  routineForm: {
    course_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room: string;
  };
  setRoutineForm: React.Dispatch<
    React.SetStateAction<{
      course_id: string;
      day_of_week: string;
      start_time: string;
      end_time: string;
      room: string;
    }>
  >;
  onAddRoutine: (e: React.FormEvent) => void;
  assessmentForm: {
    course_id: string;
    type: AssessmentType;
    title: string;
    topics: string;
    due_date: string;
    room: string;
  };
  setAssessmentForm: React.Dispatch<
    React.SetStateAction<{
      course_id: string;
      type: AssessmentType;
      title: string;
      topics: string;
      due_date: string;
      room: string;
    }>
  >;
  onAddAssessment: (e: React.FormEvent) => void;
  noteForm: {
    course_code: string;
    title: string;
    content: string;
  };
  setNoteForm: React.Dispatch<
    React.SetStateAction<{
      course_code: string;
      title: string;
      content: string;
    }>
  >;
  onAddNote: (e: React.FormEvent) => void;
}

export default function Modals({
  activeModal,
  onClose,
  saving,
  editingAssessmentId,
  uniqueSemesters,
  courses,
  activeCourses,
  courseForm,
  setCourseForm,
  onAddCourse,
  routineForm,
  setRoutineForm,
  onAddRoutine,
  assessmentForm,
  setAssessmentForm,
  onAddAssessment,
  noteForm,
  setNoteForm,
  onAddNote,
}: ModalsProps) {
  if (!activeModal) return null;

  const isExam = assessmentForm.type === 'Midterm' || assessmentForm.type === 'Final';
  const isEditingAssessment = Boolean(editingAssessmentId);
  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-stone-100/90 dark:bg-white/[0.06] border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all';

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white dark:bg-[#12151f] rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-white/12 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg tracking-tight">
            {activeModal === 'course' && 'Add Course to Semester'}
            {activeModal === 'routine' && 'Add Class to Routine'}
            {activeModal === 'assessment' &&
              (isEditingAssessment
                ? isExam
                  ? `Edit ${assessmentForm.type} Exam`
                  : `Edit ${assessmentForm.type}`
                : isExam
                  ? `Add ${assessmentForm.type} Exam`
                  : `Add ${assessmentForm.type}`)}
            {activeModal === 'note' && 'Create Quick Note'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-stone-100 dark:bg-white/[0.07] text-stone-500 dark:text-zinc-400 hover:bg-rose-500/15 hover:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 active:bg-rose-500/25 active:text-rose-500 active:scale-90 transition-all duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL 1: ADD COURSE WITH SEMESTER */}
        {activeModal === 'course' && (
          <form onSubmit={onAddCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Semester Name
              </label>
              <input
                type="text"
                required
                list="semester-suggestions"
                placeholder="e.g., Fall 2026, Spring 2026, Semester 4"
                value={courseForm.semester}
                onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                className={inputClass}
              />
              <datalist id="semester-suggestions">
                {uniqueSemesters.map((sem) => (
                  <option key={sem} value={sem} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Course Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g., CSE340"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Course Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Computer Architecture"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Faculty Initials
              </label>
              <input
                type="text"
                required
                placeholder="e.g., FARS"
                value={courseForm.faculty}
                onChange={(e) => setCourseForm({ ...courseForm, faculty: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-stone-600 dark:text-zinc-300">
                Color Tag
              </label>
              <div className="flex gap-2.5 flex-wrap">
                {COURSE_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setCourseForm({ ...courseForm, color })}
                    className={`w-7 h-7 rounded-full transition-all duration-150 active:scale-90 hover:scale-110 ${
                      courseForm.color === color
                        ? 'scale-125 ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-[#12151f]'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-tactile w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold text-sm mt-2 shadow-lg shadow-teal-500/25"
            >
              {saving ? 'Saving...' : 'Save Course'}
            </button>
          </form>
        )}

        {/* MODAL 2: ADD ROUTINE */}
        {activeModal === 'routine' && (
          <form onSubmit={onAddRoutine} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Select Course
              </label>
              <select
                value={routineForm.course_id}
                onChange={(e) => setRoutineForm({ ...routineForm, course_id: e.target.value })}
                className={inputClass}
              >
                {activeCourses.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-zinc-900">
                    {c.code} — {c.name} ({c.faculty})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Day of Week
              </label>
              <select
                value={routineForm.day_of_week}
                onChange={(e) => setRoutineForm({ ...routineForm, day_of_week: e.target.value })}
                className={inputClass}
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d} className="dark:bg-zinc-900">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={routineForm.start_time}
                  onChange={(e) => setRoutineForm({ ...routineForm, start_time: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={routineForm.end_time}
                  onChange={(e) => setRoutineForm({ ...routineForm, end_time: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Room Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g., UB40203 or Lab-4"
                value={routineForm.room}
                onChange={(e) => setRoutineForm({ ...routineForm, room: e.target.value })}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-tactile w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold text-sm mt-2 shadow-lg shadow-teal-500/25"
            >
              {saving ? 'Saving...' : 'Add to Schedule'}
            </button>
          </form>
        )}

        {/* MODAL 3: ADD / EDIT ASSESSMENT */}
        {activeModal === 'assessment' && (
          <form onSubmit={onAddAssessment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Course
              </label>
              <select
                value={assessmentForm.course_id}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, course_id: e.target.value })}
                className={inputClass}
              >
                {activeCourses.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-zinc-900">
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {!isExam && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                  Title / Number
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    assessmentForm.type === 'Quiz' ? 'e.g., Quiz 2' : 'e.g., Assignment 1'
                  }
                  value={assessmentForm.title}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                {isExam ? 'Exam Date & Time' : 'Date & Time / Deadline'}
              </label>
              <input
                type="datetime-local"
                required
                value={assessmentForm.due_date}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, due_date: e.target.value })}
                className={inputClass}
              />
            </div>

            {isExam && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                  Room Number <span className="text-stone-400 dark:text-zinc-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., UB40203 or Exam Hall 2"
                  value={assessmentForm.room}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, room: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Syllabus / Topics
              </label>
              <textarea
                rows={isExam ? 3 : 2}
                placeholder={
                  isExam
                    ? 'e.g., Chapters 1-5, Lectures 1-12, Lab 1-4'
                    : 'e.g., Linked Lists, Stacks & Queues (Lectures 4-7)'
                }
                value={assessmentForm.topics}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, topics: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-tactile w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold text-sm mt-2 shadow-lg shadow-teal-500/25"
            >
              {saving
                ? 'Saving...'
                : isEditingAssessment
                  ? `Update ${assessmentForm.type}`
                  : `Save ${assessmentForm.type}`}
            </button>
          </form>
        )}

        {/* MODAL 4: ADD NOTE */}
        {activeModal === 'note' && (
          <form onSubmit={onAddNote} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Course Tag
              </label>
              <select
                value={noteForm.course_code}
                onChange={(e) => setNoteForm({ ...noteForm, course_code: e.target.value })}
                className={inputClass}
              >
                <option value="General" className="dark:bg-zinc-900">General</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code} className="dark:bg-zinc-900">
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Note Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Google Drive Folder / Key Formulas"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-600 dark:text-zinc-300">
                Content
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your notes here..."
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-tactile w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold text-sm mt-2 shadow-lg shadow-teal-500/25"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}