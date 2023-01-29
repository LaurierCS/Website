import React from "react";
import "./Newsletter.css"
import { Title, Text, Container, Flex, Center } from '@mantine/core';

const NEWSLETTER_HEADING = "Join our Newsletter!";
const NEWSLETTER_CAPTION = ["Subscribe to our newsletter to receive event", <br/>, "announcements and more!"]

const Newsletter = () => {
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
                        <Title align="center" variant="gradient" order={1} size={50}>
                            {NEWSLETTER_HEADING}
                        </Title>
                        <Text align="center" color="white" size={30}>
                            {NEWSLETTER_CAPTION}
                        </Text>
                        
                    </Flex>
                </Center>
            </Container>
        </section>
    );
}

export default Newsletter;