import { useEffect, useState, useRef } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, Box } from '@mantine/core';
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import EventCard from '../EventCard/EventCard';
import dayjs from '../../../utils/day';
import { store } from '../../../services/firebase';

import classes from './EventCarousel.module.css';

// TODO: add animation

const EventCarousel = () => {
    const [visibleEvents, setVisibleEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const eventsRef = useRef([]);

    useEffect(() => {
        (async () => {
            const q = query(
                collection(store, 'events'),
                where('date', '>=', Timestamp.now()),
                orderBy('date', 'asc')
            );

            const docs = await getDocs(q);
            let _events = [];
            docs.forEach((doc) => {
                const data = doc.data();
                data.date = dayjs.unix(data.date.seconds);
                data.key = doc.id;
                data.active = false;
                _events.push(data);
            });

            // move the up comming event to the middle
            const upnext = _events[0];
            upnext.isNext = true;
            upnext.active = true;
            const mid = Math.floor(_events.length / 2);
            const firstHalf = _events.slice(1, mid + 1);
            const secondHalf = _events.slice(mid + 1);
            eventsRef.current = [...firstHalf, upnext, ...secondHalf];
            const startIndex = mid - 1 >= 0 ? mid - 1 : 0;
            setActiveIndex(mid);
            setVisibleEvents(eventsRef.current.slice(startIndex, mid + 2));
        })();
    }, []);

    const slideEvents = (direction) => {
        const isInbound =
            direction === 'left'
                ? activeIndex + 1 < eventsRef.current.length
                : activeIndex - 1 >= 0;
        let newIndex = -1;
        if (direction === 'left') {
            newIndex = isInbound
                ? activeIndex + 1
                : eventsRef.current.length - 1;
        } else {
            newIndex = isInbound ? activeIndex - 1 : 0;
        }
        eventsRef.current[activeIndex].active = false;
        eventsRef.current[newIndex].active = true;
        const visible = eventsRef.current.slice(
            newIndex - 1 >= 0 ? newIndex - 1 : 0,
            newIndex + 2
        );

        setActiveIndex(newIndex);
        setVisibleEvents(visible);
    };

    return (
        <div className={classes.carouselRoot}>
            <Box
                className={classes.eventsContainer}
                sx={{
                    justifyContent:
                        visibleEvents.length === 3
                            ? 'center'
                            : activeIndex === 0
                            ? 'end'
                            : 'start',
                }}
            >
                {visibleEvents.map(({ key, ...event }) => (
                    <div
                        key={key}
                        className={
                            event.active ? classes.midEvent : classes.sideEvent
                        }
                    >
                        <EventCard {...event} />
                    </div>
                ))}
            </Box>
            <div className={classes.controllerContainer}>
                <ActionIcon
                    disabled={activeIndex === 0}
                    onClick={() => slideEvents('right')}
                    variant="filled"
                    className={classes.control}
                >
                    <IconChevronLeft />
                </ActionIcon>
                <div className={classes.dotsContainer}>
                    {visibleEvents.map((event) => (
                        <div
                            key={`dot-${event.key}`}
                            className={
                                event.active ? classes.activeDot : classes.dot
                            }
                        ></div>
                    ))}
                </div>
                <ActionIcon
                    disabled={activeIndex === eventsRef.current.length - 1}
                    onClick={() => slideEvents('left')}
                    variant="filled"
                    className={classes.control}
                >
                    <IconChevronRight />
                </ActionIcon>
            </div>
        </div>
    );
};

export default EventCarousel;
