import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  School,
  KeyRound
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalInitialRole, 
    loginAsStudent, 
    loginAsFaculty,
    state
  } = useApp();

  const [activeTab, setActiveTab] = useState<'student' | 'faculty'>(authModalInitialRole);
  
  // Student form state
  const [studentIdentifier, setStudentIdentifier] = useState<string>('Vyash');
  const [studentPassword, setStudentPassword] = useState<string>('');
  
  // Faculty form state
  const [facultyId, setFacultyId] = useState<string>('FAC-101');
  const [facultyPassword, setFacultyPassword] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync tab if modal opened with specific role
  React.useEffect(() => {
    setActiveTab(authModalInitialRole);
    setErrorMessage(null);
    setStudentPassword('');
    setFacultyPassword('');
  }, [authModalInitialRole, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginAsStudent(studentIdentifier, studentPassword);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to authenticate student');
    }
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginAsFaculty(facultyId, facultyPassword);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to authenticate faculty');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Institutional Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-300">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
                NIET Autonomous Academic Portal
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Institutional Portal Authentication
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Sign in with institutional credentials to access your designated departmental workspace.
          </p>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Student Access</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('faculty');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'faculty'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Faculty / Admin Access</span>
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 bg-slate-50/50 flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'student' ? (
            /* Student Login Form */
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900">
                <div className="font-semibold flex items-center gap-1.5 text-blue-950 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-blue-700" />
                  <span>Student Credentials Guidance</span>
                </div>
                <div className="text-[11px] text-blue-800 space-y-0.5">
                  <p>• <strong>Student Name / Roll ID</strong>: Select or type any student name from the roster (e.g. <em>Vyash</em>, <em>Vedant</em>, <em>Yogesh</em>, etc.)</p>
                  <p>• <strong>Password</strong>: <code className="bg-blue-100 font-mono font-bold px-1 py-0.5 rounded text-blue-900">123</code></p>
                </div>
              </div>

              {/* Quick Select Student Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Registered Student or Type Below:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {state.students.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setStudentIdentifier(s.name);
                        setStudentPassword('123');
                        setErrorMessage(null);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                        studentIdentifier.toLowerCase() === s.name.toLowerCase() ||
                        studentIdentifier.toLowerCase() === s.id.toLowerCase()
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                      }`}
                    >
                      {s.name} <span className="opacity-75 font-mono text-[10px]">({s.id})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Name or Roll Number *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={studentIdentifier}
                    onChange={e => setStudentIdentifier(e.target.value)}
                    placeholder="e.g. Vyash or NIET-2026-002"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Portal Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={studentPassword}
                    onChange={e => setStudentPassword(e.target.value)}
                    placeholder="Default password: 123"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Demonstration Password: <code className="font-mono font-bold text-slate-700">123</code>
                </span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Faculty / Admin Login Form */
            <form onSubmit={handleFacultySubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <div className="font-semibold flex items-center gap-1.5 text-amber-950 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>Faculty / Administrator Credentials</span>
                </div>
                <div className="text-[11px] text-amber-800 space-y-0.5">
                  <p>• <strong>Teacher ID</strong>: Enter Teacher / Admin ID (e.g. <code className="font-mono font-bold">FAC-101</code> or <code className="font-mono font-bold">faculty</code>)</p>
                  <p>• <strong>Password</strong>: <code className="bg-amber-100 font-mono font-bold px-1 py-0.5 rounded text-amber-950">12345</code></p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teacher / Faculty ID *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    placeholder="e.g. FAC-101 or 12345"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={facultyPassword}
                    onChange={e => setFacultyPassword(e.target.value)}
                    placeholder="Default password: 12345"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Demonstration Password: <code className="font-mono font-bold text-slate-700">12345</code>
                </span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-semibold rounded-xl text-sm shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <span>Enter Faculty & Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setFacultyId('FAC-101');
                  setFacultyPassword('12345');
                }}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Auto-fill Demo Faculty Credentials (FAC-101 / 12345)
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer Notice */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            NIET Department of Computer Science & Engineering
          </span>
          <span className="font-mono">Academic Year 2025–26</span>
        </div>
      </div>
    </div>
  );
};
