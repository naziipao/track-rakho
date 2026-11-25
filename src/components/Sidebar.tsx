'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  Clock,
  FileCheck2,
  ClipboardList,
  BookOpenCheck,
  GraduationCap,
  UserCheck,
  StickyNote,
  Library,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { AssessmentCategory, TabId } from '@/lib/types';

export type CategorizedAssessmentType = 'Assignment' | 'Midterm' | 'Final';

interface PendingCounts {
  Quiz: number;
  Assignment: number;
  Midterm: number;
  Final: number;
}

interface SubCounts {
  Assignment: { Theory: number; Lab: number };
  Midterm: { Theory: number; Lab: number };
  Final: { Theory: number; Lab: number };
}

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  pendingCounts: PendingCounts;
  subCounts: SubCounts;
}

interface MobileHeaderProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  pendingCounts: PendingCounts;
  subCounts: SubCounts;
}

interface MobileBottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  pendingCounts: PendingCounts;
  categoryFilters?: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment?: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  subCounts?: SubCounts;
}

const NAV_ITEMS: {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: keyof PendingCounts;
  categorized?: CategorizedAssessmentType;
}[] = [
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'routine', label: 'Routine', icon: Clock },
  { id: 'Quiz', label: 'Quiz', icon: FileCheck2, countKey: 'Quiz' },
  {
    id: 'Assignment',
    label: 'Assignment',
    icon: ClipboardList,
    countKey: 'Assignment',
    categorized: 'Assignment',
  },
  {
    id: 'Midterm',
    label: 'Midterm',
    icon: BookOpenCheck,
    countKey: 'Midterm',
    categorized: 'Midterm',
  },
  {
    id: 'Final',
    label: 'Final',
    icon: GraduationCap,
    countKey: 'Final',
    categorized: 'Final',
  },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'courses', label: 'Courses', icon: Library },
];

// --- SHARED NAV LIST WITH COLLAPSIBLE DROPDOWNS ---
function NavMenuList({
  activeTab,
  setActiveTab,
  categoryFilters,
  onSelectCategorizedAssessment,
  pendingCounts,
  subCounts,
  onItemSelect,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  pendingCounts: PendingCounts;
  subCounts: SubCounts;
  onItemSelect?: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<CategorizedAssessmentType, boolean>>({
    Assignment: activeTab === 'Assignment',
    Midterm: activeTab === 'Midterm',
    Final: activeTab === 'Final',
  });

  useEffect(() => {
    if (activeTab === 'Assignment' || activeTab === 'Midterm' || activeTab === 'Final') {
      setExpanded((prev) => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab]);

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const badge = item.countKey ? pendingCounts[item.countKey] : 0;
        const isDropdown = Boolean(item.categorized);
        const isOpen = item.categorized ? expanded[item.categorized] : false;

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => {
                if (item.categorized) {
                  setExpanded((prev) => ({
                    ...prev,
                    [item.categorized!]: !prev[item.categorized!],
                  }));
                } else {
                  setActiveTab(item.id);
                  onItemSelect?.();
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </span>

              <span className="flex items-center gap-1.5">
                {badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-600 text-white">
                    {badge}
                  </span>
                )}
                {isDropdown && (
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  />
                )}
              </span>
            </button>

            {item.categorized && isOpen && (
              <div className="ml-5 mt-1 mb-1.5 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                {(['Theory', 'Lab'] as AssessmentCategory[]).map((cat) => {
                  const subActive = isActive && categoryFilters[item.categorized!] === cat;
                  const count = subCounts[item.categorized!][cat];

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onSelectCategorizedAssessment(item.categorized!, cat);
                        onItemSelect?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        subActive
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          subActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// --- DESKTOP SIDEBAR ---
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
  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className="flex items-center gap-2.5 text-left"
        >
          <img
            src="/logo.svg"
            alt="Track Rakho"
            className="w-9 h-9 rounded-xl object-cover shadow-sm shrink-0"
          />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            Track Rakho
          </span>
        </button>
      </div>

      <div className="px-4 pt-4 pb-2 shrink-0">
        <select
          value={activeSemester}
          onChange={(e) => onSelectActiveSemester(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="All">All Semesters</option>
          {uniqueSemesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      <NavMenuList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categoryFilters={categoryFilters}
        onSelectCategorizedAssessment={onSelectCategorizedAssessment}
        pendingCounts={pendingCounts}
        subCounts={subCounts}
      />

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Lock app"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

// --- MOBILE TOP HEADER + COLLAPSIBLE DRAWER MENU ---
export function MobileHeader({
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
}: MobileHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="p-2 -ml-1 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className="flex items-center gap-2 shrink-0"
            >
              <img
                src="/logo.svg?v=2"
                alt="Track Rakho"
                className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0"
              />
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Track Rakho
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <select
              value={activeSemester}
              onChange={(e) => onSelectActiveSemester(e.target.value)}
              className="max-w-[110px] truncate px-2 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            >
              <option value="All">All Sem</option>
              {uniqueSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onLogout}
              aria-label="Lock app"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible Slide-Over Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.svg?v=2"
                  alt="Track Rakho"
                  className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0"
                />
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  Track Rakho
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <NavMenuList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              categoryFilters={categoryFilters}
              onSelectCategorizedAssessment={onSelectCategorizedAssessment}
              pendingCounts={pendingCounts}
              subCounts={subCounts}
              onItemSelect={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

// --- MOBILE BOTTOM NAV + ON-DEMAND SUB-MENU BAR ---
export function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingCounts,
  categoryFilters,
  onSelectCategorizedAssessment,
  subCounts,
}: MobileBottomNavProps) {
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<CategorizedAssessmentType | null>(null);

  useEffect(() => {
    activeBtnRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeTab]);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      {/* Mobile Sub-Menu — opens when tapping Assignment / Midterm / Final without redirecting */}
      {openSubMenu && categoryFilters && onSelectCategorizedAssessment && (
        <div className="px-3 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-1 shrink-0">
            {openSubMenu}:
          </span>
          <div className="flex-1 flex items-center justify-center gap-2">
            {(['Theory', 'Lab'] as AssessmentCategory[]).map((cat) => {
              const isSelected =
                activeTab === openSubMenu && categoryFilters[openSubMenu] === cat;
              const count = subCounts?.[openSubMenu]?.[cat];

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onSelectCategorizedAssessment(openSubMenu, cat);
                    setOpenSubMenu(null);
                  }}
                  className={`flex-1 max-w-[130px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  {typeof count === 'number' && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setOpenSubMenu(null)}
            aria-label="Close sub-menu"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontally Scrollable Bottom Tabs */}
      <div
        className="flex items-center overflow-x-auto touch-pan-x scroll-smooth px-2 py-1.5 gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isSubMenuOpen = item.categorized && openSubMenu === item.categorized;
          const badge = item.countKey ? pendingCounts[item.countKey] : 0;

          return (
            <button
              key={item.id}
              ref={isActive ? activeBtnRef : null}
              type="button"
              onClick={() => {
                if (item.categorized) {
                  setOpenSubMenu((prev) =>
                    prev === item.categorized ? null : item.categorized!
                  );
                } else {
                  setOpenSubMenu(null);
                  setActiveTab(item.id);
                }
              }}
              className={`relative shrink-0 min-w-[68px] flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-colors ${
                isActive || isSubMenuOpen
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-teal-600 text-white">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}