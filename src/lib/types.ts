export interface Course {
  id: string;
  code: string;
  name: string;
  faculty: string;
  semester: string;
  color: string;
}

export interface Routine {
  id: string;
  course_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
  courses?: Course;
}

export type AssessmentType = 'Quiz' | 'Assignment' | 'Midterm' | 'Final';

export interface Assessment {
  id: string;
  course_id: string;
  type: AssessmentType;
  title: string;
  topics: string;
  due_date: string;
  room?: string | null;
  is_completed: boolean;
  courses?: Course;
}

export interface Note {
  id: string;
  course_code: string;
  title: string;
  content: string;
  updated_at: string;
}

export type TabId =
  | 'today'
  | 'routine'
  | 'Quiz'
  | 'Assignment'
  | 'Midterm'
  | 'Final'
  | 'notes'
  | 'courses';

export type ModalType = 'course' | 'routine' | 'assessment' | 'note' | null;

export const ASSESSMENT_TABS: AssessmentType[] = ['Quiz', 'Assignment', 'Midterm', 'Final'];

export const ASSESSMENT_TAB_META: Record<
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

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const COURSE_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#14b8a6', // Teal
];