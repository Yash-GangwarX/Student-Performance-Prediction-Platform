import React, { useState } from 'react';
import { AssessmentRecord } from '../../types';

interface ScoreTrendChartProps {
  records: AssessmentRecord[];
  predictedScore?: number | null;
  reviewThreshold?: number;
  height?: number;
  showPredictionCorridor?: boolean;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  records,
  predictedScore = null,
  reviewThreshold = 60,
  height = 240,
  showPredictionCorridor = true
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort chronologically
  const sorted = [...records]
    .filter(r => r.status === 'completed' && r.maxMarks > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg p-8 bg-slate-50 text-slate-500"
        style={{ height }}
      >
        <span className="text-sm font-medium">No chronological assessment records available</span>
        <span className="text-xs text-slate-400 mt-1">Record assessment attempts to view performance trajectory</span>
      </div>
    );
  }

  const width = 640;
  const padding = { top: 24, right: 48, bottom: 40, left: 44 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // X scale: total points = sorted.length + (predictedScore !== null ? 1 : 0)
  const totalPoints = sorted.length + (predictedScore !== null ? 1 : 0);
  const getX = (index: number) => {
    if (totalPoints <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (totalPoints - 1)) * chartWidth;
  };

  // Y scale: 0 to 100%
  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    return padding.top + chartHeight - (clamped / 100) * chartHeight;
  };

  // Generate SVG path for actual points
  const points = sorted.map((r, i) => ({
    x: getX(i),
    y: getY(r.percentage),
    record: r,
    index: i
  }));

  const pathD = points.length > 1
    ? points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  // Prediction point
  const lastPoint = points[points.length - 1];
  const predX = predictedScore !== null ? getX(sorted.length) : null;
  const predY = predictedScore !== null ? getY(predictedScore) : null;

  const thresholdY = getY(reviewThreshold);

  return (
    <div className="w-full relative">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto overflow-visible select-none"
        style={{ maxHeight: height }}
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="predCorridor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = getY(val);
          return (
            <g key={val}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={width - padding.right} 
                y2={y} 
                stroke="#e2e8f0" 
                strokeWidth="1" 
                strokeDasharray={val === 0 || val === 100 ? undefined : "3 3"} 
              />
              <text 
                x={padding.left - 8} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="10" 
                fill="#64748b" 
                className="font-mono tabular-nums"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Review Threshold Line */}
        <line 
          x1={padding.left} 
          y1={thresholdY} 
          x2={width - padding.right} 
          y2={thresholdY} 
          stroke="#ef4444" 
          strokeWidth="1.25" 
          strokeDasharray="4 4" 
        />
        <text 
          x={width - padding.right + 6} 
          y={thresholdY + 3} 
          fontSize="9" 
          fill="#ef4444" 
          fontWeight="600"
          className="tabular-nums"
        >
          {reviewThreshold}% Goal
        </text>

        {/* Trend Area under curve */}
        {points.length > 1 && (
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${getY(0)} L ${points[0].x} ${getY(0)} Z`}
            fill="url(#trendGradient)"
          />
        )}

        {/* Trend Line */}
        {points.length > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Prediction segment & corridor */}
        {predictedScore !== null && lastPoint && predX !== null && predY !== null && (
          <g>
            {/* Uncertainty Corridor */}
            {showPredictionCorridor && (
              <polygon
                points={`
                  ${lastPoint.x},${lastPoint.y}
                  ${predX},${getY(Math.min(100, predictedScore + 4.5))}
                  ${predX},${getY(Math.max(0, predictedScore - 4.5))}
                `}
                fill="url(#predCorridor)"
              />
            )}
            
            {/* Dashed connector line */}
            <line
              x1={lastPoint.x}
              y1={lastPoint.y}
              x2={predX}
              y2={predY}
              stroke="#7c3aed"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Prediction Diamond Marker */}
            <g transform={`translate(${predX}, ${predY})`}>
              <polygon
                points="0,-6 6,0 0,6 -6,0"
                fill="#7c3aed"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>

            {/* Label for predicted point */}
            <text
              x={predX}
              y={height - padding.bottom + 18}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#7c3aed"
            >
              Next (Est.)
            </text>
            <text
              x={predX}
              y={predY - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#7c3aed"
              className="font-mono tabular-nums"
            >
              {predictedScore}%
            </text>
          </g>
        )}

        {/* Actual Observed Points */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g 
              key={p.record.id} 
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Invisible touch area */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

              {/* Center point circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4.5}
                fill="#ffffff"
                stroke="#1d4ed8"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-150"
              />

              {/* Point value label */}
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#0f172a"
                className="font-mono tabular-nums select-none"
              >
                {p.record.percentage}%
              </text>

              {/* X-axis date / index label */}
              <text
                x={p.x}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
                className="font-mono tabular-nums"
              >
                {p.record.date.slice(5)}
              </text>
              <text
                x={p.x}
                y={height - padding.bottom + 28}
                textAnchor="middle"
                fontSize="8"
                fill="#94a3b8"
              >
                Att. {p.record.attemptNumber}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredIndex !== null && sorted[hoveredIndex] && (
        <div 
          className="absolute z-20 bg-slate-900 text-white text-xs rounded-md shadow-lg p-2.5 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 8}%`
          }}
        >
          <div className="font-semibold text-slate-100">{sorted[hoveredIndex].assessmentName}</div>
          <div className="text-slate-300 flex items-center gap-2 mt-1 font-mono text-[11px]">
            <span>Marks: {sorted[hoveredIndex].obtainedMarks} / {sorted[hoveredIndex].maxMarks}</span>
            <span>·</span>
            <span className="text-blue-300 font-bold">{sorted[hoveredIndex].percentage}%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Date: {sorted[hoveredIndex].date} · Type: {sorted[hoveredIndex].assessmentType}
          </div>
        </div>
      )}
    </div>
  );
};
