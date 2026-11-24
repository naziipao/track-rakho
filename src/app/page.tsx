'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  Moon,
  Sun,
  LayoutDashboard,
  FileText,
  GraduationCap,
  MapPin,
  User,
  Lock,
  Sparkles,
  AlertCircle,
  X,
  StickyNote,
  Filter,
  Layers,
  ClipboardList,
  BookMarked,
  Award,
  PenTool
} from 'lucide-react';

// --- TYPES ---
interface Course {
  id: string;
  code: string;
  name: string;
  faculty: string;
  semester: string;
  color: string;
}

interface Routine {
  id: string;
  course_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
  courses?: Course;
}

type AssessmentType = 'Quiz' | 'Assignment' | 'Midterm' | 'Final';

interface Assessment {
  id: string;
  course_id: string;
  type: AssessmentType;
  title: string;
  topics: string;
  due_date: string;
  is_completed: boolean;
  courses?: Course;
}

interface Note {
  id: string;
  course_code: string;
  title: string;
  content: string;
  updated_at: string;
}

type TabId = 'today' | 'routine' | 'Quiz' | 'Assignment' | 'Midterm' | 'Final' | 'notes' | 'courses';

const ASSESSMENT_TABS: AssessmentType[] = ['Quiz', 'Assignment', 'Midterm', 'Final'];

const ASSESSMENT_TAB_META: Record<
  AssessmentType,
  { heading: string; plural: string; subtitle: string; buttonLabel: string }
> = {
  Quiz: {
    heading: 'Quizzes',
    plural: 'Quizzes',
    subtitle: 'Track upcoming quiz dates, syllabus topics, and completion status.',
    buttonLabel: 'Add Quiz',
  },
  Assignment: {
    heading: 'Assignments',
    plural: 'Assignments',
    subtitle: 'Keep track of homework, lab reports, and submission deadlines.',
    buttonLabel: 'Add Assignment',
  },
  Midterm: {
    heading: 'Midterm Exams',
    plural: 'Midterms',
    subtitle: 'Your midterm exam routine, coverage topics, and countdowns.',
    buttonLabel: 'Add Midterm',
  },
  Final: {
    heading: 'Final Exams',
    plural: 'Finals',
    subtitle: 'Your final exam schedule, syllabus coverage, and countdowns.',
    buttonLabel: 'Add Final',
  },
};

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const COURSE_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#14b8a6', // Teal
];

export default function AcademicPlanner() {
  // --- AUTH & THEME STATE ---
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // --- NAVIGATION & DATA STATE ---
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  // --- DATE & FILTERS (Client-safe for Next.js 16) ---
  const [todayName, setTodayName] = useState<string>('Sunday');
  const [todayDateLabel, setTodayDateLabel] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [activeSemester, setActiveSemester] = useState<string>('All');
  const [courseTabFilter, setCourseTabFilter] = useState<string>('All');

  // --- MODAL STATES ---
  const [activeModal, setActiveModal] = useState<'course' | 'routine' | 'assessment' | 'note' | null>(null);

  // --- FORM STATES ---
  const [courseForm, setCourseForm] = useState({
    semester: 'Fall 2026',
    code: '',
    name: '',
    faculty: '',
    color: COURSE_COLORS[0],
  });
  const [routineForm, setRoutineForm] = useState({
    course_id: '',
    day_of_week: 'Sunday',
    start_time: '09:00',
    end_time: '10:30',
    room: '',
  });
  const [assessmentForm, setAssessmentForm] = useState({
    course_id: '',
    type: 'Quiz' as AssessmentType,
    title: '',
    topics: '',
    due_date: '',
  });
  const [noteForm, setNoteForm] = useState({ course_code: 'General', title: '', content: '' });

  // --- INITIALIZATION (DATE, THEME & SESSION) ---
  useEffect(() => {
    const now = new Date();
    const currentDay = DAYS_OF_WEEK[now.getDay()];
    setTodayName(currentDay);
    setSelectedDay(currentDay);
    setTodayDateLabel(
      now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    );
    setRoutineForm((prev) => ({ ...prev, day_of_week: currentDay }));

    const savedTheme = localStorage.getItem('uniflow_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const unlocked = localStorage.getItem('uniflow_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }

    const savedSemester = localStorage.getItem('uniflow_active_semester');
    if (savedSemester) {
      setActiveSemester(savedSemester);
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uniflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uniflow_theme', 'light');
    }
  };

  const handleSelectActiveSemester = (sem: string) => {
    setActiveSemester(sem);
    localStorage.setItem('uniflow_active_semester', sem);
  };

  const openAssessmentModal = (defaultType?: AssessmentType) => {
    if (defaultType) {
      setAssessmentForm((prev) => ({ ...prev, type: defaultType }));
    }
    setActiveModal('assessment');
  };

  // --- FETCH ALL DATA ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [coursesRes, routinesRes, assessmentsRes, notesRes] = await Promise.all([
        supabase.from('courses').select('*').order('code', { ascending: true }),
        supabase.from('routines').select('*, courses(*)').order('start_time', { ascending: true }),
        supabase.from('assessments').select('*, courses(*)').order('due_date', { ascending: true }),
        supabase.from('notes').select('*').order('updated_at', { ascending: false }),
      ]);

      if (coursesRes.error) console.error('Courses fetch error:', coursesRes.error);

      if (coursesRes.data) {
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0) {
          setRoutineForm((prev) => ({ ...prev, course_id: prev.course_id || coursesRes.data[0].id }));
          setAssessmentForm((prev) => ({ ...prev, course_id: prev.course_id || coursesRes.data[0].id }));
        }
      }
      if (routinesRes.data) setRoutines(routinesRes.data);
      if (assessmentsRes.data) setAssessments(assessmentsRes.data);
      if (notesRes.data) setNotes(notesRes.data);
    } catch (error) {
      console.error('Error fetching planner data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAllData();
    }
  }, [isUnlocked]);

  // --- DERIVED SEMESTER LIST & ACTIVE COURSES ---
  const uniqueSemesters = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.semester) set.add(c.semester);
    });
    return Array.from(set);
  }, [courses]);

  const activeCourses = useMemo(() => {
    if (activeSemester === 'All') return courses;
    return courses.filter((c) => c.semester === activeSemester);
  }, [courses, activeSemester]);

  useEffect(() => {
    if (activeCourses.length > 0) {
      setRoutineForm((prev) => ({
        ...prev,
        course_id: activeCourses.some((c) => c.id === prev.course_id) ? prev.course_id : activeCourses[0].id,
      }));
      setAssessmentForm((prev) => ({
        ...prev,
        course_id: activeCourses.some((c) => c.id === prev.course_id) ? prev.course_id : activeCourses[0].id,
      }));
    }
  }, [activeCourses]);

  const coursesBySemester = useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    courses.forEach((course) => {
      const sem = course.semester || 'Uncategorized';
      if (courseTabFilter !== 'All' && sem !== courseTabFilter) return;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(course);
    });
    return grouped;
  }, [courses, courseTabFilter]);

  // --- PIN HANDLER ---
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_APP_PIN || '1234';
    if (pinInput === correctPin) {
      setIsUnlocked(true);
      localStorage.setItem('uniflow_unlocked', 'true');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // --- CRUD HANDLERS ---
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.code.trim() || !courseForm.name.trim() || !courseForm.semester.trim()) return;
    setSaving(true);
    const cleanSemester = courseForm.semester.trim();

    const { error } = await supabase.from('courses').insert([
      {
        semester: cleanSemester,
        code: courseForm.code.toUpperCase().trim(),
        name: courseForm.name.trim(),
        faculty: courseForm.faculty.toUpperCase().trim(),
        color: courseForm.color,
      },
    ]);

    setSaving(false);

    if (error) {
      alert(`Could not save course: ${error.message}\n\nMake sure you ran the SQL query in Supabase to create the 'courses' table and 'semester' column.`);
      return;
    }

    setCourseForm({
      semester: cleanSemester,
      code: '',
      name: '',
      faculty: '',
      color: COURSE_COLORS[(courses.length + 1) % COURSE_COLORS.length],
    });
    setActiveModal(null);
    fetchAllData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course? All routines and assessments linked to it will also be removed.')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert(`Error deleting course: ${error.message}`);
    fetchAllData();
  };

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineForm.course_id || !routineForm.room.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('routines').insert([routineForm]);
    setSaving(false);
    if (error) {
      alert(`Could not save class slot: ${error.message}`);
      return;
    }
    setRoutineForm({ ...routineForm, room: '' });
    setActiveModal(null);
    fetchAllData();
  };

  const handleDeleteRoutine = async (id: string) => {
    await supabase.from('routines').delete().eq('id', id);
    fetchAllData();
  };

  const handleAddAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentForm.course_id || !assessmentForm.title.trim() || !assessmentForm.due_date) return;
    setSaving(true);
    const { error } = await supabase.from('assessments').insert([
      {
        ...assessmentForm,
        due_date: new Date(assessmentForm.due_date).toISOString(),
      },
    ]);
    setSaving(false);
    if (error) {
      alert(`Could not save entry: ${error.message}`);
      return;
    }
    setAssessmentForm({ ...assessmentForm, title: '', topics: '', due_date: '' });
    setActiveModal(null);
    fetchAllData();
  };

  const toggleAssessmentComplete = async (item: Assessment) => {
    await supabase.from('assessments').update({ is_completed: !item.is_completed }).eq('id', item.id);
    setAssessments((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, is_completed: !a.is_completed } : a))
    );
  };

  const handleDeleteAssessment = async (id: string) => {
    await supabase.from('assessments').delete().eq('id', id);
    fetchAllData();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title.trim() || !noteForm.content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('notes').insert([noteForm]);
    setSaving(false);
    if (error) {
      alert(`Could not save note: ${error.message}`);
      return;
    }
    setNoteForm({ course_code: 'General', title: '', content: '' });
    setActiveModal(null);
    fetchAllData();
  };

  const handleDeleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id);
    fetchAllData();
  };

  // --- FORMATTING HELPERS ---
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    const [hoursStr, minutes] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const getCountdownBadge = (isoDate: string) => {
    const now = new Date();
    const target = new Date(isoDate);
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) return { label: 'Overdue', style: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
    if (diffHours < 24) return { label: `In ${Math.max(1, diffHours)}h`, style: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    if (diffDays === 1) return { label: 'Tomorrow', style: 'bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border-orange-200 dark:border-orange-800' };
    if (diffDays <= 4) return { label: `In ${diffDays} days`, style: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
    return { label: `In ${diffDays} days`, style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Quiz':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300';
      case 'Assignment':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'Midterm':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300';
      case 'Final':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  // --- DERIVED FILTERED DATA ---
  const visibleRoutines = useMemo(() => {
    if (activeSemester === 'All') return routines;
    return routines.filter((r) => r.courses?.semester === activeSemester);
  }, [routines, activeSemester]);

  const visibleAssessments = useMemo(() => {
    if (activeSemester === 'All') return assessments;
    return assessments.filter((a) => a.courses?.semester === activeSemester);
  }, [assessments, activeSemester]);

  const todaysClasses = useMemo(
    () => visibleRoutines.filter((r) => r.day_of_week === todayName),
    [visibleRoutines, todayName]
  );

  const upcomingAssessments = useMemo(
    () => visibleAssessments.filter((a) => !a.is_completed),
    [visibleAssessments]
  );

  const pendingCounts = useMemo(() => {
    return {
      Quiz: upcomingAssessments.filter((a) => a.type === 'Quiz').length,
      Assignment: upcomingAssessments.filter((a) => a.type === 'Assignment').length,
      Midterm: upcomingAssessments.filter((a) => a.type === 'Midterm').length,
      Final: upcomingAssessments.filter((a) => a.type === 'Final').length,
    };
  }, [upcomingAssessments]);

  const isAssessmentTab = ASSESSMENT_TABS.includes(activeTab as AssessmentType);

  const currentTabAssessments = useMemo(() => {
    if (!isAssessmentTab) return [];
    return visibleAssessments.filter((a) => {
      const matchesType = a.type === activeTab;
      const matchesStatus = showCompleted ? true : !a.is_completed;
      return matchesType && matchesStatus;
    });
  }, [visibleAssessments, activeTab, isAssessmentTab, showCompleted]);

  const navItems: { id: TabId; label: string; mobileLabel: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'today', label: 'Today & Overview', mobileLabel: 'Today', icon: LayoutDashboard },
    { id: 'routine', label: 'Weekly Routine', mobileLabel: 'Routine', icon: Calendar },
    { id: 'Quiz', label: 'Quizzes', mobileLabel: 'Quizzes', icon: PenTool, count: pendingCounts.Quiz },
    { id: 'Assignment', label: 'Assignments', mobileLabel: 'Tasks', icon: ClipboardList, count: pendingCounts.Assignment },
    { id: 'Midterm', label: 'Midterms', mobileLabel: 'Midterm', icon: BookMarked, count: pendingCounts.Midterm },
    { id: 'Final', label: 'Finals', mobileLabel: 'Final', icon: Award, count: pendingCounts.Final },
    { id: 'notes', label: 'Quick Notes', mobileLabel: 'Notes', icon: StickyNote },
    { id: 'courses', label: 'My Courses', mobileLabel: 'Courses', icon: BookOpen },
  ];

  // --- LOCK SCREEN UI ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900">
        <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Track Rakho</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
            Enter your personal PIN to access your schedule.
          </p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center text-2xl tracking-[0.5em] font-semibold py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            {pinError && (
              <p className="text-xs font-medium text-rose-500">Incorrect PIN. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            >
              Unlock Workspace
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN APP SHELL ---
  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
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
              onChange={(e) => handleSelectActiveSemester(e.target.value)}
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
                      active ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
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
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
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
              onChange={(e) => handleSelectActiveSemester(e.target.value)}
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
            onClick={toggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:pl-64">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
          {/* SETUP PROMPT IF NO COURSES EXIST YET */}
          {!loading && courses.length === 0 && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> Welcome to Track Rakho!
                </div>
                <p className="text-indigo-100 text-sm mt-1">
                  Start by adding your semester name and courses (code, title, and faculty initials).
                </p>
              </div>
              <button
                onClick={() => setActiveModal('course')}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm shadow-md hover:bg-indigo-50 transition-colors"
              >
                + Add First Course
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: TODAY & OVERVIEW DASHBOARD                         */}
          {/* ========================================================= */}
          {activeTab === 'today' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {todayDateLabel}
                    {activeSemester !== 'All' && ` • ${activeSemester}`}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                    Today&apos;s Focus
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openAssessmentModal('Quiz')}
                    disabled={activeCourses.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Quiz / Exam / Task
                  </button>
                  <button
                    onClick={() => setActiveModal('note')}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Quick Note
                  </button>
                </div>
              </div>

              {/* Quick Category Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ASSESSMENT_TABS.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all shadow-sm"
                  >
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getTypeBadgeColor(type)}`}>
                      {ASSESSMENT_TAB_META[type].plural}
                    </span>
                    <p className="text-2xl font-bold mt-2">{pendingCounts[type]}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Pending</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Today's Classes */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      Classes Today ({todayName})
                    </h3>
                    <button
                      onClick={() => setActiveTab('routine')}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Full Week →
                    </button>
                  </div>

                  {todaysClasses.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No classes scheduled today 🎉</p>
                      <p className="text-xs text-slate-400 mt-1">Enjoy your free time or catch up on notes.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todaysClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-start gap-3.5 relative overflow-hidden"
                        >
                          <div
                            className="w-1.5 self-stretch rounded-full shrink-0"
                            style={{ backgroundColor: cls.courses?.color || '#6366f1' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm tracking-tight">
                                {cls.courses?.code}
                              </span>
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {formatTime12Hour(cls.start_time)} – {formatTime12Hour(cls.end_time)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {cls.courses?.name}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Room {cls.room}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-emerald-500" /> {cls.courses?.faculty}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Upcoming Deadlines */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      Upcoming Deadlines & Exams
                    </h3>
                    <button
                      onClick={() => setActiveTab(upcomingAssessments[0]?.type || 'Quiz')}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All ({upcomingAssessments.length}) →
                    </button>
                  </div>

                  {upcomingAssessments.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">All caught up!</p>
                      <p className="text-xs text-slate-400 mt-1">No pending quizzes, assignments, or exams.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAssessments.slice(0, 6).map((item) => {
                        const countdown = getCountdownBadge(item.due_date);
                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-start gap-3.5 group"
                          >
                            <button
                              onClick={() => toggleAssessmentComplete(item)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                              title="Mark as completed"
                            >
                              <Circle className="w-5 h-5" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                                    style={{ backgroundColor: item.courses?.color || '#6366f1' }}
                                  >
                                    {item.courses?.code}
                                  </span>
                                  <button
                                    onClick={() => setActiveTab(item.type)}
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${getTypeBadgeColor(item.type)}`}
                                  >
                                    {item.type}
                                  </button>
                                  <span className="font-semibold text-sm">{item.title}</span>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${countdown.style}`}>
                                  {countdown.label}
                                </span>
                              </div>
                              {item.topics && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">Topics:</span> {item.topics}
                                </p>
                              )}
                              <p className="text-[11px] text-slate-400 mt-2">
                                {new Date(item.due_date).toLocaleString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: WEEKLY CLASS ROUTINE                               */}
          {/* ========================================================= */}
          {activeTab === 'routine' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Weekly Class Routine</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tap a day to view or manage your scheduled classes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRoutineForm((prev) => ({ ...prev, day_of_week: selectedDay }));
                    setActiveModal('routine');
                  }}
                  disabled={activeCourses.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Class Slot
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {DAYS_OF_WEEK.map((day) => {
                  const count = visibleRoutines.filter((r) => r.day_of_week === day).length;
                  const isSelected = selectedDay === day;
                  const isToday = day === todayName;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{day.slice(0, 3)}</span>
                      {isToday && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                      )}
                      {count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                {visibleRoutines.filter((r) => r.day_of_week === selectedDay).length === 0 ? (
                  <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      No classes added for {selectedDay}.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click &ldquo;Add Class Slot&rdquo; above to build your schedule.
                    </p>
                  </div>
                ) : (
                  visibleRoutines
                    .filter((r) => r.day_of_week === selectedDay)
                    .map((cls) => (
                      <div
                        key={cls.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-2 h-12 rounded-full shrink-0"
                            style={{ backgroundColor: cls.courses?.color || '#6366f1' }}
                          />
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-base">{cls.courses?.code}</span>
                              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                                {formatTime12Hour(cls.start_time)} – {formatTime12Hour(cls.end_time)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{cls.courses?.name}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Room: <strong className="text-slate-700 dark:text-slate-200">{cls.room}</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-emerald-500" /> Faculty: <strong className="text-slate-700 dark:text-slate-200">{cls.courses?.faculty}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRoutine(cls.id)}
                          className="self-end sm:self-center p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove class"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TABS 3–6: SEPARATE QUIZ, ASSIGNMENT, MIDTERM, FINAL TABS  */}
          {/* ========================================================= */}
          {isAssessmentTab && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {ASSESSMENT_TAB_META[activeTab as AssessmentType].heading}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {ASSESSMENT_TAB_META[activeTab as AssessmentType].subtitle}
                  </p>
                </div>
                <button
                  onClick={() => openAssessmentModal(activeTab as AssessmentType)}
                  disabled={activeCourses.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> {ASSESSMENT_TAB_META[activeTab as AssessmentType].buttonLabel}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Showing {currentTabAssessments.length}{' '}
                  {currentTabAssessments.length === 1 ? 'item' : 'items'}
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

              {currentTabAssessments.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    No {ASSESSMENT_TAB_META[activeTab as AssessmentType].plural.toLowerCase()} added yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Click &ldquo;{ASSESSMENT_TAB_META[activeTab as AssessmentType].buttonLabel}&rdquo; above to add one.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTabAssessments.map((item) => {
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
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${getTypeBadgeColor(item.type)}`}>
                                {item.type}
                              </span>
                            </div>
                            {!item.is_completed && (
                              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${countdown.style}`}>
                                {countdown.label}
                              </span>
                            )}
                          </div>

                          <h3 className={`font-bold text-base mt-3 ${item.is_completed ? 'line-through' : ''}`}>
                            {item.title}
                          </h3>

                          {item.topics && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                              <strong className="text-slate-700 dark:text-slate-300">Topics:</strong> {item.topics}
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
                              onClick={() => toggleAssessmentComplete(item)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                                item.is_completed
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {item.is_completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              {item.is_completed ? 'Done' : 'Mark Done'}
                            </button>
                            <button
                              onClick={() => handleDeleteAssessment(item.id)}
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
          )}

          {/* ========================================================= */}
          {/* TAB 7: QUICK NOTES                                        */}
          {/* ========================================================= */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Study & Lecture Notes</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Save formulas, Drive links, reminders, or quick lecture points.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('note')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Note
                </button>
              </div>

              {notes.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No notes yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Create a note to keep synced across your devices.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                            {note.course_code}
                          </span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-base">{note.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        Added {new Date(note.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: MY COURSES (GROUPED BY SEMESTER)                   */}
          {/* ========================================================= */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Semester Courses</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your complete course record organized by semester.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('course')}
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
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No courses added yet.</p>
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
                          onClick={() => {
                            setCourseForm((prev) => ({ ...prev, semester: semesterName }));
                            setActiveModal('course');
                          }}
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
                                onClick={() => handleDeleteCourse(course.id)}
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
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (HORIZONTALLY SCROLLABLE FOR ALL TABS) */}
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

      {/* ========================================================= */}
      {/* MODALS FOR ADDING ITEMS                                   */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">
                {activeModal === 'course' && 'Add Course to Semester'}
                {activeModal === 'routine' && 'Add Class to Routine'}
                {activeModal === 'assessment' && `Add ${assessmentForm.type}`}
                {activeModal === 'note' && 'Create Quick Note'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODAL 1: ADD COURSE WITH SEMESTER */}
            {activeModal === 'course' && (
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Semester Name</label>
                  <input
                    type="text"
                    required
                    list="semester-suggestions"
                    placeholder="e.g., Fall 2026, Spring 2026, Semester 4"
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                  <datalist id="semester-suggestions">
                    {uniqueSemesters.map((sem) => (
                      <option key={sem} value={sem} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CSE340"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Computer Architecture"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Faculty Initials</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., FARS"
                    value={courseForm.faculty}
                    onChange={(e) => setCourseForm({ ...courseForm, faculty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Color Tag</label>
                  <div className="flex gap-2">
                    {COURSE_COLORS.map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setCourseForm({ ...courseForm, color })}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          courseForm.color === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm mt-2"
                >
                  {saving ? 'Saving...' : 'Save Course'}
                </button>
              </form>
            )}

            {/* MODAL 2: ADD ROUTINE */}
            {activeModal === 'routine' && (
              <form onSubmit={handleAddRoutine} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Select Course</label>
                  <select
                    value={routineForm.course_id}
                    onChange={(e) => setRoutineForm({ ...routineForm, course_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    {activeCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name} ({c.faculty})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Day of Week</label>
                  <select
                    value={routineForm.day_of_week}
                    onChange={(e) => setRoutineForm({ ...routineForm, day_of_week: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={routineForm.start_time}
                      onChange={(e) => setRoutineForm({ ...routineForm, start_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={routineForm.end_time}
                      onChange={(e) => setRoutineForm({ ...routineForm, end_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., UB40203 or Lab-4"
                    value={routineForm.room}
                    onChange={(e) => setRoutineForm({ ...routineForm, room: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm mt-2"
                >
                  {saving ? 'Saving...' : 'Add to Schedule'}
                </button>
              </form>
            )}

            {/* MODAL 3: ADD ASSESSMENT */}
            {activeModal === 'assessment' && (
              <form onSubmit={handleAddAssessment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Course</label>
                    <select
                      value={assessmentForm.course_id}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, course_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    >
                      {activeCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category</label>
                    <select
                      value={assessmentForm.type}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          type: e.target.value as AssessmentType,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    >
                      <option value="Quiz">Quiz</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Midterm">Midterm Exam</option>
                      <option value="Final">Final Exam</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Title / Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Quiz 2, Assignment 1, Midterm"
                    value={assessmentForm.title}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Syllabus / Topics</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Linked Lists, Stacks & Queues (Lectures 4-7)"
                    value={assessmentForm.topics}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, topics: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Date & Time / Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    value={assessmentForm.due_date}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, due_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm mt-2"
                >
                  {saving ? 'Saving...' : `Save ${assessmentForm.type}`}
                </button>
              </form>
            )}

            {/* MODAL 4: ADD NOTE */}
            {activeModal === 'note' && (
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Course Tag</label>
                  <select
                    value={noteForm.course_code}
                    onChange={(e) => setNoteForm({ ...noteForm, course_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="General">General</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Note Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Google Drive Folder / Key Formulas"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Content</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your notes here..."
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm mt-2"
                >
                  {saving ? 'Saving...' : 'Save Note'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}