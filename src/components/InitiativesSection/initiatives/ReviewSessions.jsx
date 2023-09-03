import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Title, Text, Box, Flex, Button, Modal } from '@mantine/core';
import { PodsLogo, IconLogo } from '@assets';
import { useCommonStyles } from './styles';
import { store } from '../../../services/firebase';

const ReviewSessions = () => {
    const { classes } = useCommonStyles();
    const { classes: commonClasses } = useCommonStyles();
    const [opened, { open, close }] = useDisclosure(false);
    const [description, setDescription] = useState('');

    const getData = async () => {
        try {
            const docSnap = await getDoc(
                doc(store, 'initiatives', 'review-sessions')
            );
            if (docSnap.exists()) {
                const docData = docSnap.data();
                setDescription(docData.description);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box sx={(theme) => ({ boxShadow: theme.shadows.lg })}>
            <Box className={commonClasses.outerBox}>
                <Box className={commonClasses.innerBox}>
                    <Flex
                        justify="center"
                        align="center"
                        gap={12}
                        className={commonClasses.partnerLogoContainer}
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
                        className={classes.headerLogoBox}
                    >
                        <Box
                            sx={(theme) => ({
                                display: 'none',

                                [theme.fn.smallerThan('md')]: {
                                    display: 'block',
                                },
                            })}
                        >
                            <img
                                src={PodsLogo}
                                alt="PODS Logo"
                                className={classes.headerLogo}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Flex gap={32} direction="row-reverse" justify="space-between">
                    <Flex align="center">
                        <Text className={commonClasses.description}>
                            {description}
                        </Text>
                    </Flex>
                    <Flex align="center">
                        <img
                            src={PodsLogo}
                            alt="Code n Chill Logo"
                            className={classes.bodyLogo}
                        />
                    </Flex>
                </Flex>
                <Flex mt="2rem" gap="md" justify="center">
                    <span className="sr-only" id="pods-details">
                        opens a modal with more description about code and chill
                    </span>
                    <Button
                        aria-describedby="pods-details"
                        size="lg"
                        variant="subtle"
                        onClick={open}
                    >
                        Show More
                    </Button>
                </Flex>
            </Box>
            <Modal
                opened={opened}
                onClose={close}
                title="LCS ReviewSessions Details"
                centered
            >
                <Box
                    sx={{
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        color: 'white',
                    }}
                >
                    <p>
                        ReviewSessions has 5 major development phases -{' '}
                        <span className="bold">
                            Brainstorming, Design, Prototyping, MVP
                        </span>{' '}
                        and <span className="bold">Launch</span>.
                    </p>
                    <p>
                        ReviewSessions teams are curated based on skill level,
                        based on your application's test. Our goal is for{' '}
                        <span className="bold">everyone to learn</span> - nto
                        just one hardcarry.
                    </p>
                    <p>
                        Each POD will work on one project over the course of the
                        next three months. These projects can be{' '}
                        <span className="bold">
                            websites, video games, machine learning models,
                        </span>
                        or whatever else the team is interested in!
                    </p>
                </Box>
            </Modal>
        </Box>
    );
};

export default ReviewSessions;
