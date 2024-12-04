import { Container, Flex, Title, Text, createStyles, MantineTheme, Box, Transition } from '@mantine/core';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp, limit } from 'firebase/firestore';
import { store } from '../../services/firebase';
import dayjs from '../../utils/day';
import { IconCalendar, IconMapPin, IconClock } from '@tabler/icons-react';

const useStyles = createStyles((theme: MantineTheme) => ({
    title: {
        [theme.fn.smallerThan(780)]: {
            fontSize: "2rem",
        },
    },

    description: {
        fontWeight: 600,
        [theme.fn.smallerThan(780)]: {
            fontSize: "1rem",
        },
    },

    eventsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
        gap: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        justifyContent: 'center',
        '& > *': {
            width: '100%',
            maxWidth: '500px',
            justifySelf: 'center',
        },
    },

    eventCard: {
        backgroundColor: theme.fn.rgba(theme.colors.dark[7], 0.5),
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.fn.rgba(theme.colors.gray[8], 0.5)}`,
        height: '130px',
        width: '100%',
    },

    iconSection: {
        background: theme.fn.gradient({ 
            from: theme.colors.blue[5], 
            to: theme.colors.cyan[5], 
            deg: 45 
        }),
        width: '80px',
        height: '135px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
    },

    eventIcon: {
        fontSize: '2rem',
        color: 'white',
        lineHeight: 1,
        filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.5))',
    },

    contentSection: {
        flex: 1,
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        minWidth: 0,
    },

    eventTitle: {
        color: 'white',
        fontSize: '1.375rem',
        fontWeight: 600,
        margin: 0,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
    },

    metaInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },

    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: theme.colors.gray[4],
        fontSize: '1.1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        
        '& svg': {
            color: theme.colors.blue[4],
            flexShrink: 0,
            width: '18px',
            height: '18px'
        },
    },

    dateTimeWrapper: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1.1rem',
        fontWeight: 500,
    },

    timeHighlight: {
        color: theme.colors.blue[3],
        fontWeight: 600,
        fontSize: '1.1rem',
    },

    noEvents: {
        textAlign: 'center',
        padding: '4rem 1rem',
        color: theme.colors.gray[5],
    },
}));

const EVENT_SECTION_TITLE = "<Our Upcoming Events />";
const EVENT_SECTION_PHRASE = "";

interface Event {
    id: string;
    title: string;
    date: dayjs.Dayjs;
    place: string;
    icon: string;
}

const EventSection: React.FC = () => {
    const { classes } = useStyles();
    const [events, setEvents] = useState<Event[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            const q = query(
                collection(store, 'events'),
                where('date', '>=', Timestamp.now()),
                where('visible', '==', true),
                orderBy('date', 'asc'),
                limit(12)
            );

            const docs = await getDocs(q);
            const fetchedEvents: Event[] = [];
            
            docs.forEach((doc) => {
                const data = doc.data();
                fetchedEvents.push({
                    id: doc.id,
                    title: data.title,
                    date: dayjs.unix(data.date.seconds),
                    place: data.place,
                    icon: data.icon || "✏️"
                });
            });

            setEvents(fetchedEvents);
            setMounted(true);
        };

        fetchEvents();
    }, []);

    return (
        <section id="Events">
            <Container fluid>
                <Flex direction="column" justify="center" wrap="wrap" gap="md">
                    <Title
                        align="center"
                        variant="gradient"
                        order={1}
                        sx={{ fontSize: "3rem" }}
                        className={classes.title}
                    >
                        {EVENT_SECTION_TITLE}
                    </Title>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={(theme: MantineTheme) => ({
                            fontSize: "1.5rem",
                            [theme.fn.smallerThan("sm")]: {
                                fontSize: "1.2rem",
                            },
                        })}
                        className={classes.description}
                    >
                        {EVENT_SECTION_PHRASE}
                    </Text>
                </Flex>

                <Transition mounted={mounted} transition="fade" duration={500}>
                    {(styles) => (
                        <Box style={styles}>
                            {events.length > 0 ? (
                                <div className={classes.eventsContainer}>
                                    {events.map((event) => (
                                        <Box key={event.id} className={classes.eventCard}>
                                            <div className={classes.iconSection}>
                                                <div className={classes.eventIcon}>{event.icon}</div>
                                            </div>
                                            <div className={classes.contentSection}>
                                                <h3 className={classes.eventTitle}>{event.title}</h3>
                                                <div className={classes.metaInfo}>
                                                    <div className={classes.metaItem}>
                                                        <IconCalendar size={14} />
                                                        <div className={classes.dateTimeWrapper}>
                                                            <span>{event.date.format('dddd, MMM D')}</span>
                                                            <span className={classes.timeHighlight}>
                                                                {' at '}{event.date.format('h:mm A')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={classes.metaItem}>
                                                        <IconMapPin size={14} />
                                                        {event.place}
                                                    </div>
                                                </div>
                                            </div>
                                        </Box>
                                    ))}
                                </div>
                            ) : (
                                <div className={classes.noEvents}>
                                    <Text size="xl">No upcoming events at the moment.</Text>
                                    <Text size="md" mt="md">Check back soon for new events!</Text>
                                </div>
                            )}
                        </Box>
                    )}
                </Transition>
            </Container>
        </section>
    );
};

export default EventSection;
