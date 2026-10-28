import React, { useState, useMemo } from 'react';
import { Topic, AssessmentRecord } from '../../types';
import { 
  detectGraphCycles, 
  performBFSTraversal, 
  performDFSTraversal, 
  computeTopologicalStudyOrder, 
  calculateMean 
} from '../../utils/calculations';
import { ArrowRight, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';

interface PrerequisiteDAGChartProps {
  topics: Topic[];
  assessments: AssessmentRecord[];
  studentId: string;
  reviewThreshold: number;
}

export const PrerequisiteDAGChart: React.FC<PrerequisiteDAGChartProps> = ({
  topics,
  assessments,
  studentId,
  reviewThreshold
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [activeAlgorithm, setActiveAlgorithm] = useState<'none' | 'bfs' | 'dfs' | 'topo'>('none');
  const [traversalStep, setTraversalStep] = useState<number>(0);
  const [testCycleInjected, setTestCycleInjected] = useState<boolean>(false);

  // Compute effective topics (normal or with injected circular edge for verification testing)
  const effectiveTopics = useMemo(() => {
    if (!testCycleInjected) return topics;
    // Inject a test cycle: pick first topic and make it depend on last topic
    if (topics.length < 2) return topics;
    return topics.map((t, idx) => {
      if (idx === 0) {
        return {
          ...t,
          prerequisites: [...t.prerequisites, topics[topics.length - 1].id]
        };
      }
      return t;
    });
  }, [topics, testCycleInjected]);

  // Run cycle detection
  const cycleResult = useMemo(() => {
    return detectGraphCycles(effectiveTopics);
  }, [effectiveTopics]);

  // Run BFS & DFS from selected topic
  const bfsResult = useMemo(() => {
    if (!selectedTopicId) return { visitedOrder: [], levels: [] };
    return performBFSTraversal(selectedTopicId, effectiveTopics);
  }, [selectedTopicId, effectiveTopics]);

  const dfsResult = useMemo(() => {
    if (!selectedTopicId) return { visitedOrder: [], branchPath: [] };
    return performDFSTraversal(selectedTopicId, effectiveTopics);
  }, [selectedTopicId, effectiveTopics]);

  const topologicalOrder = useMemo(() => {
    return computeTopologicalStudyOrder(topics);
  }, [topics]);

  // Calculate student average per topic
  const topicStats = useMemo(() => {
    const map = new Map<string, { avg: number | null; attempts: number; status: string }>();
    for (const t of topics) {
      const recs = assessments.filter(
        a => a.studentId === studentId && a.topicId === t.id && a.status === 'completed'
      );
      if (recs.length === 0) {
        map.set(t.id, { avg: null, attempts: 0, status: 'Insufficient data' });
      } else {
        const avg = calculateMean(recs.map(r => r.percentage))!;
        let status = 'On track';
        if (avg < reviewThreshold) status = 'Needs attention';
        else if (avg < reviewThreshold + 15) status = 'Developing';
        map.set(t.id, { avg, attempts: recs.length, status });
      }
    }
    return map;
  }, [topics, assessments, studentId, reviewThreshold]);

  // Node layout coordinates
  // Organize topics into topological columns/levels
  const layout = useMemo(() => {
    const nodeCoords = new Map<string, { x: number; y: number; col: number; row: number }>();
    
    // Calculate level (depth from root prerequisites)
    const levelMap = new Map<string, number>();
    for (const t of topics) {
      levelMap.set(t.id, 0);
    }

    let changed = true;
    let iterations = 0;
    while (changed && iterations < topics.length + 2) {
      changed = false;
      iterations++;
      for (const t of topics) {
        let maxPrereqLevel = -1;
        for (const p of t.prerequisites) {
          const pLvl = levelMap.get(p) ?? 0;
          if (pLvl > maxPrereqLevel) maxPrereqLevel = pLvl;
        }
        if (maxPrereqLevel >= 0) {
          const current = levelMap.get(t.id) ?? 0;
          if (current <= maxPrereqLevel) {
            levelMap.set(t.id, maxPrereqLevel + 1);
            changed = true;
          }
        }
      }
    }

    // Group by column
    const columns = new Map<number, string[]>();
    for (const [id, lvl] of levelMap.entries()) {
      if (!columns.has(lvl)) columns.set(lvl, []);
      columns.get(lvl)!.push(id);
    }

    const colKeys = Array.from(columns.keys()).sort((a, b) => a - b);
    const startX = 60;
    const colSpacing = 190;
    const startY = 40;
    const rowSpacing = 85;

    colKeys.forEach((colIndex, col) => {
      const ids = columns.get(colIndex)!;
      ids.forEach((id, row) => {
        nodeCoords.set(id, {
          x: startX + col * colSpacing,
          y: startY + row * rowSpacing,
          col,
          row
        });
      });
    });

    return { nodeCoords, maxCol: colKeys.length, maxRow: Math.max(...Array.from(columns.values()).map(a => a.length)) };
  }, [topics]);

  const svgWidth = Math.max(780, (layout.maxCol + 1) * 190);
  const svgHeight = Math.max(280, (layout.maxRow + 1) * 95);

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div className="space-y-4">
      {/* Algorithm controls and cycle check banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Graph Algorithms:</span>
          <button
            onClick={() => { setActiveAlgorithm('bfs'); setTraversalStep(0); }}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeAlgorithm === 'bfs' 
                ? 'bg-blue-900 text-white shadow-xs' 
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            BFS Traversal (Layers)
          </button>
          <button
            onClick={() => { setActiveAlgorithm('dfs'); setTraversalStep(0); }}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeAlgorithm === 'dfs' 
                ? 'bg-blue-900 text-white shadow-xs' 
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            DFS Traversal (Branches)
          </button>
          <button
            onClick={() => { setActiveAlgorithm('topo'); setTraversalStep(0); }}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeAlgorithm === 'topo' 
                ? 'bg-blue-900 text-white shadow-xs' 
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Topological Study Order
          </button>
          {activeAlgorithm !== 'none' && (
            <button
              onClick={() => setActiveAlgorithm('none')}
              className="text-slate-500 hover:text-slate-800 underline ml-1"
            >
              Reset
            </button>
          )}
        </div>

        {/* Hand-checkable Test Cycle toggle */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Test Cycle Check:</span>
          <button
            onClick={() => setTestCycleInjected(prev => !prev)}
            className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
              testCycleInjected 
                ? 'bg-red-50 border-red-300 text-red-700' 
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {testCycleInjected ? 'Remove Cycle Injection' : 'Inject Circular Edge'}
          </button>
        </div>
      </div>

      {/* Cycle Detection Status Banner */}
      <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
        cycleResult.hasCycle 
          ? 'bg-rose-50 border-rose-200 text-rose-800' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}>
        <div className="flex items-center gap-2">
          {cycleResult.hasCycle ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>
            <strong className="font-semibold">DAG Validation: </strong>
            {cycleResult.explanation}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Algorithm: DFS 3-Coloring Cycle Check</span>
      </div>

      {/* Traversal sequence bar if algorithm active */}
      {activeAlgorithm !== 'none' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
          <div className="font-semibold text-blue-900 flex items-center justify-between">
            <span>
              {activeAlgorithm === 'bfs' && `BFS Level-by-Level Exploration (Root: ${selectedTopic?.name})`}
              {activeAlgorithm === 'dfs' && `DFS Depth-First Exploration (Root: ${selectedTopic?.name})`}
              {activeAlgorithm === 'topo' && 'Topological Study Sequence (Prerequisite-First Schedule)'}
            </span>
            <span className="font-mono text-[11px] text-blue-700">
              {activeAlgorithm === 'topo' ? `${topologicalOrder.length} topics` : `Reachable: ${activeAlgorithm === 'bfs' ? bfsResult.visitedOrder.length : dfsResult.visitedOrder.length}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {(activeAlgorithm === 'topo' 
              ? topologicalOrder.map(t => t.id)
              : (activeAlgorithm === 'bfs' ? bfsResult.visitedOrder : dfsResult.visitedOrder)
            ).map((id, index) => {
              const t = topics.find(x => x.id === id);
              return (
                <div key={id} className="flex items-center gap-1">
                  <span className="bg-white border border-blue-300 text-blue-900 px-2 py-0.5 rounded font-mono text-[11px] font-medium">
                    {index + 1}. {t?.name || id}
                  </span>
                  {index < (activeAlgorithm === 'topo' ? topologicalOrder.length - 1 : (activeAlgorithm === 'bfs' ? bfsResult.visitedOrder.length - 1 : dfsResult.visitedOrder.length - 1)) && (
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Directed Graph */}
      <div className="border border-slate-200 rounded-lg p-3 bg-white overflow-x-auto shadow-xs">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto min-w-[720px] select-none"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="7"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 7 3, 0 6" fill="#94a3b8" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="7"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 7 3, 0 6" fill="#1d4ed8" />
            </marker>
            <marker
              id="arrowhead-cycle"
              markerWidth="7"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 7 3, 0 6" fill="#e11d48" />
            </marker>
          </defs>

          {/* Directed Edges */}
          {effectiveTopics.map(topic => {
            const destCoord = layout.nodeCoords.get(topic.id);
            if (!destCoord) return null;

            return topic.prerequisites.map(prereqId => {
              const srcCoord = layout.nodeCoords.get(prereqId);
              if (!srcCoord) return null;

              const isPartOfCycle = cycleResult.hasCycle && 
                cycleResult.cycleNodes.includes(prereqId) && 
                cycleResult.cycleNodes.includes(topic.id);

              const isHighlighted = (activeAlgorithm === 'bfs' && bfsResult.visitedOrder.includes(topic.id)) ||
                (activeAlgorithm === 'dfs' && dfsResult.visitedOrder.includes(topic.id));

              // Compute smooth bezier curve
              const startX = srcCoord.x + 75;
              const startY = srcCoord.y + 24;
              const endX = destCoord.x - 75;
              const endY = destCoord.y + 24;
              const midX = (startX + endX) / 2;

              return (
                <path
                  key={`${prereqId}->${topic.id}`}
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke={isPartOfCycle ? '#e11d48' : isHighlighted ? '#1d4ed8' : '#cbd5e1'}
                  strokeWidth={isPartOfCycle || isHighlighted ? '2' : '1.25'}
                  strokeDasharray={isPartOfCycle ? '4 2' : undefined}
                  markerEnd={`url(#${isPartOfCycle ? 'arrowhead-cycle' : isHighlighted ? 'arrowhead-active' : 'arrowhead'})`}
                />
              );
            });
          })}

          {/* Nodes */}
          {topics.map(topic => {
            const coord = layout.nodeCoords.get(topic.id);
            if (!coord) return null;

            const stats = topicStats.get(topic.id);
            const isSelected = selectedTopicId === topic.id;
            const isPartOfCycle = cycleResult.hasCycle && cycleResult.cycleNodes.includes(topic.id);

            // Border color by academic risk status
            let borderColor = '#94a3b8';
            let statusFill = '#f8fafc';
            if (stats?.status === 'On track') {
              borderColor = '#059669';
              statusFill = '#ecfdf5';
            } else if (stats?.status === 'Developing') {
              borderColor = '#d97706';
              statusFill = '#fffbeb';
            } else if (stats?.status === 'Needs attention') {
              borderColor = '#dc2626';
              statusFill = '#fef2f2';
            }

            if (isPartOfCycle) {
              borderColor = '#e11d48';
            }

            return (
              <g
                key={topic.id}
                transform={`translate(${coord.x - 75}, ${coord.y})`}
                onClick={() => setSelectedTopicId(topic.id)}
                className="cursor-pointer"
              >
                {/* Node Box */}
                <rect
                  x="0"
                  y="0"
                  width="150"
                  height="48"
                  rx="6"
                  fill="#ffffff"
                  stroke={isSelected ? '#1d4ed8' : borderColor}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  filter={isSelected ? 'drop-shadow(0 4px 6px rgba(37,99,235,0.15))' : undefined}
                />

                {/* Left status color bar */}
                <rect
                  x="0"
                  y="0"
                  width="5"
                  height="48"
                  rx="2"
                  fill={borderColor}
                />

                {/* Topic Name */}
                <text
                  x="12"
                  y="18"
                  fontSize="10.5"
                  fontWeight="600"
                  fill="#0f172a"
                  className="select-none"
                >
                  {topic.name.length > 18 ? topic.name.slice(0, 17) + '…' : topic.name}
                </text>

                {/* Topic stats line */}
                <text
                  x="12"
                  y="34"
                  fontSize="9"
                  fill="#64748b"
                  className="font-mono tabular-nums select-none"
                >
                  {stats?.avg !== null ? `Avg: ${stats?.avg}% (${stats?.attempts} att)` : 'No records'}
                </text>

                {/* Status indicator tag */}
                <rect
                  x="96"
                  y="24"
                  width="46"
                  height="14"
                  rx="3"
                  fill={statusFill}
                  stroke={borderColor}
                  strokeWidth="0.75"
                />
                <text
                  x="119"
                  y="34"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill={borderColor}
                  className="select-none"
                >
                  {stats?.status === 'Needs attention' ? 'Review' : stats?.status === 'Developing' ? 'Dev' : stats?.status === 'On track' ? 'Mastered' : 'Empty'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedTopic && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <span className="font-semibold text-slate-700 block">Selected Topic</span>
            <span className="font-bold text-slate-900 text-sm">{selectedTopic.name}</span>
            <p className="text-slate-500 text-[11px] mt-0.5">{selectedTopic.description}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-700 block">Immediate Prerequisites</span>
            {selectedTopic.prerequisites.length === 0 ? (
              <span className="text-slate-400 italic">None (Foundational Entry Topic)</span>
            ) : (
              <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-0.5">
                {selectedTopic.prerequisites.map(pid => {
                  const p = topics.find(t => t.id === pid);
                  const pStat = topicStats.get(pid);
                  return (
                    <li key={pid}>
                      <span className="font-medium">{p?.name || pid}</span>
                      <span className="text-slate-400 font-mono ml-1">
                        ({pStat?.avg !== null ? `${pStat?.avg}%` : 'No data'})
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-700 block">Dependent Downstream Topics</span>
            {(() => {
              const dependents = topics.filter(t => t.prerequisites.includes(selectedTopic.id));
              if (dependents.length === 0) {
                return <span className="text-slate-400 italic">None (Terminal Topic in Curriculum)</span>;
              }
              return (
                <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-0.5">
                  {dependents.map(d => (
                    <li key={d.id} className="font-medium">{d.name}</li>
                  ))}
                </ul>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
