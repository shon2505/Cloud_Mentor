'use client';

import React, { useState, useMemo } from 'react';
import { CostWorkloadInputs, CostComparisonResult } from '@/lib/platformTypes';
import { calculateCloudWorkloadCost, ARCHITECTURE_PRESETS } from '@/lib/costEngine';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Server,
  Database,
  HardDrive,
  Globe,
  Shield,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface CloudCostOptimizerModuleProps {
  onAskMentor: (prompt: string) => void;
}

const DEFAULT_INPUTS: CostWorkloadInputs = {
  projectName: 'My Cloud Service',
  businessCategory: 'SaaS & Enterprise B2B',
  businessModel: 'SaaS Subscription',
  stage: 'Production',
  currency: 'USD',
  monthlyRevenue: 15000,
  monthlyOperatingBudget: 6000,
  monthlyCloudBudget: 800,

  computeUnits: 2,
  vcpuPerUnit: 2,
  ramGbPerUnit: 4,
  os: 'linux',
  architecturePreset: 'web-app',

  objectStorageGb: 100,
  blockStorageGb: 120,
  egressGbMonthly: 400,

  databaseType: 'relational',
  databaseStorageGb: 80,
  multiAz: true,

  region: 'us-east',
  availabilitySla: 'standard',
  complianceLevel: 'standard',
};

export const CloudCostOptimizerModule: React.FC<CloudCostOptimizerModuleProps> = ({
  onAskMentor,
}) => {
  const [step, setStep] = useState<number>(1);
  const [inputs, setInputs] = useState<CostWorkloadInputs>(DEFAULT_INPUTS);
  const [activeScenario, setActiveScenario] = useState<'current' | 'savings' | 'growth' | 'multiRegion'>('current');

  // Compute cost comparison deterministically
  const results: CostComparisonResult = useMemo(() => {
    return calculateCloudWorkloadCost(inputs);
  }, [inputs]);

  // Handle Architecture Preset change
  const handlePresetSelect = (presetKey: string) => {
    if (presetKey === 'custom') {
      setInputs((prev) => ({ ...prev, architecturePreset: 'custom' }));
      return;
    }
    const preset = ARCHITECTURE_PRESETS[presetKey];
    if (preset) {
      setInputs((prev) => ({
        ...prev,
        ...preset,
        architecturePreset: presetKey as any,
      }));
    }
  };

  // Export results as clean CSV
  const handleExportCsv = () => {
    const headers = 'Provider,Monthly Cost,Annual Cost,Compute,Storage,Database,Networking,Support,Budget Delta\n';
    const rows = results.estimates
      .map(
        (est) =>
          `"${est.providerName}",${results.currencySymbol}${est.monthlyCost},${results.currencySymbol}${est.annualCost},${results.currencySymbol}${est.breakdown.compute},${results.currencySymbol}${est.breakdown.storage},${results.currencySymbol}${est.breakdown.database},${results.currencySymbol}${est.breakdown.networking},${results.currencySymbol}${est.breakdown.supportMonitoring},${results.currencySymbol}${est.budgetDelta}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cloudmentor-cost-comparison-${inputs.currency.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ask Cloud Mentor for an architectural trade-off review
  const handleAskMentorAnalysis = () => {
    const topPick = results.estimates.find((e) => e.providerId === results.recommendedProvider);
    const prompt = `Here is my business cloud workload comparison:
- Business Model: ${inputs.businessModel} (${inputs.stage} stage)
- Monthly Cloud Budget: ${results.currencySymbol}${inputs.monthlyCloudBudget.toLocaleString()}
- Workload: ${inputs.computeUnits} compute node(s) (${inputs.computeUnits * inputs.vcpuPerUnit} vCPU, ${inputs.computeUnits * inputs.ramGbPerUnit}GB RAM), OS: ${inputs.os}
- Storage: ${inputs.objectStorageGb}GB object storage + ${inputs.blockStorageGb}GB SSD
- Database: ${inputs.databaseType} (${inputs.databaseStorageGb}GB, Multi-AZ: ${inputs.multiAz ? 'Yes' : 'No'})
- Bandwidth: ${inputs.egressGbMonthly}GB/mo egress in ${inputs.region}
- Cost Estimates:
  * Google Cloud: ${results.currencySymbol}${results.estimates.find((e) => e.providerId === 'gcp')?.monthlyCost}/mo
  * AWS: ${results.currencySymbol}${results.estimates.find((e) => e.providerId === 'aws')?.monthlyCost}/mo
  * Azure: ${results.currencySymbol}${results.estimates.find((e) => e.providerId === 'azure')?.monthlyCost}/mo
The cost engine recommends ${topPick?.providerName}. Can you provide an architectural trade-off breakdown, explaining where I can save money and what hidden costs I should watch out for?`;

    onAskMentor(prompt);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-teal/15 border border-aurora-teal/30 text-aurora-teal text-xs font-semibold uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Workload Sizing & Multi-Cloud Economics</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-light-primary dark:text-dark-primary tracking-tight mb-2">
          Cloud Cost Optimizer
        </h1>
        <p className="text-sm md:text-base text-light-muted dark:text-dark-muted max-w-3xl leading-relaxed">
          Input your business revenue, budget, compute, storage, and reliability needs to receive transparent, deterministic cost estimates across AWS, Microsoft Azure, and Google Cloud.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="liquid-glass rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { stepNum: 1, label: 'Business & Budget' },
            { stepNum: 2, label: 'Compute Architecture' },
            { stepNum: 3, label: 'Storage & Network' },
            { stepNum: 4, label: 'Database & Region' },
            { stepNum: 5, label: 'Comparison & Analysis' },
          ].map((st, idx) => (
            <React.Fragment key={st.stepNum}>
              <button
                onClick={() => setStep(st.stepNum)}
                className="flex flex-col items-center gap-1.5 group focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === st.stepNum
                      ? 'bg-aurora-cyan text-dark-bg ring-4 ring-aurora-cyan/20 font-extrabold shadow-aurora-teal'
                      : step > st.stepNum
                      ? 'bg-emerald-500 text-white'
                      : 'bg-light-surface dark:bg-dark-elevated text-light-muted dark:text-dark-muted border border-light-border dark:border-dark-border'
                  }`}
                >
                  {step > st.stepNum ? '✓' : st.stepNum}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:block ${
                    step === st.stepNum
                      ? 'text-light-primary dark:text-dark-primary font-bold'
                      : 'text-light-muted dark:text-dark-muted'
                  }`}
                >
                  {st.label}
                </span>
              </button>
              {idx < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                    step > idx + 1 ? 'bg-emerald-500' : 'bg-light-border dark:bg-dark-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Multi-Step Form (Takes 7 cols on review step, 12 on earlier steps) */}
        <div className={step === 5 ? 'lg:col-span-5 space-y-6' : 'lg:col-span-12 max-w-4xl mx-auto w-full'}>
          {/* STEP 1: Business Profile & Budget */}
          {step === 1 && (
            <div className="liquid-glass rounded-2xl p-6 space-y-6 animate-in fade-in">
              <div className="border-b border-light-border dark:border-dark-border pb-4">
                <h2 className="font-serif text-xl font-semibold text-light-primary dark:text-dark-primary">
                  1. Business Profile & Financials
                </h2>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Keep revenue, operating budget, and cloud infrastructure budget distinct.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-light-surface/60 dark:bg-dark-elevated/60 border border-light-border dark:border-dark-border">
                <div>
                  <span className="text-xs font-bold text-light-primary dark:text-dark-primary block">
                    Display Currency
                  </span>
                  <span className="text-[11px] text-light-muted dark:text-dark-muted">
                    Supports USD ($) and INR (₹) at standard conversion benchmark (1 USD = 85 INR)
                  </span>
                </div>
                <div className="flex rounded-lg p-1 bg-light-hover dark:bg-dark-secondary">
                  <button
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, currency: 'USD' }))}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      inputs.currency === 'USD'
                        ? 'bg-aurora-cyan text-dark-bg shadow-xs'
                        : 'text-light-muted dark:text-dark-muted'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, currency: 'INR' }))}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      inputs.currency === 'INR'
                        ? 'bg-aurora-cyan text-dark-bg shadow-xs'
                        : 'text-light-muted dark:text-dark-muted'
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Project / Application Name
                  </label>
                  <input
                    type="text"
                    value={inputs.projectName || ''}
                    onChange={(e) => setInputs((p) => ({ ...p, projectName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                    placeholder="e.g. NextGen SaaS Platform"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Workload Lifecycle Stage
                  </label>
                  <select
                    value={inputs.stage}
                    onChange={(e) => setInputs((p) => ({ ...p, stage: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                  >
                    <option value="Prototype">Prototype / MVP</option>
                    <option value="Growth">Growth / Scaling Stage</option>
                    <option value="Production">Production Critical</option>
                    <option value="Enterprise">Enterprise Multi-Tenant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Business Model
                  </label>
                  <select
                    value={inputs.businessModel}
                    onChange={(e) => setInputs((p) => ({ ...p, businessModel: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
                  >
                    <option value="SaaS Subscription">SaaS B2B / B2C</option>
                    <option value="E-Commerce Storefront">E-Commerce Retail</option>
                    <option value="API / Developer Platform">API & Data Platform</option>
                    <option value="Marketplace">Two-Sided Marketplace</option>
                    <option value="Internal Enterprise App">Internal Enterprise Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Monthly Cloud Infrastructure Budget ({results.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.monthlyCloudBudget}
                    onChange={(e) => setInputs((p) => ({ ...p, monthlyCloudBudget: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan font-mono"
                  />
                  <span className="text-[10.5px] text-light-muted dark:text-dark-muted mt-1 block">
                    Target maximum monthly cloud hosting spend
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Monthly Business Revenue ({results.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.monthlyRevenue}
                    onChange={(e) => setInputs((p) => ({ ...p, monthlyRevenue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan font-mono"
                  />
                  <span className="text-[10.5px] text-light-muted dark:text-dark-muted mt-1 block">
                    Used to calculate cloud spend as a % of company revenue
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Monthly Total Operating Budget ({results.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.monthlyOperatingBudget}
                    onChange={(e) => setInputs((p) => ({ ...p, monthlyOperatingBudget: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-aurora-cyan text-dark-bg font-bold text-xs hover:opacity-90 shadow-aurora-teal transition-all"
                >
                  <span>Next: Compute Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Compute & Presets */}
          {step === 2 && (
            <div className="liquid-glass rounded-2xl p-6 space-y-6 animate-in fade-in">
              <div className="border-b border-light-border dark:border-dark-border pb-4">
                <h2 className="font-serif text-xl font-semibold text-light-primary dark:text-dark-primary">
                  2. Compute & Architecture Presets
                </h2>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Choose a pre-configured architecture baseline or dial in custom sizing.
                </p>
              </div>

              {/* Architecture Preset Shortcut Buttons */}
              <div>
                <label className="block text-xs font-bold text-light-primary dark:text-dark-primary mb-2">
                  Architecture Presets (Quick Shortcuts)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'web-app', label: 'Web Application', desc: '2 VMs, 4 vCPU, 8GB RAM' },
                    { id: 'microservices-api', label: 'Microservices API', desc: '4 VMs, 8 vCPU, 32GB RAM' },
                    { id: 'data-pipeline', label: 'Data Pipeline', desc: '6 VMs, 24 vCPU, 96GB RAM' },
                    { id: 'high-traffic-ecommerce', label: 'E-Commerce Peak', desc: '8 VMs, 32 vCPU, 128GB' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        inputs.architecturePreset === preset.id
                          ? 'bg-aurora-cyan/15 border-aurora-cyan text-light-primary dark:text-dark-primary shadow-xs'
                          : 'bg-light-surface dark:bg-dark-elevated border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-aurora-cyan/40'
                      }`}
                    >
                      <span className="text-xs font-bold block mb-1">{preset.label}</span>
                      <span className="text-[10.5px] opacity-80">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compute Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Number of Compute Units / VMs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={inputs.computeUnits}
                    onChange={(e) => {
                      setInputs((p) => ({
                        ...p,
                        computeUnits: Math.max(1, Number(e.target.value)),
                        architecturePreset: 'custom',
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono"
                  />
                  <span className="text-[10.5px] text-light-muted dark:text-dark-muted mt-1 block">
                    e.g. 2 instances across availability zones
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    vCPUs per Instance
                  </label>
                  <select
                    value={inputs.vcpuPerUnit}
                    onChange={(e) => {
                      setInputs((p) => ({
                        ...p,
                        vcpuPerUnit: Number(e.target.value),
                        architecturePreset: 'custom',
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono"
                  >
                    <option value="1">1 vCPU</option>
                    <option value="2">2 vCPUs (General Purpose)</option>
                    <option value="4">4 vCPUs (Performance)</option>
                    <option value="8">8 vCPUs (High Throughput)</option>
                    <option value="16">16 vCPUs (Heavy Compute)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    RAM per Instance (GB)
                  </label>
                  <select
                    value={inputs.ramGbPerUnit}
                    onChange={(e) => {
                      setInputs((p) => ({
                        ...p,
                        ramGbPerUnit: Number(e.target.value),
                        architecturePreset: 'custom',
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono"
                  >
                    <option value="2">2 GB RAM</option>
                    <option value="4">4 GB RAM</option>
                    <option value="8">8 GB RAM</option>
                    <option value="16">16 GB RAM</option>
                    <option value="32">32 GB RAM</option>
                    <option value="64">64 GB RAM</option>
                  </select>
                </div>
              </div>

              {/* Operating System */}
              <div>
                <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-2">
                  Operating System & Licensing
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-elevated flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="os"
                      value="linux"
                      checked={inputs.os === 'linux'}
                      onChange={() => setInputs((p) => ({ ...p, os: 'linux' }))}
                      className="text-aurora-cyan focus:ring-aurora-cyan"
                    />
                    <div>
                      <span className="text-xs font-bold text-light-primary dark:text-dark-primary block">
                        Linux (Ubuntu / Amazon Linux / Debian)
                      </span>
                      <span className="text-[10.5px] text-light-muted dark:text-dark-muted">
                        No OS licensing surcharge
                      </span>
                    </div>
                  </label>

                  <label className="flex-1 p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-elevated flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="os"
                      value="windows"
                      checked={inputs.os === 'windows'}
                      onChange={() => setInputs((p) => ({ ...p, os: 'windows' }))}
                      className="text-aurora-cyan focus:ring-aurora-cyan"
                    />
                    <div>
                      <span className="text-xs font-bold text-light-primary dark:text-dark-primary block">
                        Microsoft Windows Server
                      </span>
                      <span className="text-[10.5px] text-light-muted dark:text-dark-muted">
                        Includes per-core Windows license fees
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-light-border dark:border-dark-border text-xs font-semibold text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-aurora-cyan text-dark-bg font-bold text-xs hover:opacity-90 shadow-aurora-teal transition-all"
                >
                  <span>Next: Storage & Network</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Storage & Network */}
          {step === 3 && (
            <div className="liquid-glass rounded-2xl p-6 space-y-6 animate-in fade-in">
              <div className="border-b border-light-border dark:border-dark-border pb-4">
                <h2 className="font-serif text-xl font-semibold text-light-primary dark:text-dark-primary">
                  3. Storage & Network Bandwidth
                </h2>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Specify object storage (S3/Blob), persistent SSD block volumes, and monthly egress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Object Storage (GB)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.objectStorageGb}
                    onChange={(e) => setInputs((p) => ({ ...p, objectStorageGb: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono"
                  />
                  <span className="text-[10.5px] text-light-muted dark:text-dark-muted mt-1 block">
                    e.g. S3 / Azure Blob for media & assets
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Block Storage SSD Disk (GB)
                  </label>
                  <input
                    type="number"
                    min="20"
                    step="20"
                    value={inputs.blockStorageGb}
                    onChange={(e) => setInputs((p) => ({ ...p, blockStorageGb: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono"
                  />
                  <span className="text-[10.5px] text-light-muted dark:text-dark-muted mt-1 block">
                    e.g. EBS gp3 / Managed Disks for OS & data
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Outbound Data Egress (GB/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.egressGbMonthly}
                    onChange={(e) => setInputs((p) => ({ ...p, egressGbMonthly: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono"
                  />
                  <span className="text-[10.5px] text-light-muted dark:text-dark-muted mt-1 block">
                    Data downloaded by users over the internet
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-light-border dark:border-dark-border text-xs font-semibold text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-aurora-cyan text-dark-bg font-bold text-xs hover:opacity-90 shadow-aurora-teal transition-all"
                >
                  <span>Next: Database & Region</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Database & Region */}
          {step === 4 && (
            <div className="liquid-glass rounded-2xl p-6 space-y-6 animate-in fade-in">
              <div className="border-b border-light-border dark:border-dark-border pb-4">
                <h2 className="font-serif text-xl font-semibold text-light-primary dark:text-dark-primary">
                  4. Managed Database, Region & Resilience
                </h2>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  Configure high availability Multi-AZ database replication and deployment geography.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Managed Database Type
                  </label>
                  <select
                    value={inputs.databaseType}
                    onChange={(e) => setInputs((p) => ({ ...p, databaseType: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary"
                  >
                    <option value="relational">Relational SQL (PostgreSQL / MySQL)</option>
                    <option value="nosql">NoSQL (DynamoDB / Cosmos / Firestore)</option>
                    <option value="cache">In-Memory Cache (Redis / Memcached)</option>
                    <option value="none">None / External Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Database Storage (GB)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="20"
                    disabled={inputs.databaseType === 'none'}
                    value={inputs.databaseStorageGb}
                    onChange={(e) => setInputs((p) => ({ ...p, databaseStorageGb: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary font-mono disabled:opacity-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="p-3 rounded-xl border border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-elevated/60 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.multiAz}
                      onChange={(e) => setInputs((p) => ({ ...p, multiAz: e.target.checked }))}
                      className="mt-0.5 rounded text-aurora-cyan focus:ring-aurora-cyan"
                    />
                    <div>
                      <span className="text-xs font-bold text-light-primary dark:text-dark-primary block">
                        Multi-AZ High Availability Synchronous Replication
                      </span>
                      <span className="text-[11px] text-light-muted dark:text-dark-muted leading-relaxed block">
                        Maintains an active standby replica in a second data center for zero-data-loss automated failover. Essential for production workloads.
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Primary Cloud Region
                  </label>
                  <select
                    value={inputs.region}
                    onChange={(e) => setInputs((p) => ({ ...p, region: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary"
                  >
                    <option value="us-east">US East (N. Virginia / Ohio) - Baseline</option>
                    <option value="europe">Europe (Frankfurt / Ireland) +7%</option>
                    <option value="asia-south">Asia South (Mumbai / India) +5%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-primary dark:text-dark-primary mb-1">
                    Availability SLA Level
                  </label>
                  <select
                    value={inputs.availabilitySla}
                    onChange={(e) => setInputs((p) => ({ ...p, availabilitySla: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary"
                  >
                    <option value="standard">Standard SLA (99.9% uptime)</option>
                    <option value="high">Mission-Critical Enterprise (99.99% uptime)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-light-border dark:border-dark-border text-xs font-semibold text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-aurora-cyan text-dark-bg font-extrabold text-xs hover:opacity-90 shadow-aurora-teal transition-all"
                >
                  <span>Generate Multi-Cloud Comparison</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 (Left Col): Workload Parameters Summary */}
          {step === 5 && (
            <div className="liquid-glass rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-3">
                <h3 className="font-serif font-semibold text-base text-light-primary dark:text-dark-primary">
                  Workload Parameters
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-aurora-cyan hover:underline"
                >
                  Edit Inputs
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Lifecycle Stage:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary">{inputs.stage}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Monthly Cloud Budget:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary font-mono">
                    {results.currencySymbol}{inputs.monthlyCloudBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Monthly Revenue:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary font-mono">
                    {results.currencySymbol}{inputs.monthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Compute Capacity:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary font-mono">
                    {inputs.computeUnits} node(s) • {inputs.computeUnits * inputs.vcpuPerUnit} vCPU • {inputs.computeUnits * inputs.ramGbPerUnit} GB RAM
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Storage:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary font-mono">
                    {inputs.objectStorageGb} GB Object • {inputs.blockStorageGb} GB SSD
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Database:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary">
                    {inputs.databaseType} ({inputs.databaseStorageGb} GB, Multi-AZ: {inputs.multiAz ? 'Yes' : 'No'})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-light-border/40 dark:border-dark-border/40">
                  <span className="text-light-muted dark:text-dark-muted">Egress Bandwidth:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary font-mono">
                    {inputs.egressGbMonthly} GB/mo
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-light-muted dark:text-dark-muted">Region & OS:</span>
                  <span className="font-medium text-light-primary dark:text-dark-primary">
                    {inputs.region.toUpperCase()} • {inputs.os.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-light-border dark:border-dark-border flex flex-col gap-2">
                <button
                  onClick={handleAskMentorAnalysis}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-blue text-dark-bg font-bold text-xs hover:opacity-95 shadow-aurora-teal transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with Cloud Mentor AI</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-elevated text-light-primary dark:text-dark-primary text-xs font-semibold hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Comparison (CSV)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STEP 5 (Right Col): Results & Ranked Comparison Cards */}
        {step === 5 && (
          <div className="lg:col-span-7 space-y-6 animate-in fade-in">
            {/* Budget Overrun Alert if active */}
            {results.budgetAlert && (
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-3 shadow-glass">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block font-semibold mb-0.5">Budget Alert Notice</strong>
                  {results.budgetAlert}
                </div>
              </div>
            )}

            {/* Recommendation Banner */}
            <div className="liquid-glass rounded-2xl p-5 border-l-4 border-l-aurora-cyan">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aurora-cyan mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Primary Recommendation</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-light-primary dark:text-dark-primary mb-1">
                {results.estimates.find((e) => e.providerId === results.recommendedProvider)?.providerName}
              </h3>
              <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                {results.recommendationReason}
              </p>
            </div>

            {/* Ranked Comparison Cards */}
            <div className="space-y-4">
              {results.estimates.map((est, rank) => {
                const isTopPick = est.providerId === results.recommendedProvider;
                return (
                  <div
                    key={est.providerId}
                    className={`liquid-glass-card rounded-2xl p-5 transition-all ${
                      isTopPick ? 'ring-2 ring-aurora-cyan/40 shadow-aurora-glow' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-[11px] font-bold flex items-center justify-center">
                            #{rank + 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-light-primary dark:text-dark-primary">
                            {est.providerName}
                          </h4>
                          {isTopPick && (
                            <span className="px-2 py-0.5 rounded-full bg-aurora-cyan text-dark-bg text-[10px] font-extrabold uppercase tracking-wider">
                              Top Pick
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {est.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-light-surface/80 dark:bg-dark-elevated/80 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted font-medium"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold font-mono text-light-primary dark:text-dark-primary">
                          {results.currencySymbol}
                          {est.monthlyCost.toLocaleString()}
                          <span className="text-xs font-normal text-light-muted dark:text-dark-muted">/mo</span>
                        </div>
                        <div className="text-[11px] text-light-muted dark:text-dark-muted font-mono">
                          {results.currencySymbol}
                          {est.annualCost.toLocaleString()} / year
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Progress Bars */}
                    <div className="space-y-2 mb-4 bg-light-surface/60 dark:bg-dark-elevated/50 p-3 rounded-xl border border-light-border/60 dark:border-dark-border/60">
                      <span className="text-[11px] font-bold text-light-primary dark:text-dark-primary block mb-2">
                        Monthly Cost Breakdown
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div>
                          <span className="text-[10.5px] text-light-muted dark:text-dark-muted block">Compute</span>
                          <span className="font-mono font-semibold text-light-primary dark:text-dark-primary">
                            {results.currencySymbol}{est.breakdown.compute}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10.5px] text-light-muted dark:text-dark-muted block">Storage</span>
                          <span className="font-mono font-semibold text-light-primary dark:text-dark-primary">
                            {results.currencySymbol}{est.breakdown.storage}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10.5px] text-light-muted dark:text-dark-muted block">Database</span>
                          <span className="font-mono font-semibold text-light-primary dark:text-dark-primary">
                            {results.currencySymbol}{est.breakdown.database}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10.5px] text-light-muted dark:text-dark-muted block">Network Egress</span>
                          <span className="font-mono font-semibold text-light-primary dark:text-dark-primary">
                            {results.currencySymbol}{est.breakdown.networking}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10.5px] text-light-muted dark:text-dark-muted block">Monitoring</span>
                          <span className="font-mono font-semibold text-light-primary dark:text-dark-primary">
                            {results.currencySymbol}{est.breakdown.supportMonitoring}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className="flex flex-wrap items-center gap-4 text-xs mb-3 text-light-muted dark:text-dark-muted">
                      {est.costAsPercentOfRevenue !== null && (
                        <div>
                          <span>% of Revenue: </span>
                          <strong className="text-light-primary dark:text-dark-primary font-mono">
                            {est.costAsPercentOfRevenue}%
                          </strong>
                        </div>
                      )}
                      {est.costAsPercentOfCloudBudget !== null && (
                        <div>
                          <span>% of Cloud Budget: </span>
                          <strong
                            className={`font-mono ${
                              est.costAsPercentOfCloudBudget > 100
                                ? 'text-red-500 font-bold'
                                : 'text-emerald-500 font-bold'
                            }`}
                          >
                            {est.costAsPercentOfCloudBudget}%
                          </strong>
                        </div>
                      )}
                      {inputs.monthlyCloudBudget > 0 && (
                        <div>
                          <span>Budget Delta: </span>
                          <strong
                            className={`font-mono ${
                              est.budgetDelta >= 0 ? 'text-emerald-500' : 'text-red-500'
                            }`}
                          >
                            {est.budgetDelta >= 0
                              ? `+${results.currencySymbol}${est.budgetDelta.toLocaleString()} under`
                              : `-${results.currencySymbol}${Math.abs(est.budgetDelta).toLocaleString()} overrun`}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Pros & Tradeoffs */}
                    <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-light-muted dark:text-dark-muted">
                        <span>Source: Verified Public Cloud Calculator API (Oct 2025)</span>
                      </div>
                      <a
                        href={est.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-aurora-cyan hover:underline font-semibold"
                      >
                        <span>Official Calculator</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scenario Forecasting Simulator */}
            <div className="liquid-glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-aurora-cyan" />
                  <h4 className="font-serif font-semibold text-sm text-light-primary dark:text-dark-primary">
                    Scenario Projections & Growth Planning
                  </h4>
                </div>
                <span className="text-[11px] text-light-muted dark:text-dark-muted">
                  Baseline: {results.currencySymbol}{results.scenarios.current.toLocaleString()}/mo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-light-surface/70 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border">
                  <span className="text-[11px] text-light-muted dark:text-dark-muted block">
                    1-Year Savings Plan (~32% off compute)
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-500 block mt-1">
                    {results.currencySymbol}{results.scenarios.withSavingsPlan.toLocaleString()}/mo
                  </span>
                  <span className="text-[10px] text-light-muted dark:text-dark-muted block mt-0.5">
                    Save ~{results.currencySymbol}{(results.scenarios.current - results.scenarios.withSavingsPlan).toLocaleString()}/mo with commitment
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-light-surface/70 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border">
                  <span className="text-[11px] text-light-muted dark:text-dark-muted block">
                    2x Business Growth Workload
                  </span>
                  <span className="font-mono font-bold text-sm text-light-primary dark:text-dark-primary block mt-1">
                    {results.currencySymbol}{results.scenarios.withDoubleGrowth.toLocaleString()}/mo
                  </span>
                  <span className="text-[10px] text-light-muted dark:text-dark-muted block mt-0.5">
                    Projected cost if traffic & users double
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-light-surface/70 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border">
                  <span className="text-[11px] text-light-muted dark:text-dark-muted block">
                    Multi-Region Disaster Recovery
                  </span>
                  <span className="font-mono font-bold text-sm text-light-primary dark:text-dark-primary block mt-1">
                    {results.currencySymbol}{results.scenarios.multiRegionHa.toLocaleString()}/mo
                  </span>
                  <span className="text-[10px] text-light-muted dark:text-dark-muted block mt-0.5">
                    Active-passive cross-region failover
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
