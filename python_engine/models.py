"""
Data models and type definitions for Student Performance Prediction and Prescription Engine.
Institution: Noida Institute of Engineering & Technology (NIET)
Department: Computer Science and Engineering
Cohort: B.Tech CSE, Semester 3, Section F
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Literal
from datetime import date

AssessmentType = Literal['Quiz', 'Assignment', 'Midterm', 'Final', 'Lab', 'Practice']
AssessmentStatus = Literal['Completed', 'Pending', 'Excused']
TopicRiskStatus = Literal['High risk', 'Moderate risk', 'On track']
InterventionPriority = Literal['High', 'Medium', 'Low']
RecommendationCategory = Literal['Prerequisite Review', 'Concept Revision', 'Practice Reinforcement', 'Data Collection']
RevisionFrequency = Literal['Daily', '3-4 times/week', 'Weekly', 'Before Exams']
PracticeFrequency = Literal['High', 'Moderate', 'Low']
PreparationPattern = Literal['Regular distributed', 'Self-paced', 'Group study', 'Cramming']
UserRole = Literal['student', 'faculty']


@dataclass
class Student:
    id: str  # Roll ID e.g. NIET-2026-001
    name: str
    programme: str = "B.Tech Computer Science and Engineering"
    semester: str = "Sem 3"
    section: str = "F"
    avatar_color: str = "bg-blue-600"


@dataclass
class Subject:
    id: str
    code: str
    name: str
    credit_hours: int
    syllabus_description: str


@dataclass
class Topic:
    id: str
    subject_id: str
    name: str
    prerequisite_ids: List[str] = field(default_factory=list)
    unit: str = "Unit 1"
    importance_weight: float = 1.0


@dataclass
class AssessmentRecord:
    id: str
    student_id: str
    subject_id: str
    topic_id: str
    assessment_name: str
    assessment_type: AssessmentType
    obtained_marks: float
    max_marks: float
    date: str
    attempt_number: int = 1
    status: AssessmentStatus = 'Completed'

    @property
    def percentage(self) -> float:
        if self.max_marks <= 0:
            return 0.0
        return round((self.obtained_marks / self.max_marks) * 100.0, 1)


@dataclass
class StudyHabit:
    id: str
    student_id: str
    study_hours_per_week: float
    revision_frequency: RevisionFrequency
    practice_frequency: PracticeFrequency
    preparation_pattern: PreparationPattern
    last_updated: str
    notes: Optional[str] = None


@dataclass
class AttendanceRecord:
    id: str
    student_id: str
    subject_id: str
    classes_attended: int
    total_classes_held: int

    @property
    def attendance_percentage(self) -> float:
        if self.total_classes_held <= 0:
            return 0.0
        return round((self.classes_attended / self.total_classes_held) * 100.0, 1)


@dataclass
class EngagementRecord:
    id: str
    student_id: str
    lms_resource_views: int
    forum_posts: int
    on_time_submission_rate: float
    last_active: str


@dataclass
class PracticeQuizActivity:
    id: str
    student_id: str
    subject_id: str
    quizzes_attempted: int
    quizzes_completed: int
    average_accuracy: float


@dataclass
class QuizQuestion:
    id: str
    topic_id: str
    question: str
    options: List[str]
    correct_option_index: int
    explanation: str
    difficulty: Literal['Easy', 'Medium', 'Hard'] = 'Easy'


@dataclass
class Recommendation:
    id: str
    student_id: str
    subject_id: str
    topic_id: str
    title: str
    priority: InterventionPriority
    category: RecommendationCategory
    recommended_action: str
    reason: str
    supporting_rule_or_data: str
    is_completed: bool = False


@dataclass
class TopicSummary:
    topic_id: str
    topic_name: str
    subject_name: str
    average_score: Optional[float]
    attempt_count: int
    risk_status: TopicRiskStatus
    prerequisites_met: bool
    unmet_prerequisite_names: List[str] = field(default_factory=list)


@dataclass
class RecencyWeight:
    attempt: int
    date: str
    score: float
    weight: float
    weighted_score: float


@dataclass
class PerformancePrediction:
    student_id: str
    estimated_score: Optional[float]
    confidence: Literal['High', 'Moderate', 'Low']
    data_sufficiency: Literal['Robust (>=3 attempts)', 'Moderate (2 attempts)', 'Preliminary (1 attempt)', 'Insufficient']
    method_used: str
    recency_weights: List[RecencyWeight]
    explanation: List[str]
    multi_category_rationale: List[str]
    risk_level: Literal['On track', 'Needs attention', 'Critical intervention']
