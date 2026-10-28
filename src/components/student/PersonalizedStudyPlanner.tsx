import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Topic, Subject, AssessmentRecord } from '../../types';
import { 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  CheckSquare,
  Square,
  Sliders,
  TrendingUp,
  FileCheck,
  BarChart2,
  ChevronDown,
  ChevronRight,
  Layers,
  HelpCircle,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  PieChart
} from 'lucide-react';

interface PersonalizedStudyPlannerProps {
  student: Student;
  onNavigateToQuiz?: (topicId?: string) => void;
}

interface SubjectDiagnostic {
  subject: Subject;
  overallScore: number;
  midtermScore: number | null;
  assignmentScore: number | null;
  quizScore: number | null;
  urgencyWeight: number; // calculated from learning deficit
  status: 'critical' | 'developing' | 'strong' | 'untested';
  reason: string;
  topicDiagnostics: TopicDiagnostic[];
}

interface TopicDiagnostic {
  topic: Topic;
  subjectId: string;
  subjectName: string;
  midtermScore: number | null;
  assignmentScore: number | null;
  quizScore: number | null;
  overallScore: number;
  priorityScore: number;
  status: 'critical' | 'developing' | 'strong' | 'untested';
  reason: string;
}

interface SubjectDailyAllocation {
  subject: Subject;
  allocatedMinutes: number;
  percentageShare: number;
  diagnostic: SubjectDiagnostic;
  targetTopic: TopicDiagnostic;
  conceptMinutes: number;
  practiceMinutes: number;
  quizMinutes: number;
  tasks: string[];
  targetOutcome: string;
}

interface DailyScheduleSession {
  id: string;
  dayName: string;
  dayIndex: number;
  totalDailyMinutes: number;
  subjectAllocations: SubjectDailyAllocation[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const PersonalizedStudyPlanner: React.FC<PersonalizedStudyPlannerProps> = ({
  student,
  onNavigateToQuiz
}) => {
  const { state } = useApp();

  // Storage key for student's custom planner settings and completed sessions
  const PLAN_STORAGE_KEY = `NIET_STUDY_PLAN_V2_${student.id}`;

  // Interactive student preferences
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedDays && Array.isArray(parsed.selectedDays) && parsed.selectedDays.length > 0) {
          return parsed.selectedDays;
        }
      }
    } catch (e) {
      // fallback
    }
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Default 5 weekdays
  });

  // Daily hours can be > 3 hrs/day (e.g. 4, 5, 6, 8, etc.)
  const [dailyHours, setDailyHours] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.dailyHours === 'number' && parsed.dailyHours > 0) {
          return parsed.dailyHours;
        }
      }
    } catch (e) {
      // fallback
    }
    return 4.0; // Default 4 hours per day (providing ample room for all subjects)
  });

  const [studyStrategy, setStudyStrategy] = useState<'balanced' | 'remediation' | 'sprint'>('balanced');
  const [activeViewMode, setActiveViewMode] = useState<'daily' | 'matrix' | 'distribution'>('daily');

  // Track completed subject tasks within days
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedTaskIds) return parsed.completedTaskIds;
      }
    } catch (e) {
      // fallback
    }
    return {};
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        PLAN_STORAGE_KEY,
        JSON.stringify({
          selectedDays,
          dailyHours,
          studyStrategy,
          completedTaskIds
        })
      );
    } catch (e) {
      console.error(e);
    }
  }, [selectedDays, dailyHours, studyStrategy, completedTaskIds, PLAN_STORAGE_KEY]);

  // =========================================================================
  // 1. ANALYZE STUDENT PREVIOUS ASSESSMENTS ACROSS ALL SUBJECTS & TOPICS
  // =========================================================================
  const subjectDiagnostics: SubjectDiagnostic[] = useMemo(() => {
    const studentAssessments = state.assessments.filter(a => a.studentId === student.id);

    return state.subjects.map(subject => {
      // Topics belonging to this subject
      const subjectTopics = state.topics.filter(t => t.subjectId === subject.id);

      // Analyze each topic in this subject
      const topicDiagnosticsList: TopicDiagnostic[] = subjectTopics.map(topic => {
        const relatedRecords = studentAssessments.filter(a => a.topicId === topic.id);

        const midtermRecord = relatedRecords.find(a => a.assessmentType === 'Midterm');
        const assignmentRecords = relatedRecords.filter(a => a.assessmentType === 'Assignment');
        const quizRecords = relatedRecords.filter(a => a.assessmentType === 'Quiz');

        const midtermScore = midtermRecord ? midtermRecord.percentage : null;
        const assignmentScore = assignmentRecords.length > 0
          ? assignmentRecords.reduce((acc, r) => acc + r.percentage, 0) / assignmentRecords.length
          : null;
        const quizScore = quizRecords.length > 0
          ? quizRecords.reduce((acc, r) => acc + r.percentage, 0) / quizRecords.length
          : null;

        // Weighted continuous score
        let scoreSum = 0;
        let weightSum = 0;
        if (midtermScore !== null) {
          scoreSum += midtermScore * 0.45;
          weightSum += 0.45;
        }
        if (assignmentScore !== null) {
          scoreSum += assignmentScore * 0.30;
          weightSum += 0.30;
        }
        if (quizScore !== null) {
          scoreSum += quizScore * 0.25;
          weightSum += 0.25;
        }

        let overallScore = 70; // baseline if untested
        let status: 'critical' | 'developing' | 'strong' | 'untested' = 'untested';
        let reason = 'Untested topic in current academic cycle. Diagnostic testing recommended.';

        if (weightSum > 0) {
          overallScore = scoreSum / weightSum;
          if (overallScore < 60) {
            status = 'critical';
            reason = `Critical performance deficit (${overallScore.toFixed(0)}%). ` +
              (midtermScore !== null && midtermScore < 60 ? `Struggled in Midterm (${midtermScore.toFixed(0)}%). ` : '') +
              (quizScore !== null && quizScore < 60 ? `Quiz scores below 60% (${quizScore.toFixed(0)}%). ` : '');
          } else if (overallScore < 75) {
            status = 'developing';
            reason = `Moderate performance (${overallScore.toFixed(0)}%). Needs conceptual reinforcement and timed problem practice.`;
          } else {
            status = 'strong';
            reason = `Solid mastery demonstrated (${overallScore.toFixed(0)}%). Regular maintenance and speed drills.`;
          }
        }

        let priorityScore = (100 - overallScore);
        if (status === 'critical') priorityScore += 50;
        if (midtermScore !== null && midtermScore < 60) priorityScore += 30;

        return {
          topic,
          subjectId: subject.id,
          subjectName: subject.name,
          midtermScore,
          assignmentScore,
          quizScore,
          overallScore,
          priorityScore,
          status,
          reason
        };
      }).sort((a, b) => b.priorityScore - a.priorityScore);

      // Subject-level aggregation
      const subjectRecords = studentAssessments.filter(a => a.subjectId === subject.id);
      const midtermRecords = subjectRecords.filter(a => a.assessmentType === 'Midterm');
      const assignmentRecords = subjectRecords.filter(a => a.assessmentType === 'Assignment');
      const quizRecords = subjectRecords.filter(a => a.assessmentType === 'Quiz');

      const avgMidterm = midtermRecords.length > 0
        ? midtermRecords.reduce((acc, r) => acc + r.percentage, 0) / midtermRecords.length
        : null;
      const avgAssignment = assignmentRecords.length > 0
        ? assignmentRecords.reduce((acc, r) => acc + r.percentage, 0) / assignmentRecords.length
        : null;
      const avgQuiz = quizRecords.length > 0
        ? quizRecords.reduce((acc, r) => acc + r.percentage, 0) / quizRecords.length
        : null;

      let subScoreSum = 0;
      let subWeightSum = 0;
      if (avgMidterm !== null) {
        subScoreSum += avgMidterm * 0.45;
        subWeightSum += 0.45;
      }
      if (avgAssignment !== null) {
        subScoreSum += avgAssignment * 0.30;
        subWeightSum += 0.30;
      }
      if (avgQuiz !== null) {
        subScoreSum += avgQuiz * 0.25;
        subWeightSum += 0.25;
      }

      let overallSubjectScore = 72;
      if (subWeightSum > 0) {
        overallSubjectScore = subScoreSum / subWeightSum;
      } else if (topicDiagnosticsList.length > 0) {
        overallSubjectScore = topicDiagnosticsList.reduce((acc, t) => acc + t.overallScore, 0) / topicDiagnosticsList.length;
      }

      let status: 'critical' | 'developing' | 'strong' | 'untested' = 'untested';
      let reason = 'Curriculum initialized. Regular study recommended.';

      if (subWeightSum > 0 || topicDiagnosticsList.some(t => t.status !== 'untested')) {
        if (overallSubjectScore < 60) {
          status = 'critical';
          reason = `Urgent focus: Average grade is ${overallSubjectScore.toFixed(0)}%. Previous midterm and quiz performance indicates severe concept gaps.`;
        } else if (overallSubjectScore < 75) {
          status = 'developing';
          reason = `Progressing at ${overallSubjectScore.toFixed(0)}%. Regular guided problem sets recommended to reach distinction.`;
        } else {
          status = 'strong';
          reason = `Strong foundation at ${overallSubjectScore.toFixed(0)}%. Retain mastery through spaced repetition and advanced drills.`;
        }
      }

      // Urgency Weight for time calculation
      // Ensure lower scoring subjects get more time, but high scoring subjects still have baseline time
      let urgencyWeight = Math.max(15, 100 - overallSubjectScore);
      if (studyStrategy === 'remediation' && status === 'critical') {
        urgencyWeight *= 1.4;
      }

      return {
        subject,
        overallScore: overallSubjectScore,
        midtermScore: avgMidterm,
        assignmentScore: avgAssignment,
        quizScore: avgQuiz,
        urgencyWeight,
        status,
        reason,
        topicDiagnostics: topicDiagnosticsList
      };
    });
  }, [state.assessments, state.subjects, state.topics, student.id, studyStrategy]);

  // =========================================================================
  // 2. GENERATE COMPREHENSIVE MULTI-SUBJECT DAILY & WEEKLY STUDY SCHEDULE
  // =========================================================================
  const weeklySchedule: DailyScheduleSession[] = useMemo(() => {
    if (selectedDays.length === 0 || subjectDiagnostics.length === 0) return [];

    const totalDailyMinutes = Math.round(dailyHours * 60);
    const sortedDays = DAYS_OF_WEEK.filter(d => selectedDays.includes(d));

    // Calculate daily minutes allocated to EACH subject
    // We enforce a baseline guarantee (minimum 15% of daily time per subject)
    // so NO subject is ever neglected or omitted on any study day!
    const numSubjects = subjectDiagnostics.length;
    const baselineFloorRatio = numSubjects <= 4 ? 0.15 : 0.10; // 15% guaranteed floor per subject
    const baselineMinutesPerSubject = Math.floor(totalDailyMinutes * baselineFloorRatio);
    const totalBaselineMinutes = baselineMinutesPerSubject * numSubjects;
    const poolMinutes = Math.max(0, totalDailyMinutes - totalBaselineMinutes);

    const totalUrgencySum = subjectDiagnostics.reduce((acc, s) => acc + s.urgencyWeight, 0) || 1;

    // Fixed subject minute distribution for the day
    const subjectMinuteDistribution = subjectDiagnostics.map(diag => {
      const urgencyShare = diag.urgencyWeight / totalUrgencySum;
      const calculatedMinutes = baselineMinutesPerSubject + Math.round(poolMinutes * urgencyShare);
      return {
        subjectId: diag.subject.id,
        minutes: Math.max(20, calculatedMinutes)
      };
    });

    // Normalize so sum of minutes strictly equals totalDailyMinutes
    const currentSum = subjectMinuteDistribution.reduce((acc, s) => acc + s.minutes, 0);
    const diff = totalDailyMinutes - currentSum;
    if (subjectMinuteDistribution.length > 0) {
      subjectMinuteDistribution[0].minutes += diff;
    }

    return sortedDays.map((dayName, dayIdx) => {
      // For each subject on this day, select the target topic and detailed tasks
      const subjectAllocations: SubjectDailyAllocation[] = subjectDiagnostics.map(diag => {
        const allottedMinutes = subjectMinuteDistribution.find(s => s.subjectId === diag.subject.id)?.minutes || Math.floor(totalDailyMinutes / numSubjects);
        const percentageShare = Math.round((allottedMinutes / totalDailyMinutes) * 100);

        // Rotate through topics across days so student touches different topics throughout the week
        const topics = diag.topicDiagnostics.length > 0 ? diag.topicDiagnostics : [];
        const topicIdx = (dayIdx) % (topics.length || 1);
        const targetTopic = topics[topicIdx] || {
          topic: { id: `GEN-${diag.subject.id}`, name: `${diag.subject.name} Fundamentals`, subjectId: diag.subject.id, description: '', prerequisites: [] },
          subjectId: diag.subject.id,
          subjectName: diag.subject.name,
          midtermScore: null,
          assignmentScore: null,
          quizScore: null,
          overallScore: 70,
          priorityScore: 50,
          status: 'developing' as const,
          reason: 'General topic revision'
        };

        // Split subject time into 3 actionable phases
        const conceptMinutes = Math.max(10, Math.round(allottedMinutes * 0.40));
        const practiceMinutes = Math.max(10, Math.round(allottedMinutes * 0.35));
        const quizMinutes = Math.max(10, allottedMinutes - conceptMinutes - practiceMinutes);

        // Generate tailored actionable items
        let tasks: string[] = [];
        let targetOutcome = '';

        if (targetTopic.status === 'critical') {
          tasks = [
            `Concept Review (${conceptMinutes}m): Read lecture slides on ${targetTopic.topic.name}. Re-derive core formulas and edge cases where previous midterm marks were lost.`,
            `Targeted Drills (${practiceMinutes}m): Solve 3 benchmark textbook problems focusing on previous evaluation errors.`,
            `Continuous Assessment (${quizMinutes}m): Take the official 20-Question Topic Quiz in the portal to verify conceptual recovery.`
          ];
          targetOutcome = `Elevate ${targetTopic.topic.name} score from ${targetTopic.overallScore.toFixed(0)}% to ≥ 75%`;
        } else if (targetTopic.status === 'developing') {
          tasks = [
            `Theory Consolidation (${conceptMinutes}m): Review advanced theorems, architecture diagrams, and syntax nuances for ${targetTopic.topic.name}.`,
            `Application Drill (${practiceMinutes}m): Work through 2 multi-step problem scenarios or code implementations.`,
            `Diagnostic Quiz (${quizMinutes}m): Complete 20-Question assessment in the portal to track accuracy.`
          ];
          targetOutcome = `Consolidate understanding and reach distinction level (≥ 80%)`;
        } else {
          tasks = [
            `Rapid Review (${conceptMinutes}m): Quick formula scan and memory check on ${targetTopic.topic.name}.`,
            `Speed Drill (${practiceMinutes}m): Solve 2 timed competition/exam standard questions.`,
            `Mastery Verification (${quizMinutes}m): 20-Question quiz in the portal to ensure zero retention decay.`
          ];
          targetOutcome = `Sustain top-tier mastery (> 85%)`;
        }

        return {
          subject: diag.subject,
          allocatedMinutes: allottedMinutes,
          percentageShare,
          diagnostic: diag,
          targetTopic,
          conceptMinutes,
          practiceMinutes,
          quizMinutes,
          tasks,
          targetOutcome
        };
      });

      return {
        id: `SESSION_${student.id}_${dayName}`,
        dayName,
        dayIndex: dayIdx + 1,
        totalDailyMinutes,
        subjectAllocations
      };
    });
  }, [selectedDays, dailyHours, subjectDiagnostics, student.id, studyStrategy]);

  // Toggle individual task completion
  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // Must have at least 1 day
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Quick preset days helpers
  const handleSelectWeekdays = () => {
    setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  };
  const handleSelectAllWeek = () => {
    setSelectedDays([...DAYS_OF_WEEK]);
  };
  const handleSelectWeekend = () => {
    setSelectedDays(['Saturday', 'Sunday']);
  };

  // Metrics summary
  const totalWeeklyHours = (selectedDays.length * dailyHours).toFixed(1);
  const totalScheduledTasks = weeklySchedule.reduce((acc, day) => acc + day.subjectAllocations.length, 0);
  const completedTasksCount = Object.values(completedTaskIds).filter(Boolean).length;
  const criticalSubjectsCount = subjectDiagnostics.filter(s => s.status === 'critical').length;

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          PLANNER HEADER & DIAGNOSTIC INTELLIGENCE SUMMARY
          ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                All-Subject Multi-Disciplinary Planner
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Student: <strong className="text-slate-800">{student.name}</strong> ({student.id})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Personalized Multi-Subject Study & Exam Plan
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Provides an evidence-based daily study allocation across <strong>ALL 4 curriculum subjects</strong> (DSA, AI/ML, Discrete Mathematics, and DBMS). 
              Calculates exact daily time utilization per subject and targets specific topics based on your previous <strong>Midterm</strong>, <strong>Assignment</strong>, and <strong>20-Question Quiz</strong> marks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              title="Print your comprehensive weekly timetable"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Timetable</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Assessment Cards Across Subjects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {subjectDiagnostics.map(diag => (
            <div 
              key={diag.subject.id} 
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                diag.status === 'critical'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : diag.status === 'developing'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="font-mono text-[11px] bg-white/80 px-1.5 py-0.5 rounded border border-current">
                  {diag.subject.code}
                </span>
                <span className="font-mono text-xs font-extrabold">
                  {diag.overallScore.toFixed(0)}% Score
                </span>
              </div>
              <h4 className="font-bold text-slate-900 line-clamp-1">{diag.subject.name}</h4>
              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                <div>Midterm: <strong>{diag.midtermScore !== null ? `${diag.midtermScore.toFixed(0)}%` : 'Pending'}</strong></div>
                <div>Quiz Avg: <strong>{diag.quizScore !== null ? `${diag.quizScore.toFixed(0)}%` : 'Pending'}</strong></div>
              </div>
              <div className="mt-2 text-[10px] uppercase font-mono font-bold tracking-wider">
                <span className={`px-1.5 py-0.5 rounded ${
                  diag.status === 'critical' ? 'bg-rose-200 text-rose-900' : diag.status === 'developing' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {diag.status.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE CONTROLS: AVAILABLE TIME & DAYS IN A WEEK (SUPPORTS > 3 HRS/DAY)
          ========================================================================= */}
      <div className="no-print bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white tracking-tight">
              Study Availability & Constraint Controls
            </h3>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {selectedDays.length} Days/Wk × {dailyHours} Hrs/Day = <span className="text-amber-400 font-bold">{totalWeeklyHours} Total Hours/Wk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Question 1: Number of Days in a Week */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-200">
                1. Which days in a week do you have available for study?
              </label>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded">
                {selectedDays.length} of 7 Days
              </span>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Quick Presets:</span>
              <button 
                type="button" 
                onClick={handleSelectWeekdays}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer text-[11px]"
              >
                Mon–Fri (5 Days)
              </button>
              <button 
                type="button" 
                onClick={handleSelectAllWeek}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer text-[11px]"
              >
                All 7 Days
              </button>
              <button 
                type="button" 
                onClick={handleSelectWeekend}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer text-[11px]"
              >
                Weekend (2 Days)
              </button>
            </div>

            {/* Interactive Day Buttons */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAYS_OF_WEEK.map(day => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDaySelection(day)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    <span>{day.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-slate-400 block">
              Toggle specific days you can dedicate to exam preparation and continuous assignments.
            </span>
          </div>

          {/* Question 2: Provided Time per Day (Supports > 3 hrs/day) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-200">
                2. Available study time on each study day (Flexible: 1h to 12h+):
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                  {dailyHours} Hours ({Math.round(dailyHours * 60)} Mins)
                </span>
              </div>
            </div>

            {/* Direct Number Input + Slider Row for Any Custom Hours */}
            <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>1 Hour</span>
                  <span>4 Hours</span>
                  <span>8 Hours</span>
                  <span>12 Hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Exact Direct Number Input Box */}
              <div className="shrink-0 flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-600">
                <span className="text-xs text-slate-400">Custom:</span>
                <input
                  type="number"
                  min="0.5"
                  max="16"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) setDailyHours(val);
                  }}
                  className="w-14 bg-slate-800 text-amber-400 font-mono font-bold text-center text-xs py-1 rounded border border-slate-600 focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-400 font-mono">hrs</span>
              </div>
            </div>

            {/* Preset Hours Quick Buttons (including > 3 hrs/day) */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDailyHours(h)}
                  className={`py-1.5 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    dailyHours === h
                      ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {h}h/day
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400 block">
              Each day's time is partitioned dynamically across <strong>all 4 subjects</strong> with specific focus topics and quiz drills.
            </span>
          </div>

        </div>

      </div>

      {/* =========================================================================
          VIEW MODE TOGGLE: DAILY TIMELINE vs WEEKLY MATRIX vs EFFORT DISTRIBUTION
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveViewMode('daily')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeViewMode === 'daily'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily All-Subject Breakdown</span>
          </button>

          <button
            onClick={() => setActiveViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeViewMode === 'matrix'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Master Weekly Matrix</span>
          </button>

          <button
            onClick={() => setActiveViewMode('distribution')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeViewMode === 'distribution'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Subject Time Distribution</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>{completedTasksCount} / {totalScheduledTasks} Subject Sessions Done</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: DAILY ALL-SUBJECT BREAKDOWN (DAY BY DAY CARDS)
          ========================================================================= */}
      {activeViewMode === 'daily' && (
        <div className="space-y-6">
          {weeklySchedule.map(daySession => (
            <div 
              key={daySession.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Day Header Strip */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                    D{daySession.dayIndex}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {daySession.dayName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Total Time Commitment:</span>
                      <span className="font-mono font-bold text-blue-700">{dailyHours} Hours ({daySession.totalDailyMinutes} Minutes)</span>
                    </div>
                  </div>
                </div>

                {/* Subject Time Utilization Pills for This Day */}
                <div className="flex flex-wrap items-center gap-2">
                  {daySession.subjectAllocations.map(alloc => (
                    <span 
                      key={alloc.subject.id}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-lg border bg-white flex items-center gap-1.5 shadow-2xs"
                    >
                      <strong className="text-slate-900">{alloc.subject.code}:</strong>
                      <span className="text-blue-700 font-bold">{alloc.allocatedMinutes}m</span>
                      <span className="text-slate-400">({alloc.percentageShare}%)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Day's Multi-Subject Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Status</th>
                      <th className="py-3 px-4 w-52">Subject & Daily Utilization</th>
                      <th className="py-3 px-4 w-56">Focus Topic & Diagnostic</th>
                      <th className="py-3 px-4">Action Routine (Theory, Drills & 20-Q Quiz)</th>
                      <th className="py-3 px-4 w-36">Expected Target</th>
                      <th className="py-3 px-4 w-28 text-center no-print">Quick Quiz</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {daySession.subjectAllocations.map(alloc => {
                      const taskId = `TASK_${student.id}_${daySession.dayName}_${alloc.subject.id}_${alloc.targetTopic.topic.id}`;
                      const isTaskCompleted = !!completedTaskIds[taskId];

                      return (
                        <tr 
                          key={alloc.subject.id}
                          className={`transition-colors hover:bg-slate-50/80 ${
                            isTaskCompleted ? 'bg-emerald-50/40 opacity-80' : ''
                          }`}
                        >
                          {/* Done Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => toggleTaskCompletion(taskId)}
                              className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                              title={isTaskCompleted ? "Mark incomplete" : "Mark completed"}
                            >
                              {isTaskCompleted ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                          </td>

                          {/* Subject & Daily Time Utilization */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">
                              {alloc.subject.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                {alloc.allocatedMinutes} Mins ({alloc.percentageShare}% of day)
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                              Course Code: {alloc.subject.code}
                            </span>
                          </td>

                          {/* Focus Topic & Diagnostic Reason */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-xs leading-snug">
                              {alloc.targetTopic.topic.name}
                            </div>
                            <div className="mt-1">
                              <span className={`inline-block text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                                alloc.targetTopic.status === 'critical'
                                  ? 'bg-rose-100 text-rose-800'
                                  : alloc.targetTopic.status === 'developing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {alloc.targetTopic.status.toUpperCase()} GAP
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                              {alloc.targetTopic.reason}
                            </div>
                          </td>

                          {/* Concrete Action Routine with Timed Tasks */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1.5 text-[11px] text-slate-700">
                              {alloc.tasks.map((task, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <span className="text-blue-600 font-bold shrink-0">•</span>
                                  <span className="leading-snug">{task}</span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Target Outcome */}
                          <td className="py-3.5 px-4">
                            <span className="text-[11px] font-semibold text-slate-900 block leading-tight">
                              {alloc.targetOutcome}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Continuous evaluation tracking
                            </span>
                          </td>

                          {/* Quick Quiz Launch */}
                          <td className="py-3.5 px-4 text-center no-print">
                            <button
                              onClick={() => onNavigateToQuiz && onNavigateToQuiz(alloc.targetTopic.topic.id)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                              title={`Take 20-Question quiz on ${alloc.targetTopic.topic.name}`}
                            >
                              Take 20 Qs
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: MASTER WEEKLY MATRIX (CROSS-SUBJECT TIMETABLE)
          ========================================================================= */}
      {activeViewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-blue-600" />
                <span>Master Weekly Academic Matrix Across All Subjects</span>
              </h3>
              <p className="text-xs text-slate-500">
                Synchronized schedule showing daily minutes and topic focus across every course
              </p>
            </div>
            <div className="text-xs font-mono font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              {dailyHours} Hours/Day · {subjectDiagnostics.length} Courses Covered
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-32">Study Day</th>
                  {subjectDiagnostics.map(diag => (
                    <th key={diag.subject.id} className="py-3 px-4">
                      <div>{diag.subject.code}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{diag.subject.name}</div>
                    </th>
                  ))}
                  <th className="py-3 px-4 w-28 text-center">Day Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {weeklySchedule.map(daySession => (
                  <tr key={daySession.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm bg-slate-50/50">
                      <div>{daySession.dayName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">Day {daySession.dayIndex}</span>
                    </td>

                    {daySession.subjectAllocations.map(alloc => (
                      <td key={alloc.subject.id} className="py-3.5 px-4 align-top">
                        <div className="font-bold text-slate-900 text-xs">
                          {alloc.targetTopic.topic.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {alloc.allocatedMinutes} mins
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded font-bold ${
                            alloc.targetTopic.status === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {alloc.targetTopic.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                          {alloc.conceptMinutes}m Theory · {alloc.practiceMinutes}m Drill · {alloc.quizMinutes}m Quiz
                        </p>
                        <button
                          onClick={() => onNavigateToQuiz && onNavigateToQuiz(alloc.targetTopic.topic.id)}
                          className="mt-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                          Launch 20 Qs →
                        </button>
                      </td>
                    ))}

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                      {daySession.totalDailyMinutes}m
                      <span className="text-[10px] text-slate-400 block font-normal">({dailyHours}h)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: SUBJECT TIME DISTRIBUTION & DIAGNOSTIC RATIONALE
          ========================================================================= */}
      {activeViewMode === 'distribution' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>Weekly Subject Time Utilization & Diagnostic Weighting</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Explains how your total weekly commitment of <strong>{totalWeeklyHours} hours</strong> is partitioned across subjects to repair past test deficits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectDiagnostics.map(diag => {
              // Calculate weekly hours for this subject
              const subjectDayAlloc = weeklySchedule[0]?.subjectAllocations.find(s => s.subject.id === diag.subject.id);
              const dailyMins = subjectDayAlloc?.allocatedMinutes || 0;
              const weeklyHours = ((dailyMins * selectedDays.length) / 60).toFixed(1);
              const sharePct = subjectDayAlloc?.percentageShare || 25;

              return (
                <div 
                  key={diag.subject.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {diag.subject.code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{diag.subject.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-blue-700 font-mono">
                        {weeklyHours} hrs/wk
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {dailyMins} mins/day ({sharePct}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar of share */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        diag.status === 'critical' ? 'bg-rose-500' : diag.status === 'developing' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sharePct}%` }}
                    />
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                    <div>
                      <strong>Diagnostic Justification:</strong> {diag.reason}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      • Historical Average: <strong>{diag.overallScore.toFixed(0)}%</strong> (Midterm: {diag.midtermScore !== null ? `${diag.midtermScore.toFixed(0)}%` : 'N/A'}, Quiz: {diag.quizScore !== null ? `${diag.quizScore.toFixed(0)}%` : 'N/A'})
                    </div>
                  </div>

                  {/* High priority topics in this subject */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                      Priority Topics Scheduled for Study:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {diag.topicDiagnostics.map(t => (
                        <span 
                          key={t.topic.id}
                          className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                        >
                          {t.topic.name} ({t.overallScore.toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIMETABLE FOOTER & INSTITUTIONAL COMPLIANCE
          ========================================================================= */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Multi-subject continuous assessment study engine dynamically updates whenever new marks are submitted.
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-600">
          NIET CSE Department · Odd Semester 2025–26 · Section F
        </div>
      </div>

    </div>
  );
};
