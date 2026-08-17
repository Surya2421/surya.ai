import { Metadata } from 'next';
import JourneyPage from './JourneyClient';

export const metadata: Metadata = {
  title: 'Journey',
  description:
    'My journey building AI products in public — from early experiments to shipped products. Timeline of projects, learnings, and milestones.',
  openGraph: {
    title: 'Journey | Surya.ai',
    description: 'My journey building AI products in public — timeline of projects and milestones.',
    type: 'website',
  },
};

export default function JourneyPageWrapper() {
  return <JourneyPage />;
}
