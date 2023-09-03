import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useDisclosure } from '@mantine/hooks';
import {
    Title,
    Text,
    Box,
    Flex,
    Button,
    Modal,
    createStyles,
} from '@mantine/core';
import { PodsLogo, IconLogo, C3PartnerLogo, HHPartnerLogo } from '@assets';
import { useCommonStyles } from './styles';
import dayjs from '@utils/day';
import { store } from '../../../services/firebase';

const useStyles = createStyles((theme) => ({
    lcsLogo: {
        width: '3rem',
    },
    hhLogo: {
        width: '2rem',
        marginLeft: '-0.7rem',
    },
    c3Logo: {
        width: '2rem',
    },
    bodyPODSLogo: {
        maxWidth: '23rem',
        margin: 'auto',
        display: 'block',

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },
    headerPODSLogoBox: {
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,

        [theme.fn.smallerThan('sm')]: {
            position: 'initial',
            marginTop: '1rem',
        },
    },
    hedearPODSLogo: {
        maxHeight: '2rem',
    },
    actionBox: {
        position: 'absolute',
        right: 0,

        [theme.fn.smallerThan('sm')]: {
            position: 'initial',
        },
    },
    smallText: {
        fontSize: '1rem',
        textAlign: 'center',
        color: 'white',
        marginTop: '1rem',
    },
}));

const PODS = () => {
    const { classes } = useStyles();
    const { classes: commonClasses } = useCommonStyles();
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState({
        applicable: false,
        openDate: 'TBD',
        description: '',
    });

    const getData = async () => {
        try {
            const docSnap = await getDoc(doc(store, 'initiatives', 'pods'));
            if (docSnap.exists()) {
                const docData = docSnap.data();
                const date = docData.openDate.toDate();
                setData({
                    applicable: docData.applicable,
                    openDate: dayjs(date).format('MMMM Do, YYYY'),
                    description: docData.description,
                });
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
                    <Title className={commonClasses.title}>LCS PODS</Title>
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
                        <img
                            alt="HawkHacks Logo"
                            src={HHPartnerLogo}
                            className={classes.hhLogo}
                        />
                        <img
                            alt="C Cubed Logo"
                            src={C3PartnerLogo}
                            className={classes.c3Logo}
                        />
                    </Flex>
                    <Flex
                        justify="center"
                        align="center"
                        className={classes.headerPODSLogoBox}
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
                                className={classes.hedearPODSLogo}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Flex gap={32} direction="row-reverse">
                    <Flex align="center">
                        <Text className={commonClasses.description}>
                            {data.description}
                        </Text>
                    </Flex>
                    <Flex align="center">
                        <img
                            src={PodsLogo}
                            alt="PODS Logo"
                            className={classes.bodyPODSLogo}
                        />
                    </Flex>
                </Flex>
                <Text className={classes.smallText}>
                    {`Applications open on ${data.openDate}`}
                </Text>
                <Flex
                    sx={{ position: 'relative' }}
                    mt="2rem"
                    gap="md"
                    justify="center"
                >
                    <span className="sr-only" id="pods-details">
                        opens a modal with more description about PODS
                    </span>
                    <Button
                        aria-describedby="pods-details"
                        size="lg"
                        variant="subtle"
                        onClick={open}
                    >
                        Show More
                    </Button>
                    {data.applicable && (
                        <Box className={classes.actionBox}>
                            <span className="sr-only" id="apply-pods">
                                opens form to apply to PODS
                            </span>
                            <Button
                                aria-describedby="apply-pods"
                                variant=""
                                gradient={{
                                    from: 'blue.4',
                                    to: 'accents.1',
                                }}
                                className={commonClasses.actionBtn}
                                size="lg"
                                onClick={() => console.log('here')}
                                disabled={!data.applicable}
                            >
                                Apply
                            </Button>
                        </Box>
                    )}
                </Flex>
            </Box>
            <Modal
                opened={opened}
                onClose={close}
                title="LCS PODS Details"
                size="85%"
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
                        PODS has 5 major development phases -{' '}
                        <span className="bold">
                            Brainstorming, Design, Prototyping, MVP
                        </span>{' '}
                        and <span className="bold">Launch</span>.
                    </p>
                    <p>
                        PODS teams are curated based on skill level, based on
                        your application's test. Our goal is for{' '}
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

export default PODS;
