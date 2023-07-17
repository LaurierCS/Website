import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { Box } from '@mantine/core';
import { Link } from 'react-router-dom';

import classes from './EventCard.module.css';
import { background } from '@storybook/theming';

const EventCard = ({ icon, title, date, place, description, url, isNext }) => {
    return (
        <Box
            sx={(theme) => ({
                backgroundColor: theme.colors.card[0],
                borderRadius: '10px',
                paddingTop: '20px',
                paddingBottom: '20px',
                width: '567px',
                height: '535px',
                boxShadow: theme.shadows.md,
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
                    background: 'red',
                    position: 'absolute',
                    background: theme.fn.gradient(),
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
                    <h1 className={classes.title}>{title}</h1>
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
                <p className={classes.description}>{description}</p>

                <span className={classes.link}>
                    <Link to={url}>{'Learn More >>'}</Link>
                </span>
            </Box>
            {isNext && (
                <Box
                    component="span"
                    sx={(theme) => ({
                        background: theme.fn.gradient(),
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
    date: momentPropTypes.momentObj,
    place: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isNext: PropTypes.bool,
};

export default EventCard;
