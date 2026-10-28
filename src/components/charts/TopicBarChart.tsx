import React, { useState } from 'react';
import { TopicSummary } from '../../types';

interface TopicBarChartProps {
  summaries: TopicSummary[];
  reviewThreshold: number;
  height?: number;
}

export const TopicBarChart: React.FC<TopicBarChartProps> = ({
  summaries,
  reviewThreshold,
  height = 240
}) => {
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);

  if (summaries.length === 0) {
    return (
      <div 
        className="flex items-center justify-center border border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 text-slate-500 text-sm"
        style={{ height }}
      >
        No topic summary data available
      </div>
    );
  }

  const width = 640;
  const padding = { top: 20, right: 30, bottom: 45, left: 140 };
  const chartWidth = width - padding.left - padding.right;
  const rowHeight = Math.max(34, Math.floor((height - padding.top - padding.bottom) / summaries.length));
  const svgHeight = padding.top + padding.bottom + summaries.length * rowHeight;

  const getBarColor = (summary: TopicSummary) => {
    switch (summary.status) {
      case 'On track':
        return '#059669'; // Emerald-600
      case 'Developing':
        return '#d97706'; // Amber-600
      case 'Needs attention':
        return '#dc2626'; // Rose/Red-600
      case 'Insufficient data':
      default:
        return '#94a3b8'; // Slate-400
    }
  };

  const thresholdX = padding.left + (reviewThreshold / 100) * chartWidth;

  return (
    <div className="w-full relative">
      <svg 
        viewBox={`0 0 ${width} ${svgHeight}`} 
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Vertical Gridlines: 0, 25, 50, 75, 100% */}
        {[0, 25, 50, 75, 100].map(val => {
          const x = padding.left + (val / 100) * chartWidth;
          return (
            <g key={val}>
              <line 
                x1={x} 
                y1={padding.top} 
                x2={x} 
                y2={svgHeight - padding.bottom} 
                stroke="#e2e8f0" 
                strokeWidth="1" 
                strokeDasharray={val === 0 || val === 100 ? undefined : "3 3"} 
              />
              <text 
                x={x} 
                y={svgHeight - padding.bottom + 16} 
                textAnchor="middle" 
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
          x1={thresholdX} 
          y1={padding.top - 6} 
          x2={thresholdX} 
          y2={svgHeight - padding.bottom} 
          stroke="#ef4444" 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
        />
        <text 
          x={thresholdX} 
          y={padding.top - 10} 
          textAnchor="middle" 
          fontSize="9" 
          fill="#ef4444" 
          fontWeight="600"
          className="tabular-nums"
        >
          {reviewThreshold}% Cutoff
        </text>

        {/* Topic Rows */}
        {summaries.map((summary, index) => {
          const y = padding.top + index * rowHeight;
          const barY = y + 8;
          const barH = rowHeight - 16;
          const hasScore = summary.averagePercentage !== null;
          const score = summary.averagePercentage || 0;
          const barWidth = hasScore ? (score / 100) * chartWidth : 0;
          const isHovered = hoveredTopicId === summary.topicId;

          return (
            <g 
              key={summary.topicId}
              onMouseEnter={() => setHoveredTopicId(summary.topicId)}
              onMouseLeave={() => setHoveredTopicId(null)}
              className="cursor-pointer"
            >
              {/* Row background hover tint */}
              <rect
                x={0}
                y={y}
                width={width}
                height={rowHeight}
                fill={isHovered ? '#f1f5f9' : 'transparent'}
                rx="4"
              />

              {/* Topic Label */}
              <text
                x={padding.left - 12}
                y={y + rowHeight / 2 + 3}
                textAnchor="end"
                fontSize="11"
                fontWeight="500"
                fill="#1e293b"
                className="truncate"
              >
                {summary.topicName.length > 20 ? summary.topicName.slice(0, 19) + '…' : summary.topicName}
              </text>

              {/* Background slot */}
              <rect
                x={padding.left}
                y={barY}
                width={chartWidth}
                height={barH}
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="1"
                rx="3"
              />

              {/* Value Bar */}
              {hasScore ? (
                <rect
                  x={padding.left}
                  y={barY}
                  width={barWidth}
                  height={barH}
                  fill={getBarColor(summary)}
                  rx="3"
                  className="transition-all duration-300"
                  opacity={isHovered ? 0.95 : 0.85}
                />
              ) : (
                /* Empty state stripe pattern or text */
                <text
                  x={padding.left + 10}
                  y={y + rowHeight / 2 + 3}
                  fontSize="9.5"
                  fill="#94a3b8"
                  fontStyle="italic"
                >
                  No assessments recorded
                </text>
              )}

              {/* Score text label */}
              {hasScore && (
                <text
                  x={padding.left + barWidth + 8}
                  y={y + rowHeight / 2 + 3}
                  fontSize="10"
                  fontWeight="600"
                  fill="#334155"
                  className="font-mono tabular-nums"
                >
                  {score}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
