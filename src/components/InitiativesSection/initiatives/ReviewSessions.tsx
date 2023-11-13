import { Title, Text, Box, Flex, Button } from '@mantine/core';
import { FaYoutube, FaTwitch } from 'react-icons/fa';
import { IconLogo } from '@/assets';
import { Link } from 'react-scroll';
import { useCommonStyles } from './styles';
import { navbarHeight } from '../../Navbar/Navbar';

const ReviewSessions = () => {
    const { classes } = useCommonStyles();
    const { classes: commonClasses } = useCommonStyles();

    return (
        <Box sx={(theme) => ({ boxShadow: theme.shadows.lg })}>
            <Box className={commonClasses.outerBox}>
                <Box className={commonClasses.innerBox}>
                    <Flex
                        justify="center"
                        align="center"
                        gap={12}
                        className={commonClasses.partnerLogoContainer}
                        sx={(theme) => ({
                            [theme.fn.smallerThan('xs')]: {
                                gridColumn: 'span 1',
                            },
                        })}
                    >
                        <img
                            alt="LCS Logo"
                            src={IconLogo}
                            className={classes.lcsLogo}
                        />
                    </Flex>
                    <Title className={commonClasses.title}>
                        Review Sessions
                    </Title>
                    <Flex
                        justify="center"
                        align="center"
                        sx={(theme) => ({
                            height: '100%',
                            [theme.fn.smallerThan('xs')]: {
                                gridColumn: 'span 1',
                            },
                        })}
                    >
                        <Box
                            sx={(theme) => ({
                                display: 'none',

                                [theme.fn.smallerThan('md')]: {
                                    display: 'block',
                                },
                            })}
                        >
                            <span className={classes.emojiHeaderLogo}>📝</span>
                        </Box>
                    </Flex>
                </Box>
                <Flex justify="center" gap={32}>
                    <span className={classes.emojiLogo}>📝</span>
                    <Box>
                        <Text className={commonClasses.description}>
                            Review Sessions are events hosted in-person and/or
                            online by LCS which offer fun and interactive way to
                            review course content through games of Kahoot and
                            slide shows. Keep an eye on our{' '}
                            <Link
                                to="Events"
                                offset={-navbarHeight}
                                smooth
                                duration={300}
                                className={classes.link}
                            >
                                upcoming events
                            </Link>{' '}
                            to not miss out on any Review Session!
                        </Text>

                        <Box mt={32}>
                            <Text className={classes.description}>
                                Feel free to take a look at previous Review
                                Sessions and follow us on Twitch for live
                                streams!
                            </Text>
                            <Button
                                component="a"
                                variant="subtle"
                                color="red.5"
                                href="https://www.youtube.com/@LaurierComputingSociety/playlists"
                                size="lg"
                                leftIcon={<FaYoutube />}
                                target="_blank"
                                rel="external noreferrer"
                            >
                                Youtube
                            </Button>
                            <Button
                                component="a"
                                variant="subtle"
                                color="violet.5"
                                href="https://www.twitch.tv/lauriercs"
                                size="lg"
                                leftIcon={<FaTwitch />}
                                target="_blank"
                                rel="external noreferrer"
                            >
                                Twitch
                            </Button>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default ReviewSessions;
