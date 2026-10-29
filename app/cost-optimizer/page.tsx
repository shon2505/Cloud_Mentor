import { PlatformShell } from '@/components/PlatformShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Cost Optimizer — Multi-Cloud Workload Sizing & Comparison | CloudMentor',
  description: 'Deterministic cloud cost estimation across AWS, Microsoft Azure, and Google Cloud with business revenue benchmarks and scenario forecasting.',
};

export default function CostOptimizerPage() {
  return <PlatformShell initialModule="optimizer" />;
}
