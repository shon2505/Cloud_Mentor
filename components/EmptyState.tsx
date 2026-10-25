'use client';

import React from 'react';
import { Layers, Box, Cpu, GraduationCap } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Layers,
    title: 'Explain IaaS vs PaaS vs SaaS',
    subtitle: 'With everyday analogies and real-world examples',
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
    title: 'AWS Lambda vs EC2',
    subtitle: 'When to choose serverless vs virtual servers',
    prompt: 'Compare AWS Lambda vs Amazon EC2. In what scenarios should I choose serverless over traditional virtual machines?',
  },
  {
    icon: GraduationCap,
    title: 'Roadmap to AWS Cloud Practitioner',
    subtitle: 'Key exam topics, services, and study strategies',
    prompt: 'What is the recommended roadmap to prepare for and pass the AWS Certified Cloud Practitioner (CLF-C02) exam?',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-2xl mx-auto my-auto animate-in fade-in duration-300">
      {/* Custom Terracotta Sparkle / Cloud Geometric Logo */}
      <div className="w-12 h-12 mb-5 rounded-2xl bg-[#FDF5F2] dark:bg-[#3B221B] border border-[#C96442]/30 flex items-center justify-center text-[#C96442] shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-[#C96442]"
        >
          {/* Custom 8-point geometric star/cloud node */}
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" fill="#C96442" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Editorial Serif Greeting */}
      <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1E1D] dark:text-[#F5F4EE] mb-3 tracking-tight">
        Hello, ready to learn cloud?
      </h1>

      {/* Subtitle strictly enforcing scope */}
      <p className="text-sm sm:text-[15px] text-[#73726C] dark:text-[#9E9C96] max-w-lg mb-8 leading-relaxed">
        I am your dedicated Cloud Computing tutor. Ask me anything about AWS, Azure, GCP,
        Kubernetes, serverless architectures, DevOps, or cloud certification prep.
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              type="button"
              className="group p-4 rounded-xl border border-[#E5E2D8] dark:border-[#3E3E3A] bg-white dark:bg-[#30302E] hover:border-[#C96442]/50 hover:bg-[#FDF5F2]/40 dark:hover:bg-[#383835] transition-all duration-150 text-left shadow-soft hover:shadow-card flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4 text-[#C96442] shrink-0" />
                <span className="text-sm font-medium text-[#1F1E1D] dark:text-[#F5F4EE] group-hover:text-[#C96442] transition-colors">
                  {item.title}
                </span>
              </div>
              <span className="text-xs text-[#73726C] dark:text-[#9E9C96] line-clamp-1">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
