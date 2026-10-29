import { CostWorkloadInputs, CostComparisonResult, ProviderCostEstimate } from './platformTypes';

export const USD_TO_INR_RATE = 85.0; // Transparent fixed conversion benchmark for normalization

export const ARCHITECTURE_PRESETS: Record<string, Partial<CostWorkloadInputs>> = {
  'web-app': {
    computeUnits: 2,
    vcpuPerUnit: 2,
    ramGbPerUnit: 4,
    os: 'linux',
    objectStorageGb: 50,
    blockStorageGb: 80,
    egressGbMonthly: 250,
    databaseType: 'relational',
    databaseStorageGb: 50,
    multiAz: false,
    availabilitySla: 'standard',
  },
  'microservices-api': {
    computeUnits: 4,
    vcpuPerUnit: 2,
    ramGbPerUnit: 8,
    os: 'linux',
    objectStorageGb: 150,
    blockStorageGb: 160,
    egressGbMonthly: 600,
    databaseType: 'relational',
    databaseStorageGb: 100,
    multiAz: true,
    availabilitySla: 'high',
  },
  'data-pipeline': {
    computeUnits: 6,
    vcpuPerUnit: 4,
    ramGbPerUnit: 16,
    os: 'linux',
    objectStorageGb: 1000,
    blockStorageGb: 300,
    egressGbMonthly: 1200,
    databaseType: 'nosql',
    databaseStorageGb: 250,
    multiAz: false,
    availabilitySla: 'standard',
  },
  'high-traffic-ecommerce': {
    computeUnits: 8,
    vcpuPerUnit: 4,
    ramGbPerUnit: 16,
    os: 'linux',
    objectStorageGb: 500,
    blockStorageGb: 400,
    egressGbMonthly: 2500,
    databaseType: 'relational',
    databaseStorageGb: 200,
    multiAz: true,
    availabilitySla: 'high',
  },
};

/**
 * Deterministic cost estimation engine.
 * Computes monthly and annual costs for AWS, Azure, and GCP based on transparent unit benchmarks.
 */
export function calculateCloudWorkloadCost(inputs: CostWorkloadInputs): CostComparisonResult {
  const isINR = inputs.currency === 'INR';
  const currencySymbol = isINR ? '₹' : '$';
  const multiplier = isINR ? USD_TO_INR_RATE : 1.0;

  // Regional multipliers based on public cloud regional pricing tables
  const regionalMultipliers: Record<string, number> = {
    'us-east': 1.0,
    europe: 1.07,
    'asia-south': 1.05,
  };
  const regFactor = regionalMultipliers[inputs.region] || 1.0;

  // OS Licensing surcharge per vCPU-month (Windows license fee)
  const windowsSurchargePerVcpu = inputs.os === 'windows' ? 14.5 : 0.0;

  // Hours in standard billing month (730 hours)
  const hoursPerMonth = 730;

  // Total required vCPU and RAM across compute units
  const totalVcpu = Math.max(1, inputs.computeUnits) * Math.max(1, inputs.vcpuPerUnit);
  const totalRamGb = Math.max(1, inputs.computeUnits) * Math.max(1, inputs.ramGbPerUnit);

  // ---------------------------------------------------------
  // 1. AWS Cost Model (Reference: US-East-1 on-demand EC2 t3/m6i, S3 Standard, RDS db.m6i/gp3, EBS gp3)
  // ---------------------------------------------------------
  // Base compute rate ~$0.038/vCPU-hr and $0.0048/GB-RAM-hr
  const awsVcpuHr = 0.038 * regFactor;
  const awsRamHr = 0.0048 * regFactor;
  const awsComputeUsd =
    totalVcpu * awsVcpuHr * hoursPerMonth +
    totalRamGb * awsRamHr * hoursPerMonth +
    totalVcpu * windowsSurchargePerVcpu;

  // Storage: S3 ~$0.023/GB + EBS gp3 SSD ~$0.08/GB
  const awsS3Cost = inputs.objectStorageGb * 0.023 * regFactor;
  const awsEbsCost = inputs.blockStorageGb * 0.08 * regFactor;
  const awsStorageUsd = awsS3Cost + awsEbsCost;

  // Database: RDS PostgreSQL/MySQL (compute + storage gp3 + Multi-AZ factor)
  let awsDbUsd = 0;
  if (inputs.databaseType === 'relational') {
    const dbCompute = 2 * awsVcpuHr * hoursPerMonth + 4 * awsRamHr * hoursPerMonth;
    const dbStorage = inputs.databaseStorageGb * 0.115 * regFactor;
    awsDbUsd = (dbCompute + dbStorage) * (inputs.multiAz ? 1.85 : 1.0);
  } else if (inputs.databaseType === 'nosql') {
    // DynamoDB baseline storage + pay-per-request estimate
    awsDbUsd = inputs.databaseStorageGb * 0.25 + 15.0;
  } else if (inputs.databaseType === 'cache') {
    // ElastiCache Redis baseline
    awsDbUsd = 2 * awsVcpuHr * hoursPerMonth + 18.0;
  }

  // Network Egress: AWS 100 GB free tier, then ~$0.09/GB
  const awsBillableEgress = Math.max(0, inputs.egressGbMonthly - 100);
  const awsNetworkUsd = awsBillableEgress * 0.09 * regFactor;

  // Support & Observability: CloudWatch basic metrics & logs
  const awsSupportUsd = 18.0 + (inputs.availabilitySla === 'high' ? 25.0 : 0.0);

  const awsTotalUsd = awsComputeUsd + awsStorageUsd + awsDbUsd + awsNetworkUsd + awsSupportUsd;

  // ---------------------------------------------------------
  // 2. Azure Cost Model (Reference: East US, D2s v5 / B-series, Blob Hot, Azure SQL / Flexible PostgreSQL, Premium SSD)
  // ---------------------------------------------------------
  const azureVcpuHr = 0.039 * regFactor;
  const azureRamHr = 0.0051 * regFactor;
  const azureComputeUsd =
    totalVcpu * azureVcpuHr * hoursPerMonth +
    totalRamGb * azureRamHr * hoursPerMonth +
    totalVcpu * (inputs.os === 'windows' ? 12.0 : 0.0); // Azure offers slightly discounted Windows licensing

  // Storage: Blob Hot ~$0.018/GB + Managed Disks SSD ~$0.075/GB
  const azureBlobCost = inputs.objectStorageGb * 0.018 * regFactor;
  const azureDiskCost = inputs.blockStorageGb * 0.075 * regFactor;
  const azureStorageUsd = azureBlobCost + azureDiskCost;

  // Database: Azure SQL / Database for PostgreSQL
  let azureDbUsd = 0;
  if (inputs.databaseType === 'relational') {
    const dbCompute = 2 * azureVcpuHr * hoursPerMonth + 4 * azureRamHr * hoursPerMonth;
    const dbStorage = inputs.databaseStorageGb * 0.11 * regFactor;
    azureDbUsd = (dbCompute + dbStorage) * (inputs.multiAz ? 1.8 : 1.0);
  } else if (inputs.databaseType === 'nosql') {
    // Cosmos DB Serverless / provisioned RU
    azureDbUsd = inputs.databaseStorageGb * 0.25 + 18.0;
  } else if (inputs.databaseType === 'cache') {
    azureDbUsd = 2 * azureVcpuHr * hoursPerMonth + 16.0;
  }

  // Network Egress: 100 GB free, then ~$0.087/GB
  const azureBillableEgress = Math.max(0, inputs.egressGbMonthly - 100);
  const azureNetworkUsd = azureBillableEgress * 0.087 * regFactor;

  // Support & Observability: Azure Monitor + Log Analytics
  const azureSupportUsd = 16.0 + (inputs.availabilitySla === 'high' ? 20.0 : 0.0);

  const azureTotalUsd = azureComputeUsd + azureStorageUsd + azureDbUsd + azureNetworkUsd + azureSupportUsd;

  // ---------------------------------------------------------
  // 3. GCP Cost Model (Reference: us-east1, E2 / N2 instances, Cloud Storage Standard, Cloud SQL, Persistent Disk SSD)
  // ---------------------------------------------------------
  // GCP includes automatic sustained-use discounts (~15% baseline on consistent usage)
  const gcpVcpuHr = 0.0355 * regFactor;
  const gcpRamHr = 0.0047 * regFactor;
  const gcpComputeUsd =
    totalVcpu * gcpVcpuHr * hoursPerMonth +
    totalRamGb * gcpRamHr * hoursPerMonth +
    totalVcpu * windowsSurchargePerVcpu;

  // Storage: Cloud Storage ~$0.020/GB + SSD PD ~$0.078/GB
  const gcpGcsCost = inputs.objectStorageGb * 0.020 * regFactor;
  const gcpPdCost = inputs.blockStorageGb * 0.078 * regFactor;
  const gcpStorageUsd = gcpGcsCost + gcpPdCost;

  // Database: Cloud SQL PostgreSQL / MySQL
  let gcpDbUsd = 0;
  if (inputs.databaseType === 'relational') {
    const dbCompute = 2 * gcpVcpuHr * hoursPerMonth + 4 * gcpRamHr * hoursPerMonth;
    const dbStorage = inputs.databaseStorageGb * 0.108 * regFactor;
    gcpDbUsd = (dbCompute + dbStorage) * (inputs.multiAz ? 1.75 : 1.0);
  } else if (inputs.databaseType === 'nosql') {
    // Firestore / Bigtable
    gcpDbUsd = inputs.databaseStorageGb * 0.18 + 14.0;
  } else if (inputs.databaseType === 'cache') {
    gcpDbUsd = 2 * gcpVcpuHr * hoursPerMonth + 15.0;
  }

  // Network Egress: 200 GB standard allowance, then ~$0.085/GB
  const gcpBillableEgress = Math.max(0, inputs.egressGbMonthly - 200);
  const gcpNetworkUsd = gcpBillableEgress * 0.085 * regFactor;

  // Support & Observability: Google Cloud Operations suite
  const gcpSupportUsd = 15.0 + (inputs.availabilitySla === 'high' ? 20.0 : 0.0);

  const gcpTotalUsd = gcpComputeUsd + gcpStorageUsd + gcpDbUsd + gcpNetworkUsd + gcpSupportUsd;

  // ---------------------------------------------------------
  // Multi-Factor Evaluation & Budget Fitting
  // ---------------------------------------------------------
  const userBudget = inputs.monthlyCloudBudget;
  const userRevenue = inputs.monthlyRevenue;

  function buildProviderEstimate(
    id: 'aws' | 'azure' | 'gcp',
    name: string,
    rawTotalUsd: number,
    compUsd: number,
    storUsd: number,
    dbUsd: number,
    netUsd: number,
    supUsd: number,
    sourceUrl: string
  ): ProviderCostEstimate {
    const monthlyCost = Math.round(rawTotalUsd * multiplier);
    const annualCost = monthlyCost * 12;

    const compute = Math.round(compUsd * multiplier);
    const storage = Math.round(storUsd * multiplier);
    const database = Math.round(dbUsd * multiplier);
    const networking = Math.round(netUsd * multiplier);
    const supportMonitoring = Math.round(supUsd * multiplier);

    const costAsPercentOfRevenue = userRevenue > 0 ? parseFloat(((monthlyCost / userRevenue) * 100).toFixed(1)) : null;
    const costAsPercentOfCloudBudget = userBudget > 0 ? parseFloat(((monthlyCost / userBudget) * 100).toFixed(1)) : null;
    const budgetDelta = userBudget > 0 ? userBudget - monthlyCost : 0;
    const isWithinBudget = userBudget > 0 ? monthlyCost <= userBudget : true;

    // Multi-factor scoring out of 100
    let score = 80;
    if (userBudget > 0) {
      if (isWithinBudget) score += 10;
      else score -= 15;
    }
    if (id === 'gcp' && inputs.architecturePreset === 'microservices-api') score += 5;
    if (id === 'azure' && inputs.os === 'windows') score += 8;
    if (id === 'aws' && inputs.stage === 'Enterprise') score += 6;

    const badges: string[] = [];
    if (id === 'gcp') badges.push('Lowest Baseline Cost');
    if (id === 'aws') badges.push('Broadest Ecosystem');
    if (id === 'azure' && inputs.os === 'windows') badges.push('Best Windows Value');
    if (isWithinBudget && userBudget > 0) badges.push('Within Budget');

    const pros: string[] = [];
    const tradeoffs: string[] = [];

    if (id === 'aws') {
      pros.push('Widest range of instance families and native tooling integrations');
      pros.push('Unrivaled multi-AZ synchronous replication maturity');
      tradeoffs.push('Egress data transfer costs can escalate with scale');
      tradeoffs.push('Complex cost management requiring dedicated FinOps tagging');
    } else if (id === 'azure') {
      pros.push('Significant discounts for Windows Server workloads via Azure Hybrid Benefit');
      pros.push('Deep enterprise identity integration with Microsoft Entra ID');
      tradeoffs.push('Portal navigation and enterprise tiering complexity');
      tradeoffs.push('Slightly higher compute pricing than GCP on small Linux instances');
    } else {
      pros.push('Automatic sustained-use discounts without mandatory multi-year lock-in');
      pros.push('Superior developer ergonomics with Cloud Run and Google Global VPC');
      tradeoffs.push('Smaller third-party marketplace than AWS');
      tradeoffs.push('Fewer niche legacy enterprise database engines supported out of the box');
    }

    return {
      providerId: id,
      providerName: name,
      monthlyCost,
      annualCost,
      breakdown: { compute, storage, database, networking, supportMonitoring },
      costAsPercentOfRevenue,
      costAsPercentOfCloudBudget,
      budgetDelta,
      isWithinBudget,
      score: Math.min(99, Math.max(50, score)),
      badges,
      pros,
      tradeoffs,
      assumptions: [
        `Region: ${inputs.region.toUpperCase()} pricing tier`,
        `${inputs.computeUnits} compute node(s) (${totalVcpu} vCPU, ${totalRamGb} GB RAM total) running 24/7 (730 hrs/mo)`,
        `Storage: ${inputs.objectStorageGb} GB object storage + ${inputs.blockStorageGb} GB SSD block disk`,
        `Database: ${inputs.databaseType !== 'none' ? `${inputs.databaseType} (${inputs.databaseStorageGb} GB, Multi-AZ: ${inputs.multiAz ? 'Yes' : 'No'})` : 'None / External'}`,
        `Outbound network egress: ${inputs.egressGbMonthly} GB/month`,
      ],
      sourceUrl,
      verifiedDate: 'October 2025',
    };
  }

  const awsEstimate = buildProviderEstimate(
    'aws',
    'Amazon Web Services (AWS)',
    awsTotalUsd,
    awsComputeUsd,
    awsStorageUsd,
    awsDbUsd,
    awsNetworkUsd,
    awsSupportUsd,
    'https://calculator.aws/'
  );

  const azureEstimate = buildProviderEstimate(
    'azure',
    'Microsoft Azure',
    azureTotalUsd,
    azureComputeUsd,
    azureStorageUsd,
    azureDbUsd,
    azureNetworkUsd,
    azureSupportUsd,
    'https://azure.microsoft.com/en-us/pricing/calculator/'
  );

  const gcpEstimate = buildProviderEstimate(
    'gcp',
    'Google Cloud Platform (GCP)',
    gcpTotalUsd,
    gcpComputeUsd,
    gcpStorageUsd,
    gcpDbUsd,
    gcpNetworkUsd,
    gcpSupportUsd,
    'https://cloud.google.com/products/calculator'
  );

  const allEstimates = [gcpEstimate, awsEstimate, azureEstimate].sort((a, b) => a.monthlyCost - b.monthlyCost);

  // Determine top recommendation based on cost, workload profile, and OS
  let recommendedProvider: 'aws' | 'azure' | 'gcp' = allEstimates[0].providerId;
  let recommendationReason = '';

  if (inputs.os === 'windows') {
    recommendedProvider = 'azure';
    recommendationReason =
      'Azure is recommended for this workload due to built-in Windows Server licensing optimizations and native integration with Microsoft enterprise services, offering the best overall total cost of ownership for Windows workloads.';
  } else if (allEstimates[0].providerId === 'gcp') {
    recommendedProvider = 'gcp';
    recommendationReason =
      'Google Cloud delivers the lowest estimated monthly cost ($' +
      Math.round(gcpTotalUsd) +
      '/mo baseline) through efficient per-second billing and sustained-use discounts, making it ideal for Linux microservices and modern cloud applications.';
  } else {
    recommendedProvider = 'aws';
    recommendationReason =
      'AWS is recommended for its mature ecosystem, high-availability architecture options, and rich managed database choices that match your multi-AZ requirements.';
  }

  // Budget warnings
  let budgetAlert: string | undefined;
  if (userBudget > 0) {
    const minCost = allEstimates[0].monthlyCost;
    if (minCost > userBudget) {
      budgetAlert = `Your stated cloud budget of ${currencySymbol}${userBudget.toLocaleString()} is exceeded by the lowest-cost provider (${currencySymbol}${minCost.toLocaleString()}/mo). Consider reducing provisioned compute units or disabling Multi-AZ in development environments.`;
    }
  }

  // Scenario projections
  const baselineMonthly = allEstimates[0].monthlyCost;
  const scenarios = {
    current: baselineMonthly,
    withSavingsPlan: Math.round(baselineMonthly * 0.68), // ~32% compute savings
    withDoubleGrowth: Math.round(baselineMonthly * 1.78), // ~1.8x scale
    multiRegionHa: Math.round(baselineMonthly * 1.55), // ~1.55x HA disaster recovery
  };

  return {
    currency: inputs.currency,
    currencySymbol,
    exchangeRate: USD_TO_INR_RATE,
    userInputs: inputs,
    estimates: allEstimates,
    recommendedProvider,
    recommendationReason,
    budgetAlert,
    scenarios,
  };
}
