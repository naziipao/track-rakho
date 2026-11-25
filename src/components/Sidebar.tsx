'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  Sun,
  Moon,
  LogOut,
  Home,
  ChevronDown,
  FlaskConical,
  BookMarked,
} from 'lucide-react';
import { AssignmentCategory, AssessmentType, ExamCategory, TabId } from '@/lib/types';

export type CategorizedAssessmentType = 'Assignment' | 'Midterm' | 'Final';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssignmentCategory | ExamCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssignmentCategory | ExamCategory
  ) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  pendingCounts: Record<AssessmentType, number>;
  subCounts: Record<
    CategorizedAssessmentType,
    Record<AssignmentCategory | ExamCategory, number>
  >;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  categoryFilters,
  onSelectCategorizedAssessment,
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
  onLogout,
  pendingCounts,
  subCounts,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<CategorizedAssessmentType, boolean>
  >({
    Assignment: activeTab === 'Assignment',
    Midterm: activeTab === 'Midterm',
    Final: activeTab === 'Final',
  });

  useEffect(() => {
    if (activeTab === 'Assignment' || activeTab === 'Midterm' || activeTab === 'Final') {
      setExpandedSections((prev) => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab]);

  const toggleSection = (type: CategorizedAssessmentType) => {
    setExpandedSections((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const navItemClass = (isActive: boolean) =>
    `btn-tactile w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25'
        : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-white/[0.06] hover:text-stone-900 dark:hover:text-zinc-100'
    }`;

  const renderExpandableCategorySection = (
    type: CategorizedAssessmentType,
    label: string,
    icon: React.ReactNode
  ) => {
    const isExpanded = expandedSections[type];
    const currentCategory = categoryFilters[type];
    const counts = subCounts[type];

    return (
      <div className="space-y-1">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => toggleSection(type)}
          className={navItemClass(false)}
        >
          <span className="flex items-center gap-3">
            {icon} {label}
          </span>
          <span className="flex items-center gap-1.5">
            {pendingCounts[type] > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
                {pendingCounts[type]}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        {isExpanded && (
          <div className="pl-5 pr-1 space-y-1 pt-0.5">
            {(['Theory', 'Lab'] as const).map((cat) => {
              const isSelected = activeTab === type && currentCategory === cat;
              const CatIcon = cat === 'Theory' ? BookMarked : FlaskConical;

              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => onSelectCategorizedAssessment(type, cat)}
                  className={`btn-tactile w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25'
                      : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-white/[0.06] hover:text-stone-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CatIcon
                      className={`w-3.5 h-3.5 ${
                        isSelected
                          ? 'text-white'
                          : cat === 'Theory'
                            ? 'text-teal-500'
                            : 'text-emerald-500'
                      }`}
                    />{' '}
                    {cat}
                  </span>
                  {counts[cat] > 0 && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200/80 dark:bg-white/[0.08] text-stone-700 dark:text-zinc-200'
                      }`}
                    >
                      {counts[cat]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-stone-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0d1017]/95 backdrop-blur-xl z-30">
      <div className="p-5 flex items-center justify-between border-b border-stone-200/70 dark:border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="Track Rakho"
            className="w-8 h-8 rounded-xl object-cover shadow-sm"
          />
          <span className="font-bold text-base tracking-tight">Track Rakho</span>
        </div>
        <button
          onClick={onToggleDarkMode}
          aria-label="Toggle theme"
          className="btn-tactile p-2 rounded-xl bg-stone-100 dark:bg-white/[0.06] text-stone-600 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {uniqueSemesters.length > 0 && (
        <div className="px-4 pt-4 pb-1">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-1.5 px-1">
            <Layers className="w-3 h-3" /> Active Semester
          </label>
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All" className="dark:bg-zinc-900">
              All Semesters
            </option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem} className="dark:bg-zinc-900">
                {sem}
              </option>
            ))}
          </select>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <button
          onClick={() => setActiveTab('today')}
          className={navItemClass(activeTab === 'today')}
        >
          <span className="flex items-center gap-3">
            <Home className="w-4 h-4" /> Today
          </span>
        </button>

        <button
          onClick={() => setActiveTab('routine')}
          className={navItemClass(activeTab === 'routine')}
        >
          <span className="flex items-center gap-3">
            <Calendar className="w-4 h-4" /> Routine
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Quiz')}
          className={navItemClass(activeTab === 'Quiz')}
        >
          <span className="flex items-center gap-3">
            <CheckSquare className="w-4 h-4" /> Quizzes
          </span>
          {pendingCounts.Quiz > 0 && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'Quiz'
                  ? 'bg-white/20 text-white'
                  : 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
              }`}
            >
              {pendingCounts.Quiz}
            </span>
          )}
        </button>

        {renderExpandableCategorySection(
          'Assignment',
          'Assignments',
          <ClipboardList className="w-4 h-4" />
        )}

        {renderExpandableCategorySection(
          'Midterm',
          'Midterms',
          <FileText className="w-4 h-4" />
        )}

        {renderExpandableCategorySection(
          'Final',
          'Finals',
          <GraduationCap className="w-4 h-4" />
        )}

        <button
          onClick={() => setActiveTab('attendance')}
          className={navItemClass(activeTab === 'attendance')}
        >
          <span className="flex items-center gap-3">
            <Users className="w-4 h-4" /> Attendance
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={navItemClass(activeTab === 'notes')}
        >
          <span className="flex items-center gap-3">
            <BookOpen className="w-4 h-4" /> Notes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={navItemClass(activeTab === 'courses')}
        >
          <span className="flex items-center gap-3">
            <Layers className="w-4 h-4" /> Courses
          </span>
        </button>
      </nav>

      <div className="p-3 border-t border-stone-200/70 dark:border-white/[0.07]">
        <button
          onClick={onLogout}
          className="btn-tactile w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut className="w-4 h-4" /> Lock Workspace
        </button>
      </div>
    </aside>
  );
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
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-stone-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0d1017]/95 backdrop-blur-xl">
      <button
        onClick={() => setActiveTab('today')}
        className="flex items-center gap-2 text-left"
      >
        <img
          src="/logo.png?v=2"
          alt="Track Rakho"
          className="w-7 h-7 rounded-lg object-cover"
        />
        <span className="font-bold text-base tracking-tight">Track Rakho</span>
      </button>

      <div className="flex items-center gap-2">
        {uniqueSemesters.length > 0 && (
          <select
            value={activeSemester}
            onChange={(e) => onSelectActiveSemester(e.target.value)}
            aria-label="Select semester"
            className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/10 text-xs font-semibold"
          >
            <option value="All" className="dark:bg-zinc-900">
              All
            </option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem} className="dark:bg-zinc-900">
                {sem}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={onToggleDarkMode}
          aria-label="Toggle theme"
          className="btn-tactile p-2 rounded-xl bg-stone-100 dark:bg-white/[0.06]"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={onLogout}
          aria-label="Lock workspace"
          className="btn-tactile p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

interface MobileBottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  pendingCounts: Record<AssessmentType, number>;
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingCounts,
}: MobileBottomNavProps) {
  const items: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: <Home className="w-4 h-4" /> },
    { id: 'routine', label: 'Routine', icon: <Calendar className="w-4 h-4" /> },
    {
      id: 'Assignment',
      label: 'Assign',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: pendingCounts.Assignment,
    },
    { id: 'attendance', label: 'Attend', icon: <Users className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-stone-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#0d1017]/95 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`btn-tactile relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold ${
              isActive
                ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10'
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-teal-500" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}