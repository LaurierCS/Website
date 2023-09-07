import React from 'react';
import {
    Title,
    Text,
    Container,
    Flex,
    Center,
    TextInput,
    Button,
    Group,
    Box,
    MediaQuery,
    createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';

const NEWSLETTER_HEADING = '<Join our Newsletter! />';
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
}));

function Newsletter() {
    const { classes } = useStyles();
    const form = useForm({
        initialValues: {
            email: '',
        },
    });

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
                        <Text align="center" color="white">
                            Wanna stay in the know of our next events?"
                        </Text>
                        <Title
                            align="center"
                            variant="gradient"
                            order={1}
                            sx={{ fontSize: '3rem' }}
                        >
                            {NEWSLETTER_HEADING}
                        </Title>
                        <MediaQuery
                            query="(max-width: 768px)"
                            styles={{ fontSize: '1.2rem' }}
                        >
                            <Text align="center" color="white" weight="bold">
                                Subscribe to our newsletter to receive event
                                <br />
                                announcements, updates, and more!
                            </Text>
                        </MediaQuery>

                        <MediaQuery
                            query="(max-width: 768px)"
                            styles={{ width: 300 }}
                        >
                            <Box sx={{ width: 400 }} mx="auto" mt="sm">
                                <form action="https://eepurl.com/hI3myD" target="_blank">
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        type="submit"
                                        radius="6px"
                                        sx={{
                                            fontSize: '1rem',
                                            marginTop: '10px',
                                        }}
                                    >
                                        SUBSCRIBE
                                    </Button>
                                </form>
                            </Box>
                        </MediaQuery>
                    </Flex>
                </Center>
            </Container>
        </section>
    );
}

export default Newsletter;
