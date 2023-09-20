import './EventTable.css';
import { useEffect, useMemo, useState } from 'react';
import EventItem from '../EventItem/EventItem';
import { Container, Center, Loader, Title } from '@mantine/core';

const EventTable = ({ empty = false }) => {
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockedEventData = [
            {
                eventTitle:
                    'longer name for the event, how long until the element goes brrrrrrrrrrrrrrr',
                eventSchedule: {
                    start: '19:20',
                    end: '20:30',
                    date: '01/01/23',
                },
                online: true,
                place: 'Twitch',
            },
            {
                eventTitle: 'Event 2',
                eventSchedule: {
                    start: '19:20',
                    end: '20:30',
                    date: '01/01/23',
                },
                place: 'BA110',
                online: false,
            },
            {
                eventTitle: 'Event 3',
                eventSchedule: {
                    start: '19:20',
                    end: '20:30',
                    date: '01/01/23',
                },
                online: true,
                place: 'Twitch',
            },
            {
                eventTitle: 'Event 4',
                eventSchedule: {
                    start: '19:20',
                    end: '20:30',
                    date: '01/01/23',
                },
                place: 'BA110',
                online: false,
            },
            {
                eventTitle: 'Event 5',
                eventSchedule: {
                    start: '19:20',
                    end: '20:30',
                    date: '01/01/23',
                },
                online: true,
                place: 'Twitch',
            },
        ];

        setTimeout(() => {
            if (!empty) setEventData(mockedEventData);
            setLoading(false);
        }, 1000);
    }, []);

    const events = useMemo(() => {
        console.log('re-render');
        return eventData.map((data, i) => (
            <EventItem eventData={data} key={i} />
        ));
    }, [eventData]);

    return (
        <section id="events">
            <Container
                size="sm"
                my="md"
                px={0}
                className={`event-table-wrapper ${
                    eventData.length ? 'pulse' : ''
                }`}
            >
                {loading ? (
                    <Container py={6}>
                        <Center>
                            <Loader />
                        </Center>
                    </Container>
                ) : eventData.length ? (
                    events
                ) : (
                    <Container py={6}>
                        <Center>
                            <Title order={3}>
                                No events at the moment, please come back later.
                            </Title>
                        </Center>
                    </Container>
                )}
            </Container>
        </section>
    );
};

export default EventTable;
