import PropTypes from 'prop-types';
import { Box, Tooltip } from '@mantine/core';
import { Link } from 'react-router-dom';

import classes from './EventCard.module.css';

const EventCard = ({ icon, title, date, place, description, url, isNext }) => {
    const descriptionMaxLength = 112;

    // I hate how the classes are here, makes me want to quit mantine 100000%
    return (
        <Box
            sx={(theme) => ({
                backgroundColor: theme.colors.card[0],
                borderRadius: '10px',
                paddingTop: '20px',
                paddingBottom: '20px',
                width: '567px',
                height: '535px',
                boxShadow: theme.shadows.lg,
                position: 'relative',
                transition: 'all ease 150ms',
                borderStyle: 'solid',
                borderWidth: '5px',
                borderColor: 'transparent',
                ':hover': {
                    borderColor: '#6CB3FF',
                    '::before': {
                        opacity: 0.6,
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
                    transition: 'opacity ease 150ms',
                },
            })}
        >
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
                    <Box
                        sx={() => ({
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        })}
                    >
                        <span className={classes.date}>
                            {date.format('MMMM Do, YYYY')}
                        </span>
                        <Box
                            sx={() => ({
                                borderRadius: '10px',
                                overflow: 'hidden',
                                backgroundColor: '#89F7FE',
                                color: '#2C3844',
                                fontWeight: 'bold',
                                fontSize: '25px',
                            })}
                        >
                            <Box
                                sx={() => ({
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                })}
                            >
                                {place}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <div className={classes.descriptionContainer}>
                    <p className={classes.description}>
                        {description.length > descriptionMaxLength
                            ? description.slice(0, -3) + '...'
                            : description}
                    </p>
                </div>

                <span className={classes.link}>
                    <Link to={url}>{'Learn More >>'}</Link>
                </span>
            </Box>
            {isNext && (
                <Box
                    component="span"
                    sx={(theme) => ({
                        background: theme.fn.gradient({
                            from: 'blue.4',
                            to: 'accents.1',
                        }),
                        color: '#1A1B1E',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        padding: '4px 20px',
                        borderRadius: '14px',
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: theme.shadows.md,
                    })}
                >
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
    url: PropTypes.string.isRequired,
    isNext: PropTypes.bool,
};

export default EventCard;
