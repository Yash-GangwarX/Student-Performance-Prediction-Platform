export type AssessmentType = 'Quiz' | 'Assignment' | 'Midterm' | 'Final' | 'Lab' | 'Practice';

export type AssessmentStatus = 'completed' | 'unattempted' | 'absent';

export interface Student {
  id: string; // e.g. "NIET-2026-001"
  name: string;
  program: string; // e.g. "B.Tech Computer Science & AI"
  semester: number; // e.g. 5
  section: string; // e.g. "A"
  enrollmentDate: string; // YYYY-MM-DD
  email?: string;
}

export interface Subject {
  id: string; // e.g. "SUB-DSA"
  name: string;
  code: string; // e.g. "CS501"
  semester: number;
}

export interface Topic {
  id: string; // e.g. "TOPIC-DSA-01"
  subjectId: string;
  name: string;
  description: string;
  prerequisites: string[]; // Topic IDs that are prerequisites for this topic
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  subjectId: string;
  topicId: string;
  assessmentName: string;
  assessmentType: AssessmentType;
  date: string; // YYYY-MM-DD
  obtainedMarks: number;
  maxMarks: number;
  percentage: number; // (obtainedMarks / maxMarks) * 100
  attemptNumber: number;
  status: AssessmentStatus;
  difficulty?: 'Introductory' | 'Standard' | 'Advanced';
}

export interface StudyHabit {
  id: string;
  studentId: string;
  studyHoursPerWeek: number; // self-reported
  revisionFrequency: 'Daily' | '3-4 times/week' | 'Weekly' | 'Before Exams';
  practiceFrequency: 'High' | 'Moderate' | 'Low';
  preparationPattern: 'Regular distributed' | 'Cramming' | 'Group study' | 'Self-paced';
  lastUpdated: string;
  notes?: string;
}

export interface EngagementRecord {
  id: string;
  studentId: string;
  lessonsCompleted: number;
  totalLessons: number;
  learningActivitiesCompleted: number;
  totalActivities: number;
  resourcesAccessedCount: number;
  progressPercentage: number;
  measuredMinutesSpent: number;
  lastUpdated: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  classesAttended: number;
  totalClassesHeld: number;
  attendancePercentage: number;
  termPeriod: string; // e.g. "Odd Sem 2026"
}

export interface PracticeQuizActivity {
  id: string;
  studentId: string;
  topicId: string;
  quizzesAttempted: number;
  quizzesCompleted: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  repeatAttemptsCount: number;
}

export type TrendDirection = 'improving' | 'declining' | 'stable' | 'insufficient';

export type DataSufficiencyStatus = 
  | 'Insufficient data'
  | 'Preliminary estimate'
  | 'Limited historical evidence'
  | 'Sufficient chronological records';

export type TopicRiskStatus = 'Needs attention' | 'Developing' | 'On track' | 'Insufficient data';

export interface RecencyWeightDetail {
  attempt: number;
  date: string;
  assessmentName: string;
  score: number;
  weight: number;
  weightedScore: number;
}

export interface PredictionResult {
  studentId: string;
  targetSubjectId: string;
  targetTopicId: string;
  estimatedScore: number | null; // null if insufficient data
  historicalAverage: number | null;
  mostRecentScore: number | null;
  attemptsUsed: number;
  trendDirection: TrendDirection;
  trendSlope: number | null; // change per assessment
  dataSufficiency: DataSufficiencyStatus;
  methodUsed: string;
  categoriesUsed: string[];
  explanation: string[];
  formulaBreakdown: {
    baselineWeightedScore: number | null;
    trendAdjustment: number;
    recencyWeights: RecencyWeightDetail[];
    multiCategoryAdjustment: number;
    multiCategoryRationale: string[];
    clampedScore: number | null;
  };
  limitations: string[];
}

export interface TopicSummary {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  attemptsCount: number;
  averagePercentage: number | null;
  medianPercentage: number | null;
  minPercentage: number | null;
  maxPercentage: number | null;
  recentScore: number | null;
  trend: TrendDirection;
  status: TopicRiskStatus;
  reason: string;
  recommendedAction: string;
  prerequisitesMastered: boolean;
  unmasteredPrerequisites: string[];
}

export interface Recommendation {
  id: string;
  studentId: string;
  subjectId: string;
  topicId: string;
  title: string;
  recommendedAction: string;
  reason: string;
  supportingRuleOrData: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  category: 'Prerequisite Review' | 'Practice Reinforcement' | 'Concept Revision' | 'Data Collection';
}

export type DataSourceType = 'synthetic' | 'imported' | 'manual';

export interface AppState {
  students: Student[];
  subjects: Subject[];
  topics: Topic[];
  assessments: AssessmentRecord[];
  studyHabits: StudyHabit[];
  engagementRecords: EngagementRecord[];
  attendanceRecords: AttendanceRecord[];
  practiceActivities: PracticeQuizActivity[];
  recommendations: Recommendation[];
  reviewThreshold: number; // default 60%
  dataSource: DataSourceType;
  selectedStudentId: string;
  selectedSubjectId: string; // 'all' or subjectId
  selectedTopicId: string; // 'all' or topicId
}
