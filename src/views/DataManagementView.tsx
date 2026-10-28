import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, AssessmentRecord, AssessmentType, AssessmentStatus } from '../types';
import { 
  Database, 
  Upload, 
  Download, 
  RotateCcw, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export const DataManagementView: React.FC = () => {
  const { 
    state, 
    resetToSampleData, 
    importCSVRecords 
  } = useApp();

  const [csvContent, setCsvContent] = useState<string>('');
  const [importType, setImportType] = useState<'assessments' | 'students'>('assessments');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Sample CSV Templates
  const assessmentCsvTemplate = 
`studentId,subjectId,topicId,assessmentName,assessmentType,date,obtainedMarks,maxMarks,attemptNumber,status
NIET-2026-001,SUB-DSA,TOPIC-DSA-01,Midterm Test 1,Midterm,2026-10-14,45,50,1,completed
NIET-2026-002,SUB-DSA,TOPIC-DSA-05,Lab Practice 4,Lab,2026-10-15,42,50,1,completed`;

  const studentCsvTemplate =
`id,name,program,semester,section,enrollmentDate,email
NIET-2026-009,Rahul Gupta,B.Tech Computer Science and Engineering,3,F,2024-08-01,rahul.gupta@example.edu
NIET-2026-010,Kavita Sen,B.Tech Computer Science and Engineering,3,F,2024-08-01,kavita.sen@example.edu`;

  // Export functions
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAssessmentsCSV = () => {
    const headers = 'id,studentId,subjectId,topicId,assessmentName,assessmentType,date,obtainedMarks,maxMarks,percentage,attemptNumber,status\n';
    const rows = state.assessments.map(a => 
      `"${a.id}","${a.studentId}","${a.subjectId}","${a.topicId}","${a.assessmentName.replace(/"/g, '""')}","${a.assessmentType}","${a.date}",${a.obtainedMarks},${a.maxMarks},${a.percentage},${a.attemptNumber},"${a.status}"`
    ).join('\n');
    downloadCSV(headers + rows, `assessments_${Date.now()}.csv`);
  };

  const exportStudentsCSV = () => {
    const headers = 'id,name,program,semester,section,enrollmentDate,email\n';
    const rows = state.students.map(s => 
      `"${s.id}","${s.name.replace(/"/g, '""')}","${s.program}",${s.semester},"${s.section}","${s.enrollmentDate}","${s.email || ''}"`
    ).join('\n');
    downloadCSV(headers + rows, `students_${Date.now()}.csv`);
  };

  // CSV Parse & Validate
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportErrors([]);
    setImportSuccess(null);

    if (!csvContent.trim()) {
      setImportErrors(['CSV input is empty. Paste valid CSV rows or choose a template.']);
      return;
    }

    const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setImportErrors(['CSV must contain a header row and at least one data row.']);
      return;
    }

    const errors: string[] = [];

    if (importType === 'assessments') {
      const validRecords: AssessmentRecord[] = [];
      // Expect: studentId,subjectId,topicId,assessmentName,assessmentType,date,obtainedMarks,maxMarks,attemptNumber,status
      for (let i = 1; i < lines.length; i++) {
        const rowNum = i + 1;
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        
        if (cols.length < 8) {
          errors.push(`Row ${rowNum}: Insufficient columns (expected at least 8 fields).`);
          continue;
        }

        const [studentId, subjectId, topicId, assessmentName, assessmentType, date, obtainedStr, maxStr, attemptStr, statusStr] = cols;

        // Validation
        const studentExists = state.students.some(s => s.id === studentId);
        if (!studentExists) {
          errors.push(`Row ${rowNum}: Student ID "${studentId}" does not exist in student registry.`);
          continue;
        }

        const subjectExists = state.subjects.some(s => s.id === subjectId);
        if (!subjectExists) {
          errors.push(`Row ${rowNum}: Subject ID "${subjectId}" does not exist.`);
          continue;
        }

        const topicExists = state.topics.some(t => t.id === topicId);
        if (!topicExists) {
          errors.push(`Row ${rowNum}: Topic ID "${topicId}" does not exist.`);
          continue;
        }

        const obtained = parseFloat(obtainedStr);
        const max = parseFloat(maxStr);

        if (isNaN(obtained) || obtained < 0) {
          errors.push(`Row ${rowNum}: Obtained marks must be a valid non-negative number.`);
          continue;
        }
        if (isNaN(max) || max <= 0) {
          errors.push(`Row ${rowNum}: Maximum marks must be greater than zero.`);
          continue;
        }
        if (obtained > max) {
          errors.push(`Row ${rowNum}: Obtained marks (${obtained}) exceed maximum marks (${max}).`);
          continue;
        }
        if (isNaN(new Date(date).getTime())) {
          errors.push(`Row ${rowNum}: Date "${date}" is not a valid date string (YYYY-MM-DD required).`);
          continue;
        }

        const percentage = Number(((obtained / max) * 100).toFixed(2));
        validRecords.push({
          id: `IMP-${Date.now()}-${i}`,
          studentId,
          subjectId,
          topicId,
          assessmentName: assessmentName || 'Imported Assessment',
          assessmentType: (['Quiz', 'Assignment', 'Midterm', 'Final', 'Lab'].includes(assessmentType) ? assessmentType : 'Quiz') as AssessmentType,
          date,
          obtainedMarks: obtained,
          maxMarks: max,
          percentage,
          attemptNumber: parseInt(attemptStr) || 1,
          status: (['completed', 'unattempted', 'absent'].includes(statusStr) ? statusStr : 'completed') as AssessmentStatus
        });
      }

      if (errors.length > 0) {
        setImportErrors(errors);
        return;
      }

      importCSVRecords([], validRecords);
      setImportSuccess(`Successfully imported ${validRecords.length} assessment records!`);
      setCsvContent('');

    } else {
      // Import Students
      const validStudents: Student[] = [];
      for (let i = 1; i < lines.length; i++) {
        const rowNum = i + 1;
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 5) {
          errors.push(`Row ${rowNum}: Insufficient columns (expected id, name, program, semester, section).`);
          continue;
        }

        const [id, name, program, semesterStr, section, enrollmentDate, email] = cols;
        if (!id || !name) {
          errors.push(`Row ${rowNum}: Student ID and Name cannot be empty.`);
          continue;
        }

        const sem = parseInt(semesterStr) || 5;
        validStudents.push({
          id,
          name,
          program: program || 'B.Tech Computer Science (AI & ML)',
          semester: sem,
          section: section || 'A',
          enrollmentDate: enrollmentDate || new Date().toISOString().slice(0, 10),
          email: email || ''
        });
      }

      if (errors.length > 0) {
        setImportErrors(errors);
        return;
      }

      importCSVRecords(validStudents, []);
      setImportSuccess(`Successfully imported ${validStudents.length} student records!`);
      setCsvContent('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dataset & Record Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            CSV import/export utilities, granular data validation diagnostics, and synthetic state controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Baseline Sample Data</span>
          </button>
        </div>
      </div>

      {/* Dataset Identity Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-blue-900" />
          <div>
            <span className="font-bold text-slate-900 block">
              Active Dataset Source: <span className="uppercase text-blue-800">{state.dataSource} Data</span>
            </span>
            <span className="text-slate-500 text-[11px]">
              {state.students.length} Students · {state.assessments.length} Assessment Records · {state.topics.length} Curriculum Topics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportStudentsCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Students CSV</span>
          </button>
          <button
            onClick={exportAssessmentsCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Marks CSV</span>
          </button>
        </div>
      </div>

      {/* Import CSV Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-slate-900">Validated CSV Record Ingestion</h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => { setImportType('assessments'); setCsvContent(assessmentCsvTemplate); }}
              className="text-blue-700 hover:text-blue-900 underline cursor-pointer"
            >
              Load Marks Template
            </button>
            <span>·</span>
            <button
              onClick={() => { setImportType('students'); setCsvContent(studentCsvTemplate); }}
              className="text-blue-700 hover:text-blue-900 underline cursor-pointer"
            >
              Load Students Template
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Strict schema validation checks for reference integrity, non-negative marks, mark-cap boundaries, and date formatting.
        </p>

        {importSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importSuccess}</span>
          </div>
        )}

        {importErrors.length > 0 && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
            <div className="font-bold flex items-center gap-2 text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Import Rejected · {importErrors.length} Schema Violation{importErrors.length === 1 ? '' : 's'}</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] pt-1">
              {importErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleImportSubmit} className="space-y-3 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="importType"
                checked={importType === 'assessments'}
                onChange={() => setImportType('assessments')}
                className="text-blue-900"
              />
              <span>Assessment & Marks Records</span>
            </label>
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="importType"
                checked={importType === 'students'}
                onChange={() => setImportType('students')}
                className="text-blue-900"
              />
              <span>Student Enrolment Profiles</span>
            </label>
          </div>

          <textarea
            rows={6}
            value={csvContent}
            onChange={e => setCsvContent(e.target.value)}
            placeholder="Paste raw CSV data here (header row followed by data records)..."
            className="w-full p-3 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:border-blue-600 bg-slate-50"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCsvContent('')}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
            >
              Validate & Ingest CSV
            </button>
          </div>
        </form>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reset to Baseline Synthetic Dataset</h3>
                <span className="text-slate-500">Restore factory sample records for faculty demonstration.</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              This will reset the application to the initial synthetic demonstration dataset (8 students, improving/declining trajectories, genuine zeros, and prerequisite chains). Any custom manually entered marks will be replaced.
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
