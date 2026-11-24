'use client';

import React from 'react';
import {
  Calendar,
  BookOpen,
  Moon,
  Sun,
  LayoutDashboard,
  GraduationCap,
  StickyNote,
  ClipboardList,
  BookMarked,
  Award,
  PenTool,
} from 'lucide-react';
import { AssessmentType, TabId } from '@/lib/types';

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  pendingCounts: Record<AssessmentType, number>;
}

const getNavItems = (pendingCounts: Record<AssessmentType, number>) => [
  { id: 'today' as TabId, label: 'Today & Overview', mobileLabel: 'Today', icon: LayoutDashboard },
  { id: 'routine' as TabId, label: 'Weekly Routine', mobileLabel: 'Routine', icon: Calendar },
  { id: 'Quiz' as TabId, label: 'Quizzes', mobileLabel: 'Quizzes', icon: PenTool, count: pendingCounts.Quiz },
  { id: 'Assignment' as TabId, label: 'Assignments', mobileLabel: 'Tasks', icon: ClipboardList, count: pendingCounts.Assignment },
  { id: 'Midterm' as TabId, label: 'Midterms', mobileLabel: 'Midterm', icon: BookMarked, count: pendingCounts.Midterm },
  { id: 'Final' as TabId, label: 'Finals', mobileLabel: 'Final', icon: Award, count: pendingCounts.Final },
  { id: 'notes' as TabId, label: 'Quick Notes', mobileLabel: 'Notes', icon: StickyNote },
  { id: 'courses' as TabId, label: 'My Courses', mobileLabel: 'Courses', icon: BookOpen },
];

export function Sidebar({
  activeTab,
  setActiveTab,
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
  pendingCounts,
}: NavigationProps) {
  const navItems = getNavItems(pendingCounts);

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 z-30">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">Track Rakho</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">My Personal Planner</p>
        </div>
      </div>

      {/* Active Semester Switcher in Sidebar */}
      {uniqueSemesters.length > 0 && (
        <div className="px-4 mb-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
            Active Semester
          </label>
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Semesters</option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1 mt-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader({
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
}: Pick<
  NavigationProps,
  'uniqueSemesters' | 'activeSemester' | 'onSelectActiveSemester' | 'darkMode' | 'onToggleDarkMode'
>) {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="font-bold text-base tracking-tight">Track Rakho</span>
      </div>

      <div className="flex items-center gap-2">
        {uniqueSemesters.length > 0 && (
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="All">All Semesters</option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={onToggleDarkMode}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingCounts,
}: Pick<NavigationProps, 'activeTab' | 'setActiveTab' | 'pendingCounts'>) {
  const navItems = getNavItems(pendingCounts);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 z-30 px-2 py-1.5 flex items-center gap-1 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative shrink-0 flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[11px] font-medium transition-colors ${
              active
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${active ? 'stroke-[2.5]' : ''}`} />
            <span>{item.mobileLabel}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className="absolute top-1 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}