import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  School,
  ExternalLink,
  ChevronRight,
  Bell,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

interface CollegePublicViewProps {
  onEnterPortal: (role: 'student' | 'faculty') => void;
}

export const CollegePublicView: React.FC<CollegePublicViewProps> = ({ onEnterPortal }) => {
  const { openAuthModal, state, loginAsStudent, loginAsFaculty } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* =========================================================================
          HERO BANNER: OFFICIAL INSTITUTIONAL PRESENTATION
          ========================================================================= */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden border-b border-slate-800">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          
          {/* Institutional Accreditation Kicker */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30">
              Autonomous Institution · Est. 2001
            </span>
            <span className="text-xs font-medium text-slate-300">
              NAAC Grade 'A' Accredited · NBA Approved · Affiliated with AKTU
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Department Headline & Mission */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-blue-400 font-semibold text-sm sm:text-base tracking-wide uppercase block">
                  Department of Computer Science & Engineering
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Academic Portal & Student Performance Analytics System
                </h1>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Official centralized academic management platform for B.Tech Computer Science and Engineering (Semester 3, Section F). 
                Facilitating continuous evaluation, topic-wise 20-question assessments, evidence-based academic interventions, and transparent student performance forecasting.
              </p>

              {/* Fast Login Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openAuthModal('student')}
                  className="flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-900/30 transition-all cursor-pointer active:scale-98"
                >
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                  <span>Student Portal Login</span>
                  <span className="text-xs font-mono bg-blue-700/80 px-1.5 py-0.5 rounded text-blue-100">pw: 123</span>
                </button>

                <button
                  onClick={() => openAuthModal('faculty')}
                  className="flex items-center gap-2.5 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-all cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>Faculty / Admin Access</span>
                  <span className="text-xs font-mono bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">pw: 12345</span>
                </button>
              </div>

              {/* Quick Demo Credentials Guide */}
              <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>⚡ <strong>Quick Demo Credentials:</strong></span>
                <span>Student: <code className="text-blue-300 font-mono">Vyash</code> / <code className="text-blue-300 font-mono">123</code></span>
                <span>Faculty: <code className="text-amber-300 font-mono">FAC-101</code> / <code className="text-amber-300 font-mono">12345</code></span>
              </div>
            </div>

            {/* Right: Quick Direct Entry Gateways */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Student Portal Card */}
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-500/30 rounded-2xl p-5 hover:border-blue-400/60 transition-all shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-300">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">Student Academic Portal</h3>
                      <p className="text-xs text-blue-200">For Enrolled B.Tech Scholars (Sec F)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-blue-900/80 text-blue-200 border border-blue-700 px-2 py-0.5 rounded">
                    Student Login
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Take interactive 20-question topic quizzes, view assignment and midterm marks, track attendance, and inspect personalized AI study interventions.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Use Student Name & Password <strong className="text-white font-mono">123</strong>
                  </span>
                  <button
                    onClick={() => openAuthModal('student')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-white bg-blue-600/40 hover:bg-blue-600 px-3 py-1.5 rounded-lg border border-blue-500/40 transition-colors cursor-pointer"
                  >
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Faculty & Admin Portal Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400/50 transition-all shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">Faculty & Examination Portal</h3>
                      <p className="text-xs text-slate-400">For Instructors & Department Admins</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                    Admin Access
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Enter manual marks for assignments and midterms, review cohort risk radars, examine student rosters, and generate official printable dossiers.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Teacher ID & Password <strong className="text-white font-mono">12345</strong>
                  </span>
                  <button
                    onClick={() => openAuthModal('faculty')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-600 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <span>Authenticate Faculty (pw: 12345)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Institutional KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">7</span>
              <span className="text-xs text-slate-400 font-medium">Cohort Scholars (Sec F)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 block">4</span>
              <span className="text-xs text-slate-400 font-medium">Core Technical Courses</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block">20 Qs</span>
              <span className="text-xs text-slate-400 font-medium">Topic-wise Assessments</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">100%</span>
              <span className="text-xs text-slate-400 font-medium">Continuous CIE Coverage</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 1: DEPARTMENT OVERVIEW & ACADEMIC FRAMEWORK
          ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Curriculum & Evaluation Scheme
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              B.Tech Computer Science & Engineering (Semester 3)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our continuous academic monitoring framework separates automated topic-wise 20-question diagnostic assessments from instructor-graded assignments and midterm examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Subject 1 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  CS301
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem 3 · 4 Credits</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                Data Structures & Algorithms
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Linear structures, non-linear hierarchies, graph traversals, and asymptotic algorithmic complexity analysis.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200/80 pt-2.5">
                <div>• Arrays, Stacks, Queues (20 Qs)</div>
                <div>• Binary Trees & BSTs (20 Qs)</div>
                <div>• Graph Algorithms & BFS/DFS (20 Qs)</div>
              </div>
            </div>

            {/* Subject 2 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  CS302
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem 3 · 4 Credits</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                AI & Machine Learning
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Supervised & unsupervised learning principles, regression models, neural network foundations, and evaluation metrics.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200/80 pt-2.5">
                <div>• Supervised & Unsupervised (20 Qs)</div>
                <div>• Neural Networks Fundamentals (20 Qs)</div>
                <div>• Model Evaluation & Metrics (20 Qs)</div>
              </div>
            </div>

            {/* Subject 3 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  CS303
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem 3 · 3 Credits</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                Discrete Mathematics
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Propositional logic, set theory, graph theory principles, combinatorics, and algebraic computation foundations.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200/80 pt-2.5">
                <div>• Logic & Truth Tables (20 Qs)</div>
                <div>• Sets, Relations & Functions (20 Qs)</div>
                <div>• Graph Theory Foundations (20 Qs)</div>
              </div>
            </div>

            {/* Subject 4 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  CS304
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem 3 · 4 Credits</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                Database Management Systems
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Relational schema design, normalization, ACID properties, indexing techniques, and complex SQL transaction execution.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200/80 pt-2.5">
                <div>• ER Modeling & Relational Schema (20 Qs)</div>
                <div>• Normalization 1NF to BCNF (20 Qs)</div>
                <div>• SQL Transactions & Indexing (20 Qs)</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: STEP-BY-STEP ACCESS & CONTINUOUS EVALUATION WORKFLOW
          ========================================================================= */}
      <section className="py-12 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Institutional Steps & Procedures
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Role-Based Academic Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Clearly segregated privileges ensuring students focus on learning diagnostic assessments while faculty supervise academic evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Student Self-Assessment & Quizzes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Students log in with their Name (e.g. <em>Vyash</em>, <em>Vedant</em>) and password <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-blue-800">123</code>. They attempt 20-question topic quizzes with instant feedback and revision suggestions.
              </p>
              <div className="flex items-center text-xs font-semibold text-blue-700">
                <span>Separate Student Workspace</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Faculty Grading & Evaluations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Faculty sign in with Teacher ID and password <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-amber-800">12345</code>. Instructors record marks for assignments, midterms, and lab practicals without student interference.
              </p>
              <div className="flex items-center text-xs font-semibold text-amber-700">
                <span>Manual Marks Entry Enabled</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                AI Forecast & Targeted Interventions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                The platform continuously fuses quiz scores, manual marks, LMS study hours, and attendance into a transparent recency-weighted linear forecast and printable dossier.
              </p>
              <div className="flex items-center text-xs font-semibold text-emerald-700">
                <span>Evidence-Based Analytics</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CAMPUS NOTICES & CIRCULARS
          ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                Official Department Bulletins
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Academic Circulars & Examination Notices
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Academic Session 2025–26 · Odd Semester
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-slate-900">
                    Continuous Internal Evaluation (CIE) Window Open
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Oct 2026</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All 7 enrolled scholars of Section F (Vedant, Vyash, Yogesh, Yash, Rahul, Gyanendra, Anubhav) are required to complete their designated 20-question topic assessments across Data Structures and AI/ML.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-slate-900">
                    Midterm Marks Entry & Attendance Audit
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Official Notice</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Faculty members can record manual marks for Midterm Test 1 and Assignment 1. Attendance records below 75% trigger automatic targeted intervention alerts.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: INSTITUTIONAL FOOTER
          ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 mt-auto border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-amber-400">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm block">
                    Noida Institute of Engineering & Technology (NIET)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Autonomous Institute · Department of Computer Science & Engineering
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-md">
                19, Knowledge Park-II, Institutional Area, Greater Noida, Uttar Pradesh 201306. Approved by AICTE, Accredited by NAAC ('A' Grade) and NBA.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">
                Quick Portals
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => openAuthModal('student')}
                    className="hover:text-blue-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Student Academic Portal (pw: 123)</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openAuthModal('faculty')}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Faculty & Admin Portal (pw: 12345)</span>
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">AI PBL Verification Dossiers</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">
                Cohort Specifications
              </h4>
              <div className="text-[11px] space-y-1 text-slate-400">
                <p>• Programme: B.Tech Computer Science and Engineering</p>
                <p>• Class: Semester 3 · Section F</p>
                <p>• Enrolled Roster: 7 Scholars</p>
                <p>• Roll Prefix: <code className="text-amber-400 font-mono">NIET-2026-XXX</code></p>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2025–2026 Department of Computer Science & Engineering, NIET. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>Autonomous Academic Regulation</span>
              <span>·</span>
              <span>Outcome-Based Education (OBE)</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
