import React from 'react';
import { useApp } from '../context/AppContext';
import { summarizeTopicPerformance } from '../utils/calculations';
import { TopicBarChart } from '../components/charts/TopicBarChart';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  Printer, 
  TrendingDown, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const TopicAnalysisView: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    setReviewThreshold, 
    openReportModal 
  } = useApp();

  const summaries = state.topics.map(topic => {
    const subject = state.subjects.find(s => s.id === topic.subjectId);
    return summarizeTopicPerformance(
      topic,
      subject?.name || topic.subjectId,
      state.assessments,
      selectedStudent?.id || '',
      state.reviewThreshold,
      state.topics
    );
  });

  const needsAttention = summaries.filter(s => s.status === 'Needs attention');
  const developing = summaries.filter(s => s.status === 'Developing');
  const onTrack = summaries.filter(s => s.status === 'On track');
  const insufficientData = summaries.filter(s => s.status === 'Insufficient data');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Topic Risk Analysis & Mastery</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configurable academic risk detection, prerequisite gap flags, and mastery evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openReportModal(selectedStudent?.id)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-blue-200" />
            <span>Generate Performance Report</span>
          </button>
        </div>
      </div>

      {/* Threshold Configurator & Student Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Student picker */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-semibold text-slate-700 whitespace-nowrap">Evaluated Student:</span>
          <select
            value={state.selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-900 focus:outline-none"
          >
            {state.students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>

        {/* Configurable Threshold Slider */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Sliders className="w-4 h-4 text-blue-800" />
            <span>Review Cutoff Threshold:</span>
          </div>
          
          <input
            type="range"
            min="40"
            max="80"
            step="5"
            value={state.reviewThreshold}
            onChange={e => setReviewThreshold(Number(e.target.value))}
            className="w-32 accent-blue-900 cursor-pointer"
          />

          <span className="font-mono font-bold text-sm text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {state.reviewThreshold}%
          </span>
          <span className="text-[11px] text-slate-400">
            (Developing: {state.reviewThreshold}%–{state.reviewThreshold + 15}%)
          </span>
        </div>

      </div>

      {/* Status Summary Banner Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium text-rose-800">Needs Attention</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-2 font-mono tabular-nums">
            {needsAttention.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Average &lt; {state.reviewThreshold}%</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium text-amber-800">Developing</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 font-mono tabular-nums">
            {developing.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{state.reviewThreshold}% to {state.reviewThreshold + 15}%</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium text-emerald-800">On Track / Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
            {onTrack.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Average &ge; {state.reviewThreshold + 15}%</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium text-slate-700">Insufficient Data</span>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-600 mt-2 font-mono tabular-nums">
            {insufficientData.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">0 completed attempts</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-1">
          Topic Performance vs Configured Cutoff ({state.reviewThreshold}%)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Calculated averages per curriculum topic for {selectedStudent?.name}.
        </p>

        <TopicBarChart 
          summaries={summaries}
          reviewThreshold={state.reviewThreshold}
          height={240}
        />
      </div>

      {/* Granular Topic Status Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Granular Topic Audit & Remediation Prescriptions
          </h3>
          <span className="text-xs text-slate-500">
            Student: <strong className="text-slate-800">{selectedStudent?.name}</strong>
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
              <th className="py-3 px-4">Curriculum Topic</th>
              <th className="py-3 px-3">Subject</th>
              <th className="py-3 px-2 text-center">Attempts</th>
              <th className="py-3 px-3 text-right font-mono">Average</th>
              <th className="py-3 px-2 text-center">Trend</th>
              <th className="py-3 px-3 text-center">Risk Status</th>
              <th className="py-3 px-4">Audit Rationale</th>
              <th className="py-3 px-4">Recommended Remediation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {summaries.map(summary => {
              let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
              if (summary.status === 'On track') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              if (summary.status === 'Developing') badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              if (summary.status === 'Needs attention') badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';

              return (
                <tr key={summary.topicId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{summary.topicName}</td>
                  <td className="py-3 px-3 text-slate-600">{summary.subjectName}</td>
                  <td className="py-3 px-2 text-center font-mono">{summary.attemptsCount}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {summary.averagePercentage !== null ? `${summary.averagePercentage}%` : '-'}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {summary.trend === 'improving' && (
                      <span className="text-emerald-600 font-semibold text-[10px] flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> Up
                      </span>
                    )}
                    {summary.trend === 'declining' && (
                      <span className="text-rose-600 font-semibold text-[10px] flex items-center justify-center gap-0.5">
                        <TrendingDown className="w-3 h-3" /> Down
                      </span>
                    )}
                    {summary.trend === 'stable' && (
                      <span className="text-slate-500 font-medium text-[10px]">Stable</span>
                    )}
                    {summary.trend === 'insufficient' && (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badgeColor}`}>
                      {summary.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-[11px] max-w-xs leading-snug">
                    {summary.reason}
                    {summary.unmasteredPrerequisites.length > 0 && (
                      <div className="text-rose-700 font-medium mt-0.5 text-[10px]">
                        Unmet Prereqs: {summary.unmasteredPrerequisites.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-900 text-[11px] max-w-xs leading-snug font-medium">
                    {summary.recommendedAction}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
