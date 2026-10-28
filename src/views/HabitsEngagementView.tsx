import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyHabit, AttendanceRecord, EngagementRecord, PracticeQuizActivity } from '../types';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Activity, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  Save,
  HelpCircle
} from 'lucide-react';

export const HabitsEngagementView: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    openReportModal,
    updateStudyHabit
  } = useApp();

  const [editHabit, setEditHabit] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Student specific records
  const habit = state.studyHabits.find(h => h.studentId === selectedStudent?.id);
  const attendanceList = state.attendanceRecords.filter(a => a.studentId === selectedStudent?.id);
  const engagement = state.engagementRecords.find(e => e.studentId === selectedStudent?.id);
  const practiceList = state.practiceActivities.filter(p => p.studentId === selectedStudent?.id);

  // Form state for editing study habit
  const [habitForm, setHabitForm] = useState<{
    studyHoursPerWeek: number;
    revisionFrequency: StudyHabit['revisionFrequency'];
    practiceFrequency: StudyHabit['practiceFrequency'];
    preparationPattern: StudyHabit['preparationPattern'];
  }>({
    studyHoursPerWeek: habit?.studyHoursPerWeek || 8,
    revisionFrequency: habit?.revisionFrequency || '3-4 times/week',
    practiceFrequency: habit?.practiceFrequency || 'Moderate',
    preparationPattern: habit?.preparationPattern || 'Regular distributed'
  });

  const handleSaveHabit = () => {
    if (!selectedStudent) return;
    const updatedRecord: StudyHabit = {
      id: habit?.id || `HABIT-${Date.now()}`,
      studentId: selectedStudent.id,
      studyHoursPerWeek: habitForm.studyHoursPerWeek,
      revisionFrequency: habitForm.revisionFrequency,
      practiceFrequency: habitForm.practiceFrequency,
      preparationPattern: habitForm.preparationPattern,
      notes: habit?.notes,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    updateStudyHabit(updatedRecord);
    setEditHabit(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Study Habits & Learning Engagement</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit non-academic educational factors (Categories B, C, D & E) supporting longitudinal performance analysis.
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

      {/* Student Picker Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Select Enrolled Student:</span>
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
        <span className="text-slate-400 font-mono text-[11px]">
          Multi-Category Telemetry Framework
        </span>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category C: Study Habits (Self-Reported) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <h2 className="text-sm font-bold text-slate-900">Category C · Self-Reported Study Habits</h2>
            </div>
            <button
              onClick={() => {
                if (editHabit) handleSaveHabit();
                else setEditHabit(true);
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer flex items-center gap-1"
            >
              {editHabit ? <Save className="w-3.5 h-3.5" /> : null}
              <span>{editHabit ? 'Save Changes' : 'Edit Habits'}</span>
            </button>
          </div>

          <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-[11px] text-blue-900">
            <strong>Disclosure: </strong>Self-reported student declarations. Elevated study hours do not automatically guarantee mastery without effective distribution.
          </div>

          {saveSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Study habit observations updated successfully.</span>
            </div>
          )}

          {editHabit ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dedicated Weekly Study Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={habitForm.studyHoursPerWeek}
                  onChange={e => setHabitForm({ ...habitForm, studyHoursPerWeek: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Revision Cadence
                </label>
                <select
                  value={habitForm.revisionFrequency}
                  onChange={e => setHabitForm({ ...habitForm, revisionFrequency: e.target.value as StudyHabit['revisionFrequency'] })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                >
                  <option value="Daily">Daily regular sessions</option>
                  <option value="3-4 times/week">3–4 times per week</option>
                  <option value="Weekly">Weekly consolidated review</option>
                  <option value="Before Exams">Before Exams (Cramming)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Practice Frequency
                </label>
                <select
                  value={habitForm.practiceFrequency}
                  onChange={e => setHabitForm({ ...habitForm, practiceFrequency: e.target.value as StudyHabit['practiceFrequency'] })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                >
                  <option value="High">High (Daily coding/problems)</option>
                  <option value="Moderate">Moderate (Assigned exercises only)</option>
                  <option value="Low">Low (Infrequent problem sets)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preparation Pattern
                </label>
                <select
                  value={habitForm.preparationPattern}
                  onChange={e => setHabitForm({ ...habitForm, preparationPattern: e.target.value as StudyHabit['preparationPattern'] })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                >
                  <option value="Regular distributed">Regular distributed learning</option>
                  <option value="Self-paced">Self-paced independent</option>
                  <option value="Group study">Peer collaboration / Group study</option>
                  <option value="Cramming">Massed practice / Cramming</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Self-Reported Study</span>
                <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {habit ? `${habit.studyHoursPerWeek} hrs/week` : 'Not recorded'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Revision Cadence</span>
                <span className="text-sm font-bold text-slate-900">
                  {habit?.revisionFrequency || 'Not recorded'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Practice Frequency</span>
                <span className="text-sm font-bold text-slate-900">
                  {habit?.practiceFrequency || 'Not recorded'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Preparation Pattern</span>
                <span className="text-sm font-bold text-slate-900">
                  {habit?.preparationPattern || 'Not recorded'}
                </span>
              </div>
              {habit?.notes && (
                <div className="col-span-2 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                    Student's Self-Reported Academic Note
                  </span>
                  <p className="text-slate-700 italic">"{habit.notes}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category E: Lecture Attendance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">Category E · Institutional Attendance</h2>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <strong>Statutory Rule: </strong>Minimum required attendance is 75.0%. Scores below threshold trigger institutional warnings. Missing records are not treated as absence.
          </div>

          <div className="space-y-2.5">
            {attendanceList.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 text-center text-slate-400 text-xs rounded-lg">
                No attendance logs found for this student.
              </div>
            ) : (
              attendanceList.map(att => {
                const sub = state.subjects.find(s => s.id === att.subjectId);
                const isCompliant = att.attendancePercentage >= 75;

                return (
                  <div key={att.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{sub?.name || att.subjectId} ({sub?.code})</span>
                      <span className={`font-mono text-sm font-bold ${isCompliant ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {att.attendancePercentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Classes Attended: {att.classesAttended} / {att.totalClassesHeld}</span>
                      <span className={isCompliant ? 'text-emerald-700' : 'text-rose-600 font-semibold'}>
                        {isCompliant ? 'Compliant (≥ 75%)' : 'Attendance Risk (< 75%)'}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${isCompliant ? 'bg-emerald-600' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, att.attendancePercentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category D: Learning Engagement (LMS) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm font-bold text-slate-900">Category D · LMS Learning Engagement</h2>
          </div>

          <p className="text-xs text-slate-500">
            Directly observed telemetry from the course portal. Opening resources is never conflated with genuine comprehension.
          </p>

          {engagement ? (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Module Lessons Completed</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {engagement.lessonsCompleted} <span className="text-xs text-slate-400">/ {engagement.totalLessons}</span>
                </span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                  {engagement.progressPercentage}% completed
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Interactive Activities</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {engagement.learningActivitiesCompleted} <span className="text-xs text-slate-400">/ {engagement.totalActivities}</span>
                </span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                  Lab checkpoints
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Resources Accessed</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {engagement.resourcesAccessedCount}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Readings & notebooks
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Measured Active Minutes</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {engagement.measuredMinutesSpent} <span className="text-xs text-slate-400">min</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  {(engagement.measuredMinutesSpent / 60).toFixed(1)} hours total
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
              No LMS engagement records recorded.
            </div>
          )}
        </div>

        {/* Category B: Practice & Quiz Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-700" />
            <h2 className="text-sm font-bold text-slate-900">Category B · Practice & Repeated Attempts</h2>
          </div>

          <p className="text-xs text-slate-500">
            Voluntary practice problem sets, test re-attempts, and drill question accuracies.
          </p>

          <div className="space-y-2.5">
            {practiceList.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                No supplemental practice drills recorded for this student.
              </div>
            ) : (
              practiceList.map(pr => {
                const topic = state.topics.find(t => t.id === pr.topicId);
                return (
                  <div key={pr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{topic?.name || pr.topicId}</span>
                      <span className="font-mono text-indigo-700 font-bold">{pr.accuracyPercentage}% Accuracy</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Quizzes Completed: {pr.quizzesCompleted} / {pr.quizzesAttempted}</span>
                      <span>Questions: {pr.correctAnswers} / {pr.totalQuestions}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Repeated attempts on practice bank: {pr.repeatAttemptsCount}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
