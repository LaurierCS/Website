import PropTypes from 'prop-types';
import { Box, Flex, Tooltip, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    icon: {
        fontSize: '5.75rem',

        [theme.fn.smallerThan('lg')]: {
            fontSize: '4rem',
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: '3rem',
        },
    },

    title: {
        fontSize: '1.8rem',
        color: 'white',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        [theme.fn.smallerThan('sm')]: {
            fontSize: '1.2rem',
            overflow: 'initial',
            whiteSpace: 'normal',
        },
    },

    date: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#6CB3FF',

        [theme.fn.smallerThan('sm')]: {
            fontSize: '0.9rem',
        },
    },

    time: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#6CB3FF',
        display: 'block',

        [theme.fn.smallerThan('sm')]: {
            fontSize: '0.9rem',
        },
    },

    description: {
        margin: '40px 0px',
        fontSize: '1rem',
        color: '#E7EBF5',
    },

    link: {
        fontSize: '1.56rem',
        fontWeight: 'bold',
        color: theme.colors.accents[1],
        borderRadius: '8px',

        [theme.fn.smallerThan('lg')]: {
            fontSize: '1.2rem',
        },
    },

    highlight: {
        color: theme.colors.accents[1],
        fontWeight: 'bold',
    },

    cardRoot: {
        backgroundColor: theme.colors.card[0],
        borderRadius: '10px',
        paddingTop: '20px',
        paddingBottom: '20px',
        width: '33rem',
        height: '35rem',
        boxShadow: theme.shadows.lg,
        position: 'relative',
        transition: 'all ease 150ms',
        borderStyle: 'solid',
        borderWidth: '5px',
        borderColor: 'transparent',
        ':hover': {
            borderColor: '#6CB3FF',
            '::before': {
                opacity: 0.4,
            },
        },
        zIndex: 2,
        '::before': {
            content: '""',
            position: 'absolute',
            background: theme.fn.gradient({
                from: 'blue.4',
                to: 'accents.1',
            }),
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: -1,
            opacity: 0,
            transition: 'all ease 150ms',
        },
        '::after': {
            content: '""',
            position: 'absolute',
            top: -5,
            right: -5,
            bottom: -5,
            left: -5,
            zIndex: -1,
            borderRadius: 10,
            border: '2px solid #6cb3ff',
        },

        [theme.fn.smallerThan('lg')]: {
            width: '30rem',
        },

        [theme.fn.smallerThan('md')]: {
            width: '100%',
            height: 'auto',
        },
    },

    placeRoot: {
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: '#89F7FE',
        color: '#2C3844',
        fontWeight: 'bold',
        fontSize: '1.2rem',

        [theme.fn.smallerThan('sm')]: {
            fontSize: '0.8rem',
        },
    },

    placeContent: {
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',

        [theme.fn.smallerThan('lg')]: {
            paddingLeft: '1rem',
            paddingRight: '1rem',
        },

        [theme.fn.smallerThan('sm')]: {
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
        },
    },

    upNext: {
        background: theme.fn.gradient({
            from: 'blue.4',
            to: 'accents.1',
        }),
        color: '#1A1B1E',
        fontSize: '2rem',
        fontWeight: 'bold',
        padding: '4px 20px',
        borderRadius: '14px',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: theme.shadows.md,

        [theme.fn.smallerThan('lg')]: {
            fontSize: '1.5rem',
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: '1.2rem',
        },
    },
}));

const EventCard = ({
    icon,
    title,
    date,
    place,
    description,
    igPost,
    isPublicDate,
    isPublicPlace,
    isPublicTime,
    isNext,
    disableIg,
    hideDate,
    hidePlace,
}) => {
    const { classes } = useStyles();

    return (
        <Box className={classes.cardRoot}>
            <Box
                sx={() => ({
                    paddingLeft: '18px',
                    paddingRight: '18px',
                })}
            >
                <Box>
                    <span className={classes.icon}>{icon}</span>
                    <Tooltip label={title}>
                        <h1 className={classes.title}>{title}</h1>
                    </Tooltip>
                    <Flex align="center" justify="space-between">
                        {!hideDate && (
                            <Box>
                                <span className={classes.date}>
                                    {isPublicDate &&
                                        date.format('MMMM Do, YYYY')}
                                    {!isPublicDate && 'Date: TBD'}
                                </span>
                                <span className={classes.time}>
                                    {isPublicTime && date.format('hh:mm A')}
                                    {!isPublicTime && 'Time: TBD'}
                                </span>
                            </Box>
                        )}
                        {!hidePlace && (
                            <Box className={classes.placeRoot}>
                                <Box className={classes.placeContent}>
                                    {isPublicPlace ? place : 'Place: TBD'}
                                </Box>
                            </Box>
                        )}
                    </Flex>
                </Box>

                <p className={classes.description}>
                    {description}
                </p>

                {!disableIg && igPost && (
                    <a
                        href={igPost}
                        target="_blank"
                        rel="next noreferrer"
                        className={classes.link}
                    >
                        Learn more about the event!
                    </a>
                )}

                {!disableIg && !igPost && (
                    <span
                        className={[
                            classes.description,
                            classes.highlight,
                        ].join(' ')}
                    >
                        Find out more closer to the date!
                    </span>
                )}
            </Box>

            {isNext && (
                <Box component="span" className={classes.upNext}>
                    UP NEXT
                </Box>
            )}
        </Box>
    );
};

EventCard.defaultProps = {
    isNext: false,
};

EventCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    place: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isNext: PropTypes.bool,
    disableIg: PropTypes.bool,
    hideDate: PropTypes.bool,
    hidePlace: PropTypes.bool,
};

export default EventCard;
