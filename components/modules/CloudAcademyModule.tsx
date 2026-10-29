'use client';

import React, { useState, useMemo } from 'react';
import { ACADEMY_RESOURCES } from '@/lib/academyData';
import { AcademyResource, CloudProviderId, ResourceCategory, SkillLevel, PriceCategory } from '@/lib/platformTypes';
import {
  Search,
  ExternalLink,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Award,
  Clock,
  ShieldCheck,
  Sparkles,
  Filter,
  CheckCircle2,
  BookmarkPlus,
} from 'lucide-react';

interface CloudAcademyModuleProps {
  onAskMentor: (prompt: string) => void;
  onAddToRoadmap?: (resourceTitle: string) => void;
}

export const CloudAcademyModule: React.FC<CloudAcademyModuleProps> = ({
  onAskMentor,
  onAddToRoadmap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<CloudProviderId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'duration'>('relevance');
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    return ACADEMY_RESOURCES.filter((res) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(query);
        const matchesDesc = res.description.toLowerCase().includes(query);
        const matchesPublisher = res.publisher.toLowerCase().includes(query);
        const matchesTopics = res.topics.some((t) => t.toLowerCase().includes(query));
        const matchesCert = res.certification?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesPublisher && !matchesTopics && !matchesCert) {
          return false;
        }
      }

      // Provider filter
      if (selectedProvider !== 'all' && res.provider !== selectedProvider) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && res.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && res.level !== selectedLevel && res.level !== 'All Levels') {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'all' && res.priceCategory !== selectedPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      // Default: featured first, then verified
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [searchQuery, selectedProvider, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const handleBookmark = (title: string) => {
    if (onAddToRoadmap) onAddToRoadmap(title);
    setSavedNotification(`Saved "${title}" to your study focus list!`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const getCategoryIcon = (cat: ResourceCategory) => {
    switch (cat) {
      case 'course':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'documentation':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'lab':
        return <FlaskConical className="w-3.5 h-3.5" />;
      case 'certification':
        return <Award className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const getProviderBadge = (provider: CloudProviderId) => {
    switch (provider) {
      case 'aws':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'azure':
        return 'bg-sky-500/10 text-sky-500 border-sky-500/30';
      case 'gcp':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'cloudflare':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'oci':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-glass text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-cyan/15 border border-aurora-cyan/30 text-aurora-cyan text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Free Cloud Learning Hub</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-light-primary dark:text-dark-primary tracking-tight mb-2">
          Cloud Academy
        </h1>
        <p className="text-sm md:text-base text-light-muted dark:text-dark-muted max-w-3xl leading-relaxed">
          Discover verified free courses, official interactive labs, vendor documentation, and certification prep across AWS, Microsoft Azure, Google Cloud, Cloudflare, and Linux Foundation.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="liquid-glass rounded-2xl p-4 md:p-5 mb-6 space-y-4">
        {/* Search Input Row */}
        <div className="relative">
          <Search className="w-4 h-4 text-light-muted dark:text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search free courses, topics (Kubernetes, Terraform, S3, Docker), or certifications (AZ-900, AWS SAA)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-light-surface/80 dark:bg-dark-elevated/70 border border-light-border dark:border-dark-border text-sm text-light-primary dark:text-dark-primary placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:border-aurora-cyan focus:ring-1 focus:ring-aurora-cyan/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-light-border/60 dark:border-dark-border/60">
          <span className="text-xs font-semibold text-light-muted dark:text-dark-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Provider:</span>
          </span>
          {[
            { id: 'all', label: 'All Providers' },
            { id: 'aws', label: 'AWS' },
            { id: 'azure', label: 'Azure' },
            { id: 'gcp', label: 'Google Cloud' },
            { id: 'cloudflare', label: 'Cloudflare' },
            { id: 'oci', label: 'Oracle OCI' },
            { id: 'multi', label: 'CNCF / Kubernetes' },
          ].map((prov) => (
            <button
              key={prov.id}
              onClick={() => setSelectedProvider(prov.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedProvider === prov.id
                  ? 'bg-aurora-cyan text-dark-bg font-bold shadow-xs'
                  : 'bg-light-surface dark:bg-dark-elevated text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary border border-light-border dark:border-dark-border'
              }`}
            >
              {prov.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-light-muted dark:text-dark-muted mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
            >
              <option value="all">All Categories</option>
              <option value="course">Free Courses</option>
              <option value="lab">Interactive Labs</option>
              <option value="documentation">Official Docs</option>
              <option value="certification">Certification Prep</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-light-muted dark:text-dark-muted mb-1">
              Skill Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-light-muted dark:text-dark-muted mb-1">
              Pricing Tier
            </label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
            >
              <option value="all">All Pricing</option>
              <option value="100% Free">100% Free (No Credit Card)</option>
              <option value="Free Tier / Trial">Free Tier / Free Trial</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-light-muted dark:text-dark-muted mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-light-surface dark:bg-dark-elevated border border-light-border dark:border-dark-border text-xs text-light-primary dark:text-dark-primary focus:outline-none focus:border-aurora-cyan"
            >
              <option value="relevance">Featured & Verified First</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Summary */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs text-light-muted dark:text-dark-muted">
        <span>
          Showing <strong className="text-light-primary dark:text-dark-primary">{filteredResources.length}</strong> verified cloud learning resources
        </span>
        {(selectedProvider !== 'all' || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedPrice !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedProvider('all');
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSelectedPrice('all');
              setSearchQuery('');
            }}
            className="text-aurora-cyan hover:underline font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 ? (
        <div className="liquid-glass rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center">
          <BookOpen className="w-10 h-10 text-light-muted dark:text-dark-muted mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-medium text-light-primary dark:text-dark-primary mb-1">
            No learning resources found
          </h3>
          <p className="text-xs text-light-muted dark:text-dark-muted max-w-md mb-4">
            No resources match your current search and filter combination. Try adjusting or clearing your filters.
          </p>
          <button
            onClick={() => {
              setSelectedProvider('all');
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSelectedPrice('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-aurora-cyan text-dark-bg text-xs font-bold hover:opacity-90 transition-opacity"
          >
            View All Resources
          </button>
        </div>
      ) : (
        /* Resource Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const providerBadgeClass = getProviderBadge(res.provider);
            const categoryIcon = getCategoryIcon(res.category);

            return (
              <div
                key={res.id}
                className="liquid-glass-card rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${providerBadgeClass}`}
                    >
                      {res.providerName}
                    </span>

                    <span
                      className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                        res.priceCategory === '100% Free'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                      }`}
                    >
                      {res.priceCategory}
                    </span>
                  </div>

                  {/* Title & Publisher */}
                  <h3 className="font-serif font-semibold text-base text-light-primary dark:text-dark-primary mb-1.5 group-hover:text-aurora-cyan transition-colors leading-snug">
                    {res.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-light-muted dark:text-dark-muted mb-3">
                    <span className="font-medium text-light-primary/80 dark:text-dark-primary/80">
                      {res.publisher}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {categoryIcon}
                      <span className="capitalize">{res.category}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-3 leading-relaxed mb-4">
                    {res.description}
                  </p>

                  {/* Topics Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {res.topics.slice(0, 4).map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-[10.5px] px-2 py-0.5 rounded-md bg-light-surface/90 dark:bg-dark-elevated/90 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Certification Pill if applicable */}
                  {res.certification && (
                    <div className="mb-4 flex items-center gap-1.5 text-[11px] font-medium text-aurora-violet dark:text-aurora-violet bg-aurora-violet/10 px-2.5 py-1 rounded-lg border border-aurora-violet/20">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{res.certification}</span>
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-light-muted dark:text-dark-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{res.duration}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified {res.lastVerified}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct Outbound Link */}
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-light-surface dark:bg-dark-elevated hover:bg-aurora-cyan hover:text-dark-bg text-light-primary dark:text-dark-primary border border-light-border dark:border-dark-border text-xs font-semibold transition-all shadow-xs"
                    >
                      <span>Start Learning</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Ask AI Tutor Button */}
                    <button
                      onClick={() =>
                        onAskMentor(
                          `Can you give me an overview and beginner study guide for "${res.title}" by ${res.publisher}? What prerequisites should I know first?`
                        )
                      }
                      title="Ask Cloud Mentor AI about this resource"
                      className="p-2 rounded-xl bg-aurora-cyan/15 hover:bg-aurora-cyan text-aurora-cyan hover:text-dark-bg transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    {/* Bookmark to Roadmap */}
                    <button
                      onClick={() => handleBookmark(res.title)}
                      title="Save to My Learning Roadmap"
                      className="p-2 rounded-xl bg-light-surface dark:bg-dark-elevated hover:bg-light-hover dark:hover:bg-dark-hover text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary border border-light-border dark:border-dark-border transition-colors"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
