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

// this is used to fill out an empty space when the carousel reaches the end.
const CardPlaceholder = () => (
    <Box sx={{ width: '567px', height: '535px', opacity: 0 }}></Box>
);

const EventCarousel = () => {
    const [visibleEvents, setVisibleEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState('');
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

            if (!_events.length) return;

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
        if (!eventsRef.current.length) return;

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
        setSlideDirection(
            newIndex === 0 || newIndex === eventsRef.current.length - 1
                ? direction
                : ''
        );
    };

    return (
        <div className={classes.carouselRoot}>
            <Box
                className={classes.eventsContainer}
                sx={{ justifyContent: 'center' }}
            >
                {slideDirection === 'right' && activeIndex === 0 && (
                    <CardPlaceholder />
                )}
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
                {slideDirection === 'left' &&
                    activeIndex === eventsRef.current.length - 1 && (
                        <CardPlaceholder />
                    )}
                {!visibleEvents.length && (
                    <div className={classes.midEvent}>
                        <EventCard
                            title="No Events"
                            description="There are no events scheduled for now."
                            date={dayjs()}
                            icon="😭"
                            place="Unknown"
                            url="/"
                        />
                    </div>
                )}
            </Box>
            <div className={classes.controllerContainer}>
                <ActionIcon
                    disabled={activeIndex === 0 || !eventsRef.current.length}
                    onClick={() => slideEvents('right')}
                    variant="filled"
                    className={classes.control}
                >
                    <IconChevronLeft />
                </ActionIcon>
                <div className={classes.dotsContainer}>
                    {[0, 1, 2].map((dot) => (
                        <div
                            key={`dot-${dot}`}
                            className={
                                eventsRef.current.length &&
                                ((dot === 0 && activeIndex === 0) ||
                                    (dot === 2 &&
                                        activeIndex ===
                                            eventsRef.current.length - 1) ||
                                    (dot === 1 &&
                                        activeIndex > 0 &&
                                        activeIndex <
                                            eventsRef.current.length - 1))
                                    ? classes.activeDot
                                    : classes.dot
                            }
                        ></div>
                    ))}
                </div>
                <ActionIcon
                    disabled={
                        activeIndex === eventsRef.current.length - 1 ||
                        !eventsRef.current.length
                    }
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
