'use client';

import React from 'react';
import { Layers, Box, Cpu, GraduationCap, Calculator, Compass, Sparkles, Milestone } from 'lucide-react';
import { PlatformModule } from '@/lib/platformTypes';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
  onNavigateModule?: (module: PlatformModule) => void;
}

const SUGGESTIONS = [
  {
    icon: Layers,
    title: 'Explain IaaS vs PaaS vs SaaS',
    subtitle: 'With intuitive everyday analogies and provider examples',
    prompt: 'Can you explain the difference between IaaS, PaaS, and SaaS with simple everyday analogies and real-world provider examples?',
  },
  {
    icon: Box,
    title: 'How does Kubernetes work?',
    subtitle: 'Pods, Nodes, Deployments & cluster architecture',
    prompt: 'How does Kubernetes work under the hood? Explain its core components like Pods, Nodes, and Deployments simply.',
  },
  {
    icon: Cpu,
    title: 'AWS Lambda vs Amazon EC2',
    subtitle: 'When to choose serverless vs virtual servers',
    prompt: 'Compare AWS Lambda vs Amazon EC2. In what scenarios should I choose serverless over traditional virtual machines?',
  },
  {
    icon: GraduationCap,
    title: 'Roadmap to Cloud Certifications',
    subtitle: 'Key exam topics, services, and study strategies',
    prompt: 'What is the recommended roadmap to prepare for and pass the AWS Certified Solutions Architect Associate (SAA-C03) or Azure AZ-104?',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, onNavigateModule }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-3xl mx-auto my-auto animate-in fade-in duration-300">
      {/* Liquid Aurora Icon Mark */}
      <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-tr from-aurora-teal via-aurora-blue to-aurora-violet p-[2px] shadow-aurora-glow">
        <div className="w-full h-full bg-light-surface dark:bg-dark-secondary rounded-[14px] flex items-center justify-center text-aurora-cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-7 h-7">
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
            <path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Greeting Heading */}
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-light-primary dark:text-dark-primary mb-3 tracking-tight">
        Hello! Ready to master cloud computing?
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-[15px] text-light-muted dark:text-dark-muted max-w-xl mb-6 leading-relaxed">
        I am your AI Cloud Computing Mentor. Ask me anything about AWS, Azure, GCP, Kubernetes, Docker, serverless architectures, DevOps, cloud security, or certification exams.
      </p>

      {/* Cross-Module Quick Shortcuts */}
      {onNavigateModule && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => onNavigateModule('academy')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurora-cyan/15 hover:bg-aurora-cyan/25 border border-aurora-cyan/30 text-aurora-cyan text-xs font-semibold transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Discover Free Courses</span>
          </button>

          <button
            onClick={() => onNavigateModule('optimizer')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurora-teal/15 hover:bg-aurora-teal/25 border border-aurora-teal/30 text-aurora-teal text-xs font-semibold transition-all"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Compare Cloud Costs</span>
          </button>

          <button
            onClick={() => onNavigateModule('explorer')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurora-blue/15 hover:bg-aurora-blue/25 border border-aurora-blue/30 text-aurora-blue text-xs font-semibold transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Service Equivalents</span>
          </button>

          <button
            onClick={() => onNavigateModule('roadmap')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurora-violet/15 hover:bg-aurora-violet/25 border border-aurora-violet/30 text-aurora-violet text-xs font-semibold transition-all"
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>Personal Roadmap</span>
          </button>
        </div>
      )}

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              type="button"
              className="liquid-glass-card group p-4 rounded-2xl text-left flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4 text-aurora-cyan shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-light-primary dark:text-dark-primary group-hover:text-aurora-cyan transition-colors">
                  {item.title}
                </span>
              </div>
              <span className="text-xs text-light-muted dark:text-dark-muted line-clamp-1">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
