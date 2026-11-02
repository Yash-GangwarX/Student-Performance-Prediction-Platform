"""
Pre-populated academic dataset for NIET Greater Noida.
Department: Computer Science and Engineering
Programme: B.Tech Computer Science and Engineering
Cohort: Semester 3, Section F
Students: Vedant, Vyash, Yogesh, Yash, Rahul, Gyanendra, Anubhav
"""

from typing import List
from .models import (
    Student, 
    Subject, 
    Topic, 
    AssessmentRecord, 
    StudyHabit, 
    AttendanceRecord, 
    EngagementRecord, 
    PracticeQuizActivity
)

STUDENTS: List[Student] = [
    Student(id="NIET-2026-001", name="Vedant", avatar_color="bg-blue-600"),
    Student(id="NIET-2026-002", name="Vyash", avatar_color="bg-emerald-600"),
    Student(id="NIET-2026-003", name="Yogesh", avatar_color="bg-purple-600"),
    Student(id="NIET-2026-004", name="Yash", avatar_color="bg-amber-600"),
    Student(id="NIET-2026-005", name="Rahul", avatar_color="bg-rose-600"),
    Student(id="NIET-2026-006", name="Gyanendra", avatar_color="bg-indigo-600"),
    Student(id="NIET-2026-007", name="Anubhav", avatar_color="bg-cyan-600"),
]

SUBJECTS: List[Subject] = [
    Subject(
        id="CS301",
        code="KCS-301",
        name="Data Structures & Algorithms",
        credit_hours=4,
        syllabus_description="Linear and non-linear data structures, trees, graphs, sorting, searching, and complexity analysis."
    ),
    Subject(
        id="CS302",
        code="KCS-302",
        name="Database Management Systems",
        credit_hours=4,
        syllabus_description="Relational database design, ER modeling, SQL, normalization (1NF-BCNF), transaction processing and indexing."
    ),
    Subject(
        id="CS303",
        code="KCS-303",
        name="Computer Organization & Architecture",
        credit_hours=3,
        syllabus_description="Machine instructions, ALU design, memory hierarchy, pipelining, cache coherence, and I/O organization."
    ),
    Subject(
        id="CS304",
        code="KAS-302",
        name="Discrete Mathematics & Structures",
        credit_hours=4,
        syllabus_description="Set theory, propositional & predicate logic, combinatorics, recurrence relations, and algebraic structures."
    )
]

TOPICS: List[Topic] = [
    # CS301 Data Structures
    Topic(id="TOP-DS-01", subject_id="CS301", name="Arrays & Asymptotic Notation", unit="Unit 1", prerequisite_ids=[]),
    Topic(id="TOP-DS-02", subject_id="CS301", name="Linked Lists & Doubly Linked Lists", unit="Unit 2", prerequisite_ids=["TOP-DS-01"]),
    Topic(id="TOP-DS-03", subject_id="CS301", name="Binary Trees & BST Traversals", unit="Unit 3", prerequisite_ids=["TOP-DS-02"]),
    Topic(id="TOP-DS-04", subject_id="CS301", name="Graph Algorithms (BFS/DFS/Dijkstra)", unit="Unit 4", prerequisite_ids=["TOP-DS-03"]),

    # CS302 Database Management Systems
    Topic(id="TOP-DB-01", subject_id="CS302", name="Relational Model & Keys", unit="Unit 1", prerequisite_ids=[]),
    Topic(id="TOP-DB-02", subject_id="CS302", name="Entity-Relationship (ER) Modeling", unit="Unit 2", prerequisite_ids=["TOP-DB-01"]),
    Topic(id="TOP-DB-03", subject_id="CS302", name="Complex SQL Queries & Joins", unit="Unit 3", prerequisite_ids=["TOP-DB-01"]),
    Topic(id="TOP-DB-04", subject_id="CS302", name="Normalization (1NF to BCNF)", unit="Unit 4", prerequisite_ids=["TOP-DB-01", "TOP-DB-03"]),

    # CS303 Computer Organization & Architecture
    Topic(id="TOP-CO-01", subject_id="CS303", name="Instruction Set Architecture & Addressing", unit="Unit 1", prerequisite_ids=[]),
    Topic(id="TOP-CO-02", subject_id="CS303", name="Memory Hierarchy & Cache Design", unit="Unit 2", prerequisite_ids=["TOP-CO-01"]),
    Topic(id="TOP-CO-03", subject_id="CS303", name="Instruction Pipelining & Hazards", unit="Unit 3", prerequisite_ids=["TOP-CO-01"]),
    Topic(id="TOP-CO-04", subject_id="CS303", name="ALU, Booth's Algorithm & Floating Point", unit="Unit 4", prerequisite_ids=["TOP-CO-01"]),

    # CS304 Discrete Mathematics
    Topic(id="TOP-DM-01", subject_id="CS304", name="Propositional & First-Order Logic", unit="Unit 1", prerequisite_ids=[]),
    Topic(id="TOP-DM-02", subject_id="CS304", name="Set Theory, Relations & Functions", unit="Unit 2", prerequisite_ids=["TOP-DM-01"]),
    Topic(id="TOP-DM-03", subject_id="CS304", name="Recurrence Relations & Generating Functions", unit="Unit 3", prerequisite_ids=["TOP-DM-02"]),
    Topic(id="TOP-DM-04", subject_id="CS304", name="Graph Theory & Euler/Hamilton Circuits", unit="Unit 4", prerequisite_ids=["TOP-DM-02"])
]

ASSESSMENTS: List[AssessmentRecord] = [
    # Vedant (NIET-2026-001)
    AssessmentRecord(id="REC-001", student_id="NIET-2026-001", subject_id="CS301", topic_id="TOP-DS-01", assessment_name="Midterm 1: Arrays & Complexity", assessment_type="Midterm", obtained_marks=24, max_marks=30, date="2026-09-15"),
    AssessmentRecord(id="REC-002", student_id="NIET-2026-001", subject_id="CS301", topic_id="TOP-DS-02", assessment_name="Assignment 1: Linked List Pointers", assessment_type="Assignment", obtained_marks=18, max_marks=20, date="2026-09-28"),
    AssessmentRecord(id="REC-003", student_id="NIET-2026-001", subject_id="CS301", topic_id="TOP-DS-03", assessment_name="Binary Trees 20-Q Quiz", assessment_type="Quiz", obtained_marks=17, max_marks=20, date="2026-10-10"),
    AssessmentRecord(id="REC-004", student_id="NIET-2026-001", subject_id="CS302", topic_id="TOP-DB-01", assessment_name="Midterm 1: Relational Schema & Keys", assessment_type="Midterm", obtained_marks=26, max_marks=30, date="2026-09-17"),
    AssessmentRecord(id="REC-005", student_id="NIET-2026-001", subject_id="CS302", topic_id="TOP-DB-03", assessment_name="Assignment 1: SQL Aggregations & Joins", assessment_type="Assignment", obtained_marks=19, max_marks=20, date="2026-10-02"),
    AssessmentRecord(id="REC-006", student_id="NIET-2026-001", subject_id="CS303", topic_id="TOP-CO-01", assessment_name="Midterm 1: Addressing Modes", assessment_type="Midterm", obtained_marks=22, max_marks=30, date="2026-09-19"),
    AssessmentRecord(id="REC-007", student_id="NIET-2026-001", subject_id="CS304", topic_id="TOP-DM-01", assessment_name="Midterm 1: Propositional Logic", assessment_type="Midterm", obtained_marks=25, max_marks=30, date="2026-09-21"),

    # Vyash (NIET-2026-002)
    AssessmentRecord(id="REC-011", student_id="NIET-2026-002", subject_id="CS301", topic_id="TOP-DS-01", assessment_name="Midterm 1: Arrays & Complexity", assessment_type="Midterm", obtained_marks=27, max_marks=30, date="2026-09-15"),
    AssessmentRecord(id="REC-012", student_id="NIET-2026-002", subject_id="CS301", topic_id="TOP-DS-02", assessment_name="Assignment 1: Linked List Pointers", assessment_type="Assignment", obtained_marks=19, max_marks=20, date="2026-09-28"),
    AssessmentRecord(id="REC-013", student_id="NIET-2026-002", subject_id="CS301", topic_id="TOP-DS-03", assessment_name="Binary Trees 20-Q Quiz", assessment_type="Quiz", obtained_marks=19, max_marks=20, date="2026-10-10"),
    AssessmentRecord(id="REC-014", student_id="NIET-2026-002", subject_id="CS302", topic_id="TOP-DB-04", assessment_name="Midterm 1: Normalization & BCNF", assessment_type="Midterm", obtained_marks=28, max_marks=30, date="2026-09-17"),
    AssessmentRecord(id="REC-015", student_id="NIET-2026-002", subject_id="CS303", topic_id="TOP-CO-02", assessment_name="Midterm 1: Cache Design", assessment_type="Midterm", obtained_marks=25, max_marks=30, date="2026-09-19"),
    AssessmentRecord(id="REC-016", student_id="NIET-2026-002", subject_id="CS304", topic_id="TOP-DM-03", assessment_name="Midterm 1: Recurrence Relations", assessment_type="Midterm", obtained_marks=27, max_marks=30, date="2026-09-21"),

    # Rahul (NIET-2026-005) - Needs Intervention
    AssessmentRecord(id="REC-021", student_id="NIET-2026-005", subject_id="CS301", topic_id="TOP-DS-01", assessment_name="Midterm 1: Arrays & Complexity", assessment_type="Midterm", obtained_marks=14, max_marks=30, date="2026-09-15"),
    AssessmentRecord(id="REC-022", student_id="NIET-2026-005", subject_id="CS301", topic_id="TOP-DS-02", assessment_name="Assignment 1: Linked List Pointers", assessment_type="Assignment", obtained_marks=11, max_marks=20, date="2026-09-28"),
    AssessmentRecord(id="REC-023", student_id="NIET-2026-005", subject_id="CS301", topic_id="TOP-DS-03", assessment_name="Binary Trees 20-Q Quiz", assessment_type="Quiz", obtained_marks=10, max_marks=20, date="2026-10-10"),
    AssessmentRecord(id="REC-024", student_id="NIET-2026-005", subject_id="CS302", topic_id="TOP-DB-04", assessment_name="Midterm 1: Normalization & BCNF", assessment_type="Midterm", obtained_marks=12, max_marks=30, date="2026-09-17"),
    AssessmentRecord(id="REC-025", student_id="NIET-2026-005", subject_id="CS303", topic_id="TOP-CO-03", assessment_name="Midterm 1: Pipeline Hazards", assessment_type="Midterm", obtained_marks=13, max_marks=30, date="2026-09-19"),
    AssessmentRecord(id="REC-026", student_id="NIET-2026-005", subject_id="CS304", topic_id="TOP-DM-01", assessment_name="Midterm 1: Propositional Logic", assessment_type="Midterm", obtained_marks=15, max_marks=30, date="2026-09-21"),
]

STUDY_HABITS: List[StudyHabit] = [
    StudyHabit(id="HAB-001", student_id="NIET-2026-001", study_hours_per_week=14.0, revision_frequency="3-4 times/week", practice_frequency="High", preparation_pattern="Regular distributed", last_updated="2026-10-25", notes="Targeting high marks in DSA and DBMS. Preparing for placements."),
    StudyHabit(id="HAB-002", student_id="NIET-2026-002", study_hours_per_week=18.0, revision_frequency="Daily", practice_frequency="High", preparation_pattern="Regular distributed", last_updated="2026-10-26", notes="Active peer mentor and daily problem solver."),
    StudyHabit(id="HAB-003", student_id="NIET-2026-003", study_hours_per_week=10.0, revision_frequency="3-4 times/week", practice_frequency="Moderate", preparation_pattern="Self-paced", last_updated="2026-10-24", notes="Balancing lab projects with regular study."),
    StudyHabit(id="HAB-004", student_id="NIET-2026-004", study_hours_per_week=12.0, revision_frequency="Weekly", practice_frequency="Moderate", preparation_pattern="Group study", last_updated="2026-10-25", notes="Weekend group study and revision sessions."),
    StudyHabit(id="HAB-005", student_id="NIET-2026-005", study_hours_per_week=6.0, revision_frequency="Before Exams", practice_frequency="Low", preparation_pattern="Cramming", last_updated="2026-10-20", notes="Struggling with time management. Requesting faculty consultation."),
    StudyHabit(id="HAB-006", student_id="NIET-2026-006", study_hours_per_week=11.0, revision_frequency="3-4 times/week", practice_frequency="Moderate", preparation_pattern="Regular distributed", last_updated="2026-10-25", notes="Working through previous year university questions."),
    StudyHabit(id="HAB-007", student_id="NIET-2026-007", study_hours_per_week=13.0, revision_frequency="3-4 times/week", practice_frequency="High", preparation_pattern="Regular distributed", last_updated="2026-10-26", notes="Dedicated revision schedule across all 4 subjects.")
]

ATTENDANCE: List[AttendanceRecord] = [
    AttendanceRecord(id="ATT-001", student_id="NIET-2026-001", subject_id="CS301", classes_attended=34, total_classes_held=38),
    AttendanceRecord(id="ATT-002", student_id="NIET-2026-001", subject_id="CS302", classes_attended=32, total_classes_held=36),
    AttendanceRecord(id="ATT-003", student_id="NIET-2026-001", subject_id="CS303", classes_attended=27, total_classes_held=30),
    AttendanceRecord(id="ATT-004", student_id="NIET-2026-001", subject_id="CS304", classes_attended=33, total_classes_held=36),

    AttendanceRecord(id="ATT-005", student_id="NIET-2026-002", subject_id="CS301", classes_attended=37, total_classes_held=38),
    AttendanceRecord(id="ATT-006", student_id="NIET-2026-002", subject_id="CS302", classes_attended=36, total_classes_held=36),
    AttendanceRecord(id="ATT-007", student_id="NIET-2026-002", subject_id="CS303", classes_attended=29, total_classes_held=30),
    AttendanceRecord(id="ATT-008", student_id="NIET-2026-002", subject_id="CS304", classes_attended=35, total_classes_held=36),

    AttendanceRecord(id="ATT-017", student_id="NIET-2026-005", subject_id="CS301", classes_attended=25, total_classes_held=38),  # 65.8% (warning)
    AttendanceRecord(id="ATT-018", student_id="NIET-2026-005", subject_id="CS302", classes_attended=24, total_classes_held=36),  # 66.7% (warning)
    AttendanceRecord(id="ATT-019", student_id="NIET-2026-005", subject_id="CS303", classes_attended=21, total_classes_held=30),  # 70.0%
    AttendanceRecord(id="ATT-020", student_id="NIET-2026-005", subject_id="CS304", classes_attended=23, total_classes_held=36),  # 63.9% (warning)
]
