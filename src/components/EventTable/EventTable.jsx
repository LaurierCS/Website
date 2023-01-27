import './EventTable.css';
import { useEffect, useState } from 'react';
import EventItem from '../EventItem/EventItem';
import { createStyles, Container, Center, Loader } from '@mantine/core';

/*
 * eventData refers to data fetched from the firebase database
 * current implementation: fetch event data in this component (makes more sense)
 * */
const EventTable = () => {
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch event data
    useEffect(() => {
        // mocked event data
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

        // simulate api fetch latency
        setTimeout(() => {
            setEventData(mockedEventData);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <Container
            size="sm"
            my="md"
            px={0}
            className={`event-table-wrapper ${eventData.length ? 'pulse' : ''}`}
        >
            {loading ? (
                <Container py={6}>
                    <Center>
                        <Loader />
                    </Center>
                </Container>
            ) : (
                eventData.map((data, i) => {
                    return <EventItem eventData={data} key={i} />;
                })
            )}
        </Container>
    );
};

export default EventTable;
