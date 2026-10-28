import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateMean } from '../utils/calculations';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Users, 
  Calendar, 
  ShieldCheck,
  Eye
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    openReportModal 
  } = useApp();

  const studentAssessments = state.assessments.filter(
    a => a.studentId === selectedStudent?.id && a.status === 'completed'
  );

  const scores = studentAssessments.map(a => a.percentage);
  const avg = calculateMean(scores);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Performance Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal, print-optimized evaluation dossiers conforming to institutional faculty standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openReportModal(selectedStudent?.id)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-200" />
            <span>Generate Performance Report</span>
          </button>
        </div>
      </div>

      {/* Report Configuration & Student Picker */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-800" />
          Report Scope & Target Student
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
            <select
              value={state.selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-900 focus:outline-none"
            >
              {state.students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Semester</label>
            <input
              type="text"
              readOnly
              value={`Semester ${selectedStudent?.semester} · Section ${selectedStudent?.section}`}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-medium"
            >
            </input>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Data Source Status</label>
            <input
              type="text"
              readOnly
              value={`${state.dataSource.toUpperCase()} RECORDSET (${studentAssessments.length} attempts)`}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono"
            >
            </input>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900 block">Dossier Components Included:</span>
            <span>Executive Summary · Assessment History · Statistical Breakdown · Weighted Prediction Audit · SVG Visualizations · Remediation Recommendations · Methodological Limitations</span>
          </div>

          <button
            onClick={() => openReportModal(selectedStudent?.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Launch Document Preview</span>
          </button>
        </div>
      </div>

      {/* Cohort Report Roster */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Instant Batch Report Generation by Student
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {state.students.length} dossiers ready
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-3 font-mono">Roll ID</th>
              <th className="py-3 px-3">Programme</th>
              <th className="py-3 px-2 text-center">Semester</th>
              <th className="py-3 px-2 text-center font-mono">Assessments</th>
              <th className="py-3 px-3 text-right font-mono">Cohort Avg</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.students.map(s => {
              const sAssessments = state.assessments.filter(a => a.studentId === s.id && a.status === 'completed');
              const sMean = calculateMean(sAssessments.map(a => a.percentage));

              return (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{s.id}</td>
                  <td className="py-3 px-3 text-slate-700">{s.program}</td>
                  <td className="py-3 px-2 text-center">Sem {s.semester} ({s.section})</td>
                  <td className="py-3 px-2 text-center font-mono">{sAssessments.length}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {sMean !== null ? `${sMean}%` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openReportModal(s.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-300" />
                      <span>Generate Report</span>
                    </button>
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
