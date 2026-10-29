'use client';

import React, { useState, useEffect } from 'react';
import { UserRoadmap, CloudProviderId } from '@/lib/platformTypes';
import {
  generatePersonalizedRoadmap,
  loadSavedRoadmap,
  saveUserRoadmap,
  clearSavedRoadmap,
} from '@/lib/roadmapData';
import {
  Milestone,
  CheckCircle2,
  Circle,
  Sparkles,
  HelpCircle,
  Trophy,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Clock,
  Layers,
  Code,
} from 'lucide-react';

interface CloudRoadmapModuleProps {
  onAskMentor: (prompt: string) => void;
  initialTopicFocus?: string | null;
}

export const CloudRoadmapModule: React.FC<CloudRoadmapModuleProps> = ({
  onAskMentor,
  initialTopicFocus,
}) => {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [activeQuizPhase, setActiveQuizPhase] = useState<string | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Initial Assessment Form States
  const [goal, setGoal] = useState<string>('Solutions Architect');
  const [provider, setProvider] = useState<CloudProviderId>('aws');
  const [experienceLevel, setExperienceLevel] = useState<string>('Developer / IT Transitioning');
  const [weeklyHours, setWeeklyHours] = useState<number>(6);
  const [learningStyle, setLearningStyle] = useState<string>('Hands-on labs & practical projects');

  // Load existing roadmap from localStorage or initialize
  useEffect(() => {
    const saved = loadSavedRoadmap();
    if (saved) {
      setRoadmap(saved);
    } else {
      const generated = generatePersonalizedRoadmap({
        goal: 'Solutions Architect',
        provider: 'aws',
        experienceLevel: 'Developer / IT Transitioning',
        weeklyHours: 6,
        learningStyle: 'Hands-on labs & practical projects',
      });
      setRoadmap(generated);
      saveUserRoadmap(generated);
    }
  }, []);

  // Handle task completion toggle
  const handleToggleTask = (phaseId: string, taskId: string) => {
    if (!roadmap) return;
    const isCompleted = roadmap.completedTaskIds.includes(taskId);
    const updatedCompleted = isCompleted
      ? roadmap.completedTaskIds.filter((id) => id !== taskId)
      : [...roadmap.completedTaskIds, taskId];

    const updatedRoadmap: UserRoadmap = {
      ...roadmap,
      completedTaskIds: updatedCompleted,
      phases: roadmap.phases.map((ph) => {
        if (ph.id !== phaseId) return ph;
        return {
          ...ph,
          tasks: ph.tasks.map((t) => (t.id === taskId ? { ...t, completed: !isCompleted } : t)),
        };
      }),
    };

    setRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
  };

  // Generate new roadmap
  const handleGenerateCustomRoadmap = () => {
    const custom = generatePersonalizedRoadmap({
      goal,
      provider,
      experienceLevel,
      weeklyHours,
      learningStyle,
    });
    setRoadmap(custom);
    saveUserRoadmap(custom);
    setShowConfigModal(false);
  };

  // Reset roadmap progress
  const handleResetProgress = () => {
    if (!roadmap) return;
    if (window.confirm('Reset all progress checkboxes and quiz checkpoints?')) {
      const reset = {
        ...roadmap,
        completedTaskIds: [],
        passedCheckpoints: [],
        phases: roadmap.phases.map((ph) => ({
          ...ph,
          tasks: ph.tasks.map((t) => ({ ...t, completed: false })),
        })),
      };
      setRoadmap(reset);
      saveUserRoadmap(reset);
    }
  };

  // Checkpoint Quiz Evaluation
  const handleQuizAnswer = (correctIdx: number, phaseId: string) => {
    setQuizSubmitted(true);
    if (selectedQuizOption === correctIdx && roadmap) {
      if (!roadmap.passedCheckpoints.includes(phaseId)) {
        const updated = {
          ...roadmap,
          passedCheckpoints: [...roadmap.passedCheckpoints, phaseId],
        };
        setRoadmap(updated);
        saveUserRoadmap(updated);
      }
    }
  };

  // Total Progress Percentage
  const totalTasks = roadmap?.phases.reduce((acc, p) => acc + p.tasks.length, 0) || 1;
  const completedCount = roadmap?.completedTaskIds.length || 0;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-cyan/15 border border-aurora-cyan/30 text-aurora-cyan text-xs font-semibold uppercase tracking-wider mb-3">
            <Milestone className="w-3.5 h-3.5" />
            <span>Personalized Learning Path</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-light-primary dark:text-dark-primary tracking-tight mb-2">
            My Learning Roadmap
          </h1>
          <p className="text-sm md:text-base text-light-muted dark:text-dark-muted max-w-2xl leading-relaxed">
            Personalized, milestone-driven cloud learning path with interactive quizzes, checkpoints, capstone projects, and real-time progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 rounded-xl bg-aurora-cyan text-dark-bg text-xs font-bold hover:opacity-90 transition-opacity shadow-aurora-teal"
          >
            Customize Roadmap
          </button>
          <button
            onClick={handleResetProgress}
            title="Reset progress"
            className="p-2 rounded-xl border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Overview Card */}
      {roadmap && (
        <div className="liquid-glass rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-aurora-cyan block mb-1">
                Active Goal: {roadmap.goal}
              </span>
              <h2 className="font-serif text-xl font-bold text-light-primary dark:text-dark-primary">
                {roadmap.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-light-muted dark:text-dark-muted block">
                  Overall Completion
                </span>
                <span className="font-mono text-2xl font-bold text-light-primary dark:text-dark-primary">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-aurora-cyan/15 border border-aurora-cyan/30 flex items-center justify-center text-aurora-cyan">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-light-surface dark:bg-dark-elevated overflow-hidden border border-light-border dark:border-dark-border mb-3">
            <div
              className="h-full bg-gradient-to-r from-aurora-teal via-aurora-cyan to-aurora-blue transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-light-muted dark:text-dark-muted">
            <span>
              <strong>{completedCount}</strong> of <strong>{totalTasks}</strong> learning activities completed
            </span>
            <span>
              <strong>{roadmap.passedCheckpoints.length}</strong> of <strong>{roadmap.phases.length}</strong> phase checkpoints validated
            </span>
          </div>
        </div>
      )}

      {/* Roadmap Staged Phases */}
      {roadmap && (
        <div className="space-y-6">
          {roadmap.phases.map((phase) => {
            const isCheckpointPassed = roadmap.passedCheckpoints.includes(phase.id);
            const allPhaseTasksDone = phase.tasks.every((t) => roadmap.completedTaskIds.includes(t.id));

            return (
              <div
                key={phase.id}
                className="liquid-glass rounded-2xl p-6 space-y-4 border border-light-border dark:border-dark-border"
              >
                {/* Phase Header */}
                <div className="flex items-start justify-between gap-4 border-b border-light-border/60 dark:border-dark-border/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-aurora-cyan text-dark-bg text-xs font-extrabold flex items-center justify-center">
                        {phase.phaseNumber}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-light-primary dark:text-dark-primary">
                        Phase {phase.phaseNumber}: {phase.title}
                      </h3>
                      {allPhaseTasksDone && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                          Tasks Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                      {phase.subtitle}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-light-muted dark:text-dark-muted shrink-0 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{phase.estimatedWeeks} weeks</span>
                  </span>
                </div>

                {/* Tasks Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted block mb-1">
                    Core Learning Steps:
                  </span>
                  {phase.tasks.map((task) => {
                    const isDone = roadmap.completedTaskIds.includes(task.id);
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          isDone
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-light-surface/60 dark:bg-dark-elevated/60 border-light-border dark:border-dark-border'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleTask(phase.id, task.id)}
                          className="flex items-start gap-3 flex-1 text-left"
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-light-muted dark:text-dark-muted hover:text-aurora-cyan transition-colors" />
                            )}
                          </div>
                          <div>
                            <span
                              className={`text-xs font-bold block mb-0.5 ${
                                isDone
                                  ? 'line-through text-light-muted dark:text-dark-muted'
                                  : 'text-light-primary dark:text-dark-primary'
                              }`}
                            >
                              {task.title}
                            </span>
                            <span className="text-[11px] text-light-muted dark:text-dark-muted leading-relaxed block">
                              {task.description}
                            </span>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {task.resourceLink && (
                            <a
                              href={task.resourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open free resource"
                              className="p-1 text-light-muted dark:text-dark-muted hover:text-aurora-cyan transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              onAskMentor(
                                `I am currently studying this roadmap step: "${task.title}". Can you give me a clear explanation with everyday analogies, key concepts, and practical steps?`
                              )
                            }
                            title="Ask Cloud Mentor AI about this step"
                            className="p-1 text-aurora-cyan hover:opacity-80 transition-opacity"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checkpoint Assessment & Capstone Project Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Phase Capstone Project */}
                  <div className="p-4 rounded-xl bg-light-surface/70 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border space-y-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-aurora-cyan" />
                      <h4 className="font-serif font-bold text-xs text-light-primary dark:text-dark-primary">
                        Hands-On Project: {phase.capstoneProject.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-light-muted dark:text-dark-muted leading-relaxed">
                      {phase.capstoneProject.description}
                    </p>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-light-primary dark:text-dark-primary block">
                        Deliverables:
                      </span>
                      {phase.capstoneProject.keyDeliverables.map((deliv, idx) => (
                        <div key={idx} className="text-[10.5px] text-light-muted dark:text-dark-muted flex items-start gap-1.5">
                          <span className="text-aurora-cyan font-bold">•</span>
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Checkpoint Quiz */}
                  <div className="p-4 rounded-xl bg-aurora-cyan/5 border border-aurora-cyan/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-aurora-cyan">
                        <HelpCircle className="w-4 h-4" />
                        <span>Phase Checkpoint Assessment</span>
                      </div>
                      {isCheckpointPassed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                          Passed ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-light-primary dark:text-dark-primary font-medium leading-relaxed">
                      {phase.checkpointAssessment.question}
                    </p>

                    <div className="space-y-1.5">
                      {phase.checkpointAssessment.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizOption === optIdx && activeQuizPhase === phase.id;
                        const isCorrect = optIdx === phase.checkpointAssessment.correctIndex;
                        const showResult = quizSubmitted && activeQuizPhase === phase.id;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              setActiveQuizPhase(phase.id);
                              setSelectedQuizOption(optIdx);
                              setQuizSubmitted(false);
                            }}
                            className={`w-full p-2.5 rounded-lg text-left text-[11px] border transition-all ${
                              showResult
                                ? isCorrect
                                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                                  : isSelected
                                  ? 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400'
                                  : 'bg-light-surface dark:bg-dark-elevated border-light-border dark:border-dark-border opacity-60'
                                : isSelected
                                ? 'bg-aurora-cyan/15 border-aurora-cyan text-light-primary dark:text-dark-primary font-semibold'
                                : 'bg-light-surface dark:bg-dark-elevated border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-aurora-cyan/40'
                            }`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={selectedQuizOption === null || activeQuizPhase !== phase.id}
                        onClick={() =>
                          handleQuizAnswer(phase.checkpointAssessment.correctIndex, phase.id)
                        }
                        className="px-3 py-1.5 rounded-lg bg-aurora-cyan text-dark-bg font-bold text-xs disabled:opacity-50 transition-opacity"
                      >
                        Submit Checkpoint
                      </button>

                      {quizSubmitted && activeQuizPhase === phase.id && (
                        <button
                          type="button"
                          onClick={() =>
                            onAskMentor(
                              `Can you explain the answer to this cloud architecture assessment question: "${phase.checkpointAssessment.question}"? Why is the correct answer: "${phase.checkpointAssessment.options[phase.checkpointAssessment.correctIndex]}"?`
                            )
                          }
                          className="text-[11px] text-aurora-cyan hover:underline font-bold"
                        >
                          Explain Why in Chat →
                        </button>
                      )}
                    </div>

                    {quizSubmitted && activeQuizPhase === phase.id && (
                      <div className="text-[11px] text-light-muted dark:text-dark-muted leading-relaxed pt-1 bg-light-surface/40 dark:bg-dark-elevated/40 p-2 rounded-lg">
                        <strong>Explanation: </strong>
                        {phase.checkpointAssessment.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Initial Assessment & Customization Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl liquid-glass p-6 shadow-glass border border-light-border dark:border-dark-border animate-in zoom-in-95 space-y-4">
            <h3 className="font-serif font-bold text-xl text-light-primary dark:text-dark-primary">
              Customize Your Cloud Learning Roadmap
            </h3>
            <p className="text-xs text-light-muted dark:text-dark-muted">
              Select your goal, provider preference, current experience, and weekly hours to generate a tailored roadmap.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-light-primary dark:text-dark-primary mb-1">
                  Primary Learning Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                >
                  <option value="Solutions Architect">Cloud Solutions Architect (AWS SAA / Azure AZ-305 / GCP ACE)</option>
                  <option value="DevOps & Cloud Engineer">Cloud DevOps & Platform Engineer (Docker, Kubernetes, IaC)</option>
                  <option value="Cloud Security Specialist">Cloud Security & Zero Trust Specialist</option>
                  <option value="Cloud Practitioner">Cloud Practitioner (Foundations & Non-Dev Introduction)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-light-primary dark:text-dark-primary mb-1">
                  Target Cloud Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as CloudProviderId)}
                  className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                >
                  <option value="aws">Amazon Web Services (AWS)</option>
                  <option value="azure">Microsoft Azure</option>
                  <option value="gcp">Google Cloud Platform (GCP)</option>
                  <option value="multi">Multi-Cloud & CNCF Kubernetes</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-light-primary dark:text-dark-primary mb-1">
                  Current Technical Background
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                >
                  <option value="Complete Beginner">Complete Beginner to Tech & Cloud</option>
                  <option value="Developer / IT Transitioning">Software Developer / IT Sysadmin transitioning to Cloud</option>
                  <option value="Intermediate">Intermediate Cloud User seeking deep architecture skills</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-light-primary dark:text-dark-primary mb-1">
                  Available Study Time per Week
                </label>
                <select
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                >
                  <option value="3">3 - 4 hours / week (Casual)</option>
                  <option value="6">6 - 8 hours / week (Balanced)</option>
                  <option value="15">12 - 15+ hours / week (Accelerated)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-light-border dark:border-dark-border">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateCustomRoadmap}
                className="px-5 py-2 rounded-xl bg-aurora-cyan text-dark-bg font-extrabold text-xs hover:opacity-90 transition-opacity shadow-aurora-teal"
              >
                Generate Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
