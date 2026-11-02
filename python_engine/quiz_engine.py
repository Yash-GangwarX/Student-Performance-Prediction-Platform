"""
Interactive 20-Question Topic Assessment Quiz Engine.
Enables students to take quizzes, review detailed explanations, and record marks.
"""

from typing import List, Dict, Optional, Tuple
from datetime import date
from .models import Student, Topic, AssessmentRecord, QuizQuestion
from .question_bank import get_questions_for_topic


class QuizSession:
    def __init__(self, student: Student, topic: Topic, subject_id: str):
        self.student = student
        self.topic = topic
        self.subject_id = subject_id
        self.questions: List[QuizQuestion] = get_questions_for_topic(topic.id)
        self.user_answers: Dict[int, int] = {}
        self.is_completed = False
        self.score_obtained = 0
        self.max_score = len(self.questions)
        self.percentage = 0.0

    def submit_answer(self, question_index: int, selected_option_index: int):
        """Records the student's answer for a question index (0 to 19)."""
        if 0 <= question_index < len(self.questions):
            self.user_answers[question_index] = selected_option_index

    def finalize_quiz(self, attempt_number: int = 1) -> AssessmentRecord:
        """Calculates final score and creates an official AssessmentRecord."""
        correct_count = 0
        for i, q in enumerate(self.questions):
            ans = self.user_answers.get(i)
            if ans is not None and ans == q.correct_option_index:
                correct_count += 1
                
        self.score_obtained = correct_count
        self.max_score = len(self.questions) if self.questions else 20
        self.percentage = round((self.score_obtained / self.max_score) * 100.0, 1)
        self.is_completed = True
        
        record = AssessmentRecord(
            id=f"REC-QUIZ-{int(date.today().strftime('%Y%m%d'))}-{self.topic.id}-{attempt_number}",
            student_id=self.student.id,
            subject_id=self.subject_id,
            topic_id=self.topic.id,
            assessment_name=f"{self.topic.name} Topic Quiz (20 Qs) - Attempt {attempt_number}",
            assessment_type='Quiz',
            obtained_marks=float(self.score_obtained),
            max_marks=float(self.max_score),
            date=date.today().isoformat(),
            attempt_number=attempt_number,
            status='Completed'
        )
        return record

    def get_summary_report(self) -> str:
        """Generates an ASCII review report of the quiz results."""
        lines = [
            "=" * 60,
            f"  NIET CSE - 20-QUESTION TOPIC ASSESSMENT REPORT",
            "=" * 60,
            f"  Student: {self.student.name} ({self.student.id})",
            f"  Topic:   {self.topic.name}",
            f"  Score:   {self.score_obtained} / {self.max_score} marks ({self.percentage}%)",
            f"  Status:  {'MASTERY ACHIEVED (>=75%)' if self.percentage >= 75 else ('NEEDS REVISION' if self.percentage >= 60 else 'HIGH RISK (<60%)')}",
            "-" * 60
        ]
        
        for i, q in enumerate(self.questions):
            user_ans = self.user_answers.get(i)
            is_correct = user_ans == q.correct_option_index
            status_symbol = "[CORRECT]" if is_correct else "[INCORRECT]"
            user_opt_str = q.options[user_ans] if user_ans is not None and 0 <= user_ans < len(q.options) else "Not Answered"
            correct_opt_str = q.options[q.correct_option_index]
            
            lines.append(f"\nQ{i+1:02d}. {q.question}")
            lines.append(f"     Your answer:    {user_opt_str} {status_symbol}")
            if not is_correct:
                lines.append(f"     Correct answer: {correct_opt_str}")
            lines.append(f"     Explanation:    {q.explanation}")
            
        lines.append("=" * 60)
        return "\n".join(lines)
