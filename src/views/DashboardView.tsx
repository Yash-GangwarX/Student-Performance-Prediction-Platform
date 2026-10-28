import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  calculateMean, 
  summarizeTopicPerformance, 
  calculatePerformancePrediction 
} from '../utils/calculations';
import { ScoreTrendChart } from '../components/charts/ScoreTrendChart';
import { TopicBarChart } from '../components/charts/TopicBarChart';
import { 
  Users, 
  FileSpreadsheet, 
  TrendingUp, 
  Printer, 
  ChevronRight,
  Target,
  Clock,
  Lightbulb,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string, topicId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    openReportModal 
  } = useApp();

  // Dataset-wide statistics
  const totalStudents = state.students.length;
  const validAssessments = state.assessments.filter(a => a.status === 'completed' && a.maxMarks > 0);
  const allScores = validAssessments.map(a => a.percentage);
  const overallAverage = calculateMean(allScores);

  // Selected student assessments and topic summaries
  const studentAssessments = selectedStudent 
    ? state.assessments.filter(a => a.studentId === selectedStudent.id && a.status === 'completed')
    : [];

  const studentTopicSummaries = state.topics.map(topic => {
    const sub = state.subjects.find(s => s.id === topic.subjectId);
    return summarizeTopicPerformance(
      topic,
      sub?.name || topic.subjectId,
      state.assessments,
      selectedStudent?.id || '',
      state.reviewThreshold,
      state.topics
    );
  });

  const totalFlaggedTopics = studentTopicSummaries.filter(t => t.status === 'Needs attention').length;

  // Primary topic prediction
  const primaryTopic = state.topics.find(t => 
    studentAssessments.some(a => a.topicId === t.id)
  ) || state.topics[0];

  const studentPrediction = selectedStudent ? calculatePerformancePrediction(
    state.assessments,
    selectedStudent.id,
    primaryTopic?.subjectId || '',
    primaryTopic?.id || ''
  ) : null;

  // Recent 6 assessments across the system
  const recentAssessments = [...state.assessments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Student specific average
  const studentScores = studentAssessments.map(a => a.percentage);
  const studentMean = calculateMean(studentScores);

  return (
    <div className="space-y-8">
      
      {/* =========================================================================
          HERO EXECUTIVE BANNER: OFFICIAL PORTAL HEADER
          ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl border border-slate-800 p-6 sm:p-8 text-white shadow-md">
        
        {/* Subtle decorative geometric overlay */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/70 px-2.5 py-0.5 rounded border border-amber-600/40">
                Department of Computer Science & Engineering
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Autonomous Academic Evaluation System
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Academic Analytics & Performance Command Center
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Real-time evaluation ledger with automated 20-question topic quizzes, manual marks recording for assignments and midterms, explainable AI forecasting, and printable official student dossiers.
            </p>
          </div>

          {/* Quick Context & Print Dossier CTA */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Launch 20-Q Quiz</span>
            </button>

            <button
              onClick={() => openReportModal(selectedStudent?.id)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer active:scale-98"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Generate Official Dossier</span>
            </button>
          </div>
        </div>

        {/* Selected Student Snapshot Strip inside Hero */}
        {selectedStudent && (
          <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Evaluated Student</span>
              <strong className="text-sm text-white font-bold">{selectedStudent.name}</strong>
              <span className="font-mono text-[11px] text-blue-300 block">{selectedStudent.id}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Assessments Mean</span>
              <strong className="text-sm font-mono text-white font-bold">
                {studentMean !== null ? `${studentMean}%` : 'No data'}
              </strong>
              <span className="text-[10px] text-slate-400 block">{studentAssessments.length} total attempts</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">AI Predicted Next Score</span>
              <strong className="text-sm font-mono text-amber-300 font-bold">
                {studentPrediction?.estimatedScore !== null && studentPrediction?.estimatedScore !== undefined ? `${studentPrediction.estimatedScore}%` : 'Preliminary'}
              </strong>
              <span className="text-[10px] text-slate-400 block">
                {studentPrediction?.trendDirection || 'Awaiting attempts'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Topic Mastery Deficits</span>
              <strong className={`text-sm font-bold ${totalFlaggedTopics > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {totalFlaggedTopics > 0 ? `${totalFlaggedTopics} Flags` : 'Optimal Mastery'}
              </strong>
              <span className="text-[10px] text-slate-400 block">Cutoff at {state.reviewThreshold}%</span>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          KEY HIGH-LEVEL METRICS CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Enrolled Cohort */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Enrolled Cohort</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalStudents} Students</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">B.Tech Sem 3 · Sec F (CSE)</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Validated Records */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assessment Records</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{validAssessments.length} Logged</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Quizzes, Midterms & Assign.</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-800 rounded-xl">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: System Assessment Average */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Cohort Mean Score</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{overallAverage}%</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Validated across subjects</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Topic Review Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Student Topic Flags</span>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1">{totalFlaggedTopics} Topics</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">&lt; {state.reviewThreshold}% Threshold</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION: VISUAL ACADEMIC MODULE HUB
          This satisfies: "As all the sections are shown in just a single place, 
          i wanted in such a way that it is accessible just like a professional one"
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Official Academic Portals & Modules
            </h2>
            <p className="text-xs text-slate-500">
              Direct visual access to all academic tracking, evaluation, prediction, and intervention tools.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            6 Specialized Subsystems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Module 1: Assessments & Manual Marks Ledger */}
          <div 
            onClick={() => onNavigate('assessments')}
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-blue-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-white rounded-lg transition-colors">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Manual Entry
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                Assessments & Marks Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Manually record and edit faculty-assigned marks for <strong>Assignments</strong>, <strong>Midterms</strong>, and <strong>Lab Practicals</strong> with full historical attempt logging.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-800 group-hover:text-blue-950">
              <span>Access Ledger</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Module 2: Interactive Topic Quizzes (20 Questions) */}
          <div 
            onClick={() => onNavigate('quiz')}
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-amber-50 text-amber-800 group-hover:bg-amber-500 group-hover:text-slate-950 rounded-lg transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  20 Qs Auto-Scored
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                Topic Quizzes (20 Qs Auto)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Automated 20-question multiple-choice examinations across 9 topics. Automatically scores responses and syncs records straight into the student ledger.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-950">
              <span>Start Assessment</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Module 3: AI Performance Prediction Engine */}
          <div 
            onClick={() => onNavigate('prediction')}
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white rounded-lg transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI Modeling
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                Performance Prediction Engine
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Explainable student forecasts using linear recency weighting (W_i = 2i/[n(n+1)]), capped trend adjustments, and confidence boundaries.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-800 group-hover:text-indigo-950">
              <span>View Predictions</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Module 4: Topic Mastery & Risk Radar */}
          <div 
            onClick={() => onNavigate('topic-analysis')}
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-900 group-hover:bg-emerald-800 group-hover:text-white rounded-lg transition-colors">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  Cutoff Slider
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                Topic Risk & Mastery Radar
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Categorizes student syllabus coverage into <em>On track</em>, <em>Developing</em>, or <em>Needs attention</em> with a configurable mastery cutoff slider.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
              <span>Analyze Topics</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Module 5: Study Habits & Engagement */}
          <div 
            onClick={() => onNavigate('habits')}
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-50 text-purple-900 group-hover:bg-purple-900 group-hover:text-white rounded-lg transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                  Engagement
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                Study Habits & Engagement
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Correlate academic scores with weekly study hours, LMS portal activity, practice quiz frequency, and classroom attendance logs.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-800 group-hover:text-purple-950">
              <span>Inspect Habits</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Module 6: Targeted Academic Interventions */}
          <div 
            onClick={() => onNavigate('recommendations')}
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-teal-50 text-teal-900 group-hover:bg-teal-900 group-hover:text-white rounded-lg transition-colors">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                  Interventions
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                Targeted Interventions
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Algorithmic, evidence-based academic remediation plans prioritizing topics with low mastery and foundational prerequisites.
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-800 group-hover:text-teal-950">
              <span>View Interventions</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION: VISUAL ANALYTICS & RECENT FEEDS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Score Trajectory & Topic Distribution */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chronological Score Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Student Score Trajectory Over Time
                </h2>
                <p className="text-xs text-slate-500">
                  Chronological plot of completed assessments for {selectedStudent?.name || 'Selected Student'}.
                </p>
              </div>

              {/* Student Switcher Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Switch:</span>
                <select
                  value={state.selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 cursor-pointer"
                >
                  {state.students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <ScoreTrendChart
              records={studentAssessments}
              predictedScore={studentPrediction?.estimatedScore}
              reviewThreshold={state.reviewThreshold}
              height={260}
            />
          </div>

          {/* Topic Performance Distribution Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Topic Mastery & Review Threshold Alignment
                </h2>
                <p className="text-xs text-slate-500">
                  Mean performance across curriculum topics vs {state.reviewThreshold}% review cutoff line.
                </p>
              </div>
              <button
                onClick={() => onNavigate('topic-analysis')}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Full Radar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <TopicBarChart
              summaries={studentTopicSummaries}
              reviewThreshold={state.reviewThreshold}
              height={260}
            />
          </div>

        </div>

        {/* Right 1 Column: Recent Assessment Feed & Quick Roster */}
        <div className="space-y-6">
          
          {/* Recent Assessment Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900">Recent Assessment Activity</h2>
                <button
                  onClick={() => onNavigate('assessments')}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                >
                  View all
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Latest marks and auto-scored quizzes recorded across the cohort.
              </p>

              <div className="space-y-2.5">
                {recentAssessments.map(record => {
                  const student = state.students.find(s => s.id === record.studentId);
                  const topic = state.topics.find(t => t.id === record.topicId);
                  const isQuiz = record.assessmentType === 'Quiz';

                  return (
                    <div key={record.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs transition-colors">
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span className="truncate pr-2">{student?.name || record.studentId}</span>
                        <span className="font-mono text-blue-800 font-bold shrink-0">{record.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mt-1">
                        <span className="truncate pr-1">{record.assessmentName}</span>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border shrink-0 ${
                          isQuiz ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {record.assessmentType}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[10px] mt-1 font-mono flex items-center justify-between">
                        <span>{record.date}</span>
                        <span>{record.obtainedMarks}/{record.maxMarks} marks</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Auto-scored quizzes & manual entries</span>
              <button
                onClick={() => onNavigate('quiz')}
                className="text-amber-800 hover:text-amber-950 font-bold cursor-pointer"
              >
                Take a Quiz &rarr;
              </button>
            </div>
          </div>

          {/* Quick Enrolled Student Standing Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Cohort Roster</h2>
              <button
                onClick={() => onNavigate('students')}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
              >
                All Students
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Click any student to switch active profile.
            </p>

            <div className="space-y-1.5">
              {state.students.slice(0, 5).map(s => {
                const sAssessments = state.assessments.filter(a => a.studentId === s.id && a.status === 'completed');
                const sScores = sAssessments.map(a => a.percentage);
                const sMean = calculateMean(sScores);
                const isSelected = selectedStudent?.id === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-500/20' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-900 truncate">{s.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{s.id} · Sec {s.section}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-slate-800">
                        {sMean !== null ? `${sMean}%` : '-'}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReportModal(s.id);
                        }}
                        className="text-[10px] text-blue-700 hover:underline font-medium"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
