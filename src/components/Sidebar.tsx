'use client';

import React from 'react';
import {
  Calendar,
  BookOpen,
  Moon,
  Sun,
  LayoutDashboard,
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
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white/80 dark:bg-[#0d0f16]/85 backdrop-blur-2xl border-r border-stone-200/80 dark:border-white/[0.07] z-30">
      <button
        type="button"
        onClick={() => setActiveTab('today')}
        className="btn-tactile p-6 flex items-center gap-3 text-left w-full group"
      >
        <img
          src="/logo.svg"
          alt="Track Rakho Logo"
          className="w-10 h-10 rounded-xl shadow-md shadow-teal-500/25 group-hover:shadow-teal-500/45 group-hover:scale-105 transition-all shrink-0"
        />
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
            Track Rakho
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">My Personal Planner</p>
        </div>
      </button>

      {/* Active Semester Switcher in Sidebar */}
      {uniqueSemesters.length > 0 && (
        <div className="px-4 mb-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 px-1 mb-1">
            Active Semester
          </label>
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100/90 dark:bg-white/[0.06] border border-stone-200/80 dark:border-white/10 hover:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          >
            <option value="All" className="dark:bg-zinc-900">All Semesters</option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem} className="dark:bg-zinc-900">
                {sem}
              </option>
            ))}
          </select>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1.5 mt-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`btn-tactile w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium group ${
                active
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25 ring-1 ring-white/15'
                  : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-200/60 dark:hover:bg-white/[0.06] hover:text-stone-900 dark:hover:text-white hover:translate-x-0.5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 ${
                    active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-teal-500 dark:group-hover:text-teal-400'
                  }`}
                />
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-500/12 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-200/80 dark:border-white/[0.07]">
        <button
          onClick={onToggleDarkMode}
          className="btn-tactile w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-stone-100/90 dark:bg-white/[0.06] border border-stone-200/70 dark:border-white/10 hover:border-teal-500/40 hover:bg-stone-200/70 dark:hover:bg-white/[0.1]"
        >
          <span className="flex items-center gap-2.5">
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-teal-600" />
            )}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader({
  setActiveTab,
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
}: Pick<
  NavigationProps,
  'setActiveTab' | 'uniqueSemesters' | 'activeSemester' | 'onSelectActiveSemester' | 'darkMode' | 'onToggleDarkMode'
>) {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-[#0d0f16]/85 backdrop-blur-xl border-b border-stone-200/80 dark:border-white/[0.08] px-4 py-3 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => setActiveTab('today')}
        className="btn-tactile flex items-center gap-2 text-left"
      >
        <img
          src="/logo.svg"
          alt="Track Rakho Logo"
          className="w-8 h-8 rounded-lg shadow-sm shadow-teal-500/25 shrink-0"
        />
        <span className="font-bold text-base tracking-tight">Track Rakho</span>
      </button>

      <div className="flex items-center gap-2">
        {uniqueSemesters.length > 0 && (
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/[0.07] border border-stone-200 dark:border-white/10"
          >
            <option value="All" className="dark:bg-zinc-900">All Semesters</option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem} className="dark:bg-zinc-900">
                {sem}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={onToggleDarkMode}
          aria-label="Toggle Theme"
          className="btn-tactile p-2 rounded-xl bg-stone-100 dark:bg-white/[0.07] border border-stone-200/70 dark:border-white/10 text-stone-700 dark:text-zinc-200 active:bg-amber-500/15"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#0d0f16]/90 backdrop-blur-xl border-t border-stone-200/80 dark:border-white/[0.08] z-30 px-2 py-1.5 flex items-center gap-1 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`btn-tactile relative shrink-0 flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[11px] font-medium ${
              active
                ? 'text-teal-700 dark:text-teal-300 bg-teal-500/12 dark:bg-teal-400/15 ring-1 ring-teal-500/30'
                : 'text-stone-500 dark:text-zinc-400 active:bg-stone-200/70 dark:active:bg-white/10'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${active ? 'stroke-[2.5]' : ''}`} />
            <span>{item.mobileLabel}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className="absolute top-1 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-teal-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}