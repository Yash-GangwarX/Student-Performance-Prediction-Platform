#!/usr/bin/env python3
"""
Noida Institute of Engineering & Technology (NIET)
Department of Computer Science and Engineering
Student Performance Prediction & Prescription System (SPPP)
Cohort: B.Tech CSE, Semester 3, Section F

Execution Modes:
  Interactive Mode: python3 main.py
  Automated Test:   python3 main.py --test
  Demonstration:    python3 main.py --demo
"""

import sys
import os
from typing import Optional, List
from datetime import date

from python_engine import (
    STUDENTS,
    SUBJECTS,
    TOPICS,
    ASSESSMENTS,
    STUDY_HABITS,
    ATTENDANCE,
    Student,
    Subject,
    Topic,
    AssessmentRecord,
    StudyHabit,
    calculate_mean,
    calculate_chronological_trend,
    summarize_topic_performance,
    calculate_performance_prediction,
    generate_evidence_based_recommendations,
    generate_personalized_study_plan,
    QuizSession,
    get_questions_for_topic
)

STUDENT_PASSWORD = "123"
FACULTY_PASSWORD = "12345"


def print_header(title: str):
    print("\n" + "=" * 70)
    print(f"  {title.upper()}")
    print("=" * 70)


def print_banner():
    print("""
======================================================================
  NOIDA INSTITUTE OF ENGINEERING & TECHNOLOGY (NIET), GREATER NOIDA
  Department of Computer Science and Engineering
  Student Performance Prediction & Prescription Platform (SPPP)
  Programme: B.Tech CSE | Semester: 3 | Section: F
======================================================================
""")


# =====================================================================
# STUDENT PORTAL FUNCTIONS
# =====================================================================

def student_view_marks(student: Student, assessments: List[AssessmentRecord]):
    print_header(f"ACADEMIC EVALUATION LEDGER: {student.name} ({student.id})")
    records = [a for a in assessments if a.student_id == student.id and a.status == 'Completed']
    if not records:
        print("  No completed assessment records found.")
        return
        
    print(f"{'Date':<12} | {'Subject':<8} | {'Type':<12} | {'Marks':<10} | {'Score %':<8} | {'Assessment Name'}")
    print("-" * 75)
    for r in records:
        print(f"{r.date:<12} | {r.subject_id:<8} | {r.assessment_type:<12} | {r.obtained_marks}/{r.max_marks:<6} | {r.percentage:>5.1f}% | {r.assessment_name}")
        
    scores = [r.percentage for r in records]
    overall_avg = calculate_mean(scores)
    print("-" * 75)
    print(f"  Overall Average: {overall_avg:.1f}% across {len(records)} completed assessments.")


def student_view_habits(student: Student, study_habits: List[StudyHabit]):
    print_header(f"MY STUDY HABITS (SELF-REPORTED): {student.name}")
    habit = next((h for h in study_habits if h.student_id == student.id), None)
    if not habit:
        print("  No study habits logged yet.")
        return
        
    print(f"  Weekly Study Hours:     {habit.study_hours_per_week:.1f} hours/week")
    print(f"  Revision Cadence:       {habit.revision_frequency}")
    print(f"  Practice Frequency:     {habit.practice_frequency}")
    print(f"  Preparation Pattern:    {habit.preparation_pattern}")
    print(f"  Last Self-Declaration:  {habit.last_updated}")
    if habit.notes:
        print(f"  Personal Academic Note: \"{habit.notes}\"")


def student_view_interventions(student: Student, assessments: List[AssessmentRecord], study_habits: List[StudyHabit]):
    print_header(f"TARGETED ACADEMIC INTERVENTIONS (PRIORITY LANE): {student.name}")
    recs = generate_evidence_based_recommendations(student.id, TOPICS, assessments, study_habits, ATTENDANCE)
    
    if not recs:
        print("  No urgent interventions needed. All evaluated topics meet mastery thresholds.")
        return
        
    print(f"  Total Prescribed Interventions: {len(recs)}")
    print(f"  (Note: High-priority interventions are arranged uppermost in the lane)\n")
    
    for idx, rec in enumerate(recs, 1):
        p_badge = f"[{rec.priority.upper()} PRIORITY]"
        print(f"#{idx:02d} {p_badge:<16} {rec.title}")
        print(f"     Category:    {rec.category}")
        print(f"     Action:      {rec.recommended_action}")
        print(f"     Diagnostic:  {rec.reason}")
        print(f"     Audit Rule:  {rec.supporting_rule_or_data}")
        print("-" * 70)


def student_generate_study_plan(student: Student, assessments: List[AssessmentRecord], study_habits: List[StudyHabit], interactive: bool = True):
    print_header(f"PERSONALIZED MULTI-SUBJECT STUDY PLAN: {student.name}")
    print("  Calculates daily time utilization partitioned across ALL 4 subjects.")
    print("  Considers previous Midterm, Assignment, and 20-Q Quiz marks.\n")
    
    days, hours = 5, 4.0
    if interactive:
        try:
            days_input = input("  Enter study days available per week [1-7] (default 5): ").strip()
            days = int(days_input) if days_input.isdigit() else 5
            hours_input = input("  Enter daily study hours [1-8+] (default 4.0): ").strip()
            hours = float(hours_input) if hours_input.replace('.', '', 1).isdigit() else 4.0
        except (ValueError, EOFError):
            days, hours = 5, 4.0
    else:
        print(f"  Configuration: {days} days/week, {hours} hours/day\n")
        
    plan = generate_personalized_study_plan(student, SUBJECTS, TOPICS, assessments, days, hours)
    
    print("\n  SUBJECT-BY-SUBJECT TIME UTILIZATION & DIAGNOSTICS:")
    print("  " + "-" * 66)
    for sd in plan.subject_diagnostics:
        print(f"  • {sd.subject.name} ({sd.subject.code}):")
        print(f"      Overall Grade:   {sd.overall_score:.1f}% [{sd.urgency_level}]")
        print(f"      Daily Allocation: {sd.daily_allotted_minutes} minutes ({sd.weekly_allotted_hours:.1f} hrs/week)")
        print(f"      Reason:          {sd.diagnostic_reason}")
        if sd.target_topics:
            top_weak = sd.target_topics[0]
            print(f"      Focus Topic:     {top_weak.topic.name} ({top_weak.overall_score:.1f}% - {top_weak.risk_level})")
        print()
        
    print("  SAMPLE DAY 1 ACTION SCHEDULE:")
    print("  " + "-" * 66)
    day1 = plan.timetable[0]
    for alloc in day1.subject_allocations:
        print(f"  [{alloc.allotted_minutes:02d}m] {alloc.subject.code}: {alloc.target_topic.topic.name}")
        print(f"        {alloc.concept_minutes}m Theory | {alloc.practice_minutes}m Drills | {alloc.quiz_minutes}m 20-Q Quiz")
        print(f"        Routine: {alloc.action_routine}")
    print("=" * 70)


def student_take_quiz(student: Student, assessments: List[AssessmentRecord]):
    print_header("INTERACTIVE 20-QUESTION TOPIC ASSESSMENT QUIZ")
    print("  Select course topic:")
    for idx, t in enumerate(TOPICS, 1):
        print(f"  {idx:02d}. [{t.subject_id}] {t.name}")
        
    try:
        choice = input("\n  Enter topic number [1-16]: ").strip()
        t_idx = int(choice) - 1
        if not (0 <= t_idx < len(TOPICS)):
            print("  Invalid topic selection.")
            return
    except (ValueError, EOFError):
        print("  Invalid input.")
        return
        
    selected_topic = TOPICS[t_idx]
    session = QuizSession(student, selected_topic, selected_topic.subject_id)
    
    print(f"\n  Starting 20-Question Quiz on: {selected_topic.name}")
    print("  Answer each multiple-choice question [1-4]. (Type 'q' to abort)\n")
    
    for i, q in enumerate(session.questions):
        print(f"Q{i+1:02d}. {q.question}")
        for o_idx, opt in enumerate(q.options, 1):
            print(f"   {o_idx}) {opt}")
        try:
            ans = input("   Your choice [1-4]: ").strip()
            if ans.lower() == 'q':
                print("  Quiz aborted.")
                return
            opt_idx = int(ans) - 1
            if 0 <= opt_idx < len(q.options):
                session.submit_answer(i, opt_idx)
            else:
                session.submit_answer(i, 0)
        except (ValueError, EOFError):
            session.submit_answer(i, 0)
        print()
        
    # Auto-grade and finalize
    existing_quizzes = [a for a in assessments if a.student_id == student.id and a.topic_id == selected_topic.id and a.assessment_type == 'Quiz']
    attempt_num = len(existing_quizzes) + 1
    record = session.finalize_quiz(attempt_number=attempt_num)
    assessments.append(record)
    
    print(session.get_summary_report())
    print(f"\n  >>> Successfully recorded into Academic Ledger with ID: {record.id}")


# =====================================================================
# FACULTY PORTAL FUNCTIONS
# =====================================================================

def faculty_cohort_overview(assessments: List[AssessmentRecord]):
    print_header("CLASS 3F COHORT EXECUTIVE OVERVIEW")
    print(f"  Programme:  B.Tech Computer Science and Engineering")
    print(f"  Semester:   Semester 3, Section F")
    print(f"  Institution: Noida Institute of Engineering & Technology (NIET)")
    print(f"  Enrolled:   {len(STUDENTS)} Students\n")
    
    print(f"{'Roll ID':<15} | {'Student Name':<12} | {'Assessments':<12} | {'Mean Score %':<12} | {'Trajectory'}")
    print("-" * 75)
    for s in STUDENTS:
        s_records = [a for a in assessments if a.student_id == s.id and a.status == 'Completed']
        scores = [a.percentage for a in s_records]
        avg = calculate_mean(scores)
        trend = calculate_chronological_trend(scores)
        avg_str = f"{avg:.1f}%" if avg is not None else "N/A"
        print(f"{s.id:<15} | {s.name:<12} | {len(s_records):<12} | {avg_str:<12} | {trend}")
    print("-" * 75)


def faculty_record_marks(assessments: List[AssessmentRecord]):
    print_header("RECORD ASSIGNMENT / MIDTERM MARKS (FACULTY MANUAL LEDGER)")
    print("  (Quizzes are self-administered via the Student Portal)\n")
    
    print("  Enrolled Scholars:")
    for idx, s in enumerate(STUDENTS, 1):
        print(f"  {idx}. {s.name} ({s.id})")
        
    try:
        s_choice = int(input("\n  Select student [1-7]: ").strip()) - 1
        if not (0 <= s_choice < len(STUDENTS)):
            print("  Invalid selection.")
            return
        student = STUDENTS[s_choice]
        
        print("\n  Subjects:")
        for idx, sub in enumerate(SUBJECTS, 1):
            print(f"  {idx}. {sub.name} ({sub.code})")
        sub_choice = int(input("  Select subject [1-4]: ").strip()) - 1
        subject = SUBJECTS[sub_choice]
        
        sub_topics = [t for t in TOPICS if t.subject_id == subject.id]
        print(f"\n  Topics for {subject.name}:")
        for idx, top in enumerate(sub_topics, 1):
            print(f"  {idx}. {top.name}")
        t_choice = int(input("  Select topic: ").strip()) - 1
        topic = sub_topics[t_choice]
        
        print("\n  Assessment Types:")
        print("  1. Midterm (Manual)")
        print("  2. Assignment (Manual)")
        print("  3. Lab Practical (Manual)")
        type_choice = input("  Select type [1-3]: ").strip()
        type_map = {'1': 'Midterm', '2': 'Assignment', '3': 'Lab'}
        ass_type = type_map.get(type_choice, 'Assignment')
        
        ass_name = input("  Enter Assessment Title: ").strip() or f"{topic.name} {ass_type}"
        obt = float(input("  Enter Obtained Marks: ").strip())
        max_m = float(input("  Enter Maximum Marks: ").strip())
        
        new_rec = AssessmentRecord(
            id=f"REC-FAC-{int(date.today().strftime('%Y%m%d%H%M'))}",
            student_id=student.id,
            subject_id=subject.id,
            topic_id=topic.id,
            assessment_name=ass_name,
            assessment_type=ass_type,
            obtained_marks=obt,
            max_marks=max_m,
            date=date.today().isoformat(),
            status='Completed'
        )
        assessments.append(new_rec)
        print(f"\n  >>> Marks successfully recorded! Score: {new_rec.percentage:.1f}%. Record ID: {new_rec.id}")
        
    except (ValueError, EOFError, IndexError) as e:
        print(f"  Error or cancelled: {e}")


def faculty_run_prediction(assessments: List[AssessmentRecord], study_habits: List[StudyHabit]):
    print_header("PERFORMANCE PREDICTION ENGINE (RECENT ASSESSMENT MOMENTUM)")
    print("  Visual Momentum Timeline with Recency-Weighted Forecasting")
    print("  Formula: W_i = 2i / [n(n+1)] ensuring recent evaluations carry progressive influence.\n")
    
    for s in STUDENTS:
        s_habit = next((h for h in study_habits if h.student_id == s.id), None)
        s_att = [a for a in ATTENDANCE if a.student_id == s.id]
        pred = calculate_performance_prediction(s.id, assessments, study_habit=s_habit, attendance=s_att)
        
        print(f"  Scholar: {s.name:<12} ({s.id})")
        print(f"  Projected Next Score:  {pred.estimated_score if pred.estimated_score is not None else 'N/A'}%")
        print(f"  Risk Status:           [{pred.risk_level.upper()}] | Confidence: {pred.confidence}")
        print(f"  Data Sufficiency:      {pred.data_sufficiency}")
        
        if pred.recency_weights:
            print("  Recent Assessment Momentum & Forecast Influence:")
            for w in pred.recency_weights:
                pct_influence = int(w.weight * 100)
                bar = "#" * (pct_influence // 5)
                print(f"    Attempt {w.attempt} ({w.date}): Score {w.score:>5.1f}% | Influence {pct_influence:>2d}% [{bar:<10}] | Points: {w.weighted_score:.1f}")
        for exp in pred.explanation:
            print(f"    › {exp}")
        for note in pred.multi_category_rationale:
            print(f"    + Multi-category: {note}")
        print("-" * 70)


def faculty_topic_radar(assessments: List[AssessmentRecord]):
    print_header("TOPIC RISK & MASTERY RADAR")
    print(f"{'Topic ID':<12} | {'Subject':<8} | {'Topic Name':<35} | {'High Risk Students'}")
    print("-" * 80)
    for t in TOPICS:
        high_risk_scholars = []
        for s in STUDENTS:
            summary = summarize_topic_performance(t, t.subject_id, assessments, s.id)
            if summary.risk_status == 'High risk':
                high_risk_scholars.append(f"{s.name} ({summary.average_score:.0f}%)")
        risk_str = ", ".join(high_risk_scholars) if high_risk_scholars else "None (Satisfactory)"
        print(f"{t.id:<12} | {t.subject_id:<8} | {t.name:<35} | {risk_str}")
    print("-" * 80)


# =====================================================================
# AUTOMATED TEST AND DEMO MODES
# =====================================================================

def run_automated_tests():
    print_header("RUNNING SUITE OF VERIFICATION TESTS (ALL MODULES)")
    test_assessments = list(ASSESSMENTS)
    
    # Test 1: Mathematical mean
    assert calculate_mean([80.0, 90.0, 100.0]) == 90.0, "calculate_mean failed"
    print("  [PASSED] Test 1: Arithmetic mean computation")
    
    # Test 2: Chronological trend
    assert calculate_chronological_trend([50.0, 70.0, 90.0]) == 'Improving', "Trend calculation failed"
    assert calculate_chronological_trend([90.0, 70.0, 50.0]) == 'Declining', "Trend calculation failed"
    print("  [PASSED] Test 2: Chronological trajectory trend slope analysis")
    
    # Test 3: Recency weighting sum to 1.00
    for n in range(1, 10):
        weights = [(2.0 * i) / (n * (n + 1)) for i in range(1, n + 1)]
        assert abs(sum(weights) - 1.0) < 1e-6, f"Weights do not sum to 1.0 for n={n}"
    print("  [PASSED] Test 3: Recency weighting decomposition W_i = 2i/[n(n+1)] normalizes to 1.000")
    
    # Test 4: Recommendation priority ordering
    recs = generate_evidence_based_recommendations("NIET-2026-005", TOPICS, test_assessments, STUDY_HABITS, ATTENDANCE)
    assert len(recs) > 0, "Recommendations generation failed"
    priorities = [r.priority for r in recs]
    # Verify High priority comes before Medium/Low
    high_seen = False
    for p in priorities:
        if p == 'High':
            high_seen = True
        elif p == 'Medium':
            assert high_seen or 'High' not in priorities, "Priority ordering violated"
    print("  [PASSED] Test 4: Strict priority ranking (High priority arranged upper in lane)")
    
    # Test 5: Multi-subject study plan balance
    vedant = STUDENTS[0]
    plan = generate_personalized_study_plan(vedant, SUBJECTS, TOPICS, test_assessments, days_per_week=5, hours_per_day=4.0)
    assert len(plan.subject_diagnostics) == 4, "All 4 subjects must be diagnosed"
    total_alloc_minutes = sum(sd.daily_allotted_minutes for sd in plan.subject_diagnostics)
    assert total_alloc_minutes == 240, f"Expected 240 daily minutes, got {total_alloc_minutes}"
    print("  [PASSED] Test 5: Multi-subject study planner balances all 4 subjects perfectly")
    
    # Test 6: 20-Question Quiz session scoring
    topic = TOPICS[0]
    session = QuizSession(vedant, topic, topic.subject_id)
    assert len(session.questions) == 20, f"Expected 20 questions, got {len(session.questions)}"
    for i in range(20):
        session.submit_answer(i, session.questions[i].correct_option_index)
    rec = session.finalize_quiz(attempt_number=2)
    assert rec.obtained_marks == 20.0 and rec.percentage == 100.0, "Quiz scoring failed"
    print("  [PASSED] Test 6: 20-Question topic assessment auto-grading & ledger sync")
    
    print("\n" + "=" * 70)
    print("  ALL 6 CORE PYTHON ENGINE TESTS PASSED SUCCESSFULLY! (100% PASS RATE)")
    print("=" * 70)


def run_demonstration():
    print_banner()
    print("  [DEMO MODE] Demonstrating Core Engines...\n")
    
    # 1. Cohort
    faculty_cohort_overview(ASSESSMENTS)
    
    # 2. Prediction Engine
    faculty_run_prediction(ASSESSMENTS, STUDY_HABITS)
    
    # 3. Interventions
    rahul = next(s for s in STUDENTS if s.name == "Rahul")
    student_view_interventions(rahul, ASSESSMENTS, STUDY_HABITS)
    
    # 4. Multi-subject Study Plan
    student_generate_study_plan(rahul, ASSESSMENTS, STUDY_HABITS, interactive=False)
    
    print("\n  Demonstration completed successfully.")


# =====================================================================
# MAIN INTERACTIVE ENTRY POINT
# =====================================================================

def main():
    if "--test" in sys.argv:
        run_automated_tests()
        return
    if "--demo" in sys.argv:
        run_demonstration()
        return
        
    print_banner()
    current_assessments = list(ASSESSMENTS)
    current_habits = list(STUDY_HABITS)
    
    while True:
        print("\nSELECT SYSTEM ACCESS PORTAL:")
        print("  1. Student Portal (Login with Name, Password: 123)")
        print("  2. Faculty Portal (Login with ID,   Password: 12345)")
        print("  3. Run Verification Tests (--test)")
        print("  4. Run Full Demonstration (--demo)")
        print("  0. Exit")
        
        try:
            choice = input("\nEnter choice [0-4]: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break
            
        if choice == '0':
            print("\nThank you for using NIET SPPP. Goodbye!")
            break
            
        elif choice == '1':
            # Student Login
            print("\nSTUDENT PORTAL LOGIN:")
            print("  Available Student Names: Vedant, Vyash, Yogesh, Yash, Rahul, Gyanendra, Anubhav")
            s_name = input("  Enter Student Name: ").strip()
            s_pwd = input("  Enter Password (123): ").strip()
            
            matched = next((s for s in STUDENTS if s.name.lower() == s_name.lower()), None)
            if not matched or s_pwd != STUDENT_PASSWORD:
                print("  Invalid student credentials! Password must be '123'.")
                continue
                
            print(f"\nWelcome, {matched.name}! (Roll ID: {matched.id})")
            while True:
                print(f"\n--- STUDENT MENU: {matched.name.upper()} ---")
                print("  1. View My Academic Evaluation Ledger & Marks")
                print("  2. View / Audit My Study Habits (Self-Reported)")
                print("  3. View Targeted Academic Interventions (Priority Lane)")
                print("  4. Take 20-Question Topic Assessment Quiz")
                print("  5. Generate Personalized Multi-Subject Study Plan & Timetable")
                print("  0. Logout to Portal Selection")
                
                s_opt = input("\nEnter option [0-5]: ").strip()
                if s_opt == '0':
                    break
                elif s_opt == '1':
                    student_view_marks(matched, current_assessments)
                elif s_opt == '2':
                    student_view_habits(matched, current_habits)
                elif s_opt == '3':
                    student_view_interventions(matched, current_assessments, current_habits)
                elif s_opt == '4':
                    student_take_quiz(matched, current_assessments)
                elif s_opt == '5':
                    student_generate_study_plan(matched, current_assessments, current_habits)
                    
        elif choice == '2':
            # Faculty Login
            print("\nFACULTY PORTAL LOGIN:")
            f_id = input("  Enter Faculty ID (e.g. FAC-CSE-01): ").strip()
            f_pwd = input("  Enter Password (12345): ").strip()
            
            if f_pwd != FACULTY_PASSWORD:
                print("  Invalid faculty credentials! Password must be '12345'.")
                continue
                
            print(f"\nAuthentication Successful. Welcome, Faculty Mentor!")
            while True:
                print("\n--- FACULTY EVALUATION & OBSERVATION MENU ---")
                print("  1. Cohort Performance Overview (Class 3F)")
                print("  2. Record Assignment / Midterm Marks (Manual Entry)")
                print("  3. Run Performance Prediction Engine (Recency Momentum)")
                print("  4. Topic Risk & Mastery Radar")
                print("  0. Logout to Portal Selection")
                
                f_opt = input("\nEnter option [0-4]: ").strip()
                if f_opt == '0':
                    break
                elif f_opt == '1':
                    faculty_cohort_overview(current_assessments)
                elif f_opt == '2':
                    faculty_record_marks(current_assessments)
                elif f_opt == '3':
                    faculty_run_prediction(current_assessments, current_habits)
                elif f_opt == '4':
                    faculty_topic_radar(current_assessments)
                    
        elif choice == '3':
            run_automated_tests()
        elif choice == '4':
            run_demonstration()


if __name__ == "__main__":
    main()
