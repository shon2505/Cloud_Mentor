import { PlatformShell } from '@/components/PlatformShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Academy — Free Courses, Labs & Certifications | CloudMentor',
  description: 'Explore free courses, hands-on labs, and certification preparation for AWS, Azure, Google Cloud, Cloudflare, and Kubernetes.',
};

export default function AcademyPage() {
  return <PlatformShell initialModule="academy" />;
}
