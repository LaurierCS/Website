import React from 'react';
import {
    Title,
    Text,
    Container,
    Flex,
    Center,
    Button,
    Group,
    Box,
    MediaQuery,
    createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';

const NEWSLETTER_HEADING = '<Sign up for our Newsletter! />';
const NEWSLETTER_CAPTION = [
    'Subscribe to our newsletter to receive event',
    <br />,
    'announcements and more!',
];

const useStyles = createStyles((theme) => ({
    emailInput: {
        backgroundColor: '#E7EBF5',
        border: 'none',
        color: '#1A1B1E',
        textAlign: 'center',
        borderRadius: '6px',
        padding: '6px 16px',
        width: '100%',
    },

    title: {
        fontWeight: 'bold',
        fontSize: 48,
        [theme.fn.smallerThan('780')]: {
            fontSize: '2rem',
        },
    },

    description: {
        fontSize: 24,
        fontWeight: '600',
        [theme.fn.smallerThan('780')]: {
            fontSize: '1rem',
        },
    },

    button: {
        fontSize: '1.5rem',
        marginTop: '10px',

        [theme.fn.smallerThan('780')]: {
            fontSize: '1rem',
        },
    },

    newsletterBtn: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        [theme.fn.smallerThan(450)]: {
            padding: '0 4rem',
        },
    },
}));

function Newsletter() {
    const { classes } = useStyles();

    const subscribe = async ({ email }) => {
        if (!email) return;
        console.log(email);
    };

    return (
        <section id="newsletter">
            <Container size="x1" my={150}>
                <Center style={{ width: '100%', height: '100%' }}>
                    <Flex
                        direction="column"
                        justify="center"
                        wrap="wrap"
                        gap="md"
                    >
                        <Text
                            align="center"
                            color="white"
                            className={classes.description}
                        >
                            Wanna stay in the know of our next events?
                        </Text>
                        <Title
                            align="center"
                            variant="gradient"
                            order={1}
                            className={classes.title}
                        >
                            {NEWSLETTER_HEADING}
                        </Title>

                        <Text
                            align="center"
                            color="white"
                            weight="bold"
                            className={classes.description}
                        >
                            Subscribe to our newsletter to receive event
                            <br />
                            announcements, updates, and more!
                        </Text>
                        <Box className={classes.newsletterBtn} mt="sm">
                            <form
                                action="https://eepurl.com/hI3myD"
                                target="_blank"
                            >
                                <Button
                                    fullWidth
                                    variant="filled"
                                    type="submit"
                                    radius="6px"
                                    size="lg"
                                    className={classes.button}
                                >
                                    SUBSCRIBE
                                </Button>
                            </form>
                        </Box>
                    </Flex>
                </Center>
            </Container>
        </section>
    );
}

export default Newsletter;
