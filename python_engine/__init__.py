"""
NIET Student Performance Prediction & Prescription Python Engine.
Department of Computer Science & Engineering
"""

from .models import (
    Student, 
    Subject, 
    Topic, 
    AssessmentRecord, 
    StudyHabit, 
    AttendanceRecord, 
    EngagementRecord, 
    Recommendation,
    QuizQuestion
)
from .sample_data import STUDENTS, SUBJECTS, TOPICS, ASSESSMENTS, STUDY_HABITS, ATTENDANCE
from .calculations import (
    calculate_mean,
    calculate_chronological_trend,
    summarize_topic_performance,
    calculate_performance_prediction,
    generate_evidence_based_recommendations
)
from .study_planner import generate_personalized_study_plan
from .quiz_engine import QuizSession
from .question_bank import get_questions_for_topic

__all__ = [
    "Student",
    "Subject",
    "Topic",
    "AssessmentRecord",
    "StudyHabit",
    "AttendanceRecord",
    "EngagementRecord",
    "Recommendation",
    "QuizQuestion",
    "STUDENTS",
    "SUBJECTS",
    "TOPICS",
    "ASSESSMENTS",
    "STUDY_HABITS",
    "ATTENDANCE",
    "calculate_mean",
    "calculate_chronological_trend",
    "summarize_topic_performance",
    "calculate_performance_prediction",
    "generate_evidence_based_recommendations",
    "generate_personalized_study_plan",
    "QuizSession",
    "get_questions_for_topic"
]
