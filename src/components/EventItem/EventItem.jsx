import EventTag from '../EventTag/EventTag';
import { createStyles, Flex, Title } from '@mantine/core';

const useStyles = createStyles((theme) => {
    return {
        eventTitle: {
            fontSize: theme.headings.sizes.h3.fontSize,
            lineHeight: 1.2,
            color: theme.white,
        },

        eventItemWrapper: {
            padding: '1.5em',
            transition: 'background-color 250ms ease',
            '&:hover': {
                backgroundColor: 'rgba(69, 78, 86, 0.4)',
                transition: 'background-color 150ms ease',
                cursor: 'pointer',
            },
        },

        eventItemTagWrapper: {
            marginTop: '0.5em',
        },

        eventItemTag: {
            flexShrink: 0,
        },
    };
});

const EventItem = ({ eventData }) => {
    const { classes } = useStyles();

    return (
        <Flex direction="column" className={classes.eventItemWrapper}>
            <Title className={classes.eventTitle}>{eventData.eventTitle}</Title>
            <Flex
                justify="space-between"
                align="center"
                className={classes.eventItemTagWrapper}
            >
                <EventTag
                    variant="secondary"
                    removeBg={true}
                    intent="date"
                    date={eventData.eventSchedule.date}
                    className="event-item-tag"
                />
                <Flex>
                    <EventTag
                        intent="time"
                        startTime={eventData.eventSchedule.start}
                        endTime={eventData.eventSchedule.end}
                        removeBg={true}
                        className="event-item-tag"
                    />
                    <EventTag
                        variant={eventData.online ? 'secondary' : 'tertiary'}
                        intent="place"
                        online={eventData.online}
                        place={eventData.place ?? ''}
                        removeBg={true}
                        className="event-item-tag"
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default EventItem;
