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
  ChevronRight
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

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'ACADEMIC OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, hint: 'Campus analytics & quick hub' },
      { id: 'students', label: 'Student Directory', icon: Users, hint: 'Roster & enrollment records' },
    ]
  },
  {
    title: 'EXAMINATIONS & EVALUATIONS',
    items: [
      { id: 'assessments', label: 'Assessments & Marks', icon: FileSpreadsheet, hint: 'Manual marks for assignments & midterms' },
      { id: 'quiz', label: 'Topic Quizzes (20 Qs)', icon: Award, badge: '20 Qs Auto', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40', hint: 'Auto-scored multiple-choice assessments' },
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

  const { state, selectedStudent, setSelectedStudentId, openReportModal, isReportModalOpen } = useApp();

  const handleNavigate = (view: string, topicId?: string) => {
    if (topicId) {
      setQuizTopicId(topicId);
    }
    setActiveTab(view);
    setIsSidebarOpen(false); // Close mobile drawer on navigation
  };

  // Find active item metadata for breadcrumb
  let activeSectionTitle = 'Academic Overview';
  let activeItemLabel = 'Executive Dashboard';
  for (const sec of NAV_SECTIONS) {
    const found = sec.items.find(i => i.id === activeTab);
    if (found) {
      activeSectionTitle = sec.title;
      activeItemLabel = found.label;
      break;
    }
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'students':
        return <StudentsView />;
      case 'assessments':
        return <AssessmentsView onNavigate={handleNavigate} />;
      case 'quiz':
        return <TopicQuizView onNavigate={handleNavigate} initialTopicId={quizTopicId} />;
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
          ZONE 1: OFFICIAL TOP INSTITUTIONAL BAR
          ========================================================================= */}
      <header className="no-print bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Mobile Toggle & Official Institutional Seal Brand */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Official Seal Crest */}
              <div 
                onClick={() => handleNavigate('dashboard')} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 border border-blue-500/30 flex items-center justify-center shadow-inner shrink-0 group-hover:border-blue-400 transition-colors">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold tracking-widest text-amber-400 uppercase">
                      Autonomous Academic Portal
                    </span>
                    <span className="hidden sm:inline-block text-[9px] font-mono font-bold bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
                      B.Tech AI PBL
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                    Student Performance Prediction Platform
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Academic Session & Semester Tag */}
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-300">Term: Academic Session 2025–26</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-400">Semester 3 · Sec F (CSE)</span>
            </div>

            {/* Right: Active Student Selector & Dossier Button */}
            <div className="flex items-center gap-3 shrink-0">
              
              {/* Active Student Selector Box */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-1.5 transition-colors">
                <div className="w-7 h-7 rounded-md bg-blue-900 text-blue-200 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                  {studentInitials}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-[10px] text-slate-400 leading-tight">Selected Student</span>
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

              {/* Quick Action: Generate Official Performance Dossier */}
              <button
                onClick={() => openReportModal(selectedStudent?.id)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
                title="Generate print-ready official evaluation dossier"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">Print Performance Dossier</span>
                <span className="md:hidden">Report</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* =========================================================================
          ZONE 2: APP BODY WITH STRUCTURED OFFICIAL SIDEBAR + MAIN WORKSPACE
          ========================================================================= */}
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
                  Academic Portals & Tests
                </span>
              </div>
            )}
            {/* Desktop collapse toggle */}
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
            {NAV_SECTIONS.map((section, idx) => (
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
                <span>Deterministic AI Engine</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Recency-weighted modeling ($W_i$), auto-scored 20-Q quizzes, and zero paid API dependencies.
              </p>
            </div>
          ) : (
            <div className="p-3 border-t border-slate-800 flex justify-center text-slate-500">
              <span className="text-[10px] font-mono font-bold">PBL</span>
            </div>
          )}
        </aside>

        {/* Workspace Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Institutional Breadcrumb & Active Student Context Banner */}
          <div className="no-print bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              
              {/* Breadcrumb path */}
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span 
                  onClick={() => handleNavigate('dashboard')} 
                  className="hover:text-blue-900 cursor-pointer transition-colors"
                >
                  Portal
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">{activeSectionTitle}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-blue-950">{activeItemLabel}</span>
              </div>

              {/* Student Context Indicator */}
              {selectedStudent && (
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-[11px]">
                  <span className="text-slate-400">Active Record:</span>
                  <strong className="text-slate-900">{selectedStudent.name}</strong>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-slate-500">{selectedStudent.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">Sec {selectedStudent.section}</span>
                </div>
              )}

            </div>
          </div>

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderActiveView()}
          </main>

          {/* Institutional Portal Footer */}
          <footer className="no-print bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <div>
                  <strong>Student Performance Prediction Platform</strong> · Department of Computer Science & Engineering
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 text-center md:text-right">
                Undergraduate PBL Academic Demonstration · Automated 20-Q Testing · Client-Side Verified
              </div>
            </div>
          </footer>

        </div>

      </div>

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
