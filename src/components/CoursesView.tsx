'use client';

import React from 'react';
import { Plus, Layers, Trash2, User } from 'lucide-react';
import { Course } from '@/lib/types';

interface CoursesViewProps {
  courses: Course[];
  uniqueSemesters: string[];
  courseTabFilter: string;
  setCourseTabFilter: (sem: string) => void;
  coursesBySemester: Record<string, Course[]>;
  onOpenAddCourse: (defaultSemester?: string) => void;
  onDeleteCourse: (id: string) => void;
}

export default function CoursesView({
  courses,
  uniqueSemesters,
  courseTabFilter,
  setCourseTabFilter,
  coursesBySemester,
  onOpenAddCourse,
  onDeleteCourse,
}: CoursesViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Semester Courses</h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Your complete course record organized by semester.
          </p>
        </div>
        <button
          onClick={() => onOpenAddCourse()}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {uniqueSemesters.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCourseTabFilter('All')}
            className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              courseTabFilter === 'All'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25'
                : 'card-surface text-stone-600 dark:text-zinc-400 hover:border-teal-500/45'
            }`}
          >
            All Semesters ({courses.length})
          </button>
          {uniqueSemesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setCourseTabFilter(sem)}
              className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                courseTabFilter === sem
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25'
                  : 'card-surface text-stone-600 dark:text-zinc-400 hover:border-teal-500/45'
              }`}
            >
              {sem} ({courses.filter((c) => c.semester === sem).length})
            </button>
          ))}
        </div>
      )}

      {Object.keys(coursesBySemester).length === 0 ? (
        <div className="p-12 rounded-2xl card-surface text-center">
          <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">
            No courses added yet.
          </p>
          <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
            Click &ldquo;Add Course&rdquo; to enter your semester name and enrolled courses.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(coursesBySemester).map(([semesterName, semCourses]) => (
            <div key={semesterName} className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-white/[0.08] pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-500" />
                  <h3 className="font-bold text-base tracking-tight">{semesterName}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-white/[0.08] text-stone-600 dark:text-zinc-300">
                    {semCourses.length} {semCourses.length === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenAddCourse(semesterName)}
                  className="btn-tactile text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 px-2.5 py-1 rounded-lg hover:bg-teal-500/10 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to {semesterName}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {semCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl card-surface hover:border-teal-500/40 dark:hover:border-teal-400/35 hover:shadow-[0_12px_36px_rgba(20,184,166,0.1)] relative overflow-hidden"
                  >
                    <div
                      className="h-1.5 w-full absolute top-0 left-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex items-start justify-between mt-1">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg text-white shadow-sm"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code}
                      </span>
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        title="Delete course"
                        className="btn-tactile text-stone-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/12 active:bg-rose-500/25 active:text-rose-500 p-2 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-base mt-3">{course.name}</h4>
                    <p className="text-xs font-medium text-stone-500 dark:text-zinc-400 mt-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-500" /> Faculty Initial:{' '}
                      <strong className="text-stone-700 dark:text-zinc-200">{course.faculty}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}