import { Container, Flex, Title, Text } from '@mantine/core';
import EventCarousel from './EventCarousel/EventCarousel';

import classes from './EventSection.module.css';

const EVENT_SECTION_TITLE = '<Our Upcoming Events />';
const EVENT_SECTION_PHRASE = '*Updates every month*';

const EventSection = () => {
    return (
        <section id="Events">
            <Container fluid>
                <Flex direction="column" justify="center" wrap="wrap" gap="md">
                    <Title
                        align="center"
                        variant="gradient"
                        order={1}
                        className={classes.sectionTitle}
                    >
                        {EVENT_SECTION_TITLE}
                    </Title>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={{ fontSize: '32px' }}
                    >
                        {EVENT_SECTION_PHRASE}
                    </Text>
                </Flex>
                <Container fluid>
                    <EventCarousel />
                </Container>
            </Container>
        </section>
    );
};

export default EventSection;
