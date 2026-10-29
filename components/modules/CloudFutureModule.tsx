'use client';

import React, { useState } from 'react';
import { FUTURE_TOPICS } from '@/lib/futureData';
import { FutureTopic } from '@/lib/platformTypes';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  Milestone,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Code,
} from 'lucide-react';

interface CloudFutureModuleProps {
  onAskMentor: (prompt: string) => void;
  onAddToRoadmap?: (topicTitle: string) => void;
}

export const CloudFutureModule: React.FC<CloudFutureModuleProps> = ({
  onAskMentor,
  onAddToRoadmap,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(FUTURE_TOPICS[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTopic = FUTURE_TOPICS.find((t) => t.id === selectedTopicId) || FUTURE_TOPICS[0];

  const handleAddRoadmap = (topic: FutureTopic) => {
    if (onAddToRoadmap) onAddToRoadmap(topic.title);
    setToastMessage(`Added "${topic.title}" to your personalized Roadmap!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-glass text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-violet/15 border border-aurora-violet/30 text-aurora-violet text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cloud Intelligence & Emerging Trends</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-light-primary dark:text-dark-primary tracking-tight mb-2">
          Cloud Future
        </h1>
        <p className="text-sm md:text-base text-light-muted dark:text-dark-muted max-w-3xl leading-relaxed">
          Stay ahead of the cloud curve. Explore emerging shifts in AI infrastructure, GPU cluster networking, platform engineering, FinOps, confidential computing, and future career trajectories.
        </p>
      </div>

      {/* Main Grid: Left sidebar of topics, Right detailed view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted px-2 block mb-1">
            Emerging Frontiers
          </span>
          <div className="space-y-1.5">
            {FUTURE_TOPICS.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-aurora-cyan/15 to-aurora-blue/15 border-aurora-cyan text-light-primary dark:text-dark-primary shadow-xs'
                      : 'liquid-glass border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-aurora-cyan/40 hover:text-light-primary dark:hover:text-dark-primary'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-aurora-cyan">
                      {topic.category}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-aurora-cyan' : 'opacity-40'}`} />
                  </div>
                  <h4 className="font-serif font-semibold text-sm leading-snug">
                    {topic.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Topic Deep-Dive */}
        <div className="lg:col-span-8 liquid-glass rounded-2xl p-6 md:p-8 space-y-6 animate-in fade-in">
          {/* Header & Category */}
          <div className="border-b border-light-border dark:border-dark-border pb-4">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider bg-aurora-violet/15 text-aurora-violet mb-2">
              {activeTopic.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-light-primary dark:text-dark-primary mb-3">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-light-primary/90 dark:text-dark-primary/90 leading-relaxed font-medium">
              {activeTopic.summary}
            </p>
          </div>

          {/* Why It Matters */}
          <div className="p-4 rounded-xl bg-aurora-cyan/10 border border-aurora-cyan/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-aurora-cyan mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Why This Shift Matters</span>
            </h3>
            <p className="text-xs text-light-primary dark:text-dark-primary leading-relaxed">
              {activeTopic.whyItMatters}
            </p>
          </div>

          {/* Production Applications Today */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-light-primary dark:text-dark-primary mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-World Applications Today</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeTopic.currentApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-light-surface/70 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border text-xs text-light-primary/90 dark:text-dark-primary/90 flex items-start gap-2"
                >
                  <span className="text-aurora-cyan font-bold">•</span>
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Adoption Challenges */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-light-primary dark:text-dark-primary mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Adoption Challenges & Engineering Hurdles</span>
            </h3>
            <ul className="space-y-1.5">
              {activeTopic.challengesAndAdoption.map((ch, idx) => (
                <li key={idx} className="text-xs text-light-muted dark:text-dark-muted flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-light-primary dark:text-dark-primary mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-aurora-blue" />
              <span>Core Skills to Learn</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeTopic.requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Hands-on Starter Project */}
          <div className="liquid-glass rounded-2xl p-5 border border-aurora-teal/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-aurora-teal" />
                <h4 className="font-serif font-bold text-sm text-light-primary dark:text-dark-primary">
                  Recommended Starter Project: {activeTopic.starterProject.title}
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-aurora-teal/15 text-aurora-teal">
                Hands-on Lab
              </span>
            </div>
            <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
              {activeTopic.starterProject.description}
            </p>
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-light-primary dark:text-dark-primary block">
                Deliverables:
              </span>
              {activeTopic.starterProject.deliverables.map((deliv, idx) => (
                <div key={idx} className="text-xs text-light-muted dark:text-dark-muted flex items-start gap-2">
                  <span className="text-aurora-teal font-bold">{idx + 1}.</span>
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Trajectories */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted block mb-1">
                Related Career Paths:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeTopic.careerPaths.map((cp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border font-semibold text-light-primary dark:text-dark-primary"
                  >
                    <Briefcase className="w-3 h-3 text-aurora-cyan" />
                    <span>{cp}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right text-[11px] text-light-muted dark:text-dark-muted">
              <span>Source: {activeTopic.sourceAttribution.source} ({activeTopic.sourceAttribution.date})</span>
            </div>
          </div>

          {/* Contextual Action Bar */}
          <div className="pt-4 border-t border-light-border dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleAddRoadmap(activeTopic)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-elevated text-xs font-semibold text-light-primary dark:text-dark-primary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Milestone className="w-3.5 h-3.5 text-aurora-blue" />
              <span>Add to Learning Roadmap</span>
            </button>

            <button
              onClick={() =>
                onAskMentor(
                  `Can you explain the trend "${activeTopic.title}" in cloud computing? What are the key architectural principles, and how should a cloud engineer start building projects in this domain?`
                )
              }
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-blue text-dark-bg font-bold text-xs hover:opacity-90 shadow-aurora-teal transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep-Dive with Cloud Mentor AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
