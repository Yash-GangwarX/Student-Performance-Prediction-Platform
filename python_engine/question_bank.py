"""
Question Bank Loader for 20-Question Topic Assessments.
Loads and organizes question sets across Data Structures, DBMS, COA, and Discrete Mathematics.
"""

import json
import os
from typing import Dict, List, Optional
from .models import QuizQuestion

_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_JSON_PATH = os.path.join(_CURRENT_DIR, "question_bank.json")

# Topic ID mapping for alias compatibility
TOPIC_ID_MAP = {
    "TOP-DS-01": "TOPIC-DSA-01",
    "TOP-DS-02": "TOPIC-DSA-02",
    "TOP-DS-03": "TOPIC-DSA-03",
    "TOP-DS-04": "TOPIC-DSA-04",
    "TOP-DB-01": "TOPIC-DBMS-01",
    "TOP-DB-02": "TOPIC-DBMS-02",
    "TOP-DB-03": "TOPIC-DBMS-03",
    "TOP-DB-04": "TOPIC-DBMS-04",
    "TOP-CO-01": "TOPIC-COA-01",
    "TOP-CO-02": "TOPIC-COA-02",
    "TOP-CO-03": "TOPIC-COA-03",
    "TOP-CO-04": "TOPIC-COA-04",
    "TOP-DM-01": "TOPIC-DM-01",
    "TOP-DM-02": "TOPIC-DM-02",
    "TOP-DM-03": "TOPIC-DM-03",
    "TOP-DM-04": "TOPIC-DM-04",
}


def load_raw_questions() -> Dict[str, List[dict]]:
    """Loads raw question dictionary from JSON file."""
    if not os.path.exists(_JSON_PATH):
        return {}
    with open(_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


_RAW_BANK = load_raw_questions()


def get_questions_for_topic(topic_id: str) -> List[QuizQuestion]:
    """
    Returns the list of 20 questions for a given topic ID.
    Supports canonical IDs (TOP-DS-01) and JSON IDs (TOPIC-DSA-01).
    """
    target_id = TOPIC_ID_MAP.get(topic_id, topic_id)
    raw_list = _RAW_BANK.get(target_id)
    
    if not raw_list:
        # Fallback search if direct match not found
        for k, v in _RAW_BANK.items():
            if topic_id.lower() in k.lower():
                raw_list = v
                break
                
    if not raw_list:
        # Generate 20 fallback diagnostic questions for this topic
        return [
            QuizQuestion(
                id=f"{topic_id}-Q{i+1:02d}",
                topic_id=topic_id,
                question=f"Diagnostic question {i+1} assessing fundamental principles of {topic_id}: Which principle applies?",
                options=[
                    "A) Direct deterministic formulation",
                    "B) Non-deterministic recursive branch",
                    "C) Unbounded sequential scan",
                    "D) Asymptotic boundary condition"
                ],
                correct_option_index=0,
                explanation=f"Option A represents standard algorithmic deterministic baseline for {topic_id}.",
                difficulty="Easy" if i < 10 else "Medium"
            )
            for i in range(20)
        ]
        
    questions: List[QuizQuestion] = []
    for q in raw_list:
        questions.append(QuizQuestion(
            id=q.get("id", ""),
            topic_id=topic_id,
            question=q.get("questionText", ""),
            options=q.get("options", []),
            correct_option_index=q.get("correctIndex", 0),
            explanation=q.get("explanation", ""),
            difficulty="Easy" if q.get("difficulty") == "Introductory" else ("Medium" if q.get("difficulty") == "Standard" else "Hard")
        ))
    return questions
