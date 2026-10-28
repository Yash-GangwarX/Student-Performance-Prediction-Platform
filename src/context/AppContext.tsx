import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AppState, 
  Student, 
  AssessmentRecord, 
  Recommendation, 
  Subject, 
  Topic, 
  DataSourceType 
} from '../types';
import { getInitialAppState } from '../data/sampleData';
import { generateEvidenceBasedRecommendations } from '../utils/calculations';

const STORAGE_KEY = 'SPPP_DATA_STORE_V4';

const STUDENT_NAME_MAP: Record<string, string> = {
  'NIET-2026-001': 'Vedant',
  'NIET-2026-002': 'Vyash',
  'NIET-2026-003': 'Yogesh',
  'NIET-2026-004': 'Yash',
  'NIET-2026-005': 'Rahul',
  'NIET-2026-006': 'Gyanendra',
  'NIET-2026-007': 'Anubhav'
};

interface AppContextValue {
  state: AppState;
  selectedStudent: Student | undefined;
  filteredAssessments: AssessmentRecord[];
  allRecommendations: Recommendation[];
  studentRecommendations: Recommendation[];
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  openReportModal: (studentId?: string) => void;
  closeReportModal: () => void;
  setSelectedStudentId: (id: string) => void;
  setSelectedSubjectId: (id: string) => void;
  setSelectedTopicId: (id: string) => void;
  setReviewThreshold: (val: number) => void;
  addStudent: (student: Student) => { success: boolean; error?: string };
  updateStudent: (student: Student) => { success: boolean; error?: string };
  deleteStudent: (id: string) => { success: boolean; error?: string; count?: number };
  addAssessment: (assessment: Omit<AssessmentRecord, 'id' | 'percentage'>) => { success: boolean; error?: string };
  updateAssessment: (assessment: AssessmentRecord) => { success: boolean; error?: string };
  deleteAssessment: (id: string) => { success: boolean; error?: string };
  toggleRecommendation: (id: string) => void;
  resetToSampleData: () => void;
  importCSVRecords: (
    studentsToImport: Student[],
    assessmentsToImport: AssessmentRecord[]
  ) => { importedStudents: number; importedAssessments: number };
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      // Clear out legacy stores if present
      localStorage.removeItem('SPPP_DATA_STORE_V1');
      localStorage.removeItem('SPPP_DATA_STORE_V2');
      localStorage.removeItem('SPPP_DATA_STORE_V3');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.students && Array.isArray(parsed.students) && parsed.students.length > 0) {
          // Normalize roll IDs, student names, program, semester 3, and section F
          parsed.students = parsed.students
            .filter((s: Student) => s.id !== 'BTCS-2024-008' && s.id !== 'NIET-2026-008')
            .map((s: Student) => {
              const updatedId = s.id.replace('BTCS-2024-', 'NIET-2026-');
              return {
                ...s,
                id: updatedId,
                name: STUDENT_NAME_MAP[updatedId] || s.name,
                program: 'B.Tech Computer Science and Engineering',
                semester: 3,
                section: 'F'
              };
            });
          if (parsed.selectedStudentId) {
            parsed.selectedStudentId = parsed.selectedStudentId.replace('BTCS-2024-', 'NIET-2026-');
          }
          if (parsed.assessments && Array.isArray(parsed.assessments)) {
            parsed.assessments = parsed.assessments.map((a: AssessmentRecord) => ({
              ...a,
              studentId: a.studentId.replace('BTCS-2024-', 'NIET-2026-')
            }));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data, falling back to initial data', e);
    }
    return getInitialAppState();
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync to local storage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [state]);

  const selectedStudent = useMemo(() => {
    return state.students.find(s => s.id === state.selectedStudentId) || state.students[0];
  }, [state.students, state.selectedStudentId]);

  // Generate recommendations dynamically from state
  const allRecommendations = useMemo(() => {
    const list: Recommendation[] = [];
    for (const student of state.students) {
      const habit = state.studyHabits.find(h => h.studentId === student.id);
      const studentAtt = state.attendanceRecords.filter(a => a.studentId === student.id);
      const studentPrac = state.practiceActivities.filter(p => p.studentId === student.id);
      
      const recs = generateEvidenceBasedRecommendations(
        student,
        state.topics,
        state.assessments,
        state.reviewThreshold,
        habit,
        studentAtt,
        studentPrac
      );

      // Preserve completed status if already toggled in state
      const mapped = recs.map(r => {
        const existing = state.recommendations.find(er => er.id === r.id);
        return existing ? { ...r, isCompleted: existing.isCompleted } : r;
      });

      list.push(...mapped);
    }
    return list;
  }, [state.students, state.topics, state.assessments, state.reviewThreshold, state.studyHabits, state.attendanceRecords, state.practiceActivities, state.recommendations]);

  const studentRecommendations = useMemo(() => {
    if (!selectedStudent) return [];
    return allRecommendations.filter(r => r.studentId === selectedStudent.id);
  }, [allRecommendations, selectedStudent]);

  const filteredAssessments = useMemo(() => {
    return state.assessments.filter(a => {
      if (state.selectedStudentId && a.studentId !== state.selectedStudentId) return false;
      if (state.selectedSubjectId !== 'all' && a.subjectId !== state.selectedSubjectId) return false;
      if (state.selectedTopicId !== 'all' && a.topicId !== state.selectedTopicId) return false;
      return true;
    });
  }, [state.assessments, state.selectedStudentId, state.selectedSubjectId, state.selectedTopicId]);

  const setSelectedStudentId = (id: string) => {
    setState(prev => ({ ...prev, selectedStudentId: id }));
  };

  const setSelectedSubjectId = (id: string) => {
    setState(prev => ({ ...prev, selectedSubjectId: id, selectedTopicId: 'all' }));
  };

  const setSelectedTopicId = (id: string) => {
    setState(prev => ({ ...prev, selectedTopicId: id }));
  };

  const setReviewThreshold = (val: number) => {
    const clamped = Math.max(30, Math.min(90, Number(val)));
    setState(prev => ({ ...prev, reviewThreshold: clamped }));
  };

  const openReportModal = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const addStudent = (newStudent: Student) => {
    if (!newStudent.id.trim() || !newStudent.name.trim()) {
      return { success: false, error: 'Student ID and Student Name are required.' };
    }
    const exists = state.students.some(s => s.id.toLowerCase() === newStudent.id.trim().toLowerCase());
    if (exists) {
      return { success: false, error: `Student with ID "${newStudent.id}" already exists.` };
    }

    setState(prev => ({
      ...prev,
      students: [...prev.students, newStudent],
      dataSource: prev.dataSource === 'synthetic' ? 'manual' : prev.dataSource
    }));
    return { success: true };
  };

  const updateStudent = (updatedStudent: Student) => {
    if (!updatedStudent.id.trim() || !updatedStudent.name.trim()) {
      return { success: false, error: 'Student ID and Student Name are required.' };
    }

    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s),
      dataSource: prev.dataSource === 'synthetic' ? 'manual' : prev.dataSource
    }));
    return { success: true };
  };

  const deleteStudent = (studentId: string) => {
    const relatedAssessments = state.assessments.filter(a => a.studentId === studentId);
    const relatedHabits = state.studyHabits.filter(h => h.studentId === studentId);
    const relatedAtt = state.attendanceRecords.filter(a => a.studentId === studentId);

    // Remove student and cascading records
    setState(prev => {
      const remainingStudents = prev.students.filter(s => s.id !== studentId);
      const nextSelected = remainingStudents.length > 0 ? remainingStudents[0].id : '';
      return {
        ...prev,
        students: remainingStudents,
        assessments: prev.assessments.filter(a => a.studentId !== studentId),
        studyHabits: prev.studyHabits.filter(h => h.studentId !== studentId),
        attendanceRecords: prev.attendanceRecords.filter(a => a.studentId !== studentId),
        engagementRecords: prev.engagementRecords.filter(e => e.studentId !== studentId),
        practiceActivities: prev.practiceActivities.filter(p => p.studentId !== studentId),
        selectedStudentId: prev.selectedStudentId === studentId ? nextSelected : prev.selectedStudentId,
        dataSource: prev.dataSource === 'synthetic' ? 'manual' : prev.dataSource
      };
    });

    return { 
      success: true, 
      count: relatedAssessments.length + relatedHabits.length + relatedAtt.length 
    };
  };

  const addAssessment = (assessmentData: Omit<AssessmentRecord, 'id' | 'percentage'>) => {
    if (assessmentData.maxMarks <= 0) {
      return { success: false, error: 'Maximum marks must be greater than zero.' };
    }
    if (assessmentData.obtainedMarks < 0) {
      return { success: false, error: 'Obtained marks cannot be negative.' };
    }
    if (assessmentData.obtainedMarks > assessmentData.maxMarks) {
      return { success: false, error: `Obtained marks (${assessmentData.obtainedMarks}) cannot exceed maximum marks (${assessmentData.maxMarks}).` };
    }
    if (!assessmentData.date || isNaN(new Date(assessmentData.date).getTime())) {
      return { success: false, error: 'A valid assessment date is required.' };
    }

    const percentage = Number(((assessmentData.obtainedMarks / assessmentData.maxMarks) * 100).toFixed(2));
    const newRecord: AssessmentRecord = {
      ...assessmentData,
      id: `REC-${Date.now()}`,
      percentage
    };

    setState(prev => ({
      ...prev,
      assessments: [newRecord, ...prev.assessments],
      dataSource: prev.dataSource === 'synthetic' ? 'manual' : prev.dataSource
    }));

    return { success: true };
  };

  const updateAssessment = (record: AssessmentRecord) => {
    if (record.maxMarks <= 0) {
      return { success: false, error: 'Maximum marks must be greater than zero.' };
    }
    if (record.obtainedMarks < 0) {
      return { success: false, error: 'Obtained marks cannot be negative.' };
    }
    if (record.obtainedMarks > record.maxMarks) {
      return { success: false, error: 'Obtained marks cannot exceed maximum marks.' };
    }

    const percentage = Number(((record.obtainedMarks / record.maxMarks) * 100).toFixed(2));
    const updated = { ...record, percentage };

    setState(prev => ({
      ...prev,
      assessments: prev.assessments.map(a => a.id === updated.id ? updated : a),
      dataSource: prev.dataSource === 'synthetic' ? 'manual' : prev.dataSource
    }));

    return { success: true };
  };

  const deleteAssessment = (id: string) => {
    setState(prev => ({
      ...prev,
      assessments: prev.assessments.filter(a => a.id !== id),
      dataSource: prev.dataSource === 'synthetic' ? 'manual' : prev.dataSource
    }));
    return { success: true };
  };

  const toggleRecommendation = (recId: string) => {
    setState(prev => {
      const existing = prev.recommendations.find(r => r.id === recId);
      if (existing) {
        return {
          ...prev,
          recommendations: prev.recommendations.map(r => 
            r.id === recId ? { ...r, isCompleted: !r.isCompleted } : r
          )
        };
      } else {
        const foundFromList = allRecommendations.find(r => r.id === recId);
        if (foundFromList) {
          return {
            ...prev,
            recommendations: [...prev.recommendations, { ...foundFromList, isCompleted: true }]
          };
        }
        return prev;
      }
    });
  };

  const resetToSampleData = () => {
    const initial = getInitialAppState();
    setState(initial);
    localStorage.removeItem(STORAGE_KEY);
  };

  const importCSVRecords = (
    studentsToImport: Student[],
    assessmentsToImport: AssessmentRecord[]
  ) => {
    setState(prev => {
      // Merge unique students by ID
      const studentMap = new Map<string, Student>();
      prev.students.forEach(s => studentMap.set(s.id, s));
      studentsToImport.forEach(s => studentMap.set(s.id, s));

      // Append assessments
      const mergedAssessments = [...assessmentsToImport, ...prev.assessments];

      return {
        ...prev,
        students: Array.from(studentMap.values()),
        assessments: mergedAssessments,
        dataSource: 'imported'
      };
    });

    return {
      importedStudents: studentsToImport.length,
      importedAssessments: assessmentsToImport.length
    };
  };

  return (
    <AppContext.Provider
      value={{
        state,
        selectedStudent,
        filteredAssessments,
        allRecommendations,
        studentRecommendations,
        isReportModalOpen,
        setIsReportModalOpen,
        openReportModal,
        closeReportModal,
        setSelectedStudentId,
        setSelectedSubjectId,
        setSelectedTopicId,
        setReviewThreshold,
        addStudent,
        updateStudent,
        deleteStudent,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        toggleRecommendation,
        resetToSampleData,
        importCSVRecords
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
