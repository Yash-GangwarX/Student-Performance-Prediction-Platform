import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIC_QUESTIONS, QuizQuestion } from '../data/questionBank';
import { AssessmentRecord } from '../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Award, 
  Clock, 
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  Play
} from 'lucide-react';

interface TopicQuizViewProps {
  onNavigate: (view: string) => void;
  initialTopicId?: string;
}

export const TopicQuizView: React.FC<TopicQuizViewProps> = ({ onNavigate, initialTopicId }) => {
  const { state, selectedStudent, setSelectedStudentId, addAssessment } = useApp();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || state.topics[0]?.id || 'TOPIC-DSA-01'
  );

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [lastRecordedAssessment, setLastRecordedAssessment] = useState<AssessmentRecord | null>(null);

  const currentTopic = useMemo(() => {
    return state.topics.find(t => t.id === selectedTopicId) || state.topics[0];
  }, [state.topics, selectedTopicId]);

  const currentSubject = useMemo(() => {
    return state.subjects.find(s => s.id === currentTopic?.subjectId);
  }, [state.subjects, currentTopic]);

  // Questions for chosen topic (20 questions)
  const questions: QuizQuestion[] = useMemo(() => {
    return TOPIC_QUESTIONS[selectedTopicId] || [];
  }, [selectedTopicId]);

  const currentQuestion = questions[currentQuestionIdx];

  // Prior completed attempts on this topic by selected student
  const priorAttempts = useMemo(() => {
    return state.assessments.filter(
      a => a.studentId === selectedStudent?.id && a.topicId === selectedTopicId && a.status === 'completed'
    );
  }, [state.assessments, selectedStudent, selectedTopicId]);

  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIndex
    }));
  };

  const handleClearAnswer = () => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestionIdx];
      return copy;
    });
  };

  const handleSubmitQuiz = () => {
    if (!selectedStudent || questions.length === 0) return;

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const maxMarks = questions.length; // 20
    const percentage = Number(((correctCount / maxMarks) * 100).toFixed(2));
    const nextAttemptNumber = priorAttempts.length + 1;

    const newRecord: Omit<AssessmentRecord, 'id' | 'percentage'> = {
      studentId: selectedStudent.id,
      subjectId: currentTopic.subjectId,
      topicId: currentTopic.id,
      assessmentName: `${currentTopic.name} Topic Quiz (20 Qs) - Attempt ${nextAttemptNumber}`,
      assessmentType: 'Quiz',
      date: new Date().toISOString().slice(0, 10),
      obtainedMarks: correctCount,
      maxMarks,
      attemptNumber: nextAttemptNumber,
      status: 'completed',
      difficulty: 'Standard'
    };

    addAssessment(newRecord);

    const fullRecord: AssessmentRecord = {
      ...newRecord,
      id: `REC-QUIZ-${Date.now()}`,
      percentage
    };

    setLastRecordedAssessment(fullRecord);
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
    setLastRecordedAssessment(null);
  };

  const handleTopicChange = (newTopicId: string) => {
    setSelectedTopicId(newTopicId);
    handleRestartQuiz();
  };

  // Score summary
  const scoreSummary = useMemo(() => {
    if (!isSubmitted) return null;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: Number(((correct / questions.length) * 100).toFixed(2))
    };
  }, [isSubmitted, questions, userAnswers]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Topic Assessment Quiz</h1>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              20 Questions · Auto-Scored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete standardized 20-question evaluations for any topic. Scores are calculated automatically from student responses and recorded into the assessment ledger.
          </p>
        </div>

        {/* Student & Topic Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Student:</span>
            <select
              value={state.selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {state.students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Topic:</span>
            <select
              value={selectedTopicId}
              onChange={e => handleTopicChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {state.topics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Post-Submission Scorecard Banner */}
      {isSubmitted && scoreSummary && (
        <div className="bg-white border-2 border-blue-600 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Assessment Completed & Automatically Logged
                </span>
                <div className="text-2xl font-black text-slate-950 font-mono">
                  {scoreSummary.correct} / {scoreSummary.total} Correct ({scoreSummary.percentage}%)
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Recorded for {selectedStudent?.name} · Attempt #{lastRecordedAssessment?.attemptNumber || priorAttempts.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRestartQuiz}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz (New Attempt)</span>
              </button>
              <button
                onClick={() => onNavigate('prediction')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>View Prediction Impact</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Assessment attempt automatically appended to the <strong>Assessments and Marks</strong> ledger with percentage normalization.
              </span>
            </div>
            <button
              onClick={() => onNavigate('assessments')}
              className="text-blue-700 hover:text-blue-900 font-semibold underline text-xs"
            >
              Open Ledger →
            </button>
          </div>
        </div>
      )}

      {/* Main Quiz Interactive Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Question Card */}
        <div className="lg:col-span-3 space-y-4">
          
          {currentQuestion ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    · {currentQuestion.difficulty}
                  </span>
                </div>

                {!isSubmitted && userAnswers[currentQuestionIdx] !== undefined && (
                  <button
                    onClick={handleClearAnswer}
                    className="text-[11px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                  >
                    Clear answer
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.questionText}
              </div>

              {/* 4 Choices */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((optText, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                  const isCorrect = currentQuestion.correctIndex === optIdx;

                  let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800';
                  let badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';

                  if (isSelected) {
                    optionStyle = 'border-blue-600 bg-blue-50/60 text-blue-950 font-medium shadow-2xs';
                    badgeStyle = 'bg-blue-600 text-white border-blue-600';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      badgeStyle = 'bg-rose-600 text-white border-rose-600';
                    } else {
                      optionStyle = 'border-slate-200 opacity-60 text-slate-500';
                      badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                    }
                  }

                  const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${badgeStyle}`}>
                        {optionLetter}
                      </span>
                      <span className="text-xs pt-0.5 leading-relaxed flex-1">
                        {optText}
                      </span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Technical Explanation in Review Mode */}
              {isSubmitted && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 mt-4">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                    Technical Explanation:
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400 font-mono">
                  {userAnswers[currentQuestionIdx] !== undefined ? (
                    <span className="text-emerald-700 font-semibold">Answered</span>
                  ) : (
                    <span>Not Answered</span>
                  )}
                </div>

                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  !isSubmitted && (
                    <button
                      onClick={() => {
                        if (answeredCount < questions.length) {
                          setShowConfirmSubmit(true);
                        } else {
                          handleSubmitQuiz();
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Submit 20-Q Assessment</span>
                    </button>
                  )
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs">
              No questions found for this topic.
            </div>
          )}

        </div>

        {/* Right Col: 20-Question Navigator & Stats */}
        <div className="space-y-4">
          
          {/* Question Grid Navigator (1 to 20) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Navigator
              </h2>
              <span className="font-mono text-xs font-bold text-blue-900">
                {answeredCount} / {questions.length} answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = currentQuestionIdx === idx;
                const isAnswered = userAnswers[idx] !== undefined;
                const isCorrect = isSubmitted && userAnswers[idx] === q.correctIndex;
                const isWrong = isSubmitted && isAnswered && !isCorrect;

                let btnBg = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                if (isAnswered && !isSubmitted) {
                  btnBg = 'bg-blue-900 border-blue-900 text-white font-bold';
                }
                if (isSubmitted) {
                  if (isCorrect) btnBg = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                  else if (isWrong) btnBg = 'bg-rose-600 border-rose-600 text-white font-bold';
                  else btnBg = 'bg-slate-100 border-slate-200 text-slate-400';
                }
                if (isCurrent) {
                  btnBg += ' ring-2 ring-blue-500 ring-offset-1';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-9 rounded-lg font-mono text-xs flex items-center justify-center border transition-all cursor-pointer ${btnBg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Quick Submit Button */}
            {!isSubmitted && (
              <button
                onClick={() => {
                  if (answeredCount < questions.length) {
                    setShowConfirmSubmit(true);
                  } else {
                    handleSubmitQuiz();
                  }
                }}
                className="w-full mt-2 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>

          {/* Topic Scope Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs">Assessment Metadata</h3>
            
            <div className="space-y-1.5 text-slate-600">
              <div>Subject: <strong className="text-slate-900">{currentSubject?.name}</strong></div>
              <div>Topic: <strong className="text-slate-900">{currentTopic.name}</strong></div>
              <div>Questions: <strong className="font-mono text-slate-900">20 Multiple Choice</strong></div>
              <div>Grading: <strong className="font-mono text-slate-900">1 mark per correct answer (Max 20)</strong></div>
              <div>Prior Attempts: <strong className="font-mono text-slate-900">{priorAttempts.length} recorded</strong></div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 leading-tight">
              Scores are automatically calculated and injected into the longitudinal prediction model upon submission.
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal if Unanswered Questions Exist */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-slate-200 p-5 space-y-3.5 text-xs">
            <div className="flex items-center gap-2.5 text-amber-600 font-bold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="text-sm text-slate-900">Unanswered Questions</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions. Unanswered questions will receive 0 marks. Do you wish to submit now?
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Keep Answering
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
