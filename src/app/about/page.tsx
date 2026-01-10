import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Golf Tourney Tracker | Local Golf Tournaments in Utah & Arizona',
    description: 'Learn about Golf Tourney Tracker, the premier platform for finding and listing local golf tournaments, scrambled, and charity events in Utah and Arizona.',
    keywords: ['golf tournaments', 'utah golf', 'arizona golf', 'charity golf', 'scramble tournaments', 'golf events'],
};

export default function AboutPage() {
    return <AboutClient />;
}
