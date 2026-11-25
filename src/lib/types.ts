export type AssessmentType = 'Quiz' | 'Assignment' | 'Midterm' | 'Final';
export type AssignmentCategory = 'Theory' | 'Lab';
export type ExamCategory = 'Theory' | 'Lab';
export type AssessmentCategory = AssignmentCategory | ExamCategory;

export const ASSESSMENT_TABS: AssessmentType[] = [
  'Quiz',
  'Assignment',
  'Midterm',
  'Final',
];

export const ASSESSMENT_TAB_META: Record<
  AssessmentType,
  {
    plural: string;
    heading: string;
    subtitle: string;
    buttonLabel: string;
  }
> = {
  Quiz: {
    plural: 'Quizzes',
    heading: 'Quizzes',
    subtitle: 'Your upcoming class quizzes, syllabus topics, and countdowns.',
    buttonLabel: 'Add Quiz',
  },
  Assignment: {
    plural: 'Assignments',
    heading: 'Assignments',
    subtitle: 'Track theory & lab homework, tasks, project submissions, and deadlines.',
    buttonLabel: 'Add Assignment',
  },
  Midterm: {
    plural: 'Midterms',
    heading: 'Midterm Exams',
    subtitle: 'Your separated theory & lab midterm exam schedule, coverage topics, and countdowns.',
    buttonLabel: 'Add Midterm',
  },
  Final: {
    plural: 'Finals',
    heading: 'Final Exams',
    subtitle: 'Your separated theory & lab final exam schedule, exam rooms, and syllabus coverage.',
    buttonLabel: 'Add Final',
  },
};

export type TabId =
  | 'today'
  | 'routine'
  | AssessmentType
  | 'attendance'
  | 'notes'
  | 'courses';

export type ModalType = 'course' | 'routine' | 'assessment' | 'note' | null;

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
  '#14b8a6',
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
];

export interface Course {
  id: string;
  semester: string;
  code: string;
  section?: string;
  name: string;
  faculty: string;
  color: string;
  total_classes?: number;
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

export interface Assessment {
  id: string;
  course_id: string;
  type: AssessmentType;
  category?: AssessmentCategory | null;
  title: string;
  topics?: string | null;
  due_date: string;
  room?: string | null;
  is_done?: boolean;
  courses?: Course;
}

export interface Note {
  id: string;
  course_code: string;
  title: string;
  content: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  course_id: string;
  missed_date: string;
  note?: string | null;
  created_at?: string;
  courses?: Course;
}