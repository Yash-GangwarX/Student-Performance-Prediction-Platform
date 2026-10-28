import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Printer, 
  Filter, 
  HelpCircle, 
  Lightbulb, 
  AlertCircle,
  Tag
} from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    studentRecommendations, 
    toggleRecommendation, 
    openReportModal,
    setSelectedStudentId 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  const filteredRecommendations = studentRecommendations.filter(rec => {
    if (categoryFilter !== 'all' && rec.category !== categoryFilter) return false;
    if (!showCompleted && rec.isCompleted) return false;
    return true;
  });

  const completedCount = studentRecommendations.filter(r => r.isCompleted).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prescriptive Study Recommendations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic, evidence-based academic interventions derived directly from topic deficits and prerequisite dependencies.
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

      {/* Filter and Student Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Student Picker */}
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Prerequisite Review">Prerequisite Review</option>
              <option value="Concept Revision">Concept Revision</option>
              <option value="Practice Reinforcement">Practice Reinforcement</option>
              <option value="Data Collection">Data Collection</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={e => setShowCompleted(e.target.checked)}
              className="rounded text-blue-900 focus:ring-0"
            />
            <span>Show Completed</span>
          </label>

          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Completed: {completedCount} / {studentRecommendations.length}
          </span>
        </div>

      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-3.5">
        {filteredRecommendations.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500 text-xs space-y-1">
            <Lightbulb className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <div className="font-semibold text-slate-700">No active recommendations for current filters</div>
            <p className="text-slate-400">All topic performance indicators are satisfied or completed.</p>
          </div>
        ) : (
          filteredRecommendations.map(rec => {
            const subject = state.subjects.find(s => s.id === rec.subjectId);
            const topic = state.topics.find(t => t.id === rec.topicId);

            return (
              <div 
                key={rec.id}
                className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
                  rec.isCompleted 
                    ? 'border-slate-200 opacity-60 bg-slate-50/50' 
                    : rec.priority === 'High' 
                      ? 'border-rose-200 hover:border-rose-300' 
                      : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleRecommendation(rec.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-900 cursor-pointer transition-colors"
                      title={rec.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {rec.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-bold ${rec.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {rec.title}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          rec.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                          rec.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {rec.priority} Priority
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          · {rec.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium">
                        <strong>Prescribed Action: </strong>{rec.recommendedAction}
                      </p>

                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div><strong>Remediation Reason: </strong>{rec.reason}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          <strong>Supporting Audit Rule: </strong>{rec.supportingRuleOrData}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs shrink-0 hidden sm:block">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Related Area</span>
                    <span className="font-semibold text-slate-800">{topic?.name || rec.topicId}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{subject?.code || rec.subjectId}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
