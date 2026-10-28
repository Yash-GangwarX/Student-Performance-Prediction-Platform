import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculatePerformancePrediction } from '../utils/calculations';
import { ScoreTrendChart } from '../components/charts/ScoreTrendChart';
import { 
  TrendingUp, 
  Printer, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export const PredictionView: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    openReportModal 
  } = useApp();

  const [targetSubjectId, setTargetSubjectId] = useState<string>(state.subjects[0]?.id || '');
  const [targetTopicId, setTargetTopicId] = useState<string>(
    state.topics.find(t => t.subjectId === state.subjects[0]?.id)?.id || state.topics[0]?.id || ''
  );
  const [includeMultiCategory, setIncludeMultiCategory] = useState<boolean>(true);

  // Available topics for chosen subject
  const availableTopics = state.topics.filter(t => t.subjectId === targetSubjectId);

  // Fetch optional factors for the selected student
  const studentAtt = state.attendanceRecords.find(
    a => a.studentId === selectedStudent?.id && a.subjectId === targetSubjectId
  );
  const habit = state.studyHabits.find(h => h.studentId === selectedStudent?.id);
  const engagement = state.engagementRecords.find(e => e.studentId === selectedStudent?.id);
  const practice = state.practiceActivities.find(
    p => p.studentId === selectedStudent?.id && p.topicId === targetTopicId
  );

  // Compute live prediction
  const prediction = calculatePerformancePrediction(
    state.assessments,
    selectedStudent?.id || '',
    targetSubjectId,
    targetTopicId,
    {
      attendance: studentAtt,
      studyHabit: habit,
      engagement,
      practice,
      useMultiCategoryHeuristic: includeMultiCategory
    }
  );

  // Target topic object
  const currentTopic = state.topics.find(t => t.id === targetTopicId);
  const currentSubject = state.subjects.find(s => s.id === targetSubjectId);

  // Topic specific assessments for chart
  const topicAssessments = state.assessments.filter(
    a => a.studentId === selectedStudent?.id && a.topicId === targetTopicId && a.status === 'completed'
  );

  const handleSubjectChange = (newSubId: string) => {
    setTargetSubjectId(newSubId);
    const subTopics = state.topics.filter(t => t.subjectId === newSubId);
    if (subTopics.length > 0) {
      setTargetTopicId(subTopics[0].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance Prediction Engine</h1>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic, explainable next-assessment score forecasting grounded in chronological weighting and empirical evidence.
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

      {/* Interactive Prediction Configuration Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-700" />
            Target Assessment Scope
          </span>
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMultiCategory}
              onChange={e => setIncludeMultiCategory(e.target.checked)}
              className="rounded text-blue-900 focus:ring-0"
            />
            <span>Include Multi-Category Heuristic Telemetry (Attendance, LMS, Habits)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Student Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Student</label>
            <select
              value={state.selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-900 focus:outline-none"
            >
              {state.students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Curriculum Subject</label>
            <select
              value={targetSubjectId}
              onChange={e => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-900 focus:outline-none"
            >
              {state.subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Topic Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Academic Topic</label>
            <select
              value={targetTopicId}
              onChange={e => setTargetTopicId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-900 focus:outline-none"
            >
              {availableTopics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Prediction Output Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Mathematical & Methodological Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Big Prediction Card */}
          <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                  Projected Next Assessment Score
                </span>
                <div className="text-3xl font-black text-slate-950 mt-1 font-mono tabular-nums flex items-baseline gap-2">
                  {prediction.estimatedScore !== null ? (
                    <>
                      <span>{prediction.estimatedScore}%</span>
                      <span className="text-xs font-normal text-slate-500 font-sans">estimated percentage</span>
                    </>
                  ) : (
                    <span className="text-xl text-slate-400 font-sans font-semibold">
                      Prediction Unavailable — Insufficient Data
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Scope: <strong className="text-slate-800">{currentTopic?.name}</strong> in {currentSubject?.name}
                </div>
              </div>

              {/* Data Sufficiency Badge */}
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Evidence Sufficiency</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  prediction.dataSufficiency === 'Sufficient chronological records' ? 'bg-emerald-100 text-emerald-800' :
                  prediction.dataSufficiency === 'Limited historical evidence' ? 'bg-blue-100 text-blue-800' :
                  prediction.dataSufficiency === 'Preliminary estimate' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  <Info className="w-3.5 h-3.5" />
                  <span>{prediction.dataSufficiency}</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                  {prediction.attemptsUsed} historical attempt{prediction.attemptsUsed === 1 ? '' : 's'} used
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Historical Average</span>
                <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                  {prediction.historicalAverage !== null ? `${prediction.historicalAverage}%` : '-'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Most Recent Score</span>
                <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                  {prediction.mostRecentScore !== null ? `${prediction.mostRecentScore}%` : '-'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Trend Direction</span>
                <span className={`font-bold font-mono text-sm capitalize ${
                  prediction.trendDirection === 'improving' ? 'text-emerald-700' :
                  prediction.trendDirection === 'declining' ? 'text-rose-600' :
                  'text-slate-800'
                }`}>
                  {prediction.trendDirection}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Trend Slope (Δ/test)</span>
                <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                  {prediction.trendSlope !== null ? `${prediction.trendSlope > 0 ? '+' : ''}${prediction.trendSlope}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Assessment Momentum & Weighting Showcase */}
          {prediction.formulaBreakdown.recencyWeights.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Recent Assessment Momentum & Influence Timeline</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recent evaluation scores carry greater influence in the prediction because they reflect the scholar's most recent conceptual recovery and practice drills.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-purple-800 font-semibold bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg shrink-0">
                  Weighted Baseline: <strong className="text-purple-950 font-bold">{prediction.formulaBreakdown.baselineWeightedScore}%</strong>
                </span>
              </div>

              {/* Visual Assessment Cards Timeline */}
              <div className="space-y-2.5">
                {prediction.formulaBreakdown.recencyWeights.map((w, idx) => {
                  const percentWeight = Math.round(w.weight * 100);
                  const isLatest = idx === prediction.formulaBreakdown.recencyWeights.length - 1;

                  return (
                    <div 
                      key={w.attempt} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        isLatest 
                          ? 'bg-purple-50/60 border-purple-200 shadow-2xs' 
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {w.assessmentName}
                            </span>
                            {isLatest && (
                              <span className="text-[10px] font-mono font-bold uppercase bg-purple-200 text-purple-900 px-2 py-0.2 rounded-full">
                                Most Recent Attempt
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Attempt #{w.attempt} recorded on {w.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right sm:text-right">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-medium">Recorded Score</span>
                            <span className="font-mono font-extrabold text-slate-900 text-base">
                              {w.score}%
                            </span>
                          </div>
                          <div className="w-28 text-left">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-slate-500 font-medium">Forecast Weight</span>
                              <span className="font-mono font-bold text-purple-700">{percentWeight}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${isLatest ? 'bg-purple-600' : 'bg-blue-600'}`}
                                style={{ width: `${percentWeight * 1.5}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Weighted average synthesized smoothly from chronological records.</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Total Weight: 100%
                </span>
              </div>
            </div>
          )}

          {/* Traceable Contributing Evidence & Explanations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Key Predictive Drivers & Contributing Evidence</span>
            </h3>
            
            <div className="space-y-2 text-xs">
              {prediction.explanation.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>

            {includeMultiCategory && prediction.formulaBreakdown.multiCategoryRationale.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-700 text-xs block mb-2">
                  Academic & Behavioral Adjustments Applied:
                </span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {prediction.formulaBreakdown.multiCategoryRationale.map((rat, i) => (
                    <li key={i}>{rat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Topic Trajectory Chart & Limitations */}
        <div className="space-y-6">
          
          {/* Chart card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Topic Score Trajectory
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Chronological attempts for {currentTopic?.name} with projected next score.
            </p>

            <ScoreTrendChart 
              records={topicAssessments}
              predictedScore={prediction.estimatedScore}
              reviewThreshold={state.reviewThreshold}
              height={200}
            />
          </div>

          {/* Methodological Transparency & Limitations */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Model Scope & Scientific Boundaries</span>
            </div>

            <div className="text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Method: </strong>{prediction.methodUsed}.
              </p>
              <p>
                <strong>Non-Guarantee Disclosure: </strong>The estimated score is a diagnostic projection based strictly on recorded coursework trends. It does not promise university final exam marks.
              </p>
              <p>
                <strong>Extraneous Invariants: </strong>Assumes evaluation difficulty and rubric strictness remain stationary.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Data Categories Consulted:</span>
              <div className="flex flex-wrap gap-1.5">
                {prediction.categoriesUsed.map(c => (
                  <span key={c} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
