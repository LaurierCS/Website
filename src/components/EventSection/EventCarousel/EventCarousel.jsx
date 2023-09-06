import { useEffect, useState, useRef } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, Box, createStyles } from '@mantine/core';
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    limit,
} from 'firebase/firestore';
import EventCard from '../EventCard/EventCard';
import dayjs from '../../../utils/day';
import { store } from '../../../services/firebase';
import { useMediaQuery } from '@mantine/hooks';
import { flushSync } from 'react-dom';

// TODO: add animation

// this is used to fill out an empty space when the carousel reaches the end.
const CardPlaceholder = () => (
    <Box sx={{ width: '567px', height: '535px', opacity: 0 }}></Box>
);

const useStyles = createStyles((theme) => ({
    carouselRoot: {
        paddingLeft: '15%',
        paddingRight: '15%',

        [theme.fn.smallerThan('md')]: {
            paddingLeft: '0',
            paddingRight: '0',
        },
    },
    eventsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '8rem',
        position: 'relative',
        gap: '8%',

        [theme.fn.smallerThan('lg')]: {
            gap: '2%',
            width: '100%',
        },

        [theme.fn.smallerThan('sm')]: {
            paddingTop: '2rem',
        },
    },
    midEvent: {
        ['&:not(:only-child)']: {
            position: 'absolute',
            zIndex: 3,
            top: '4rem',
            left: '50%',
            transform: 'translateX(-50%)',
        },

        [theme.fn.smallerThan('md')]: {
            width: '100%',
        },
    },
    sideEvent: {
        opacity: 0.5,
    },
    controllerContainer: {
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    control: {
        width: '2rem',
        height: '2rem',
        borderRadius: 9999,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
    },
    dot: {
        width: '1rem',
        height: '1rem',
        borderRadius: 9999,
        backgroundColor: '#717277',
        flexShrink: 0,
    },
    activeDot: {
        width: '1rem',
        height: '1rem',
        borderRadius: 9999,
        backgroundColor: '#E7EBF5',
        flexShrink: 0,
    },
    dotsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginLeft: '2rem',
        marginRight: '2rem',
    },
}));

const EventCarousel = () => {
    const [visibleEvents, setVisibleEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState('');
    const { classes } = useStyles();
    const eventsRef = useRef([]);
    const mdBreakpoint = useMediaQuery('(max-width: 64em)');

    useEffect(() => {
        (async () => {
            const q = query(
                collection(store, 'events'),
                where('date', '>=', Timestamp.now()),
                orderBy('date', 'asc'),
                limit(3)
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
            flushSync(() => {
                setActiveIndex(mid);
                setVisibleEvents(eventsRef.current.slice(startIndex, mid + 2));
            });
        })();
    }, []);

    const getNextIndex = (direction) => {
        const isInbound =
            direction === 'left'
                ? activeIndex + 1 < eventsRef.current.length
                : activeIndex - 1 >= 0;
        let nextIndex = -1;
        if (direction === 'left') {
            nextIndex = isInbound
                ? activeIndex + 1
                : eventsRef.current.length - 1;
        } else {
            nextIndex = isInbound ? activeIndex - 1 : 0;
        }
        eventsRef.current[activeIndex].active = false;
        eventsRef.current[nextIndex].active = true;
        return nextIndex;
    };

    const setCarouselState = (nextIndex, events, direction) => {
        setActiveIndex(nextIndex);
        setVisibleEvents(events);
        setSlideDirection(
            nextIndex === 0 || nextIndex === eventsRef.current.length - 1
                ? direction
                : ''
        );
    };

    const bigSlide = (direction) => {
        const nextIndex = getNextIndex(direction);
        const visible = eventsRef.current.slice(
            nextIndex - 1 >= 0 ? nextIndex - 1 : 0,
            nextIndex + 2
        );
        setCarouselState(nextIndex, visible, direction);
    };

    const simpleSlide = (direction) => {
        const nextIndex = getNextIndex(direction);

        const visible = [eventsRef.current[nextIndex]];
        setCarouselState(nextIndex, visible, direction);
    };

    const slideEvents = (direction) => {
        if (!eventsRef.current.length) return;
        if (mdBreakpoint) simpleSlide(direction);
        else bigSlide(direction);
    };

    return (
        <div className={classes.carouselRoot}>
            <Box className={classes.eventsContainer}>
                {!mdBreakpoint &&
                    slideDirection === 'right' &&
                    activeIndex === 0 && <CardPlaceholder />}
                {visibleEvents.map(({ key, ...event }) => {
                    if (mdBreakpoint && event.active) {
                        return (
                            <div key={key} className={classes.midEvent}>
                                <EventCard {...event} />
                            </div>
                        );
                    }

                    if (!mdBreakpoint) {
                        return (
                            <div
                                key={key}
                                className={
                                    event.active
                                        ? classes.midEvent
                                        : classes.sideEvent
                                }
                            >
                                <EventCard {...event} />
                            </div>
                        );
                    }

                    return null;
                })}
                {!mdBreakpoint &&
                    slideDirection === 'left' &&
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
                            disableIg
                            hidePlace
                            hideDate
                        />
                    </div>
                )}
            </Box>
            {!!eventsRef.current.length && (
                <div className={classes.controllerContainer}>
                    <ActionIcon
                        disabled={
                            activeIndex === 0 || !eventsRef.current.length
                        }
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
            )}
        </div>
    );
};

export default EventCarousel;
