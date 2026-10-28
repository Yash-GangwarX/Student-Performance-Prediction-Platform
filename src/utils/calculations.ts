import { 
  AssessmentRecord, 
  PredictionResult, 
  RecencyWeightDetail, 
  TopicSummary, 
  TopicRiskStatus, 
  TrendDirection, 
  DataSufficiencyStatus, 
  Topic, 
  Student, 
  StudyHabit, 
  AttendanceRecord, 
  EngagementRecord, 
  PracticeQuizActivity, 
  Recommendation 
} from '../types';

/**
 * Validates and normalizes marks into percentage
 */
export function calculatePercentage(obtained: number, max: number): number {
  if (max <= 0) return 0;
  if (obtained < 0) return 0;
  return Number(((obtained / max) * 100).toFixed(2));
}

/**
 * Calculates arithmetic mean
 */
export function calculateMean(values: number[]): number | null {
  if (!values || values.length === 0) return null;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Number((sum / values.length).toFixed(2));
}

/**
 * Calculates median
 */
export function calculateMedian(values: number[]): number | null {
  if (!values || values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
  }
  return Number(sorted[mid].toFixed(2));
}

/**
 * Evaluates chronological trend using linear least-squares regression
 */
export function calculateChronologicalTrend(chronologicalPercentages: number[]): {
  slope: number | null;
  direction: TrendDirection;
  delta: number | null;
} {
  const n = chronologicalPercentages.length;
  if (n < 2) {
    return { slope: null, direction: 'insufficient', delta: null };
  }

  // x values are attempt sequence indices 1, 2, ..., n
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const y = chronologicalPercentages[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator = (n * sumXX) - (sumX * sumX);
  const slope = denominator === 0 ? 0 : Number((((n * sumXY) - (sumX * sumY)) / denominator).toFixed(2));
  const delta = Number((chronologicalPercentages[n - 1] - chronologicalPercentages[0]).toFixed(2));

  let direction: TrendDirection = 'stable';
  if (slope > 1.25) {
    direction = 'improving';
  } else if (slope < -1.25) {
    direction = 'declining';
  }

  return { slope, direction, delta };
}

/**
 * Core Prediction Engine:
 * Implements a weighted recent-score baseline with capped chronological trend adjustment
 * and explicit multi-factor heuristic telemetry.
 */
export function calculatePerformancePrediction(
  records: AssessmentRecord[],
  studentId: string,
  targetSubjectId: string,
  targetTopicId: string,
  options?: {
    attendance?: AttendanceRecord;
    studyHabit?: StudyHabit;
    engagement?: EngagementRecord;
    practice?: PracticeQuizActivity;
    useMultiCategoryHeuristic?: boolean;
  }
): PredictionResult {
  // Filter valid completed records for the target student and topic
  const validRecords = records
    .filter(
      r => r.studentId === studentId &&
           r.topicId === targetTopicId &&
           r.status === 'completed' &&
           r.maxMarks > 0 &&
           r.obtainedMarks >= 0
    )
    .sort((a, b) => {
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return a.attemptNumber - b.attemptNumber;
    });

  const n = validRecords.length;
  const categoriesUsed: string[] = ['Academic Historical Marks (Essential)'];

  // Case 0: No attempts
  if (n === 0) {
    return {
      studentId,
      targetSubjectId,
      targetTopicId,
      estimatedScore: null,
      historicalAverage: null,
      mostRecentScore: null,
      attemptsUsed: 0,
      trendDirection: 'insufficient',
      trendSlope: null,
      dataSufficiency: 'Insufficient data',
      methodUsed: 'Weighted Recent-Score Baseline with Capped Trend Adjustment',
      categoriesUsed: ['None (No completed attempts found)'],
      explanation: [
        'Prediction is unavailable because zero valid completed assessment attempts are recorded for this topic.',
        'At least one completed assessment is required to establish a preliminary baseline.'
      ],
      formulaBreakdown: {
        baselineWeightedScore: null,
        trendAdjustment: 0,
        recencyWeights: [],
        multiCategoryAdjustment: 0,
        multiCategoryRationale: [],
        clampedScore: null,
      },
      limitations: [
        'Insufficient empirical records to calculate historical average or trend slope.',
        'Academic assessment required before generating predictive estimates.'
      ]
    };
  }

  const scores = validRecords.map(r => r.percentage);
  const historicalAverage = calculateMean(scores);
  const mostRecentScore = scores[n - 1];

  // Case 1: Exactly 1 attempt
  if (n === 1) {
    return {
      studentId,
      targetSubjectId,
      targetTopicId,
      estimatedScore: mostRecentScore,
      historicalAverage,
      mostRecentScore,
      attemptsUsed: 1,
      trendDirection: 'insufficient',
      trendSlope: null,
      dataSufficiency: 'Preliminary estimate',
      methodUsed: 'Single-Attempt Historical Anchor',
      categoriesUsed,
      explanation: [
        `Only 1 historical attempt recorded (${mostRecentScore}% on ${validRecords[0].date}).`,
        'The preliminary estimate mirrors the single observed score.',
        'Chronological trend analysis requires at least 2 distinct observations.'
      ],
      formulaBreakdown: {
        baselineWeightedScore: mostRecentScore,
        trendAdjustment: 0,
        recencyWeights: [{
          attempt: 1,
          date: validRecords[0].date,
          assessmentName: validRecords[0].assessmentName,
          score: mostRecentScore,
          weight: 1.0,
          weightedScore: mostRecentScore
        }],
        multiCategoryAdjustment: 0,
        multiCategoryRationale: ['Multi-category heuristic held inactive due to preliminary single-attempt state.'],
        clampedScore: mostRecentScore,
      },
      limitations: [
        'Single data point carries high volatility.',
        'No longitudinal trend evidence available.',
        'Treat this figure as an initial baseline rather than an established projection.'
      ]
    };
  }

  // Case 2+: 2 or more attempts
  // Documented Linear Recency Weights:
  // Weight for attempt i (1-indexed): W_i = i / sum(1..n)
  const sumIndices = (n * (n + 1)) / 2;
  const recencyWeights: RecencyWeightDetail[] = [];
  let baselineWeightedScore = 0;

  for (let i = 0; i < n; i++) {
    const attemptIndex = i + 1;
    const weight = Number((attemptIndex / sumIndices).toFixed(4));
    const score = scores[i];
    const weightedScore = Number((score * weight).toFixed(2));
    baselineWeightedScore += score * (attemptIndex / sumIndices);

    recencyWeights.push({
      attempt: attemptIndex,
      date: validRecords[i].date,
      assessmentName: validRecords[i].assessmentName,
      score,
      weight,
      weightedScore
    });
  }
  baselineWeightedScore = Number(baselineWeightedScore.toFixed(2));

  // Chronological trend calculation
  const { slope, direction } = calculateChronologicalTrend(scores);
  
  // Capped Trend Adjustment: T = clamp(slope * 0.75, -7.5%, +7.5%)
  const rawTrendAdjustment = slope !== null ? slope * 0.75 : 0;
  const trendAdjustment = Number(Math.max(-7.5, Math.min(7.5, rawTrendAdjustment)).toFixed(2));

  // Multi-Category Heuristic factors (if provided and enabled)
  let multiCategoryAdjustment = 0;
  const multiCategoryRationale: string[] = [];

  if (options?.useMultiCategoryHeuristic) {
    if (options.attendance) {
      categoriesUsed.push('Attendance Records (Category E)');
      const att = options.attendance.attendancePercentage;
      if (att >= 85) {
        multiCategoryAdjustment += 1.0;
        multiCategoryRationale.push(`High attendance (${att}%) contributed +1.0% positive adjustment.`);
      } else if (att < 65) {
        multiCategoryAdjustment -= 1.5;
        multiCategoryRationale.push(`Low attendance (${att}%) applied -1.5% risk adjustment.`);
      } else {
        multiCategoryRationale.push(`Attendance (${att}%) within standard baseline; neutral impact.`);
      }
    }

    if (options.studyHabit) {
      categoriesUsed.push('Self-Reported Study Habits (Category C)');
      if (options.studyHabit.revisionFrequency === 'Daily' || options.studyHabit.revisionFrequency === '3-4 times/week') {
        multiCategoryAdjustment += 0.5;
        multiCategoryRationale.push(`Consistent revision frequency (${options.studyHabit.revisionFrequency}) added +0.5%.`);
      }
    }

    if (options.engagement) {
      categoriesUsed.push('Learning Engagement (Category D)');
      const engProg = options.engagement.progressPercentage;
      if (engProg >= 80) {
        multiCategoryAdjustment += 1.0;
        multiCategoryRationale.push(`Strong LMS engagement (${engProg}% module completion) added +1.0%.`);
      } else if (engProg < 40) {
        multiCategoryAdjustment -= 1.0;
        multiCategoryRationale.push(`Low LMS engagement (${engProg}% module completion) applied -1.0%.`);
      }
    }

    if (options.practice) {
      categoriesUsed.push('Practice & Quiz Activity (Category B)');
      const accuracy = options.practice.accuracyPercentage;
      if (accuracy >= 80) {
        multiCategoryAdjustment += 1.0;
        multiCategoryRationale.push(`Practice quiz accuracy of ${accuracy}% added +1.0%.`);
      } else if (accuracy < 50) {
        multiCategoryAdjustment -= 1.5;
        multiCategoryRationale.push(`Practice quiz accuracy below 50% (${accuracy}%) applied -1.5%.`);
      }
    }

    // Clamp total multi-factor modifier to [-3.0, +3.0]
    multiCategoryAdjustment = Number(Math.max(-3.0, Math.min(3.0, multiCategoryAdjustment)).toFixed(2));
  }

  // Final Estimated Score
  const rawEstimate = baselineWeightedScore + trendAdjustment + multiCategoryAdjustment;
  const clampedScore = Number(Math.max(0, Math.min(100, rawEstimate)).toFixed(2));

  const dataSufficiency: DataSufficiencyStatus = 
    n >= 3 ? 'Sufficient chronological records' : 'Limited historical evidence';

  const explanation = [
    `Weighted historical baseline: ${baselineWeightedScore}% calculated from ${n} assessments using linear recency weighting (most recent assessment receives highest weight).`,
    slope !== null
      ? `Chronological trend slope: ${slope > 0 ? '+' : ''}${slope}% per assessment (${direction}). Capped trend adjustment applied: ${trendAdjustment > 0 ? '+' : ''}${trendAdjustment}%.`
      : 'Insufficient distinct dates to calculate trend slope.',
    options?.useMultiCategoryHeuristic && multiCategoryRationale.length > 0
      ? `Multi-category heuristic modifier: ${multiCategoryAdjustment > 0 ? '+' : ''}${multiCategoryAdjustment}% based on non-academic factors.`
      : 'Prediction derived exclusively from academic marks.',
    `Final clamped score prediction: ${clampedScore}% for the next assessment in this topic.`
  ];

  return {
    studentId,
    targetSubjectId,
    targetTopicId,
    estimatedScore: clampedScore,
    historicalAverage,
    mostRecentScore,
    attemptsUsed: n,
    trendDirection: direction,
    trendSlope: slope,
    dataSufficiency,
    methodUsed: 'Weighted Recent-Score Baseline with Capped Trend Adjustment',
    categoriesUsed,
    explanation,
    formulaBreakdown: {
      baselineWeightedScore,
      trendAdjustment,
      recencyWeights,
      multiCategoryAdjustment,
      multiCategoryRationale,
      clampedScore,
    },
    limitations: [
      'Prediction assumes assessment difficulty and evaluation rigor are consistent with past evaluations.',
      'Estimate represents an expected baseline under current study trajectories, not a guaranteed examination grade.',
      'Extraneous factors (health, exam-day stress, rubric shifts) cannot be modeled from historical coursework alone.'
    ]
  };
}

/**
 * Summarizes performance for a given topic across a student's assessment records
 */
export function summarizeTopicPerformance(
  topic: Topic,
  subjectName: string,
  records: AssessmentRecord[],
  studentId: string,
  reviewThreshold: number,
  allTopics: Topic[]
): TopicSummary {
  const topicRecords = records
    .filter(
      r => r.studentId === studentId &&
           r.topicId === topic.id &&
           r.status === 'completed' &&
           r.maxMarks > 0
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const n = topicRecords.length;

  if (n === 0) {
    return {
      topicId: topic.id,
      topicName: topic.name,
      subjectId: topic.subjectId,
      subjectName,
      attemptsCount: 0,
      averagePercentage: null,
      medianPercentage: null,
      minPercentage: null,
      maxPercentage: null,
      recentScore: null,
      trend: 'insufficient',
      status: 'Insufficient data',
      reason: 'No completed assessment attempts recorded for this topic.',
      recommendedAction: 'Schedule an initial diagnostic test or practice quiz to establish baseline performance.',
      prerequisitesMastered: true,
      unmasteredPrerequisites: []
    };
  }

  const scores = topicRecords.map(r => r.percentage);
  const averagePercentage = calculateMean(scores)!;
  const medianPercentage = calculateMedian(scores)!;
  const minPercentage = Math.min(...scores);
  const maxPercentage = Math.max(...scores);
  const recentScore = scores[n - 1];

  const { direction } = calculateChronologicalTrend(scores);

  // Check prerequisite mastery
  const unmasteredPrerequisites: string[] = [];
  if (topic.prerequisites && topic.prerequisites.length > 0) {
    for (const prereqId of topic.prerequisites) {
      const prereqTopic = allTopics.find(t => t.id === prereqId);
      const prereqRecords = records.filter(
        r => r.studentId === studentId && r.topicId === prereqId && r.status === 'completed'
      );
      if (prereqRecords.length === 0) {
        unmasteredPrerequisites.push(prereqTopic ? `${prereqTopic.name} (No data)` : prereqId);
      } else {
        const prereqAvg = calculateMean(prereqRecords.map(r => r.percentage)) || 0;
        if (prereqAvg < reviewThreshold) {
          unmasteredPrerequisites.push(prereqTopic ? `${prereqTopic.name} (${prereqAvg}%)` : prereqId);
        }
      }
    }
  }

  let status: TopicRiskStatus = 'On track';
  let reason = '';
  let recommendedAction = '';

  if (averagePercentage < reviewThreshold) {
    status = 'Needs attention';
    reason = `Calculated average of ${averagePercentage}% is below the configured review threshold of ${reviewThreshold}%.`;
    if (unmasteredPrerequisites.length > 0) {
      recommendedAction = `Review foundational prerequisite topics [${unmasteredPrerequisites.join(', ')}] before attempting advanced practice in ${topic.name}.`;
    } else {
      recommendedAction = `Allocate targeted revision sessions and complete 2 practice problem sets covering core principles of ${topic.name}.`;
    }
  } else if (averagePercentage < reviewThreshold + 15) {
    status = 'Developing';
    reason = `Calculated average of ${averagePercentage}% is within the developing range (${reviewThreshold}% to ${reviewThreshold + 15}%).`;
    recommendedAction = `Reinforce key problem types with timed quizzes to elevate performance towards mastery.`;
  } else {
    status = 'On track';
    reason = `Calculated average of ${averagePercentage}% exceeds the review threshold with steady mastery.`;
    recommendedAction = `Maintain periodic review and proceed with downstream application concepts.`;
  }

  if (direction === 'declining' && status !== 'Needs attention') {
    reason += ` Warning: Chronological scores demonstrate a declining trend (latest: ${recentScore}%).`;
  }

  return {
    topicId: topic.id,
    topicName: topic.name,
    subjectId: topic.subjectId,
    subjectName,
    attemptsCount: n,
    averagePercentage,
    medianPercentage,
    minPercentage,
    maxPercentage,
    recentScore,
    trend: direction,
    status,
    reason,
    recommendedAction,
    prerequisitesMastered: unmasteredPrerequisites.length === 0,
    unmasteredPrerequisites
  };
}

/**
 * Generates evidence-based study recommendations
 */
export function generateEvidenceBasedRecommendations(
  student: Student,
  topics: Topic[],
  assessments: AssessmentRecord[],
  reviewThreshold: number,
  studyHabit?: StudyHabit,
  attendance?: AttendanceRecord[],
  practice?: PracticeQuizActivity[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const topic of topics) {
    const summary = summarizeTopicPerformance(
      topic,
      topic.subjectId,
      assessments,
      student.id,
      reviewThreshold,
      topics
    );

    // Rule 1: Prerequisite Gap
    if (summary.status === 'Needs attention' && summary.unmasteredPrerequisites.length > 0) {
      recommendations.push({
        id: `rec-prereq-${student.id}-${topic.id}`,
        studentId: student.id,
        subjectId: topic.subjectId,
        topicId: topic.id,
        title: `Remediate Prerequisite Foundations for ${topic.name}`,
        recommendedAction: `Complete review of prerequisite topics: ${summary.unmasteredPrerequisites.join(', ')}.`,
        reason: `${topic.name} score is ${summary.averagePercentage}%, heavily constrained by deficits in foundational concepts.`,
        supportingRuleOrData: `Rule: Prerequisite mastery must exceed ${reviewThreshold}% prior to advanced study.`,
        priority: 'High',
        isCompleted: false,
        category: 'Prerequisite Review'
      });
    }
    // Rule 2: Low Topic Average
    else if (summary.status === 'Needs attention') {
      recommendations.push({
        id: `rec-review-${student.id}-${topic.id}`,
        studentId: student.id,
        subjectId: topic.subjectId,
        topicId: topic.id,
        title: `Comprehensive Concept Revision: ${topic.name}`,
        recommendedAction: `Review lecture notes on ${topic.name}, solve 3 benchmark problems, and complete the 20-Question Topic Quiz in the portal to verify retention.`,
        reason: `Average score of ${summary.averagePercentage}% is below the required ${reviewThreshold}% passing threshold.`,
        supportingRuleOrData: `Rule: Topic average < ${reviewThreshold}%. Historical lowest score: ${summary.minPercentage}%.`,
        priority: 'High',
        isCompleted: false,
        category: 'Concept Revision'
      });
    }
    // Rule 3: Declining Trend despite acceptable average
    else if (summary.trend === 'declining' && summary.status === 'Developing') {
      recommendations.push({
        id: `rec-trend-${student.id}-${topic.id}`,
        studentId: student.id,
        subjectId: topic.subjectId,
        topicId: topic.id,
        title: `Halt Score Drift in ${topic.name}`,
        recommendedAction: `Schedule a 45-minute error review session to analyze mistakes in recent assessments, then attempt the 20-Question Quiz to recover momentum.`,
        reason: `Recent scores are tapering downward (latest attempt: ${summary.recentScore}%).`,
        supportingRuleOrData: `Rule: Chronological slope is negative over ${summary.attemptsCount} attempts.`,
        priority: 'Medium',
        isCompleted: false,
        category: 'Practice Reinforcement'
      });
    }
    // Rule 4: Insufficient Assessment Evidence
    else if (summary.status === 'Insufficient data') {
      recommendations.push({
        id: `rec-data-${student.id}-${topic.id}`,
        studentId: student.id,
        subjectId: topic.subjectId,
        topicId: topic.id,
        title: `Attempt Diagnostic Quiz for ${topic.name}`,
        recommendedAction: `Take the official 20-Question Topic Quiz in the portal to establish baseline diagnostic performance data.`,
        reason: `No assessment records exist to evaluate mastery or compute predictive projections.`,
        supportingRuleOrData: `Rule: Minimum 1 assessment required for baseline calculation.`,
        priority: 'Low',
        isCompleted: false,
        category: 'Data Collection'
      });
    }
  }

  // Rule 5: Low Attendance Warning
  if (attendance && attendance.length > 0) {
    for (const att of attendance) {
      if (att.studentId === student.id && att.attendancePercentage < 75) {
        recommendations.push({
          id: `rec-att-${student.id}-${att.subjectId}`,
          studentId: student.id,
          subjectId: att.subjectId,
          topicId: 'general',
          title: `Attend Upcoming Lecture Sessions (${att.subjectId})`,
          recommendedAction: `Attend the next 4 consecutive lectures to restore attendance above institutional threshold.`,
          reason: `Current attendance is ${att.attendancePercentage}% (${att.classesAttended}/${att.totalClassesHeld} classes).`,
          supportingRuleOrData: `Rule: Minimum institutional attendance requirement is 75%.`,
          priority: 'High',
          isCompleted: false,
          category: 'Practice Reinforcement'
        });
      }
    }
  }

  // Rule 6: Study Habit check
  if (studyHabit && studyHabit.studentId === student.id) {
    if (studyHabit.studyHoursPerWeek < 6) {
      recommendations.push({
        id: `rec-habit-${student.id}`,
        studentId: student.id,
        subjectId: 'general',
        topicId: 'general',
        title: `Increase Weekly Dedicated Study Hours`,
        recommendedAction: `Set aside at least 1.5 to 2 hours of daily study distributed across subjects, as self-reported in your Study Habits dashboard.`,
        reason: `Self-reported study time of ${studyHabit.studyHoursPerWeek} hrs/week is below the recommended curriculum pace.`,
        supportingRuleOrData: `Self-reported study habit record (Category C).`,
        priority: 'High',
        isCompleted: false,
        category: 'Practice Reinforcement'
      });
    }
  }

  // STRICT PRIORITY ORDERING: High Priority items are arranged UPPER in the lane
  const priorityRank: Record<string, number> = {
    'High': 1,
    'Medium': 2,
    'Low': 3
  };

  recommendations.sort((a, b) => {
    const rankA = priorityRank[a.priority] || 99;
    const rankB = priorityRank[b.priority] || 99;
    if (rankA !== rankB) return rankA - rankB; // High (1) before Medium (2) before Low (3)
    return a.title.localeCompare(b.title);
  });

  return recommendations;
}

/**
 * Topic Prerequisite Directed Graph Algorithms
 */

export interface CycleDetectionResult {
  hasCycle: boolean;
  cycleNodes: string[];
  explanation: string;
}

/**
 * Detects cycles in prerequisite graph using Depth-First Search with 3-color states
 * (0 = unvisited, 1 = visiting/active in recursion stack, 2 = visited/completed)
 */
export function detectGraphCycles(topics: Topic[]): CycleDetectionResult {
  const adj = new Map<string, string[]>();
  for (const topic of topics) {
    // Edge from prerequisite -> topic (prerequisite must come first)
    if (!adj.has(topic.id)) adj.set(topic.id, []);
    for (const prereqId of topic.prerequisites) {
      if (!adj.has(prereqId)) adj.set(prereqId, []);
      adj.get(prereqId)!.push(topic.id);
    }
  }

  const state = new Map<string, number>(); // 0: unvisited, 1: visiting, 2: visited
  for (const topic of topics) {
    state.set(topic.id, 0);
  }

  const parent = new Map<string, string | null>();
  let cycleNodes: string[] = [];

  function dfs(u: string): boolean {
    state.set(u, 1);
    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (state.get(v) === 1) {
        // Cycle found
        cycleNodes = [v, u];
        let curr = u;
        while (parent.get(curr) && parent.get(curr) !== v) {
          curr = parent.get(curr)!;
          cycleNodes.push(curr);
        }
        cycleNodes.reverse();
        return true;
      }
      if (state.get(v) === 0) {
        parent.set(v, u);
        if (dfs(v)) return true;
      }
    }
    state.set(u, 2);
    return false;
  }

  for (const topic of topics) {
    if (state.get(topic.id) === 0) {
      parent.set(topic.id, null);
      if (dfs(topic.id)) {
        return {
          hasCycle: true,
          cycleNodes,
          explanation: `Circular prerequisite dependency detected involving topics: ${cycleNodes.join(' -> ')} -> ${cycleNodes[0]}. Prerequisite planning is invalid until resolved.`
        };
      }
    }
  }

  return {
    hasCycle: false,
    cycleNodes: [],
    explanation: 'Valid Directed Acyclic Graph (DAG). No circular prerequisite dependencies exist.'
  };
}

/**
 * Breadth-First Search (BFS) Traversal:
 * Explores prerequisite graph level by level from root prerequisites to dependent topics.
 */
export function performBFSTraversal(
  startTopicId: string, 
  topics: Topic[]
): { visitedOrder: string[]; levels: { level: number; topicIds: string[] }[] } {
  const adj = new Map<string, string[]>();
  for (const t of topics) {
    if (!adj.has(t.id)) adj.set(t.id, []);
    for (const p of t.prerequisites) {
      if (!adj.has(p)) adj.set(p, []);
      adj.get(p)!.push(t.id);
    }
  }

  const visited = new Set<string>();
  const queue: { id: string; level: number }[] = [{ id: startTopicId, level: 0 }];
  visited.add(startTopicId);

  const visitedOrder: string[] = [];
  const levelMap = new Map<number, string[]>();

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    visitedOrder.push(id);

    if (!levelMap.has(level)) levelMap.set(level, []);
    levelMap.get(level)!.push(id);

    const neighbors = adj.get(id) || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ id: next, level: level + 1 });
      }
    }
  }

  const levels = Array.from(levelMap.entries()).map(([level, topicIds]) => ({
    level,
    topicIds
  }));

  return { visitedOrder, levels };
}

/**
 * Depth-First Search (DFS) Traversal:
 * Discovers the deep dependency branch from a topic to all downstream dependents.
 */
export function performDFSTraversal(
  startTopicId: string, 
  topics: Topic[]
): { visitedOrder: string[]; branchPath: string[] } {
  const adj = new Map<string, string[]>();
  for (const t of topics) {
    if (!adj.has(t.id)) adj.set(t.id, []);
    for (const p of t.prerequisites) {
      if (!adj.has(p)) adj.set(p, []);
      adj.get(p)!.push(t.id);
    }
  }

  const visited = new Set<string>();
  const visitedOrder: string[] = [];

  function dfs(u: string) {
    visited.add(u);
    visitedOrder.push(u);
    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        dfs(v);
      }
    }
  }

  dfs(startTopicId);
  return { visitedOrder, branchPath: visitedOrder };
}

/**
 * Topological Sort to recommend optimal study sequence based on prerequisites
 */
export function computeTopologicalStudyOrder(topics: Topic[]): Topic[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const t of topics) {
    inDegree.set(t.id, 0);
    adj.set(t.id, []);
  }

  for (const t of topics) {
    for (const prereq of t.prerequisites) {
      if (adj.has(prereq)) {
        adj.get(prereq)!.push(t.id);
        inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const sortedOrder: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    sortedOrder.push(u);
    for (const v of adj.get(u) || []) {
      const newDeg = (inDegree.get(v) || 1) - 1;
      inDegree.set(v, newDeg);
      if (newDeg === 0) queue.push(v);
    }
  }

  // Return topics in topological order, then any remaining
  const result: Topic[] = [];
  for (const id of sortedOrder) {
    const t = topics.find(x => x.id === id);
    if (t) result.push(t);
  }
  for (const t of topics) {
    if (!result.some(x => x.id === t.id)) result.push(t);
  }

  return result;
}
