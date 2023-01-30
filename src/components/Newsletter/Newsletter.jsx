import React from "react";
import "./Newsletter.css"
import { Title, Text, Container, Flex, Center, TextInput, Button, Group, Box } from '@mantine/core';
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
                        <Text align="center" color="white">
                            {NEWSLETTER_CAPTION}
                        </Text>

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
                        
                    </Flex>
                </Center>
            </Container>
        </section>
    );
}

export default Newsletter;