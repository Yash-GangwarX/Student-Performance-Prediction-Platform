import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AssessmentRecord, AssessmentType, AssessmentStatus } from '../types';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  AlertCircle, 
  Check, 
  X,
  Printer,
  HelpCircle,
  PlayCircle
} from 'lucide-react';

interface AssessmentsViewProps {
  onNavigate?: (view: string, topicId?: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ onNavigate }) => {
  const { 
    state, 
    addAssessment, 
    updateAssessment, 
    deleteAssessment, 
    openReportModal,
    setSelectedStudentId 
  } = useApp();

  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Assessment Modal state (Defaulting to Assignment/Midterm for manual mark entry)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Omit<AssessmentRecord, 'id' | 'percentage'> & { id?: string }>({
    studentId: state.selectedStudentId || state.students[0]?.id || '',
    subjectId: state.subjects[0]?.id || '',
    topicId: state.topics[0]?.id || '',
    assessmentName: '',
    assessmentType: 'Assignment',
    date: new Date().toISOString().slice(0, 10),
    obtainedMarks: 40,
    maxMarks: 50,
    attemptNumber: 1,
    status: 'completed'
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTopicsForSubject = state.topics.filter(
    t => !formData.subjectId || t.subjectId === formData.subjectId
  );

  const filteredAssessments = state.assessments.filter(a => {
    if (studentFilter !== 'all' && a.studentId !== studentFilter) return false;
    if (subjectFilter !== 'all' && a.subjectId !== subjectFilter) return false;
    if (typeFilter !== 'all' && a.assessmentType !== typeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const student = state.students.find(s => s.id === a.studentId);
      const topic = state.topics.find(t => t.id === a.topicId);
      return (
        a.assessmentName.toLowerCase().includes(term) ||
        (student && student.name.toLowerCase().includes(term)) ||
        (topic && topic.name.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setModalMode('create');
    const defaultStudent = state.selectedStudentId || state.students[0]?.id || '';
    const defaultSubject = state.subjects[0]?.id || '';
    const relevantTopics = state.topics.filter(t => t.subjectId === defaultSubject);

    setFormData({
      studentId: defaultStudent,
      subjectId: defaultSubject,
      topicId: relevantTopics[0]?.id || state.topics[0]?.id || '',
      assessmentName: '',
      assessmentType: 'Assignment',
      date: new Date().toISOString().slice(0, 10),
      obtainedMarks: 40,
      maxMarks: 50,
      attemptNumber: 1,
      status: 'completed'
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: AssessmentRecord) => {
    setModalMode('edit');
    setFormData({
      id: record.id,
      studentId: record.studentId,
      subjectId: record.subjectId,
      topicId: record.topicId,
      assessmentName: record.assessmentName,
      assessmentType: record.assessmentType,
      date: record.date,
      obtainedMarks: record.obtainedMarks,
      maxMarks: record.maxMarks,
      attemptNumber: record.attemptNumber,
      status: record.status
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubjectChange = (newSubId: string) => {
    const relevantTopics = state.topics.filter(t => t.subjectId === newSubId);
    setFormData(prev => ({
      ...prev,
      subjectId: newSubId,
      topicId: relevantTopics[0]?.id || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // If type is quiz, manual addition is disabled
    if (formData.assessmentType === 'Quiz' && modalMode === 'create') {
      setFormError('Manual mark entry is disabled for Quizzes. Please take the interactive 20-Question Topic Quiz instead.');
      return;
    }

    if (!formData.assessmentName.trim()) {
      setFormError('Assessment title is required.');
      return;
    }
    if (formData.maxMarks <= 0) {
      setFormError('Maximum marks must be greater than zero.');
      return;
    }
    if (formData.obtainedMarks < 0) {
      setFormError('Obtained marks cannot be negative.');
      return;
    }
    if (formData.obtainedMarks > formData.maxMarks) {
      setFormError(`Obtained marks (${formData.obtainedMarks}) cannot exceed maximum marks (${formData.maxMarks}).`);
      return;
    }

    if (modalMode === 'create') {
      const res = addAssessment(formData);
      if (!res.success) {
        setFormError(res.error || 'Failed to add assessment');
        return;
      }
    } else if (formData.id) {
      const res = updateAssessment({
        ...formData,
        id: formData.id,
        percentage: Number(((formData.obtainedMarks / formData.maxMarks) * 100).toFixed(2))
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update assessment');
        return;
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Assessments & Marks Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manual entry for Assignments & Midterms; Quizzes are automatically graded via 20-question topic assessments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Launch Topic Quiz Button */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-blue-700" />
              <span>Take Topic Quiz (20 Qs)</span>
            </button>
          )}

          <button
            onClick={() => openReportModal(state.selectedStudentId)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Generate Performance Report</span>
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Assignment / Midterm Marks</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assessment, student..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Student Filter */}
          <select
            value={studentFilter}
            onChange={e => setStudentFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Students</option>
            {state.students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {state.subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Quiz">Quizzes (Auto-Scored)</option>
            <option value="Assignment">Assignments (Manual)</option>
            <option value="Midterm">Midterms (Manual)</option>
            <option value="Final">Finals</option>
            <option value="Lab">Labs</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px] ml-1">
            {filteredAssessments.length} records
          </span>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-3">Student</th>
              <th className="py-3 px-3">Assessment Title</th>
              <th className="py-3 px-3">Subject & Topic</th>
              <th className="py-3 px-2 text-center">Type</th>
              <th className="py-3 px-2 text-center">Att #</th>
              <th className="py-3 px-3 text-right font-mono">Raw Marks</th>
              <th className="py-3 px-3 text-right font-mono">Percentage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssessments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                  No assessment records match the active filters
                </td>
              </tr>
            ) : (
              filteredAssessments.map(record => {
                const student = state.students.find(s => s.id === record.studentId);
                const subject = state.subjects.find(s => s.id === record.subjectId);
                const topic = state.topics.find(t => t.id === record.topicId);

                return (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{record.date}</td>
                    <td className="py-3 px-3">
                      <span 
                        onClick={() => setSelectedStudentId(record.studentId)}
                        className="font-semibold text-slate-900 hover:text-blue-900 cursor-pointer"
                      >
                        {student?.name || record.studentId}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">{record.studentId}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">{record.assessmentName}</td>
                    <td className="py-3 px-3">
                      <span className="text-slate-900 block font-medium">{topic?.name || record.topicId}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{subject?.code || record.subjectId}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        record.assessmentType === 'Quiz' 
                          ? 'bg-blue-50 text-blue-800 border-blue-200' 
                          : record.assessmentType === 'Midterm' 
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {record.assessmentType}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-600">
                      {record.attemptNumber}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {record.obtainedMarks} / {record.maxMarks}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {record.status === 'completed' ? (
                        <span className={record.percentage < state.reviewThreshold ? 'text-rose-600' : 'text-slate-900'}>
                          {record.percentage}%
                        </span>
                      ) : (
                        <span className="text-slate-400 italic font-sans text-[10px]">
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(record)}
                          title="Edit Assessment"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(record.id)}
                          title="Delete Assessment"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="font-semibold text-sm">
                {modalMode === 'create' ? 'Record Assessment Marks' : 'Edit Assessment Record'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Student Picker */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enrolled Student *
                </label>
                <select
                  required
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                >
                  {state.students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              {/* Subject & Topic Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={e => handleSubjectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  >
                    {state.subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Topic *
                  </label>
                  <select
                    required
                    value={formData.topicId}
                    onChange={e => setFormData({ ...formData, topicId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  >
                    {filteredTopicsForSubject.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assessment Title & Type */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assessment Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assessmentName}
                    onChange={e => setFormData({ ...formData, assessmentName: e.target.value })}
                    placeholder="e.g. Midterm 1 - Linear Models"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Evaluation Type
                  </label>
                  <select
                    value={formData.assessmentType}
                    onChange={e => setFormData({ ...formData, assessmentType: e.target.value as AssessmentType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  >
                    <option value="Assignment">Assignment (Manual)</option>
                    <option value="Midterm">Midterm (Manual)</option>
                    <option value="Final">Final (Manual)</option>
                    <option value="Lab">Lab (Manual)</option>
                    <option value="Quiz">Quiz (Auto 20-Q)</option>
                  </select>
                </div>
              </div>

              {/* If user chooses Quiz in manual creation modal, show warning & direct link */}
              {formData.assessmentType === 'Quiz' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Interactive Auto-Graded Quiz Module</strong>
                      <span>
                        Manual score entry is disabled for Quizzes. Quizzes are completed through 20-question assessments that calculate marks automatically based on student answers.
                      </span>
                    </div>
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        onNavigate('quiz', formData.topicId);
                      }}
                      className="px-3 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Launch 20-Question Topic Quiz Now</span>
                    </button>
                  )}
                </div>
              )}

              {/* Date, Attempt Number & Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assessment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Attempt Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.attemptNumber}
                    onChange={e => setFormData({ ...formData, attemptNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Completion Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as AssessmentStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  >
                    <option value="completed">Completed</option>
                    <option value="unattempted">Unattempted</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>

              {/* Marks & Live Percentage Validation (Manual Entry for Assignment / Midterm) */}
              {formData.assessmentType !== 'Quiz' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Obtained Marks (Manual) *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        required
                        value={formData.obtainedMarks}
                        onChange={e => setFormData({ ...formData, obtainedMarks: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Maximum Marks *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        required
                        value={formData.maxMarks}
                        onChange={e => setFormData({ ...formData, maxMarks: parseFloat(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Calculated Percentage:</span>
                    <span className="font-mono font-bold text-sm text-blue-900">
                      {formData.maxMarks > 0 
                        ? `${((formData.obtainedMarks / formData.maxMarks) * 100).toFixed(2)}%`
                        : '0.00%'}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                {formData.assessmentType !== 'Quiz' && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
                  >
                    {modalMode === 'create' ? 'Record Marks' : 'Save Changes'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">Delete Assessment Record</h3>
            </div>
            <p className="text-slate-600">
              Are you sure you want to delete this assessment record? Historical averages and trend estimates will recalculate immediately.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAssessment(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
