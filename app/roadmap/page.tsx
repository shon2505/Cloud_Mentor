import { PlatformShell } from '@/components/PlatformShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Learning Roadmap — Personalized Cloud Study Paths | CloudMentor',
  description: 'Customized cloud learning roadmaps, milestone checkpoints, interactive quizzes, hands-on capstone projects, and persistent progress tracking.',
};

export default function RoadmapPage() {
  return <PlatformShell initialModule="roadmap" />;
}
