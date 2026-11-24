'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Assessment,
  AssessmentType,
  ASSESSMENT_TABS,
  Course,
  COURSE_COLORS,
  DAYS_OF_WEEK,
  ModalType,
  Note,
  Routine,
  TabId,
} from '@/lib/types';
import LockScreen from '@/components/LockScreen';
import { Sidebar, MobileHeader, MobileBottomNav } from '@/components/Sidebar';
import TodayView from '@/components/TodayView';
import RoutineView from '@/components/RoutineView';
import AssessmentView from '@/components/AssessmentView';
import NotesView from '@/components/NotesView';
import CoursesView from '@/components/CoursesView';
import Modals from '@/components/Modals';

const toDateTimeLocal = (isoString: string) => {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

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

  // --- DATE & FILTERS ---
  const [todayName, setTodayName] = useState<string>('Sunday');
  const [todayDateLabel, setTodayDateLabel] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [activeSemester, setActiveSemester] = useState<string>('All');
  const [courseTabFilter, setCourseTabFilter] = useState<string>('All');

  // --- MODAL & FORM STATES ---
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);

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
    room: '',
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
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
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

  const closeModal = () => {
    setActiveModal(null);
    setEditingAssessmentId(null);
  };

  const openAssessmentModal = (defaultType?: AssessmentType) => {
    setEditingAssessmentId(null);
    setAssessmentForm((prev) => ({
      ...prev,
      type: defaultType || prev.type,
      title: '',
      topics: '',
      due_date: '',
      room: '',
    }));
    setActiveModal('assessment');
  };

  const openEditAssessmentModal = (item: Assessment) => {
    setEditingAssessmentId(item.id);
    setAssessmentForm({
      course_id: item.course_id,
      type: item.type,
      title: item.title,
      topics: item.topics || '',
      due_date: toDateTimeLocal(item.due_date),
      room: item.room || '',
    });
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
        course_id: activeCourses.some((c) => c.id === prev.course_id)
          ? prev.course_id
          : activeCourses[0].id,
      }));
      setAssessmentForm((prev) => ({
        ...prev,
        course_id: activeCourses.some((c) => c.id === prev.course_id)
          ? prev.course_id
          : activeCourses[0].id,
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
      alert(
        `Could not save course: ${error.message}\n\nMake sure you ran the SQL query in Supabase to create the 'courses' table and 'semester' column.`
      );
      return;
    }

    setCourseForm({
      semester: cleanSemester,
      code: '',
      name: '',
      faculty: '',
      color: COURSE_COLORS[(courses.length + 1) % COURSE_COLORS.length],
    });
    closeModal();
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
    closeModal();
    fetchAllData();
  };

  const handleDeleteRoutine = async (id: string) => {
    await supabase.from('routines').delete().eq('id', id);
    fetchAllData();
  };

  const handleAddAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    const isExam = assessmentForm.type === 'Midterm' || assessmentForm.type === 'Final';
    const finalTitle = isExam
      ? `${assessmentForm.type} Exam`
      : assessmentForm.title.trim();

    if (!assessmentForm.course_id || !finalTitle || !assessmentForm.due_date) return;
    setSaving(true);

    const payload = {
      course_id: assessmentForm.course_id,
      type: assessmentForm.type,
      title: finalTitle,
      topics: assessmentForm.topics.trim(),
      due_date: new Date(assessmentForm.due_date).toISOString(),
      room: isExam ? assessmentForm.room.trim() || null : null,
    };

    const { error } = editingAssessmentId
      ? await supabase.from('assessments').update(payload).eq('id', editingAssessmentId)
      : await supabase.from('assessments').insert([payload]);

    setSaving(false);
    if (error) {
      alert(`Could not save entry: ${error.message}`);
      return;
    }
    setAssessmentForm({ ...assessmentForm, title: '', topics: '', due_date: '', room: '' });
    closeModal();
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
    closeModal();
    fetchAllData();
  };

  const handleDeleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id);
    fetchAllData();
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

  const pendingCounts = useMemo(
    () => ({
      Quiz: upcomingAssessments.filter((a) => a.type === 'Quiz').length,
      Assignment: upcomingAssessments.filter((a) => a.type === 'Assignment').length,
      Midterm: upcomingAssessments.filter((a) => a.type === 'Midterm').length,
      Final: upcomingAssessments.filter((a) => a.type === 'Final').length,
    }),
    [upcomingAssessments]
  );

  const isAssessmentTab = ASSESSMENT_TABS.includes(activeTab as AssessmentType);

  const currentTabAssessments = useMemo(() => {
    if (!isAssessmentTab) return [];
    return visibleAssessments.filter((a) => {
      const matchesType = a.type === activeTab;
      const matchesStatus = showCompleted ? true : !a.is_completed;
      return matchesType && matchesStatus;
    });
  }, [visibleAssessments, activeTab, isAssessmentTab, showCompleted]);

  // --- LOCK SCREEN ---
  if (!isUnlocked) {
    return (
      <LockScreen
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinError={pinError}
        onUnlock={handleUnlock}
      />
    );
  }

  // --- MAIN APP SHELL ---
  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col md:flex-row">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uniqueSemesters={uniqueSemesters}
        activeSemester={activeSemester}
        onSelectActiveSemester={handleSelectActiveSemester}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        pendingCounts={pendingCounts}
      />

      <MobileHeader
        uniqueSemesters={uniqueSemesters}
        activeSemester={activeSemester}
        onSelectActiveSemester={handleSelectActiveSemester}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

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

          {activeTab === 'today' && (
            <TodayView
              todayDateLabel={todayDateLabel}
              todayName={todayName}
              activeSemester={activeSemester}
              activeCoursesCount={activeCourses.length}
              pendingCounts={pendingCounts}
              todaysClasses={todaysClasses}
              upcomingAssessments={upcomingAssessments}
              setActiveTab={setActiveTab}
              onOpenAssessmentModal={openAssessmentModal}
              onOpenNoteModal={() => setActiveModal('note')}
              onToggleAssessmentComplete={toggleAssessmentComplete}
            />
          )}

          {activeTab === 'routine' && (
            <RoutineView
              visibleRoutines={visibleRoutines}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              todayName={todayName}
              activeCoursesCount={activeCourses.length}
              onOpenAddRoutine={(day) => {
                setRoutineForm((prev) => ({ ...prev, day_of_week: day }));
                setActiveModal('routine');
              }}
              onDeleteRoutine={handleDeleteRoutine}
            />
          )}

          {isAssessmentTab && (
            <AssessmentView
              activeType={activeTab as AssessmentType}
              assessments={currentTabAssessments}
              activeSemester={activeSemester}
              activeCoursesCount={activeCourses.length}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              onOpenAddAssessment={openAssessmentModal}
              onEditAssessment={openEditAssessmentModal}
              onToggleComplete={toggleAssessmentComplete}
              onDeleteAssessment={handleDeleteAssessment}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={notes}
              onOpenAddNote={() => setActiveModal('note')}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              uniqueSemesters={uniqueSemesters}
              courseTabFilter={courseTabFilter}
              setCourseTabFilter={setCourseTabFilter}
              coursesBySemester={coursesBySemester}
              onOpenAddCourse={(defaultSemester) => {
                if (defaultSemester) {
                  setCourseForm((prev) => ({ ...prev, semester: defaultSemester }));
                }
                setActiveModal('course');
              }}
              onDeleteCourse={handleDeleteCourse}
            />
          )}
        </div>
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCounts={pendingCounts}
      />

      <Modals
        activeModal={activeModal}
        onClose={closeModal}
        saving={saving}
        editingAssessmentId={editingAssessmentId}
        uniqueSemesters={uniqueSemesters}
        courses={courses}
        activeCourses={activeCourses}
        courseForm={courseForm}
        setCourseForm={setCourseForm}
        onAddCourse={handleAddCourse}
        routineForm={routineForm}
        setRoutineForm={setRoutineForm}
        onAddRoutine={handleAddRoutine}
        assessmentForm={assessmentForm}
        setAssessmentForm={setAssessmentForm}
        onAddAssessment={handleAddAssessment}
        noteForm={noteForm}
        setNoteForm={setNoteForm}
        onAddNote={handleAddNote}
      />
    </div>
  );
}