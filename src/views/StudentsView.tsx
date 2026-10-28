import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { calculateMean } from '../utils/calculations';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Printer, 
  AlertCircle, 
  Check, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { 
    state, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    setSelectedStudentId, 
    openReportModal 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  
  // Student Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Student>({
    id: '',
    name: '',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const filteredStudents = state.students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSection = sectionFilter === 'all' || student.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      id: `NIET-2026-00${state.students.length + 1}`,
      name: '',
      program: 'B.Tech Computer Science and Engineering',
      semester: 3,
      section: 'F',
      enrollmentDate: new Date().toISOString().slice(0, 10),
      email: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setModalMode('edit');
    setFormData({ ...student });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Student name is required.');
      return;
    }
    if (!formData.id.trim()) {
      setFormError('Unique Student ID is required.');
      return;
    }

    if (modalMode === 'create') {
      const res = addStudent(formData);
      if (!res.success) {
        setFormError(res.error || 'Failed to add student');
        return;
      }
    } else {
      const res = updateStudent(formData);
      if (!res.success) {
        setFormError(res.error || 'Failed to update student');
        return;
      }
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain enrolled student profiles, academic enrollment info, and assessment links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-600 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 font-medium">Filter Section:</span>
          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
          <span className="text-slate-400 font-mono text-[11px] ml-2">
            Showing {filteredStudents.length} of {state.students.length} students
          </span>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-3 font-mono">Roll ID</th>
              <th className="py-3 px-3">Programme</th>
              <th className="py-3 px-2 text-center">Semester</th>
              <th className="py-3 px-2 text-center">Sec</th>
              <th className="py-3 px-3 text-right font-mono">Assessments</th>
              <th className="py-3 px-3 text-right font-mono">Mean Score</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                  No students matching your search criteria
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => {
                const sAssessments = state.assessments.filter(
                  a => a.studentId === student.id && a.status === 'completed'
                );
                const scores = sAssessments.map(a => a.percentage);
                const sMean = calculateMean(scores);
                const isSelected = state.selectedStudentId === student.id;

                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70 font-medium' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      {student.email && (
                        <div className="text-[11px] text-slate-400 font-normal">{student.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{student.id}</td>
                    <td className="py-3 px-3 text-slate-700">{student.program}</td>
                    <td className="py-3 px-2 text-center font-mono">Sem {student.semester}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-700">{student.section}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {sAssessments.length}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {sMean !== null ? `${sMean}%` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openReportModal(student.id)}
                          title="Generate Performance Report"
                          className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          title="Edit Student Details"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(student)}
                          title="Delete Student"
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

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="font-semibold text-sm">
                {modalMode === 'create' ? 'Add New Student Record' : `Edit Student: ${formData.name}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unique Student ID (Roll No) *
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'edit'}
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. NIET-2026-009"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-blue-600 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aditya Verma"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Section
                  </label>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Degree Programme
                </label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={e => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institutional Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.edu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
                >
                  {modalMode === 'create' ? 'Add Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Prevents silent deletion) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Student Deletion</h3>
                <span className="text-slate-500">This action requires explicit confirmation.</span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-slate-700 space-y-1">
              <p>
                Are you sure you want to delete student <strong>{deleteTarget.name}</strong> ({deleteTarget.id})?
              </p>
              {(() => {
                const count = state.assessments.filter(a => a.studentId === deleteTarget.id).length;
                return count > 0 ? (
                  <p className="text-rose-700 font-semibold mt-1">
                    Warning: This student has {count} related assessment records and associated engagement metrics that will also be removed.
                  </p>
                ) : null;
              })()}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
