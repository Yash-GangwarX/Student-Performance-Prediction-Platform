import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { AssessmentsView } from './views/AssessmentsView';
import { PredictionView } from './views/PredictionView';
import { TopicAnalysisView } from './views/TopicAnalysisView';
import { HabitsEngagementView } from './views/HabitsEngagementView';
import { RecommendationsView } from './views/RecommendationsView';
import { ReportsView } from './views/ReportsView';
import { AboutView } from './views/AboutView';
import { PerformanceReportModal } from './components/report/PerformanceReportModal';
import { TopicQuizView } from './views/TopicQuizView';
import { CollegePublicView } from './views/CollegePublicView';
import { StudentPortalView } from './views/StudentPortalView';
import { LoginModal } from './components/auth/LoginModal';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  TrendingUp, 
  Target, 
  Clock, 
  Lightbulb, 
  FileText, 
  Info,
  Printer,
  ChevronDown,
  Award,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  Sparkles,
  ChevronRight,
  LogOut,
  ShieldCheck,
  School,
  KeyRound,
  LogIn,
  Lock
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  hint: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const FACULTY_NAV_SECTIONS: NavSection[] = [
  {
    title: 'ACADEMIC OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, hint: 'Cohort metrics & health hub' },
      { id: 'students', label: 'Student Directory', icon: Users, hint: 'Roster & enrollment records' },
    ]
  },
  {
    title: 'EXAMINATIONS & EVALUATIONS',
    items: [
      { id: 'assessments', label: 'Assessments & Marks Ledger', icon: FileSpreadsheet, hint: 'Observe student grades & record manual marks' },
    ]
  },
  {
    title: 'PREDICTIVE AI & ANALYTICS',
    items: [
      { id: 'prediction', label: 'Performance Prediction', icon: TrendingUp, badge: 'AI Forecast', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40', hint: 'Recency-weighted linear forecast' },
      { id: 'topic-analysis', label: 'Topic Risk & Mastery', icon: Target, hint: 'Threshold-based review radar' },
      { id: 'habits', label: 'Study Habits & Engagement', icon: Clock, hint: 'LMS interactions & attendance' },
    ]
  },
  {
    title: 'INTERVENTIONS & REPORTS',
    items: [
      { id: 'recommendations', label: 'Targeted Interventions', icon: Lightbulb, hint: 'Evidence-based study actions' },
      { id: 'reports', label: 'Official Reports', icon: FileText, hint: 'Printable faculty dossiers' },
    ]
  },
  {
    title: 'INSTITUTION & METHODOLOGY',
    items: [
      { id: 'about', label: 'About Platform & Model', icon: Info, hint: 'AI PBL architecture & verification' },
    ]
  }
];

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [quizTopicId, setQuizTopicId] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const { 
    state, 
    selectedStudent, 
    setSelectedStudentId, 
    openReportModal, 
    isReportModalOpen,
    currentUser,
    openAuthModal,
    logout,
    loginAsStudent,
    loginAsFaculty
  } = useApp();

  const handleNavigate = (view: string, topicId?: string) => {
    if (topicId) {
      setQuizTopicId(topicId);
    }
    setActiveTab(view);
    setIsSidebarOpen(false);
  };

  // Find active item metadata for faculty breadcrumb
  let activeSectionTitle = 'Academic Overview';
  let activeItemLabel = 'Executive Dashboard';
  for (const sec of FACULTY_NAV_SECTIONS) {
    const found = sec.items.find(i => i.id === activeTab);
    if (found) {
      activeSectionTitle = sec.title;
      activeItemLabel = found.label;
      break;
    }
  }

  const renderFacultyView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'students':
        return <StudentsView />;
      case 'assessments':
        return <AssessmentsView onNavigate={handleNavigate} />;
      case 'prediction':
        return <PredictionView />;
      case 'topic-analysis':
        return <TopicAnalysisView />;
      case 'habits':
        return <HabitsEngagementView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'reports':
        return <ReportsView />;
      case 'about':
        return <AboutView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  // Student initials for official avatar badge
  const studentInitials = selectedStudent?.name
    ? selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-900 selection:text-white">
      
      {/* =========================================================================
          UNIVERSAL TOP INSTITUTIONAL BAR WITH ACCESSIBILITY & ROLE SWITCHING
          ========================================================================= */}
      <header className="no-print bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Mobile Toggle & Official Institutional Seal Brand */}
            <div className="flex items-center gap-3 shrink-0">
              {currentUser?.role === 'faculty' && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              {/* Official Seal Crest */}
              <div 
                onClick={() => {
                  if (currentUser?.role === 'faculty') handleNavigate('dashboard');
                }} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 border border-blue-500/30 flex items-center justify-center shadow-inner shrink-0 group-hover:border-blue-400 transition-colors">
                  <School className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold tracking-widest text-amber-400 uppercase">
                      NIET Autonomous Campus
                    </span>
                    <span className="hidden sm:inline-block text-[9px] font-mono font-bold bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
                      Dept of CSE
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                    {currentUser?.role === 'student' 
                      ? 'Student Academic Portal' 
                      : currentUser?.role === 'faculty' 
                      ? 'Faculty & Examination Portal' 
                      : 'Academic Portal & Analytics'}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Academic Session & Active Role Badge */}
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-300">Session 2025–26</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-300">Sem 3 · Sec F (B.Tech CSE)</span>
              <span className="text-slate-600">|</span>
              {currentUser?.role === 'student' ? (
                <span className="text-blue-300 font-semibold font-mono">
                  Student: {currentUser.name} ({currentUser.rollId})
                </span>
              ) : currentUser?.role === 'faculty' ? (
                <span className="text-amber-300 font-semibold font-mono">
                  Faculty: Dr. S. K. Sharma (HOD CSE)
                </span>
              ) : (
                <span className="text-slate-400">
                  Open Public Interface
                </span>
              )}
            </div>

            {/* Right: Actions, Quick Demo Switcher, & Authentication Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Password-Protected Portal Switcher */}
              <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                <span className="text-[10px] font-mono text-slate-400 px-2 uppercase">Switch View:</span>
                <button
                  onClick={() => logout()}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    !currentUser ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="View Public College Website (Open for Everyone)"
                >
                  Public Site
                </button>
                <button
                  onClick={() => {
                    if (currentUser?.role !== 'student') {
                      openAuthModal('student');
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentUser?.role === 'student' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Access Student Portal (Requires Password: 123)"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Student Portal</span>
                </button>
                <button
                  onClick={() => {
                    if (currentUser?.role !== 'faculty') {
                      openAuthModal('faculty');
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentUser?.role === 'faculty' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Access Faculty / Admin Portal (Password-Protected: 12345)"
                >
                  <Lock className="w-3 h-3 text-amber-300" />
                  <span>Faculty (pw: 12345)</span>
                </button>
              </div>

              {/* In Faculty Mode: Active Student Selector Dropdown */}
              {currentUser?.role === 'faculty' && (
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-1.5 transition-colors">
                  <div className="w-7 h-7 rounded-md bg-blue-900 text-blue-200 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {studentInitials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-[10px] text-slate-400 leading-tight">Inspect Scholar</span>
                    <select
                      value={state.selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-1"
                    >
                      {state.students.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                          {s.name} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Performance Dossier Modal Launcher */}
              {currentUser && (
                <button
                  onClick={() => openReportModal(selectedStudent?.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
                  title="Generate print-ready official evaluation dossier"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden md:inline">Print Dossier</span>
                  <span className="md:hidden">Report</span>
                </button>
              )}

              {/* Log In / Log Out Controls */}
              {currentUser ? (
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-200 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                  title="Sign out and return to public college interface"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('student')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Student Login</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('faculty')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Faculty Access</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW RENDERING ACCORDING TO AUTHENTICATED ROLE
          ========================================================================= */}
      
      {/* 1. PUBLIC COLLEGE VIEW (Open for everyone) */}
      {!currentUser && (
        <CollegePublicView 
          onEnterPortal={(role) => openAuthModal(role)} 
        />
      )}

      {/* 2. STUDENT DEDICATED WORKSPACE (When logged in as a student) */}
      {currentUser?.role === 'student' && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
          <StudentPortalView />
        </main>
      )}

      {/* 3. FACULTY / ADMIN EXAMINATION WORKSPACE (When logged in as faculty) */}
      {currentUser?.role === 'faculty' && (
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          
          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden"
            />
          )}

          {/* Sidebar Container */}
          <aside 
            className={`
              fixed lg:static top-16 bottom-0 left-0 z-30 
              ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} 
              w-72 bg-slate-900 text-slate-300 border-r border-slate-800 
              flex flex-col transition-all duration-200 ease-in-out shrink-0
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              no-print
            `}
          >
            {/* Sidebar Top Meta */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block font-semibold">
                    Department Navigation
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    Faculty & Admin Portals
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>

            {/* Categorized Navigation Menu List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
              {FACULTY_NAV_SECTIONS.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  {!isSidebarCollapsed && (
                    <h3 className="px-2 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      {section.title}
                    </h3>
                  )}

                  <div className="space-y-0.5">
                    {section.items.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          title={isSidebarCollapsed ? `${item.label} - ${item.hint}` : undefined}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-all cursor-pointer group
                            ${isActive 
                              ? 'bg-blue-800 text-white font-semibold shadow-xs ring-1 ring-blue-500/30' 
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                            }
                            ${isSidebarCollapsed ? 'justify-center px-2' : ''}
                          `}
                        >
                          <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-300'
                          }`} />
                          
                          {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[10px] block truncate transition-colors ${
                                isActive ? 'text-blue-200' : 'text-slate-400'
                              }`}>
                                {item.hint}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Footer Info Card */}
            {!isSidebarCollapsed ? (
              <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 font-semibold text-slate-300 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Faculty Supervisory Mode</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Continuous Internal Evaluation (CIE)
                </div>
              </div>
            ) : (
              <div className="p-3 border-t border-slate-800 flex justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="Faculty Mode Active" />
              </div>
            )}
          </aside>

          {/* Main Content Workspace */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            
            {/* Top Workspace Breadcrumb & Institutional Context Strip */}
            <div className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-semibold text-slate-700">NIET CSE</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">{activeSectionTitle}</span>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {activeItemLabel}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
                <span className="font-mono">Roster: {state.students.length} Scholars</span>
                <span>·</span>
                <span className="font-mono">Selected: {selectedStudent?.name} ({selectedStudent?.id})</span>
              </div>
            </div>

            {/* Tab Body View */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {renderFacultyView()}
            </main>

            {/* Institutional Footer */}
            <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 mt-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">NIET Department of Computer Science & Engineering</span>
                  <span>·</span>
                  <span>B.Tech CSE Semester 3 (Sec F)</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 text-center md:text-right">
                  Continuous Academic Evaluation · Client-Side Verified · Passwords: Student 123 / Teacher 12345
                </div>
              </div>
            </footer>

          </div>

        </div>
      )}

      {/* Institutional Authentication Modal */}
      <LoginModal />

      {/* Printable Evaluation Dossier Modal */}
      {isReportModalOpen && <PerformanceReportModal />}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
