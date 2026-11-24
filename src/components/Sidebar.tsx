'use client';

import React from 'react';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Moon,
  NotebookPen,
  Sun,
  UserCheck,
} from 'lucide-react';
import { TabId } from '@/lib/types';

interface PendingCounts {
  Quiz: number;
  Assignment: number;
  Midterm: number;
  Final: number;
}

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  pendingCounts: PendingCounts;
}

interface MobileHeaderProps {
  setActiveTab: (tab: TabId) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

interface MobileBottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  pendingCounts: PendingCounts;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
  onLogout,
  pendingCounts,
}: SidebarProps) {
  const navItems: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: <Home className="w-4 h-4" /> },
    { id: 'routine', label: 'Routine', icon: <Calendar className="w-4 h-4" /> },
    { id: 'Quiz', label: 'Quizzes', icon: <CheckSquare className="w-4 h-4" />, badge: pendingCounts.Quiz },
    {
      id: 'Assignment',
      label: 'Assignments',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: pendingCounts.Assignment,
    },
    { id: 'Midterm', label: 'Midterms', icon: <FileText className="w-4 h-4" />, badge: pendingCounts.Midterm },
    { id: 'Final', label: 'Finals', icon: <GraduationCap className="w-4 h-4" />, badge: pendingCounts.Final },
    { id: 'attendance', label: 'Attendance', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <NotebookPen className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('today')}
          className="flex items-center gap-3 text-left w-full"
        >
          <img
            src="/logo.svg"
            alt="Track Rakho Logo"
            className="w-9 h-9 rounded-xl object-contain shrink-0"
          />
          <span className="font-extrabold text-xl tracking-tight text-teal-600 dark:text-teal-400">
            Track Rakho
          </span>
        </button>

        {uniqueSemesters.length > 0 && (
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="mt-3 w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Semesters</option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/70 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Lock / Logout
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
  onLogout,
}: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <button
        onClick={() => setActiveTab('today')}
        className="flex items-center gap-2 shrink-0"
      >
        <img
          src="/logo.png"
          alt="Track Rakho Logo"
          className="w-7 h-7 rounded-lg object-contain shrink-0"
        />
        <span className="font-extrabold text-lg text-teal-600 dark:text-teal-400">
          Track Rakho
        </span>
      </button>

      <div className="flex items-center gap-2">
        {uniqueSemesters.length > 0 && (
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="max-w-[130px] px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
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
          aria-label="Toggle theme"
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onLogout}
          aria-label="Logout"
          title="Lock / Logout"
          className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingCounts,
}: MobileBottomNavProps) {
  const totalAssessments =
    pendingCounts.Quiz + pendingCounts.Assignment + pendingCounts.Midterm + pendingCounts.Final;

  const items: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: <Home className="w-5 h-5" /> },
    { id: 'routine', label: 'Routine', icon: <Calendar className="w-5 h-5" /> },
    { id: 'Quiz', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, badge: totalAssessments },
    { id: 'attendance', label: 'Attend', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-around">
      {items.map((item) => {
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-medium ${
              active
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {typeof item.badge === 'number' && item.badge > 0 && (
              <span className="absolute top-0 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}