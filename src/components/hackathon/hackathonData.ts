export interface HighlightItem {
    title: string;
    description: string;
}

export interface ChallengeOption {
    title: string;
    description: string;
}

export interface PresentationItem {
    timeSlot: string;
    projectName: string;
}

export interface PresentationRoom {
    roomNumber: string;
    presentations: PresentationItem[];
}

export interface TimelineDay {
    day: string;
    dateLabel: string;
    items: Array<{
        time: string;
        title: string;
        details?: string;
        signupLink?: string;
    }>;
}

export interface PrizeItem {
    placement: string;
    amount: string;
    description: string;
    winnerProject?: string;
    devpostUrl?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface SubmissionRequirement {
    title: string;
    required: boolean;
    points: string[];
}

export interface LinkConfig {
    label: string;
    href: string;
    enabled: boolean;
    disabledLabel?: string;
    helperText?: string;
}

export const HACKATHON_LINKS = {
    signup: {
        label: 'Register Now',
        href: '',
        enabled: false,
        disabledLabel: 'Registrations Closed',
    },
    devpost: {
        label: 'View Devpost',
        href: 'https://hack-to-the-future-wlu.devpost.com/?_gl=1*1s0nwa7*_gcl_au*NDExNDk1MjAzLjE3NzM2ODAwMzM.*_ga*NTM4MzM1NjcwLjE3NzM2ODAwMzM.*_ga_0YHJK3Y10M*czE3NzQ2NTQzNzYkbzIzJGcxJHQxNzc0NjU0MzkyJGo0NCRsMCRoMA..',
        enabled: true,
    },
    discord: {
        label: 'Join Discord',
        href: 'https://discord.gg/lauriercs',
        enabled: true,
    },
} as const;

// Countdown target: Sunday, March 29, 2026 at 1:30 PM in Toronto (EDT, UTC-4)
export const HACKATHON_COUNTDOWN_TARGET = '2026-03-29T13:30:00-04:00';

export const HACKATHON_EVENT = {
    title: 'Hack to the Future',
    subtitle: 'A 48-hour open-ended hackathon where you can build anything',
    host: 'Laurier Computing Society',
    duration: '48-Hour Hackathon',
    dateRange: 'March 27-29, 2026',
    challengeTitle: 'The Challenge',
    challengeDescription:
        'Build any app, tool, service, or experiment you are excited about. If you want direction, we have one suggested challenge to spark ideas.',
} as const;

export const HACKATHON_CHALLENGE_OPTIONS: ChallengeOption[] = [
    {
        title: 'Option 1: Build Anything',
        description:
            'Run with your own idea and your own stack. Build whatever feels bold, useful, fun, or meaningful to you.',
    },
    {
        title: 'Option 2: Suggested Challenge',
        description:
            'Create an application or resource that helps students learn to track, budget, and understand their personal finances during their time at university.',
    },
];

export const HACKATHON_HIGHLIGHTS: HighlightItem[] = [
    {
        title: 'Direct Engineering Support',
        description:
            'Dedicated Discord office hours on Saturday for debugging, architecture, and product direction.',
    },
    {
        title: 'Industry and Alumni Judges',
        description: 'Get feedback from professionals and alumni currently working in tech.',
    },
    {
        title: 'Up to $700 in Prizes',
        description: 'Top 3 teams win placement prizes, plus special category awards.',
    },
    {
        title: 'Real-World Impact',
        description: 'Build something that could evolve into a startup or long-term product.',
    },
    {
        title: 'Community and Momentum',
        description: 'Network with students, mentors, and judges while building under pressure.',
    },
];

export const HACKATHON_PRESENTATIONS: PresentationRoom[] = [
    {
        roomNumber: 'LH1011',
        presentations: [
            { timeSlot: '2:00-2:10', projectName: 'Budget Hawk' },
            { timeSlot: '2:10-2:20', projectName: 'QuantPilot' },
            { timeSlot: '2:20-2:30', projectName: 'KW-Network' },
            { timeSlot: '2:30-2:40', projectName: 'Studently' },
            { timeSlot: '2:40-2:50', projectName: 'StudHub' },
            { timeSlot: '2:50-3:00', projectName: 'StudyBuddy' },
            { timeSlot: '3:00-3:10', projectName: 'StudySync' },
            { timeSlot: '3:10-3:20', projectName: 'CityAnalysis' },
            { timeSlot: '3:20-3:30', projectName: 'campusmind' },
            { timeSlot: '3:30-3:40', projectName: 'HabitMaster Pro' },
            { timeSlot: '3:40-3:50', projectName: 'HavenNow' },
            { timeSlot: '3:50-4:00', projectName: 'Maple Rader' },
            { timeSlot: '4:00-4:10', projectName: 'SafeRoute' },
            { timeSlot: '4:10-4:20', projectName: 'DeadVault' },
            { timeSlot: '4:20-4:30', projectName: 'DeepDrive' },
            { timeSlot: '4:30-4:40', projectName: 'ShowUp.ai' },
            { timeSlot: '4:40-4:50', projectName: 'Genetiq' },
            { timeSlot: '4:50-5:00', projectName: 'NexusPoint' },
            { timeSlot: '5:00-5:10', projectName: 'Recall' },
            { timeSlot: '5:10-5:20', projectName: 'rezapp' },
            { timeSlot: '5:20-5:30', projectName: 'TermLease' },
        ],
    },
    {
        roomNumber: 'N2085',
        presentations: [
            { timeSlot: '2:20-2:30', projectName: 'milo' },
            { timeSlot: '2:30-2:40', projectName: 'MitraApp' },
            { timeSlot: '2:40-2:50', projectName: 'PitchReady' },
            { timeSlot: '2:50-3:00', projectName: 'ClimatePro' },
            { timeSlot: '3:00-3:10', projectName: 'Any%' },
            { timeSlot: '3:10-3:20', projectName: 'UniVerse' },
            { timeSlot: '3:20-3:30', projectName: 'FinIt' },
            { timeSlot: '3:30-3:40', projectName: 'UniWallet' },
            { timeSlot: '3:40-3:50', projectName: 'FocusFlow' },
            { timeSlot: '3:50-4:00', projectName: 'GoldenTalks' },
            { timeSlot: '4:00-4:10', projectName: 'HomeRoom' },
            { timeSlot: '4:10-4:20', projectName: 'OpenDoors' },
            { timeSlot: '4:20-4:30', projectName: 'Openspot' },
            { timeSlot: '4:30-4:40', projectName: 'Optima' },
            { timeSlot: '4:40-4:50', projectName: 'Archie' },
            { timeSlot: '4:50-5:00', projectName: 'FinCopilot' },
            { timeSlot: '5:00-5:10', projectName: 'DriveWise Pro' },
            { timeSlot: '5:10-5:20', projectName: 'Fridge Foodie' },
            { timeSlot: '5:20-5:30', projectName: 'FridgeChef' },
            { timeSlot: '5:30-5:40', projectName: 'Astro' },
            { timeSlot: '5:40-5:50', projectName: 'FillthatCrib' },
        ],
    },
];

export const HACKATHON_TIMELINE: TimelineDay[] = [
    {
        day: 'Friday',
        dateLabel: 'March 27',
        items: [
            {
                time: '6:30 - 7:15 PM',
                title: 'Check-in and Registration',
                details: 'QR code sign-in, Discord onboarding, and Redbull plus snacks.',
            },
            {
                time: '7:30 - 8:15 PM',
                title: 'Opening Ceremony',
                details:
                    'Welcome, challenge explanation, judging criteria, submission requirements, timeline, and what to expect. Location: LH1011',
            },
        ],
    },
    {
        day: 'Saturday',
        dateLabel: 'March 28',
        items: [
            {
                time: 'All Day',
                title: 'Build and Iterate',
                details: 'Hack from the LCS room (N2085) or remotely with any stack.',
            },
            {
                time: '1:00 - 2:00 PM',
                title: 'Rezzy Workshop',
                details: 'Hands-on walkthrough of Rezzy\'s API for programmatic resume generation and tailoring. Second half features live resume feedback. Free Rezzy Pro for all attendees. Snacks provided.',
                signupLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdjHV7d7qc-Gjz5DQWwvRxfll7SP1A5uCs_HFNI8Cis87pWFQ/viewform',
            },
            {
                time: '2:00 - 4:00 PM',
                title: 'In-Person Office Hours',
                details: 'Dedicated support from the engineering team in the LCS room (N2085).',
            },
            {
                time: 'All Day',
                title: 'Discord Office Hours',
                details: 'Virtual support from the engineering team on Discord.',
            },
        ],
    },
    {
        day: 'Sunday',
        dateLabel: 'March 29',
        items: [
            {
                time: '1:30 PM',
                title: 'Submission Deadline',
                details: 'Devpost closes at 1:30 PM sharp.',
            },
            {
                time: '2:00 - 6:00 PM',
                title: 'Presentations',
                details: 'Team presentations from rooms N2085 and LH1011.',
            },
            {
                time: '6:30 PM',
                title: 'Closing Ceremony and Awards',
                details: 'Top 3 presentations, winner announcements, networking, and celebration. Location: LH1011',
            },
        ],
    },
];

export const HACKATHON_PRIZES: PrizeItem[] = [
    {
        placement: '1st Place',
        amount: '$300 CAD',
        description: 'Best overall project based on execution, creativity, and impact.',
        winnerProject: 'Archie',
        devpostUrl: 'https://hack-to-the-future-wlu.devpost.com/submissions/981753-archie',
    },
    {
        placement: '2nd Place',
        amount: '$150 CAD',
        description: 'Strong technical execution and clear user value.',
        winnerProject: 'HavenNow',
        devpostUrl: 'https://hack-to-the-future-wlu.devpost.com/submissions/983144-havennow',
    },
    {
        placement: '3rd Place',
        amount: '$100 CAD',
        description: 'Solid implementation and thoughtful approach.',
        winnerProject: 'Deep Drive',
        devpostUrl: 'https://hack-to-the-future-wlu.devpost.com/submissions/983163-deepdrive',
    },
];

export const HACKATHON_CATEGORY_AWARDS: PrizeItem[] = [
    {
        placement: 'Best Design/UI',
        amount: '$50 CAD',
        description: 'Most polished and user-friendly interface.',
        winnerProject: 'Pitch Ready',
        devpostUrl: 'https://hack-to-the-future-wlu.devpost.com/submissions/981100-pitchready',
    },
    {
        placement: 'Best Creative Presentation',
        amount: '$50 CAD',
        description: 'Most engaging pitch and demo storytelling.',
        winnerProject: 'Any%',
        devpostUrl: 'https://hack-to-the-future-wlu.devpost.com/submissions/981319-any',
    },
    {
        placement: 'Most Likely to Become a Startup',
        amount: '$50 CAD',
        description: 'Strongest business potential and scalability.',
        winnerProject: 'Astro',
        devpostUrl: 'https://hack-to-the-future-wlu.devpost.com/submissions/981721-astro',
    },
];

export const HACKATHON_TOTAL_PRIZE_POOL = '$700 CAD';

export const HACKATHON_BUILD_EXAMPLES: string[] = [
    'A web or mobile app',
    'A tool or utility',
    'An AI or ML project',
    'A creative solution to any problem',
    'Anything else you are excited about',
];

export const HACKATHON_SUBMISSIONS: SubmissionRequirement[] = [
    {
        title: 'GitHub Repository',
        required: true,
        points: [
            'Include a complete link to your project code.',
            'README should explain what your project does, how to run it, setup steps, and team contributions.',
            'All source code must be accessible to judges.',
        ],
    },
    {
        title: 'Live Demo Presentation',
        required: true,
        points: [
            'Teams present in person to judges in a 1-on-1 format.',
            'Demonstrate your system live and walk through key features and decisions.',
            'Top 3 teams present again in a final round to judges and audience.',
        ],
    },
    {
        title: 'Demo Video',
        required: false,
        points: [
            'Optional, maximum 5 minutes, uploaded to YouTube (unlisted is fine).',
            'Show your system working and highlight key features.',
        ],
    },
    {
        title: 'Deployed Project Link',
        required: false,
        points: [
            'Optional live link so judges can interact with your solution directly.',
        ],
    },
    {
        title: 'Project Description',
        required: false,
        points: [
            'Optional write-up covering problem statement, approach, stack, challenges, and future plans.',
        ],
    },
];

export const HACKATHON_TECHNICAL_DETAILS: string[] = [
    'Team size: 1-4 participants. You cannot be on multiple teams.',
    'Tech stack: Any technology is welcome.',
    'Solo participants are allowed.',
    'Original work window: Friday 8:00 PM to Sunday 1:30 PM.',
    'External libraries, frameworks, APIs, and tools are allowed with transparent disclosure.',
];

export const HACKATHON_DEVPOST_CHECKLIST: string[] = [
    'Project Title',
    'Tagline (1-2 sentence summary)',
    'Project Description (optional)',
    'GitHub Repository Link (required)',
    'Demo Video Link (optional)',
    'Deployed Project Link (optional)',
    'Team Members (max 4)',
];

export const HACKATHON_FAQS: FAQItem[] = [
    {
        question: 'Who can participate?',
        answer:
            'University students are welcome. Build solo or with a team, and use any technology stack that helps you ship.',
    },
    {
        question: 'Is this hackathon open-ended?',
        answer:
            'Yes. You can build anything. We include one suggested challenge only for teams that want extra direction.',
    },
    {
        question: 'Can I work remotely?',
        answer:
            'Yes. You can build in the LCS room (N2085) or from home. Discord is the central place for announcements and support.',
    },
    {
        question: 'What is mandatory for submission?',
        answer:
            'A GitHub repository and a live demo presentation are mandatory. Optional extras include a demo video, deployment link, and project description.',
    },
    {
        question: 'Where do I get help during the event?',
        answer:
            'Join the LCS Discord for announcements and support. Office hours are held on Saturday for live engineering help.',
    },
];