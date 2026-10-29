'use client';

import React, { useState, useMemo } from 'react';
import {
  CLOUD_PROVIDERS,
  CLOUD_SERVICES,
  CROSS_PROVIDER_COMPARISONS,
  FREE_TIER_OFFERS,
} from '@/lib/explorerData';
import { CloudProviderId, ServiceCategory } from '@/lib/platformTypes';
import {
  Compass,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
  Database,
  HardDrive,
  Network,
  Box,
  Cpu,
  Shield,
  Activity,
  Gift,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Info,
  Globe,
} from 'lucide-react';

interface CloudExplorerModuleProps {
  onAskMentor: (prompt: string) => void;
  onLaunchCostOptimizer?: () => void;
}

type ExplorerTab = 'providers' | 'services' | 'comparison' | 'freetier';

export const CloudExplorerModule: React.FC<CloudExplorerModuleProps> = ({
  onAskMentor,
  onLaunchCostOptimizer,
}) => {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('providers');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory | 'all'>('all');
  const [serviceProvider, setServiceProvider] = useState<CloudProviderId | 'all'>('all');
  const [selectedComparisonCategory, setSelectedComparisonCategory] = useState<ServiceCategory | 'all'>('all');
  const [freeTierFilter, setFreeTierFilter] = useState<'all' | 'Always Free' | '12 Months Free'>('all');

  // Filtered services
  const filteredServices = useMemo(() => {
    return CLOUD_SERVICES.filter((svc) => {
      if (serviceProvider !== 'all' && svc.provider !== serviceProvider) return false;
      if (serviceCategory !== 'all' && svc.category !== serviceCategory) return false;
      if (serviceSearch.trim()) {
        const q = serviceSearch.toLowerCase();
        const matchesName = svc.name.toLowerCase().includes(q);
        const matchesSummary = svc.summary.toLowerCase().includes(q);
        const matchesFeatures = svc.keyFeatures.some((f) => f.toLowerCase().includes(q));
        const matchesCases = svc.typicalUseCases.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesSummary && !matchesFeatures && !matchesCases) return false;
      }
      return true;
    });
  }, [serviceProvider, serviceCategory, serviceSearch]);

  // Filtered cross-provider comparisons
  const filteredComparisons = useMemo(() => {
    if (selectedComparisonCategory === 'all') return CROSS_PROVIDER_COMPARISONS;
    return CROSS_PROVIDER_COMPARISONS.filter((c) => c.category === selectedComparisonCategory);
  }, [selectedComparisonCategory]);

  // Filtered free tier offers
  const filteredFreeTier = useMemo(() => {
    if (freeTierFilter === 'all') return FREE_TIER_OFFERS;
    return FREE_TIER_OFFERS.filter((f) => f.offerType === freeTierFilter);
  }, [freeTierFilter]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-blue/15 border border-aurora-blue/30 text-aurora-blue text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Cloud Architecture Reference</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-light-primary dark:text-dark-primary tracking-tight mb-2">
          Cloud Explorer
        </h1>
        <p className="text-sm md:text-base text-light-muted dark:text-dark-muted max-w-3xl leading-relaxed">
          Navigate hyperscaler profiles, discover individual services across 9 categories, cross-examine equivalent services side-by-side, and explore verified always-free tiers.
        </p>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="liquid-glass rounded-2xl p-1.5 mb-6 flex flex-wrap gap-1">
        {[
          { id: 'providers', label: 'Cloud Providers', icon: Globe },
          { id: 'services', label: 'Service Catalog', icon: Layers },
          { id: 'comparison', label: 'Cross-Provider Comparison', icon: Server },
          { id: 'freetier', label: 'Free-Tier Discovery', icon: Gift },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ExplorerTab)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-aurora-cyan to-aurora-blue text-dark-bg shadow-aurora-teal'
                  : 'text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-hover dark:hover:bg-dark-hover'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROVIDER CATALOG */}
      {activeTab === 'providers' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CLOUD_PROVIDERS.map((prov) => (
              <div
                key={prov.id}
                className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg border ${prov.badgeBg}`}
                    >
                      {prov.name}
                    </span>
                    <a
                      href={prov.officialSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-light-muted dark:text-dark-muted hover:text-aurora-cyan flex items-center gap-1 transition-colors"
                    >
                      <span>Official Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-light-primary dark:text-dark-primary mb-2">
                    {prov.tagline}
                  </h3>

                  <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed mb-4">
                    {prov.overview}
                  </p>

                  {/* Strengths */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 block mb-1.5">
                      Key Strengths
                    </span>
                    <ul className="space-y-1">
                      {prov.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-light-primary/90 dark:text-dark-primary/90 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Limitations */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 block mb-1.5">
                      Trade-offs to Consider
                    </span>
                    <ul className="space-y-1">
                      {prov.limitations.map((lim, idx) => (
                        <li key={idx} className="text-xs text-light-muted dark:text-dark-muted flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Portal Links */}
                <div className="pt-4 border-t border-light-border/60 dark:border-dark-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={prov.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-aurora-cyan hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Documentation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span>•</span>
                    <a
                      href={prov.pricingCalculatorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      Calculator
                    </a>
                    <span>•</span>
                    <a
                      href={prov.freeTierUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      Free Tier
                    </a>
                  </div>

                  <button
                    onClick={() =>
                      onAskMentor(
                        `Can you explain the main architectural reasons to choose ${prov.name} versus other cloud providers? Where does it excel most?`
                      )
                    }
                    className="flex items-center gap-1 text-[11.5px] font-bold text-aurora-blue hover:text-aurora-cyan transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE CATALOG */}
      {activeTab === 'services' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Service Search & Filter Header */}
          <div className="liquid-glass rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-light-muted dark:text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search services by name (e.g. EC2, S3, Cloud Run, DynamoDB, BigQuery)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-light-surface/80 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-light-muted dark:text-dark-muted">Provider:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'aws', label: 'AWS' },
                { id: 'azure', label: 'Azure' },
                { id: 'gcp', label: 'Google Cloud' },
                { id: 'cloudflare', label: 'Cloudflare' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => setServiceProvider(prov.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    serviceProvider === prov.id
                      ? 'bg-aurora-cyan text-dark-bg font-bold shadow-xs'
                      : 'bg-light-surface dark:bg-dark-elevated text-light-muted dark:text-dark-muted border border-light-border dark:border-dark-border'
                  }`}
                >
                  {prov.label}
                </button>
              ))}

              <span className="text-xs font-semibold text-light-muted dark:text-dark-muted ml-3">Category:</span>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
              >
                <option value="all">All Categories</option>
                <option value="compute">Compute</option>
                <option value="storage">Storage</option>
                <option value="database">Database</option>
                <option value="containers">Containers & K8s</option>
                <option value="serverless">Serverless</option>
              </select>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                className="liquid-glass-card rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-aurora-cyan">
                      {svc.categoryLabel}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border font-semibold">
                      {svc.providerName}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-light-primary dark:text-dark-primary mb-2 group-hover:text-aurora-cyan transition-colors">
                    {svc.name}
                  </h3>

                  <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed mb-3">
                    {svc.summary}
                  </p>

                  {/* Key Features */}
                  <div className="mb-3">
                    <span className="text-[10.5px] font-bold text-light-muted dark:text-dark-muted block mb-1">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1">
                      {svc.keyFeatures.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="text-[11px] text-light-primary/90 dark:text-dark-primary/90 flex items-start gap-1">
                          <span className="text-aurora-cyan font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Free Tier Snippet if available */}
                  {svc.freeTierSnippet && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] mb-3">
                      <strong>Free Tier: </strong>
                      {svc.freeTierSnippet}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
                  <a
                    href={svc.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-aurora-cyan hover:underline font-semibold"
                  >
                    <span>Official Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() =>
                      onAskMentor(
                        `How does ${svc.name} work? Can you give me a beginner walkthrough and a production architecture code example?`
                      )
                    }
                    className="text-[11px] font-bold text-aurora-blue hover:text-aurora-cyan transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Explain in Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CROSS-PROVIDER SERVICE COMPARISON MATRIX */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="liquid-glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-light-primary dark:text-dark-primary block">
                Side-by-Side Equivalence Matrix
              </span>
              <span className="text-[11px] text-light-muted dark:text-dark-muted">
                Compare direct architectural equivalents across AWS, Azure, and Google Cloud with practical distinctions.
              </span>
            </div>
            {onLaunchCostOptimizer && (
              <button
                onClick={onLaunchCostOptimizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurora-cyan text-dark-bg text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Pricing in Cost Optimizer</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {filteredComparisons.map((comp) => (
              <div key={comp.id} className="liquid-glass rounded-2xl p-6 space-y-4">
                <div className="border-b border-light-border dark:border-dark-border pb-3">
                  <div className="inline-block px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider bg-aurora-blue/15 text-aurora-blue mb-1">
                    {comp.categoryLabel}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-light-primary dark:text-dark-primary">
                    {comp.capability}
                  </h3>
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-1 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                {/* 3-Column Provider Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* AWS */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <span className="text-xs font-bold text-amber-500 block">AWS: {comp.services.aws.name}</span>
                    <p className="text-xs text-light-primary dark:text-dark-primary leading-relaxed">
                      {comp.services.aws.summary}
                    </p>
                    <div className="text-[11px] text-light-muted dark:text-dark-muted">
                      <strong>Pricing: </strong>
                      {comp.services.aws.pricingModel}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      <strong>Core Edge: </strong>
                      {comp.services.aws.strengths}
                    </div>
                  </div>

                  {/* Azure */}
                  <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-2">
                    <span className="text-xs font-bold text-sky-500 block">Azure: {comp.services.azure.name}</span>
                    <p className="text-xs text-light-primary dark:text-dark-primary leading-relaxed">
                      {comp.services.azure.summary}
                    </p>
                    <div className="text-[11px] text-light-muted dark:text-dark-muted">
                      <strong>Pricing: </strong>
                      {comp.services.azure.pricingModel}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      <strong>Core Edge: </strong>
                      {comp.services.azure.strengths}
                    </div>
                  </div>

                  {/* Google Cloud */}
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                    <span className="text-xs font-bold text-blue-500 block">Google Cloud: {comp.services.gcp.name}</span>
                    <p className="text-xs text-light-primary dark:text-dark-primary leading-relaxed">
                      {comp.services.gcp.summary}
                    </p>
                    <div className="text-[11px] text-light-muted dark:text-dark-muted">
                      <strong>Pricing: </strong>
                      {comp.services.gcp.pricingModel}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      <strong>Core Edge: </strong>
                      {comp.services.gcp.strengths}
                    </div>
                  </div>
                </div>

                {/* Alternative Provider callout if exists */}
                {comp.services.alternative && (
                  <div className="p-3 rounded-xl bg-aurora-cyan/10 border border-aurora-cyan/20 text-xs flex items-center justify-between gap-3">
                    <div>
                      <strong className="text-aurora-cyan">{comp.services.alternative.provider} Alternative: </strong>
                      <span className="text-light-primary dark:text-dark-primary">{comp.services.alternative.name} — {comp.services.alternative.summary}</span>
                    </div>
                    <a
                      href={comp.services.alternative.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-aurora-cyan hover:underline shrink-0 font-semibold"
                    >
                      Docs →
                    </a>
                  </div>
                )}

                {/* Key Differences & Architectural Guidance */}
                <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted block">
                    Key Technical Differences:
                  </span>
                  <ul className="space-y-1">
                    {comp.keyDifferences.map((diff, idx) => (
                      <li key={idx} className="text-xs text-light-muted dark:text-dark-muted flex items-start gap-1.5">
                        <span className="text-aurora-cyan font-bold">•</span>
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[11.5px] text-aurora-blue dark:text-aurora-cyan pt-2 italic">
                    💡 Architectural Tip: {comp.architecturalConsiderations}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FREE-TIER DISCOVERY */}
      {activeTab === 'freetier' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="liquid-glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-light-primary dark:text-dark-primary block">
                Verified Cloud Free Tiers & Introductory Allowances
              </span>
              <span className="text-[11px] text-light-muted dark:text-dark-muted">
                Always-free services vs 12-month promotional trials. All limits verified against official vendor documentation.
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFreeTierFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  freeTierFilter === 'all'
                    ? 'bg-aurora-cyan text-dark-bg'
                    : 'bg-light-surface dark:bg-dark-elevated text-light-muted dark:text-dark-muted'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFreeTierFilter('Always Free')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  freeTierFilter === 'Always Free'
                    ? 'bg-aurora-cyan text-dark-bg'
                    : 'bg-light-surface dark:bg-dark-elevated text-light-muted dark:text-dark-muted'
                }`}
              >
                Always Free (Never Expires)
              </button>
              <button
                onClick={() => setFreeTierFilter('12 Months Free')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  freeTierFilter === '12 Months Free'
                    ? 'bg-aurora-cyan text-dark-bg'
                    : 'bg-light-surface dark:bg-dark-elevated text-light-muted dark:text-dark-muted'
                }`}
              >
                12-Month Trial
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFreeTier.map((item) => (
              <div
                key={item.id}
                className="liquid-glass-card rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-light-primary dark:text-dark-primary">
                      {item.providerName}
                    </span>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                        item.offerType === 'Always Free'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                      }`}
                    >
                      {item.offerType}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-light-primary dark:text-dark-primary mb-2">
                    {item.serviceName}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-light-surface/70 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border text-xs font-mono font-medium text-light-primary dark:text-dark-primary mb-3">
                    {item.allowance}
                  </div>

                  <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed mb-4">
                    <strong>Restrictions & Notes: </strong>
                    {item.restrictions}
                  </p>
                </div>

                <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-light-muted dark:text-dark-muted">
                    Verified {item.verifiedDate}
                  </span>
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-aurora-cyan hover:underline font-semibold"
                  >
                    <span>View Terms</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
