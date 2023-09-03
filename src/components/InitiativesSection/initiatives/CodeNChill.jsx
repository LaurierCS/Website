import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
    bodyLogo: {
        maxWidth: '23rem',
        margin: 'auto',
        display: 'block',

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },
}));

const CodeNChill = () => {
    const { classes } = useStyles();
    const { classes: commonClasses } = useCommonStyles();
    const [opened, { open, close }] = useDisclosure(false);
    const [description, setDescription] = useState('');

    const getData = async () => {
        try {
            const docSnap = await getDoc(
                doc(store, 'initiatives', 'codenchill')
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
                    <Title className={commonClasses.title}>Code n' Chill</Title>
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
                </Box>
                <Flex gap={32} direction="row-reverse">
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
                title="LCS CodeNChill Details"
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
                        CodeNChill has 5 major development phases -{' '}
                        <span className="bold">
                            Brainstorming, Design, Prototyping, MVP
                        </span>{' '}
                        and <span className="bold">Launch</span>.
                    </p>
                    <p>
                        CodeNChill teams are curated based on skill level, based
                        on your application's test. Our goal is for{' '}
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

export default CodeNChill;
