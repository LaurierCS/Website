import React from "react";
import "./Newsletter.css"
import { Title, Text, Container, Flex, Center, TextInput, Button, Group, Box, MediaQuery } from '@mantine/core';
import { useForm } from '@mantine/form';

const NEWSLETTER_HEADING = "Join our Newsletter!";
const NEWSLETTER_CAPTION = ["Subscribe to our newsletter to receive event", <br/>, "announcements and more!"]

function Newsletter () {
    const form = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <section id="newsletter">
            <Container size="x1" my={300}>
                <Center style={{ width: '100%', height: '100%'}}>
                    <Flex
                        direction="column"
                        justify="center"
                        wrap="wrap"
                        gap="md"
                    >
                        <Title align="center" color="#A1DAF5" order={1}>
                            {NEWSLETTER_HEADING}
                        </Title>
                        <MediaQuery 
                            query="(max-width: 768px)"
                            styles={{ fontSize: '1.2rem' }}
                        >
                            <Text align="center" color="white">
                                {NEWSLETTER_CAPTION}
                            </Text>
                        </MediaQuery>

                        <MediaQuery 
                            query="(max-width: 768px)"
                            styles={{ width: 300 }}
                        >
                            <Box sx={{ width: 400 }} mx="auto" mt="sm">
                                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                                    <TextInput
                                    withAsterisk
                                    placeholder="Email"
                                    {...form.getInputProps('email')}
                                    />

                                    <Group position="center" mt="sm">
                                        <Button fullWidth variant="filled" type="submit" size="lg" radius="md">SUBSCRIBE</Button>
                                    </Group>
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