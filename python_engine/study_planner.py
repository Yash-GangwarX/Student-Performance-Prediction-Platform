"""
Personalized Multi-Subject Study Planner and Timetable Engine.
Computes daily and weekly time utilization across all 4 subjects based on:
- Previous Midterm, Assignment, and 20-Question Quiz marks
- Available days per week (e.g., 3-7 days)
- Available study hours per day (e.g., 1-8+ hours/day)
"""

from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from .models import Student, Subject, Topic, AssessmentRecord, StudyHabit
from .calculations import calculate_mean, summarize_topic_performance


@dataclass
class TopicDiagnostic:
    topic: Topic
    overall_score: float
    midterm_score: Optional[float]
    assignment_score: Optional[float]
    quiz_score: Optional[float]
    attempt_count: int
    risk_level: str
    deficit_reason: str


@dataclass
class SubjectDiagnostic:
    subject: Subject
    overall_score: float
    midterm_score: Optional[float]
    assignment_score: Optional[float]
    quiz_score: Optional[float]
    weight: float
    daily_allotted_minutes: int
    weekly_allotted_hours: float
    urgency_level: str
    diagnostic_reason: str
    target_topics: List[TopicDiagnostic]


@dataclass
class DailySubjectAllocation:
    subject: Subject
    target_topic: TopicDiagnostic
    allotted_minutes: int
    concept_minutes: int
    practice_minutes: int
    quiz_minutes: int
    focus_objective: str
    action_routine: str


@dataclass
class TimetableDay:
    day_number: int
    day_name: str
    total_minutes: int
    subject_allocations: List[DailySubjectAllocation]


@dataclass
class PersonalizedStudyPlan:
    student_id: str
    days_per_week: int
    hours_per_day: float
    total_weekly_minutes: int
    total_weekly_hours: float
    subject_diagnostics: List[SubjectDiagnostic]
    timetable: List[TimetableDay]


def generate_personalized_study_plan(
    student: Student,
    subjects: List[Subject],
    topics: List[Topic],
    assessments: List[AssessmentRecord],
    days_per_week: int = 5,
    hours_per_day: float = 4.0,
    study_habit: Optional[StudyHabit] = None
) -> PersonalizedStudyPlan:
    """
    Generates a mathematically balanced timetable across ALL subjects.
    Weak subjects receive higher allocation, but no subject is neglected.
    """
    days_per_week = max(1, min(7, days_per_week))
    hours_per_day = max(1.0, min(12.0, hours_per_day))
    
    daily_total_minutes = int(hours_per_day * 60)
    total_weekly_minutes = daily_total_minutes * days_per_week
    total_weekly_hours = round(total_weekly_minutes / 60.0, 1)
    
    subject_diagnostics: List[SubjectDiagnostic] = []
    
    # Step 1: Diagnose each subject based on assessments
    for subject in subjects:
        sub_topics = [t for t in topics if t.subject_id == subject.id]
        sub_assessments = [
            a for a in assessments 
            if a.student_id == student.id and a.subject_id == subject.id and a.status == 'Completed'
        ]
        
        midterm_records = [a for a in sub_assessments if a.assessment_type == 'Midterm']
        assignment_records = [a for a in sub_assessments if a.assessment_type == 'Assignment']
        quiz_records = [a for a in sub_assessments if a.assessment_type == 'Quiz']
        
        avg_midterm = calculate_mean([a.percentage for a in midterm_records])
        avg_assignment = calculate_mean([a.percentage for a in assignment_records])
        avg_quiz = calculate_mean([a.percentage for a in quiz_records])
        
        # Weighted overall subject score
        total_weight = 0.0
        weighted_sum = 0.0
        if avg_midterm is not None:
            weighted_sum += avg_midterm * 0.45
            total_weight += 0.45
        if avg_assignment is not None:
            weighted_sum += avg_assignment * 0.30
            total_weight += 0.30
        if avg_quiz is not None:
            weighted_sum += avg_quiz * 0.25
            total_weight += 0.25
            
        overall_sub_score = round(weighted_sum / total_weight, 1) if total_weight > 0 else 70.0
        
        # Topic-level diagnostics
        topic_diags: List[TopicDiagnostic] = []
        for t in sub_topics:
            t_assessments = [a for a in sub_assessments if a.topic_id == t.id]
            t_mid = calculate_mean([a.percentage for a in t_assessments if a.assessment_type == 'Midterm'])
            t_ass = calculate_mean([a.percentage for a in t_assessments if a.assessment_type == 'Assignment'])
            t_q = calculate_mean([a.percentage for a in t_assessments if a.assessment_type == 'Quiz'])
            
            t_sum = 0.0
            t_wt = 0.0
            if t_mid is not None:
                t_sum += t_mid * 0.45
                t_wt += 0.45
            if t_ass is not None:
                t_sum += t_ass * 0.30
                t_wt += 0.30
            if t_q is not None:
                t_sum += t_q * 0.25
                t_wt += 0.25
            t_score = round(t_sum / t_wt, 1) if t_wt > 0 else 70.0
            
            risk = 'High Risk' if t_score < 60 else ('Moderate Risk' if t_score < 75 else 'Mastered')
            reason = f"Combined score {t_score}%. "
            if t_mid is not None and t_mid < 60:
                reason += f"Low Midterm mark ({t_mid:.0f}%). "
            if t_q is not None and t_q < 60:
                reason += f"Low 20-Q Quiz accuracy ({t_q:.0f}%). "
                
            topic_diags.append(TopicDiagnostic(
                topic=t,
                overall_score=t_score,
                midterm_score=t_mid,
                assignment_score=t_ass,
                quiz_score=t_q,
                attempt_count=len(t_assessments),
                risk_level=risk,
                deficit_reason=reason.strip()
            ))
            
        # Sort topics: weakest first
        topic_diags.sort(key=lambda td: td.overall_score)
        
        # Calculate subject weight (inverse score model: deficit = 100 - score)
        deficit = max(15.0, 100.0 - overall_sub_score)
        urgency = 'Critical Priority' if overall_sub_score < 60 else ('Moderate Priority' if overall_sub_score < 75 else 'Maintenance')
        
        diag_reason = (
            f"Urgent focus needed: Average score {overall_sub_score:.0f}%. Recent tests show concept gaps."
            if overall_sub_score < 60 else
            f"Moderate focus: Average score {overall_sub_score:.0f}%. Reinforce benchmark problems."
            if overall_sub_score < 75 else
            f"Maintenance: Strong average score of {overall_sub_score:.0f}%. Maintain retention."
        )
        
        subject_diagnostics.append(SubjectDiagnostic(
            subject=subject,
            overall_score=overall_sub_score,
            midterm_score=avg_midterm,
            assignment_score=avg_assignment,
            quiz_score=avg_quiz,
            weight=deficit,
            daily_allotted_minutes=0,
            weekly_allotted_hours=0.0,
            urgency_level=urgency,
            diagnostic_reason=diag_reason,
            target_topics=topic_diags
        ))
        
    # Step 2: Distribute daily minutes proportionally across ALL 4 subjects
    total_weights = sum(sd.weight for sd in subject_diagnostics)
    allocated_sum = 0
    
    for sd in subject_diagnostics:
        # Proportion of daily minutes, ensuring minimum 25 minutes per subject
        raw_minutes = int((sd.weight / total_weights) * daily_total_minutes)
        clamped_minutes = max(25, raw_minutes)
        sd.daily_allotted_minutes = clamped_minutes
        allocated_sum += clamped_minutes
        
    # Rebalance to match exact daily_total_minutes
    diff = daily_total_minutes - allocated_sum
    if diff != 0 and subject_diagnostics:
        # Add or subtract difference from the highest priority subject
        subject_diagnostics[0].daily_allotted_minutes = max(20, subject_diagnostics[0].daily_allotted_minutes + diff)
        
    for sd in subject_diagnostics:
        sd.weekly_allotted_hours = round((sd.daily_allotted_minutes * days_per_week) / 60.0, 1)
        
    # Step 3: Construct day-by-day timetable
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    timetable: List[TimetableDay] = []
    
    for d in range(days_per_week):
        day_allocations: List[DailySubjectAllocation] = []
        
        for sd in subject_diagnostics:
            # Pick topic rotation for this day
            topic_idx = d % len(sd.target_topics)
            target = sd.target_topics[topic_idx]
            
            mins = sd.daily_allotted_minutes
            concept_mins = max(10, int(mins * 0.40))
            practice_mins = max(10, int(mins * 0.35))
            quiz_mins = max(10, mins - concept_mins - practice_mins)
            
            objective = f"Review theory and definitions for {target.topic.name}"
            routine = (
                f"1. Theory ({concept_mins}m): Review lecture slides & textbook notes on {target.topic.name}. "
                f"2. Drills ({practice_mins}m): Solve 2-3 standard problems. "
                f"3. 20-Q Quiz ({quiz_mins}m): Complete official 20-Question topic quiz in student portal."
            )
            
            day_allocations.append(DailySubjectAllocation(
                subject=sd.subject,
                target_topic=target,
                allotted_minutes=mins,
                concept_minutes=concept_mins,
                practice_minutes=practice_mins,
                quiz_minutes=quiz_mins,
                focus_objective=objective,
                action_routine=routine
            ))
            
        timetable.append(TimetableDay(
            day_number=d + 1,
            day_name=day_names[d % 7],
            total_minutes=daily_total_minutes,
            subject_allocations=day_allocations
        ))
        
    return PersonalizedStudyPlan(
        student_id=student.id,
        days_per_week=days_per_week,
        hours_per_day=hours_per_day,
        total_weekly_minutes=total_weekly_minutes,
        total_weekly_hours=total_weekly_hours,
        subject_diagnostics=subject_diagnostics,
        timetable=timetable
    )
