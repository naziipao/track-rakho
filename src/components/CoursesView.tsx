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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your complete course record organized by semester.
          </p>
        </div>
        <button
          onClick={() => onOpenAddCourse()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {uniqueSemesters.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCourseTabFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              courseTabFilter === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Semesters ({courses.length})
          </button>
          {uniqueSemesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setCourseTabFilter(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                courseTabFilter === sem
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {sem} ({courses.filter((c) => c.semester === sem).length})
            </button>
          ))}
        </div>
      )}

      {Object.keys(coursesBySemester).length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No courses added yet.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;Add Course&rdquo; to enter your semester name and enrolled courses.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(coursesBySemester).map(([semesterName, semCourses]) => (
            <div key={semesterName} className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold text-base tracking-tight">{semesterName}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {semCourses.length} {semCourses.length === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenAddCourse(semesterName)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to {semesterName}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {semCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden"
                  >
                    <div
                      className="h-1.5 w-full absolute top-0 left-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex items-start justify-between mt-1">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code}
                      </span>
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-base mt-3">{course.name}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Faculty Initial:{' '}
                      <strong className="text-slate-700 dark:text-slate-200">{course.faculty}</strong>
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