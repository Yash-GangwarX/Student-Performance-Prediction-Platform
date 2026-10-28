import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  calculateMean, 
  calculateMedian, 
  calculatePerformancePrediction, 
  summarizeTopicPerformance 
} from '../../utils/calculations';
import { ScoreTrendChart } from '../charts/ScoreTrendChart';
import { TopicBarChart } from '../charts/TopicBarChart';
import { Printer, X, Download, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export const PerformanceReportModal: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    closeReportModal 
  } = useApp();

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!state.selectedStudentId || !selectedStudent) {
    return null;
  }

  // Student assessments
  const studentAssessments = state.assessments
    .filter(a => a.studentId === selectedStudent.id && a.status === 'completed' && a.maxMarks > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const scores = studentAssessments.map(a => a.percentage);
  const overallMean = calculateMean(scores);
  const overallMedian = calculateMedian(scores);
  const highestScore = scores.length > 0 ? Math.max(...scores) : null;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : null;
  const mostRecentScore = scores.length > 0 ? scores[scores.length - 1] : null;

  // Student non-academic categories
  const habit = state.studyHabits.find(h => h.studentId === selectedStudent.id);
  const studentAtt = state.attendanceRecords.filter(a => a.studentId === selectedStudent.id);
  const studentEng = state.engagementRecords.find(e => e.studentId === selectedStudent.id);
  const studentPrac = state.practiceActivities.filter(p => p.studentId === selectedStudent.id);

  // Topic summaries
  const topicSummaries = state.topics.map(topic => {
    const subject = state.subjects.find(s => s.id === topic.subjectId);
    return summarizeTopicPerformance(
      topic,
      subject?.name || topic.subjectId,
      state.assessments,
      selectedStudent.id,
      state.reviewThreshold,
      state.topics
    );
  });

  const flaggedTopics = topicSummaries.filter(t => t.status === 'Needs attention');

  // Primary topic prediction (pick first active topic or highest importance topic)
  const primaryTopic = state.topics.find(t => 
    studentAssessments.some(a => a.topicId === t.id)
  ) || state.topics[0];

  const primarySubject = state.subjects.find(s => s.id === primaryTopic?.subjectId);

  const prediction = calculatePerformancePrediction(
    state.assessments,
    selectedStudent.id,
    primarySubject?.id || '',
    primaryTopic?.id || '',
    {
      attendance: studentAtt.find(a => a.subjectId === primarySubject?.id),
      studyHabit: habit,
      engagement: studentEng,
      practice: studentPrac.find(p => p.topicId === primaryTopic?.id),
      useMultiCategoryHeuristic: true
    }
  );

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center overflow-y-auto p-0 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:my-8 sm:rounded-xl shadow-2xl flex flex-col print:shadow-none print:m-0 print:rounded-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print sticky top-0 z-30 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-semibold text-sm">Report Preview: {selectedStudent.name}</span>
              <span className="text-xs text-slate-400 block font-mono">ID: {selectedStudent.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handlePrint}
              title="Prints using system PDF driver"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save as PDF</span>
            </button>
            <button
              onClick={closeReportModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div ref={printAreaRef} className="p-8 sm:p-10 text-slate-900 space-y-6 print:p-0 print:space-y-5">
          
          {/* Header & Title */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-900 block">
                  Student Performance Prediction Platform · Faculty Evaluation
                </span>
                <h1 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
                  STUDENT PERFORMANCE PREDICTION REPORT
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Comprehensive Academic Analytics, Trend Modeling & Evidence-Based Intervention Portfolio
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 font-mono">
                <div>Date: {currentDate}</div>
                <div>Source: <span className="uppercase font-semibold text-slate-700">{state.dataSource} Dataset</span></div>
                <div className="text-[10px] text-slate-400 mt-0.5">B.Tech Computer Science and Engineering · Sem 3 (Sec F)</div>
              </div>
            </div>
          </div>

          {/* Section A: Executive Summary */}
          <div className="print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Section A · Executive Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div>
                <span className="text-[11px] text-slate-500 block">Overall Historical Avg</span>
                <span className="text-xl font-bold text-slate-950 font-mono tabular-nums">
                  {overallMean !== null ? `${overallMean}%` : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Across all completed assessments</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Valid Assessment Records</span>
                <span className="text-xl font-bold text-slate-950 font-mono tabular-nums">
                  {studentAssessments.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{topicSummaries.length} curriculum topics</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Topics Flagged for Review</span>
                <span className={`text-xl font-bold font-mono tabular-nums ${flaggedTopics.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {flaggedTopics.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Cutoff: {state.reviewThreshold}%</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Target Predicted Next Score</span>
                <span className="text-xl font-bold text-purple-700 font-mono tabular-nums">
                  {prediction.estimatedScore !== null ? `${prediction.estimatedScore}%` : 'Unavailable'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 truncate" title={primaryTopic?.name}>
                  {primaryTopic?.name || 'Topic evaluation'}
                </span>
              </div>
            </div>
          </div>

          {/* Section B: Student Details */}
          <div className="print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section B · Student Details
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 bg-white">
                <div className="p-2.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
                  <span className="font-semibold text-slate-900">{selectedStudent.name}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Roll ID</span>
                  <span className="font-mono text-slate-900">{selectedStudent.id}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Academic Program</span>
                  <span className="text-slate-900">{selectedStudent.program}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Semester & Section</span>
                  <span className="text-slate-900">Sem {selectedStudent.semester} (Sec {selectedStudent.section})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Complete Assessment History */}
          <div className="print-avoid-break">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section C · Chronological Assessment History
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {studentAssessments.length} records verified
              </span>
            </div>
            {studentAssessments.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 text-center">
                Zero valid assessment records recorded for this student.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Subject</th>
                      <th className="py-2 px-3">Topic</th>
                      <th className="py-2 px-3">Assessment Name</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3 text-right">Marks</th>
                      <th className="py-2 px-3 text-right font-mono">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {studentAssessments.map(record => {
                      const subject = state.subjects.find(s => s.id === record.subjectId);
                      const topic = state.topics.find(t => t.id === record.topicId);
                      return (
                        <tr key={record.id} className="hover:bg-slate-50/70">
                          <td className="py-1.5 px-3 font-mono text-[11px] text-slate-600">{record.date}</td>
                          <td className="py-1.5 px-3 text-slate-700">{subject?.code || record.subjectId}</td>
                          <td className="py-1.5 px-3 text-slate-800 font-medium">{topic?.name || record.topicId}</td>
                          <td className="py-1.5 px-3 text-slate-900">{record.assessmentName}</td>
                          <td className="py-1.5 px-3 text-slate-600">{record.assessmentType}</td>
                          <td className="py-1.5 px-3 text-right font-mono text-slate-600">
                            {record.obtainedMarks} / {record.maxMarks}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                            {record.percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section D: Statistical Analysis */}
          <div className="print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section D · Statistical Profile & Multi-Category Telemetry
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Mean</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">{overallMean !== null ? `${overallMean}%` : '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Median</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">{overallMedian !== null ? `${overallMedian}%` : '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Lowest Score</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">{lowestScore !== null ? `${lowestScore}%` : '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Highest Score</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">{highestScore !== null ? `${highestScore}%` : '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Latest Score</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">{mostRecentScore !== null ? `${mostRecentScore}%` : '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Valid Attempts</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">{studentAssessments.length}</span>
              </div>
            </div>

            {/* Non-Academic Evidence Details */}
            <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 border border-slate-200 rounded-lg bg-white">
                <span className="font-semibold text-slate-800 block text-[11px]">Category C · Study Habits</span>
                <div className="text-slate-600 mt-1 space-y-0.5 text-[11px]">
                  <div>Hours/Week: <strong className="font-mono text-slate-900">{habit ? `${habit.studyHoursPerWeek} hrs` : 'Not recorded'}</strong></div>
                  <div>Revision: <strong className="text-slate-900">{habit?.revisionFrequency || 'N/A'}</strong></div>
                  <div>Pattern: <strong className="text-slate-900">{habit?.preparationPattern || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-200 rounded-lg bg-white">
                <span className="font-semibold text-slate-800 block text-[11px]">Category D · LMS Engagement</span>
                <div className="text-slate-600 mt-1 space-y-0.5 text-[11px]">
                  <div>Lesson Progress: <strong className="font-mono text-slate-900">{studentEng ? `${studentEng.progressPercentage}%` : 'N/A'}</strong></div>
                  <div>Activities: <strong className="text-slate-900">{studentEng ? `${studentEng.learningActivitiesCompleted}/${studentEng.totalActivities}` : 'N/A'}</strong></div>
                  <div>Measured Time: <strong className="font-mono text-slate-900">{studentEng ? `${studentEng.measuredMinutesSpent} mins` : 'N/A'}</strong></div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-200 rounded-lg bg-white">
                <span className="font-semibold text-slate-800 block text-[11px]">Category E · Attendance</span>
                <div className="text-slate-600 mt-1 space-y-0.5 text-[11px]">
                  {studentAtt.length > 0 ? (
                    studentAtt.map(a => (
                      <div key={a.id}>
                        {a.subjectId}: <strong className="font-mono text-slate-900">{a.attendancePercentage}%</strong> ({a.classesAttended}/{a.totalClassesHeld})
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic">No attendance records supplied</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section E: Prediction & Interpretation */}
          <div className="print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section E · Next-Assessment Performance Prediction Engine
            </h2>
            <div className="border border-purple-200 bg-purple-50/40 rounded-lg p-3.5 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-2.5">
                <div>
                  <span className="text-[11px] text-purple-900 font-semibold block">
                    Prediction Target: {primaryTopic?.name} ({primarySubject?.code})
                  </span>
                  <span className="text-xs text-slate-600">
                    Sufficiency: <strong className="text-slate-900">{prediction.dataSufficiency}</strong> · Method: <strong className="text-slate-900">{prediction.methodUsed}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-purple-800 block">Projected Next Score</span>
                  <span className="text-2xl font-black text-purple-900 font-mono tabular-nums">
                    {prediction.estimatedScore !== null ? `${prediction.estimatedScore}%` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Assessment Momentum & Influence Timeline */}
              {prediction.formulaBreakdown.recencyWeights.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Recent Assessment Momentum & Forecast Influence:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {prediction.formulaBreakdown.recencyWeights.map(w => (
                      <div key={w.attempt} className="bg-white border border-purple-100 rounded p-2 text-[10px]">
                        <div className="text-slate-500 font-medium">Attempt {w.attempt} ({w.date})</div>
                        <div className="text-slate-900 font-bold text-xs mt-0.5">
                          Score: {w.score}%
                        </div>
                        <div className="text-purple-700 text-[10px] font-semibold mt-1">
                          Forecast Influence: {(w.weight * 100).toFixed(0)}%
                        </div>
                        <div className="text-slate-400 text-[9px]">
                          Points contributed: {w.weightedScore.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed step-by-step rationale */}
              <div className="space-y-1 text-slate-700 text-[11px]">
                {prediction.explanation.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">›</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section F: Performance Charts */}
          <div className="print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section F · Visual Analytics & Empirical Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <span className="text-[11px] font-semibold text-slate-800 block mb-2">
                  Chronological Performance Trajectory & Next Score Projection
                </span>
                <ScoreTrendChart 
                  records={studentAssessments} 
                  predictedScore={prediction.estimatedScore} 
                  reviewThreshold={state.reviewThreshold}
                  height={180}
                />
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <span className="text-[11px] font-semibold text-slate-800 block mb-2">
                  Topic Mastery Levels vs {state.reviewThreshold}% Review Cutoff
                </span>
                <TopicBarChart 
                  summaries={topicSummaries} 
                  reviewThreshold={state.reviewThreshold}
                  height={180}
                />
              </div>
            </div>
          </div>

          {/* Section G: Topic Analysis & Recommendations */}
          <div className="print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section G · Topic Review Status & Evidence-Based Prescriptions
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                    <th className="py-2 px-3">Curriculum Topic</th>
                    <th className="py-2 px-2 text-center">Attempts</th>
                    <th className="py-2 px-2 text-right">Average</th>
                    <th className="py-2 px-2 text-center">Status</th>
                    <th className="py-2 px-3">Audit Reason</th>
                    <th className="py-2 px-3">Prescribed Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {topicSummaries.map(summary => (
                    <tr key={summary.topicId} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-medium text-slate-900">{summary.topicName}</td>
                      <td className="py-2 px-2 text-center font-mono">{summary.attemptsCount}</td>
                      <td className="py-2 px-2 text-right font-mono font-bold">
                        {summary.averagePercentage !== null ? `${summary.averagePercentage}%` : '-'}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          summary.status === 'On track' ? 'bg-emerald-100 text-emerald-800' :
                          summary.status === 'Developing' ? 'bg-amber-100 text-amber-800' :
                          summary.status === 'Needs attention' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {summary.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] max-w-[200px] leading-tight">
                        {summary.reason}
                      </td>
                      <td className="py-2 px-3 text-slate-800 text-[11px] leading-tight font-medium">
                        {summary.recommendedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section H: Methodological Disclosures & Limitations */}
          <div className="print-avoid-break border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block uppercase text-[10px]">
              Section H · Methodological Disclosures & Limitations
            </span>
            <p>
              1. <strong>Deterministic Baseline Model:</strong> Predictions are computed dynamically using a linear recency-weighted baseline (W_i = 2i / [n(n+1)]) paired with least-squares trend slope adjustment capped at &plusmn;7.5%.
            </p>
            <p>
              2. <strong>Predictive Boundary:</strong> Score estimates represent projected performance on subsequent assessments assuming parity in rubric difficulty and evaluation rigor. They do not constitute guaranteed final university examination results.
            </p>
            <p>
              3. <strong>Data Sufficiency:</strong> Topics with fewer than two recorded assessments reflect preliminary baselines without trend regression. Missing optional categories are held neutral without penalty.
            </p>
          </div>

          {/* Report Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Student Performance Prediction Platform · Faculty Evaluation Copy</span>
            <span>Generated: {currentDate} · Page 1 of 1</span>
          </div>

        </div>

      </div>
    </div>
  );
};
