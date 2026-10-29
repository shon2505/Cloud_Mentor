import { PlatformShell } from '@/components/PlatformShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Future — AI Infrastructure, FinOps & Career Discovery | CloudMentor',
  description: 'Emerging technology trends in cloud computing: GPU cluster networking, platform engineering, FinOps FOCUS, zero trust, and future career opportunities.',
};

export default function FuturePage() {
  return <PlatformShell initialModule="future" />;
}
