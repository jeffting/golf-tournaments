import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact Us | Golf Tourney Tracker',
    description: 'Get in touch with the Golf Tourney Tracker team. Email us with questions, feature requests, or bug reports.',
};

export default function ContactPage() {
    return <ContactClient />;
}
