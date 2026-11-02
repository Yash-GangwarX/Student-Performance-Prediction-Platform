"""
Statistical, predictive, and recommendation calculation algorithms.
Implements recency momentum weighting: W_i = (2 * i) / (n * (n + 1))
and evidence-based academic recommendation prioritization.
"""

from typing import List, Optional, Dict
from .models import (
    AssessmentRecord, 
    Topic, 
    TopicSummary, 
    PerformancePrediction, 
    RecencyWeight, 
    TopicRiskStatus, 
    Recommendation,
    StudyHabit,
    AttendanceRecord,
    EngagementRecord,
    PracticeQuizActivity
)


def calculate_mean(values: List[float]) -> Optional[float]:
    """Computes arithmetic mean of a list of floats."""
    if not values:
        return None
    return round(sum(values) / len(values), 2)


def calculate_chronological_trend(scores: List[float]) -> str:
    """Calculates linear slope across chronologically ordered assessment percentages."""
    n = len(scores)
    if n < 2:
        return 'Stable'
    
    x_mean = (n - 1) / 2.0
    y_mean = sum(scores) / n
    
    numerator = 0.0
    denominator = 0.0
    for i, y in enumerate(scores):
        dx = i - x_mean
        numerator += dx * (y - y_mean)
        denominator += dx * dx
        
    if denominator == 0:
        return 'Stable'
        
    slope = numerator / denominator
    if slope > 1.5:
        return 'Improving'
    elif slope < -1.5:
        return 'Declining'
    return 'Stable'


def summarize_topic_performance(
    topic: Topic,
    subject_name: str,
    assessments: List[AssessmentRecord],
    student_id: str,
    review_threshold: float = 70.0,
    all_topics: Optional[List[Topic]] = None
) -> TopicSummary:
    """Evaluates student mastery and prerequisite status for a single topic."""
    relevant = [
        a for a in assessments
        if a.student_id == student_id and a.topic_id == topic.id and a.status == 'Completed'
    ]
    
    scores = [a.percentage for a in relevant]
    avg = calculate_mean(scores)
    
    risk_status: TopicRiskStatus = 'On track'
    if avg is None:
        risk_status = 'Moderate risk'
    elif avg < 60.0:
        risk_status = 'High risk'
    elif avg < review_threshold:
        risk_status = 'Moderate risk'
    else:
        risk_status = 'On track'
        
    # Prerequisite verification
    prereqs_met = True
    unmet: List[str] = []
    
    if all_topics and topic.prerequisite_ids:
        for pid in topic.prerequisite_ids:
            p_assessments = [
                a for a in assessments
                if a.student_id == student_id and a.topic_id == pid and a.status == 'Completed'
            ]
            p_scores = [a.percentage for a in p_assessments]
            p_avg = calculate_mean(p_scores)
            p_topic = next((t for t in all_topics if t.id == pid), None)
            p_name = p_topic.name if p_topic else pid
            
            if p_avg is None or p_avg < review_threshold:
                prereqs_met = False
                unmet.append(p_name)
                
    return TopicSummary(
        topic_id=topic.id,
        topic_name=topic.name,
        subject_name=subject_name,
        average_score=avg,
        attempt_count=len(relevant),
        risk_status=risk_status,
        prerequisites_met=prereqs_met,
        unmet_prerequisite_names=unmet
    )


def calculate_performance_prediction(
    student_id: str,
    assessments: List[AssessmentRecord],
    subject_id: Optional[str] = None,
    study_habit: Optional[StudyHabit] = None,
    attendance: Optional[List[AttendanceRecord]] = None,
    engagement: Optional[EngagementRecord] = None,
    practice: Optional[List[PracticeQuizActivity]] = None
) -> PerformancePrediction:
    """
    Recent Assessment Momentum & Forecast Influence Engine.
    Uses linear recency weights: W_i = 2i / (n * (n + 1))
    giving progressive momentum to recent evaluations.
    """
    relevant = [
        a for a in assessments
        if a.student_id == student_id and a.status == 'Completed'
        and (subject_id is None or a.subject_id == subject_id)
    ]
    # Sort chronologically by date
    relevant.sort(key=lambda a: a.date)
    n = len(relevant)
    
    if n == 0:
        return PerformancePrediction(
            student_id=student_id,
            estimated_score=None,
            confidence='Low',
            data_sufficiency='Insufficient',
            method_used='Baseline Insufficient Data',
            recency_weights=[],
            explanation=['No completed assessment records available to build an empirical trajectory.'],
            multi_category_rationale=[],
            risk_level='Needs attention'
        )
        
    scores = [a.percentage for a in relevant]
    
    # Calculate recency weights
    recency_weights: List[RecencyWeight] = []
    denom = n * (n + 1)
    base_projection = 0.0
    
    for i, record in enumerate(relevant):
        idx = i + 1  # 1-indexed
        weight = (2.0 * idx) / denom
        weighted_score = record.percentage * weight
        base_projection += weighted_score
        recency_weights.append(RecencyWeight(
            attempt=idx,
            date=record.date,
            score=record.percentage,
            weight=round(weight, 3),
            weighted_score=round(weighted_score, 2)
        ))
        
    trend = calculate_chronological_trend(scores)
    trend_adj = 0.0
    if trend == 'Improving':
        trend_adj = 1.5
    elif trend == 'Declining':
        trend_adj = -2.0
        
    # Multi-category adjustments (capped at ±3.5%)
    multi_cat_adj = 0.0
    multi_cat_notes: List[str] = []
    
    # Category C: Study Habits (Self-reported)
    if study_habit:
        if study_habit.study_hours_per_week >= 12 and study_habit.revision_frequency in ['Daily', '3-4 times/week']:
            multi_cat_adj += 1.0
            multi_cat_notes.append(f"Self-reported routine ({study_habit.study_hours_per_week}h/week, {study_habit.revision_frequency}) added +1.0% consistency factor.")
        elif study_habit.revision_frequency == 'Before Exams' or study_habit.preparation_pattern == 'Cramming':
            multi_cat_adj -= 1.0
            multi_cat_notes.append("Massed practice / cramming pattern applied -1.0% retention risk.")
            
    # Category E: Attendance
    if attendance:
        overall_att = [a.attendance_percentage for a in attendance]
        avg_att = sum(overall_att) / len(overall_att) if overall_att else 80.0
        if avg_att >= 85.0:
            multi_cat_adj += 1.0
            multi_cat_notes.append(f"Strong lecture attendance ({avg_att:.1f}%) added +1.0% institutional factor.")
        elif avg_att < 75.0:
            multi_cat_adj -= 1.5
            multi_cat_notes.append(f"Sub-threshold lecture attendance ({avg_att:.1f}% < 75%) applied -1.5% deficit factor.")
            
    multi_cat_adj = max(-3.5, min(3.5, multi_cat_adj))
    final_score = round(max(0.0, min(100.0, base_projection + trend_adj + multi_cat_adj)), 1)
    
    confidence = 'High' if n >= 3 else ('Moderate' if n == 2 else 'Low')
    sufficiency = 'Robust (>=3 attempts)' if n >= 3 else ('Moderate (2 attempts)' if n == 2 else 'Preliminary (1 attempt)')
    
    risk_level = 'On track' if final_score >= 70.0 else ('Needs attention' if final_score >= 55.0 else 'Critical intervention')
    
    explanation = [
        f"Base projection of {base_projection:.1f}% calculated using recency momentum across {n} attempt(s).",
        f"Chronological trajectory trend evaluated as '{trend}' (Adjustment: {trend_adj:+.1f}%).",
        f"Multi-category educational adjustments contributed {multi_cat_adj:+.1f}% to the final forecast."
    ]
    
    return PerformancePrediction(
        student_id=student_id,
        estimated_score=final_score,
        confidence=confidence,
        data_sufficiency=sufficiency,
        method_used="Recency-Weighted Linear Momentum Model",
        recency_weights=recency_weights,
        explanation=explanation,
        multi_category_rationale=multi_cat_notes,
        risk_level=risk_level
    )


def generate_evidence_based_recommendations(
    student_id: str,
    topics: List[Topic],
    assessments: List[AssessmentRecord],
    study_habits: Optional[List[StudyHabit]] = None,
    attendance_records: Optional[List[AttendanceRecord]] = None
) -> List[Recommendation]:
    """
    Generates actionable remediation prescriptions.
    STRICT PRIORITY ORDERING: High Priority items are positioned uppermost.
    """
    recommendations: List[Recommendation] = []
    
    for topic in topics:
        relevant = [
            a for a in assessments
            if a.student_id == student_id and a.topic_id == topic.id and a.status == 'Completed'
        ]
        scores = [a.percentage for a in relevant]
        avg = calculate_mean(scores)
        trend = calculate_chronological_trend(scores) if len(scores) >= 2 else 'Stable'
        
        # Rule 1: Prerequisite Check
        if topic.prerequisite_ids:
            for pid in topic.prerequisite_ids:
                p_relevant = [
                    a for a in assessments
                    if a.student_id == student_id and a.topic_id == pid and a.status == 'Completed'
                ]
                p_avg = calculate_mean([a.percentage for a in p_relevant])
                p_topic = next((t for t in topics if t.id == pid), None)
                p_name = p_topic.name if p_topic else pid
                
                if p_avg is not None and p_avg < 70.0 and (avg is None or avg < 70.0):
                    recommendations.append(Recommendation(
                        id=f"REC-PREREQ-{topic.id}-{pid}",
                        student_id=student_id,
                        subject_id=topic.subject_id,
                        topic_id=topic.id,
                        title=f"Repair Foundational Prerequisite: {p_name}",
                        priority='High',
                        category='Prerequisite Review',
                        recommended_action=f"Dedicate 45 minutes to review core concepts in {p_name} before advancing in {topic.name}.",
                        reason=f"Prerequisite {p_name} average is currently {p_avg:.1f}% (below 70% threshold). Deficits in prerequisites compound in advanced modules.",
                        supporting_rule_or_data=f"Prerequisite Dependency: {pid} -> {topic.id} (Prerequisite Mastery: {p_avg:.1f}%)"
                    ))
                    
        # Rule 2: High Risk Topic
        if avg is not None and avg < 60.0:
            recommendations.append(Recommendation(
                id=f"REC-DEFICIT-{topic.id}",
                student_id=student_id,
                subject_id=topic.subject_id,
                topic_id=topic.id,
                title=f"Targeted Remediation for {topic.name}",
                priority='High',
                category='Concept Revision',
                recommended_action=f"Review lecture notes on {topic.name}, solve 3 benchmark problems, and complete the 20-Question Topic Quiz in the portal to verify retention.",
                reason=f"Topic score average is {avg:.1f}%, indicating significant conceptual gaps requiring immediate intervention.",
                supporting_rule_or_data=f"Topic Risk Classification: High Risk (Average: {avg:.1f}%, Threshold: 60.0%)"
            ))
            
        # Rule 3: Declining Trend
        elif avg is not None and trend == 'Declining':
            recommendations.append(Recommendation(
                id=f"REC-TREND-{topic.id}",
                student_id=student_id,
                subject_id=topic.subject_id,
                topic_id=topic.id,
                title=f"Arrest Declining Performance in {topic.name}",
                priority='Medium',
                category='Practice Reinforcement',
                recommended_action=f"Schedule a 45-minute error review session to analyze mistakes in recent assessments, then attempt the 20-Question Quiz to recover momentum.",
                reason="Negative chronological slope observed over consecutive attempts.",
                supporting_rule_or_data=f"Empirical Trajectory: Declining slope across {len(relevant)} attempt(s)"
            ))
            
    # Habit-based recommendations
    if study_habits:
        habit = next((h for h in study_habits if h.student_id == student_id), None)
        if habit and habit.study_hours_per_week < 8:
            recommendations.append(Recommendation(
                id=f"REC-HABIT-HOURS-{student_id}",
                student_id=student_id,
                subject_id="general",
                topic_id="general",
                title="Increase Structured Independent Study Time",
                priority='High',
                category='Practice Reinforcement',
                recommended_action="Scale self-study routine from currently reported hours to at least 10–12 hours per week distributed across all 4 subjects.",
                reason=f"Self-reported study allocation is {habit.study_hours_per_week}h/week, which is below the recommended 12h guideline for B.Tech Semester 3.",
                supporting_rule_or_data="Study Habit Audit: Weekly Study Hours < 8.0h threshold"
            ))
            
    # Attendance recommendations
    if attendance_records:
        sub_att = [a for a in attendance_records if a.student_id == student_id]
        for att in sub_att:
            if att.attendance_percentage < 75.0:
                recommendations.append(Recommendation(
                    id=f"REC-ATT-{att.subject_id}",
                    student_id=student_id,
                    subject_id=att.subject_id,
                    topic_id="general",
                    title=f"Attendance Compliance Warning ({att.subject_id})",
                    priority='High',
                    category='Data Collection',
                    recommended_action="Ensure 100% presence in remaining scheduled lectures to restore statutory attendance above 75.0%.",
                    reason=f"Current attendance is {att.attendance_percentage}% ({att.classes_attended}/{att.total_classes_held} lectures). Below 75% threshold triggers debarment warnings.",
                    supporting_rule_or_data=f"Statutory Attendance Threshold: 75.0% (Current: {att.attendance_percentage}%)"
                ))
                
    # Sort strictly: High (1) -> Medium (2) -> Low (3)
    priority_order = {'High': 1, 'Medium': 2, 'Low': 3}
    recommendations.sort(key=lambda r: priority_order.get(r.priority, 99))
    return recommendations
