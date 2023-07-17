import moment from 'moment';
import EventCard from './EventCard';

export default {
    component: EventCard,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ margin: '12px' }}>
                <Story />
            </div>
        ),
    ],
};

export const Default = {
    args: {
        icon: '👩',
        title: 'Meet The Professionals',
        date: moment(),
        place: 'Online',
        description:
            'We strive to help students realise their potential in STEM by enriching their academic and professional bla bla',
        url: 'http://localhost:3000',
        isNext: true,
    },
};
