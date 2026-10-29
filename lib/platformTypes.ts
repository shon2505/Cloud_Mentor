export type PlatformModule =
  | 'mentor'
  | 'academy'
  | 'optimizer'
  | 'explorer'
  | 'future'
  | 'roadmap';

export type CloudProviderId =
  | 'aws'
  | 'azure'
  | 'gcp'
  | 'cloudflare'
  | 'oci'
  | 'multi';

export interface CloudProviderInfo {
  id: CloudProviderId;
  name: string;
  tagline: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  iconName: string;
  officialSite: string;
  docsUrl: string;
  pricingCalculatorUrl: string;
  freeTierUrl: string;
  overview: string;
  strengths: string[];
  limitations: string[];
  entryPoints: string[];
}

export type ResourceCategory =
  | 'course'
  | 'documentation'
  | 'lab'
  | 'certification'
  | 'video'
  | 'project';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type PriceCategory = '100% Free' | 'Free Tier / Trial' | 'Freemium';

export interface AcademyResource {
  id: string;
  title: string;
  provider: CloudProviderId;
  providerName: string;
  publisher: string;
  category: ResourceCategory;
  level: SkillLevel;
  duration: string;
  priceCategory: PriceCategory;
  certification?: string;
  description: string;
  topics: string[];
  url: string;
  lastVerified: string;
  featured?: boolean;
}

export type ServiceCategory =
  | 'compute'
  | 'storage'
  | 'database'
  | 'networking'
  | 'containers'
  | 'serverless'
  | 'aiml'
  | 'security'
  | 'observability';

export interface CloudService {
  id: string;
  name: string;
  provider: CloudProviderId;
  providerName: string;
  category: ServiceCategory;
  categoryLabel: string;
  summary: string;
  keyFeatures: string[];
  pricingModel: string;
  typicalUseCases: string[];
  docsUrl: string;
  freeTierSnippet?: string;
}

export interface CrossProviderComparison {
  id: string;
  category: ServiceCategory;
  categoryLabel: string;
  capability: string;
  description: string;
  services: {
    aws: { name: string; summary: string; pricingModel: string; docsUrl: string; strengths: string };
    azure: { name: string; summary: string; pricingModel: string; docsUrl: string; strengths: string };
    gcp: { name: string; summary: string; pricingModel: string; docsUrl: string; strengths: string };
    alternative?: { provider: string; name: string; summary: string; docsUrl: string };
  };
  keyDifferences: string[];
  architecturalConsiderations: string;
}

export interface FreeTierOffer {
  id: string;
  provider: CloudProviderId;
  providerName: string;
  serviceName: string;
  offerType: 'Always Free' | '12 Months Free' | 'Trial Credit / Short Term';
  allowance: string;
  restrictions: string;
  officialUrl: string;
  verifiedDate: string;
}

export interface FutureTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  whyItMatters: string;
  currentApplications: string[];
  challengesAndAdoption: string[];
  requiredSkills: string[];
  starterProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
  careerPaths: string[];
  sourceAttribution: {
    source: string;
    date: string;
    url: string;
  };
}

export interface CostWorkloadInputs {
  projectName?: string;
  businessCategory: string;
  businessModel: string;
  stage: 'Prototype' | 'Growth' | 'Production' | 'Enterprise';
  currency: 'USD' | 'INR';
  monthlyRevenue: number;
  monthlyOperatingBudget: number;
  monthlyCloudBudget: number;

  // Compute
  computeUnits: number;
  vcpuPerUnit: number;
  ramGbPerUnit: number;
  os: 'linux' | 'windows';
  architecturePreset: 'custom' | 'web-app' | 'microservices-api' | 'data-pipeline' | 'high-traffic-ecommerce';

  // Storage & Network
  objectStorageGb: number;
  blockStorageGb: number;
  egressGbMonthly: number;

  // Database
  databaseType: 'none' | 'relational' | 'nosql' | 'cache';
  databaseStorageGb: number;
  multiAz: boolean;

  // Region & Reliability
  region: 'us-east' | 'europe' | 'asia-south';
  availabilitySla: 'standard' | 'high';
  complianceLevel: 'standard' | 'soc2-hipaa';
}

export interface ProviderCostEstimate {
  providerId: 'aws' | 'azure' | 'gcp';
  providerName: string;
  monthlyCost: number;
  annualCost: number;
  breakdown: {
    compute: number;
    storage: number;
    database: number;
    networking: number;
    supportMonitoring: number;
  };
  costAsPercentOfRevenue: number | null;
  costAsPercentOfCloudBudget: number | null;
  budgetDelta: number; // positive = under budget, negative = overrun
  isWithinBudget: boolean;
  score: number;
  badges: string[];
  pros: string[];
  tradeoffs: string[];
  assumptions: string[];
  sourceUrl: string;
  verifiedDate: string;
}

export interface CostComparisonResult {
  currency: 'USD' | 'INR';
  currencySymbol: string;
  exchangeRate: number; // 1 USD in INR
  userInputs: CostWorkloadInputs;
  estimates: ProviderCostEstimate[];
  recommendedProvider: 'aws' | 'azure' | 'gcp';
  recommendationReason: string;
  budgetAlert?: string;
  scenarios: {
    current: number;
    withSavingsPlan: number; // ~32% reduction
    withDoubleGrowth: number; // ~1.8x
    multiRegionHa: number; // ~1.5x
  };
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  resourceLink?: string;
  completed: boolean;
  estimatedHours: number;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  estimatedWeeks: number;
  tasks: RoadmapTask[];
  checkpointAssessment: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  capstoneProject: {
    title: string;
    description: string;
    keyDeliverables: string[];
  };
}

export interface UserRoadmap {
  id: string;
  title: string;
  goal: string;
  provider: CloudProviderId;
  experienceLevel: string;
  weeklyHours: number;
  learningStyle: string;
  createdAt: number;
  updatedAt: number;
  phases: RoadmapPhase[];
  completedTaskIds: string[];
  passedCheckpoints: string[];
}
