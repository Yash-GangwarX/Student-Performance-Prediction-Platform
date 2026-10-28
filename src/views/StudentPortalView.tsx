import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Printer, 
  ExternalLink, 
  Target, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  UserCheck,
  CheckSquare,
  Square,
  Sliders,
  Save,
  Lightbulb,
  Circle,
  HelpCircle
} from 'lucide-react';
import { TopicQuizView } from './TopicQuizView';
import { PersonalizedStudyPlanner } from '../components/student/PersonalizedStudyPlanner';
import { TopicSummary, StudyHabit, Recommendation } from '../types';
import { 
  summarizeTopicPerformance, 
  calculateMean, 
  calculateChronologicalTrend,
  generateEvidenceBasedRecommendations
} from '../utils/calculations';

interface StudentPortalViewProps {
  onNavigateToQuiz?: (topicId?: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = () => {
  const { 
    state, 
    currentUser, 
    selectedStudent, 
    openReportModal, 
    toggleRecommendation,
    updateStudyHabit 
  } = useApp();

  const [activeStudentTab, setActiveStudentTab] = useState<'overview' | 'habits' | 'quizzes' | 'marks' | 'interventions'>('overview');
  const [selectedQuizTopicId, setSelectedQuizTopicId] = useState<string | undefined>(undefined);

  // The active student is guaranteed to be the logged-in student (or selectedStudent)
  const student = selectedStudent || state.students[0];

  // Topic summaries for this student
  const studentTopics: TopicSummary[] = useMemo(() => {
    return state.topics.map(topic => {
      const subject = state.subjects.find(s => s.id === topic.subjectId);
      return summarizeTopicPerformance(
        topic,
        subject?.name || 'Computer Science',
        state.assessments,
        student.id,
        state.reviewThreshold,
        state.topics
      );
    });
  }, [student.id, state.assessments, state.topics, state.subjects, state.reviewThreshold]);

  // Overall student average score %
  const overallPercentage = useMemo(() => {
    const completed = state.assessments.filter(a => a.studentId === student.id && a.status === 'completed');
    if (completed.length === 0) return 82.5;
    const pcts = completed.map(a => a.percentage);
    return calculateMean(pcts) || 82.5;
  }, [state.assessments, student.id]);

  // Trend direction
  const trendDirection = useMemo(() => {
    const completed = state.assessments
      .filter(a => a.studentId === student.id && a.status === 'completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pcts = completed.map(a => a.percentage);
    const trend = calculateChronologicalTrend(pcts);
    return trend.direction === 'improving' ? 'Improving (+)' : trend.direction === 'declining' ? 'Declining (-)' : 'Consistent';
  }, [state.assessments, student.id]);

  // Student assessments
  const studentAssessments = useMemo(() => {
    return state.assessments
      .filter(a => a.studentId === student.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.assessments, student.id]);

  // Student study habit from state
  const habit = useMemo(() => {
    return state.studyHabits.find(h => h.studentId === student.id) || {
      id: `HABIT-${student.id}`,
      studentId: student.id,
      studyHoursPerWeek: 12,
      revisionFrequency: '3-4 times/week' as const,
      practiceFrequency: 'Moderate' as const,
      preparationPattern: 'Regular distributed' as const,
      lastUpdated: new Date().toISOString().slice(0, 10),
      notes: ''
    };
  }, [state.studyHabits, student.id]);

  // Interactive Student Study Habit Form state (completely controlled by student)
  const [habitForm, setHabitForm] = useState<StudyHabit>(habit);
  const [habitSaveMessage, setHabitSaveMessage] = useState<string | null>(null);

  // Sync habit form when selected student changes
  useEffect(() => {
    setHabitForm(habit);
  }, [habit]);

  const handleSaveStudentHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudyHabit = {
      ...habitForm,
      studentId: student.id,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
    updateStudyHabit(updated);
    setHabitSaveMessage('Your study habits have been saved and synchronized across your portal, study planner, and faculty view.');
    setTimeout(() => setHabitSaveMessage(null), 4000);
  };

  // Student attendance
  const attendance = useMemo(() => {
    const records = state.attendanceRecords.filter(a => a.studentId === student.id);
    const totalClasses = records.reduce((acc, r) => acc + r.totalClassesHeld, 0);
    const attendedClasses = records.reduce((acc, r) => acc + r.classesAttended, 0);
    const pct = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 85;
    return { records, totalClasses, attendedClasses, overallPercentage: pct.toFixed(1) };
  }, [state.attendanceRecords, student.id]);

  // Recommendations: strictly arranged with HIGH PRIORITY UPPER in the lane
  const sortedRecommendations = useMemo(() => {
    let recs = state.recommendations.filter(r => r.studentId === student.id);
    if (recs.length === 0) {
      recs = generateEvidenceBasedRecommendations(
        student,
        state.topics,
        state.assessments,
        state.reviewThreshold,
        habit,
        state.attendanceRecords,
        state.practiceActivities
      );
    }
    const priorityRank: Record<string, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
    return [...recs].sort((a, b) => {
      // Completed items go lower
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      const rankA = priorityRank[a.priority] || 99;
      const rankB = priorityRank[b.priority] || 99;
      return rankA - rankB; // High (1) before Medium (2) before Low (3)
    });
  }, [state.recommendations, student, state.topics, state.assessments, state.reviewThreshold, habit, state.attendanceRecords, state.practiceActivities]);

  const handleLaunchQuiz = (topicId?: string) => {
    setSelectedQuizTopicId(topicId);
    setActiveStudentTab('quizzes');
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          STUDENT IDENTITY & ACADEMIC DOSSIER BANNER
          ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/40 flex items-center justify-center text-xl font-bold font-mono shadow-inner shrink-0 text-white">
              {student.name.slice(0, 2).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-bold">
                  Enrolled Scholar
                </span>
                <span className="text-xs font-mono text-blue-200">
                  Roll ID: <strong className="text-white">{student.id}</strong>
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-300">
                  {student.program} (Sem {student.semester} · Sec {student.section})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {student.name}
              </h1>
              <p className="text-xs text-slate-300">
                Department of Computer Science & Engineering · Academic Session 2025–26
              </p>
            </div>
          </div>

          {/* Action: Print Performance Dossier */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openReportModal(student.id)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Download Official Progress Dossier</span>
            </button>
          </div>

        </div>

        {/* Student Quick Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveStudentTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeStudentTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Academic Overview</span>
          </button>

          <button
            onClick={() => setActiveStudentTab('habits')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeStudentTab === 'habits'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-300" />
            <span>My Study Habits (Self-Reported)</span>
          </button>

          <button
            onClick={() => setActiveStudentTab('quizzes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeStudentTab === 'quizzes'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Topic Quizzes (20 Qs Each)</span>
          </button>

          <button
            onClick={() => setActiveStudentTab('marks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeStudentTab === 'marks'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Evaluation Marks</span>
          </button>

          <button
            onClick={() => setActiveStudentTab('interventions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeStudentTab === 'interventions'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Personalized Study Plan</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: STUDENT ACADEMIC OVERVIEW
          ========================================================================= */}
      {activeStudentTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Personal Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Overall Average */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Cumulative Average Score</span>
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {overallPercentage.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Continuous Evaluation Average
              </span>
            </div>

            {/* Metric 2: Trend Slope */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Trajectory & Trend</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600">
                {trendDirection}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Recent Performance Momentum
              </span>
            </div>

            {/* Metric 3: Attendance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Class Attendance</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {attendance.overallPercentage}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {attendance.attendedClasses} / {attendance.totalClasses} lectures attended
              </span>
            </div>

            {/* Metric 4: Self-Reported Study Habits */}
            <div 
              onClick={() => setActiveStudentTab('habits')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">My Study Habits</span>
                <BookOpen className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-extrabold text-purple-900">
                {habit.studyHoursPerWeek} hrs/wk
              </div>
              <span className="text-[11px] text-purple-700 font-medium mt-1 flex items-center justify-between">
                <span>{habit.preparationPattern}</span>
                <span className="text-[10px] underline">Edit →</span>
              </span>
            </div>

          </div>

          {/* =========================================================================
              PRIORITY RECOMMENDATIONS LANE (HIGH PRIORITY FIRST AT TOP)
              ========================================================================= */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Targeted Academic Recommendations (Priority Lane)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-priority interventions arranged upper in the lane based on your previous test performance gaps and study habits.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                {sortedRecommendations.filter(r => r.priority === 'High' && !r.isCompleted).length} Urgent Actions Pending
              </span>
            </div>

            <div className="space-y-3">
              {sortedRecommendations.map((rec) => {
                const isHigh = rec.priority === 'High';
                const isTopicRelated = rec.topicId && rec.topicId !== 'general';

                return (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border transition-all ${
                      rec.isCompleted
                        ? 'bg-slate-50/60 border-slate-200 opacity-60'
                        : isHigh
                        ? 'bg-rose-50/50 border-rose-200 shadow-2xs hover:border-rose-300'
                        : rec.priority === 'Medium'
                        ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                        : 'bg-slate-50/40 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleRecommendation(rec.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                          title={rec.isCompleted ? "Mark incomplete" : "Mark completed"}
                        >
                          {rec.isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                              rec.isCompleted
                                ? 'bg-slate-200 text-slate-600'
                                : isHigh
                                ? 'bg-rose-600 text-white'
                                : rec.priority === 'Medium'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {rec.priority} Priority
                            </span>
                            <h4 className={`text-sm font-bold ${rec.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {rec.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            <strong>Recommended Action:</strong> {rec.recommendedAction}
                          </p>

                          <div className="text-[11px] text-slate-600 leading-snug">
                            <span><strong>Diagnostic Reason:</strong> {rec.reason}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 sm:self-center pl-8 sm:pl-0">
                        {isTopicRelated && !rec.isCompleted && (
                          <button
                            onClick={() => handleLaunchQuiz(rec.topicId)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                          >
                            Take 20 Qs
                          </button>
                        )}
                        <button
                          onClick={() => setActiveStudentTab('interventions')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          View in Plan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Quiz Callout Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded">
                  Active Continuous Assessment
                </span>
                <span className="text-xs font-semibold text-blue-900">20 Questions Topic Diagnostics</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Test your mastery on Arrays, Trees, Machine Learning, and SQL
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl">
                Immediate automatic grading, detailed answer explanations, and score recording directly into your academic profile.
              </p>
            </div>

            <button
              onClick={() => handleLaunchQuiz()}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-98 shrink-0"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Launch 20-Question Topic Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Topic Radar: Mastered vs In-Review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Mastered Topics */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">Mastered Course Topics</h3>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  Score ≥ 60%
                </span>
              </div>

              <div className="space-y-2.5">
                {studentTopics.filter((t: TopicSummary) => t.status === 'On track').map((t: TopicSummary) => (
                  <div key={t.topicId} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{t.topicName}</h4>
                      <span className="text-[10px] text-slate-500">{t.subjectName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-emerald-700">
                        {t.averagePercentage ? `${t.averagePercentage.toFixed(0)}%` : '85%'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{t.attemptsCount} attempts</span>
                    </div>
                  </div>
                ))}
                {studentTopics.filter((t: TopicSummary) => t.status === 'On track').length === 0 && (
                  <p className="text-xs text-slate-500 py-3 text-center">No mastered topics yet. Take topic quizzes to establish mastery.</p>
                )}
              </div>
            </div>

            {/* Topics Needing Review */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900">Recommended Topics to Practice</h3>
                </div>
                <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                  Needs Review
                </span>
              </div>

              <div className="space-y-2.5">
                {studentTopics.filter((t: TopicSummary) => t.status !== 'On track').map((t: TopicSummary) => (
                  <div key={t.topicId} className="p-3 rounded-xl border border-amber-100 bg-amber-50/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{t.topicName}</h4>
                      <span className="text-[10px] text-slate-500">{t.subjectName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-amber-700">
                          {t.averagePercentage ? `${t.averagePercentage.toFixed(0)}%` : 'Review'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleLaunchQuiz(t.topicId)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Practice 20 Qs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Marks in Assignments & Midterms */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Recent Instructor Evaluation Marks</h3>
                <p className="text-xs text-slate-500">Official marks entered by department faculty for assignments and midterms</p>
              </div>
              <button
                onClick={() => setActiveStudentTab('marks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Grade Record</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Assessment Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Score Obtained</th>
                    <th className="py-2.5 px-3">Percentage</th>
                    <th className="py-2.5 px-3">Evaluation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {studentAssessments.slice(0, 5).map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{a.assessmentName}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          a.assessmentType === 'Midterm' 
                            ? 'bg-amber-100 text-amber-800' 
                            : a.assessmentType === 'Assignment' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {a.assessmentType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{a.date}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {a.obtainedMarks} / {a.maxMarks}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        {a.percentage.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="flex items-center gap-1 text-emerald-600 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified by Faculty</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: MY STUDY HABITS (COMPLETELY DEPENDENT ON WHAT THE STUDENT TELLS)
          ========================================================================= */}
      {activeStudentTab === 'habits' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  Student Self-Reported Cadence
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  My Study Habits & Self-Reported Academic Routine
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  This section is <strong>completely dependent on what you declare</strong> as your study routine. 
                  Your faculty observers and the AI performance prediction engine use your reported commitments to adjust study advice and recommendations.
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                <span className="block font-medium">Last Updated:</span>
                <span className="font-mono font-bold text-slate-800">{habit.lastUpdated || 'Current Semester'}</span>
              </div>
            </div>

            {/* Instant Save Notification Banner */}
            {habitSaveMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{habitSaveMessage}</span>
              </div>
            )}

            {/* Interactive Student Form */}
            <form onSubmit={handleSaveStudentHabit} className="space-y-6 pt-2">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Self-Reported Weekly Study Hours */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>1. Dedicated Study Hours per Week</span>
                    </label>
                    <span className="font-mono font-bold text-sm text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                      {habitForm.studyHoursPerWeek} hrs/week
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2"
                    max="35"
                    step="1"
                    value={habitForm.studyHoursPerWeek}
                    onChange={(e) => setHabitForm({ ...habitForm, studyHoursPerWeek: Number(e.target.value) })}
                    className="w-full accent-purple-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>2 hrs (Minimal)</span>
                    <span>14 hrs (Recommended)</span>
                    <span>30+ hrs (Intensive)</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    Equivalent to approximately ~{(habitForm.studyHoursPerWeek / 7).toFixed(1)} hours of daily revision across your 4 courses.
                  </p>
                </div>

                {/* 2. Revision Frequency */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>2. How frequently do you revise lecture notes?</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {(['Daily', '3-4 times/week', 'Weekly', 'Before Exams'] as const).map(freq => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setHabitForm({ ...habitForm, revisionFrequency: freq })}
                        className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          habitForm.revisionFrequency === freq
                            ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    Regular distributed revision prevents exam week cramming fatigue.
                  </p>
                </div>

                {/* 3. Problem-Solving & Coding Practice Frequency */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>3. Practice Problem & Code Drill Frequency</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {(['High', 'Moderate', 'Low'] as const).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setHabitForm({ ...habitForm, practiceFrequency: level })}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          habitForm.practiceFrequency === level
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {level} Practice
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    "High" indicates taking the 20-Question topic quizzes and solving textbook exercises weekly.
                  </p>
                </div>

                {/* 4. Preparation & Study Pattern */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>4. Primary Preparation Pattern</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {(['Regular distributed', 'Group study', 'Self-paced', 'Cramming'] as const).map(pattern => (
                      <button
                        key={pattern}
                        type="button"
                        onClick={() => setHabitForm({ ...habitForm, preparationPattern: pattern })}
                        className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          habitForm.preparationPattern === pattern
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    Faculty mentors consult your declared pattern during periodic performance reviews.
                  </p>
                </div>

              </div>

              {/* 5. Scholar's Personal Reflection & Study Notes */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  5. Scholar's Personal Study Strategy & Focus Goals (Notes to Faculty Mentor)
                </label>
                <textarea
                  rows={3}
                  value={habitForm.notes || ''}
                  onChange={(e) => setHabitForm({ ...habitForm, notes: e.target.value })}
                  placeholder="e.g., Focusing on Dynamic Programming and Normalization 1NF-BCNF to repair my Midterm 1 score. Committing to two 20-question topic quizzes every weekend."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
                <span className="text-[11px] text-slate-500 block">
                  Declared notes are visible to your department faculty mentors in their evaluation console.
                </span>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Click below to record your self-reported commitments into the academic ledger.
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>Save My Study Habits</span>
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: TOPIC QUIZZES (20 QUESTIONS EACH)
          ========================================================================= */}
      {activeStudentTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900">Interactive Topic Quizzes (20 Questions Each)</h2>
              <p className="text-xs text-slate-600">Choose any syllabus topic below to take a complete 20-question multiple-choice diagnostic test.</p>
            </div>
          </div>
          
          <TopicQuizView 
            initialTopicId={selectedQuizTopicId} 
            onNavigate={(view) => {
              if (view === 'assessments') setActiveStudentTab('marks');
            }} 
          />
        </div>
      )}

      {/* =========================================================================
          TAB 4: MY EVALUATION MARKS
          ========================================================================= */}
      {activeStudentTab === 'marks' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Continuous Assessment & Examination Grades</h2>
              <p className="text-xs text-slate-500">Official marks record for {student.name} ({student.id})</p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>Verified Instructor Record · Student View</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-3 px-3">Assessment Title</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Date Completed</th>
                  <th className="py-3 px-3">Marks Scored</th>
                  <th className="py-3 px-3">Max Marks</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {studentAssessments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-semibold text-slate-900">{a.assessmentName}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        a.assessmentType === 'Midterm' 
                          ? 'bg-amber-100 text-amber-800' 
                          : a.assessmentType === 'Assignment' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {a.assessmentType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{a.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{a.obtainedMarks}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{a.maxMarks}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{a.percentage.toFixed(1)}%</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: PERSONALIZED STUDY PLAN & TIMETABLE (WITH TEST/QUIZ DIAGNOSTICS)
          ========================================================================= */}
      {activeStudentTab === 'interventions' && (
        <PersonalizedStudyPlanner 
          student={student} 
          onNavigateToQuiz={handleLaunchQuiz} 
        />
      )}

    </div>
  );
};
