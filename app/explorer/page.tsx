import { PlatformShell } from '@/components/PlatformShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Explorer — Providers, Services Catalog & Free Tiers | CloudMentor',
  description: 'Explore cloud providers, discover services across 9 categories, review side-by-side service comparisons, and discover verified free-tier offers.',
};

export default function ExplorerPage() {
  return <PlatformShell initialModule="explorer" />;
}
