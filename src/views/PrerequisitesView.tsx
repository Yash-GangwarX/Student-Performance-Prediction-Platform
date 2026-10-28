import React from 'react';
import { useApp } from '../context/AppContext';
import { PrerequisiteDAGChart } from '../components/charts/PrerequisiteDAGChart';
import { 
  GitFork, 
  Printer, 
  HelpCircle, 
  Network, 
  CheckCircle2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const PrerequisitesView: React.FC = () => {
  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    openReportModal 
  } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum Topic Prerequisites & Graph Search</h1>
          <p className="text-xs text-slate-500 mt-1">
            Directed Acyclic Graph (DAG) structural analysis, DFS cycle validation, and breadth/depth traversal algorithms.
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
          <span className="font-semibold text-slate-700">Student Mastery Overlay:</span>
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
          Node colors denote student average vs {state.reviewThreshold}% cutoff
        </span>
      </div>

      {/* Main Interactive Directed Graph Component */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-800" />
              Interactive Dependency Graph & Search Traversal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any node to inspect immediate prerequisites and downstream dependents. Select an algorithm to execute live graph search.
            </p>
          </div>
        </div>

        <PrerequisiteDAGChart 
          topics={state.topics}
          assessments={state.assessments}
          studentId={selectedStudent?.id || ''}
          reviewThreshold={state.reviewThreshold}
        />
      </div>

      {/* Algorithm Explanations (BFS, DFS, Cycle Check) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Breadth-First Search (BFS)
          </h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>Mechanism: </strong>Explores graph nodes layer by layer using an authoritative FIFO queue. Starting at the root foundational concept, it visits all immediate dependencies (Level 1) before descending to advanced concepts (Level 2+).
          </p>
          <p className="text-slate-500 text-[11px]">
            <strong>Academic Application: </strong>Guarantees horizontal breadth across all peer prerequisites before advancing into specialized domains.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            Depth-First Search (DFS)
          </h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>Mechanism: </strong>Explores deep along each dependency branch to the deepest terminal topic using recursion/LIFO stack before backtracking.
          </p>
          <p className="text-slate-500 text-[11px]">
            <strong>Academic Application: </strong>Traces the full vertical vertical pipeline from foundational algebra through to deep neural architectures.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Cycle Detection & Topological Sort
          </h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>Mechanism: </strong>Detects circular dependencies via 3-color DFS state traversal (White = unvisited, Gray = active on recursion stack, Black = completed). A back-edge to a Gray node confirms a cycle.
          </p>
          <p className="text-slate-500 text-[11px]">
            <strong>Academic Application: </strong>Ensures no student is trapped in circular study requirements (e.g. A requires B and B requires A).
          </p>
        </div>

      </div>

    </div>
  );
};
