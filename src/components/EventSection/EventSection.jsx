import './EventSection.css';
import EventTable from '../EventTable/EventTable';

// UI imports from mantine
import { Title, Text, Container, Grid, Flex, Center } from '@mantine/core';

const EVENT_SECTION_TITLE = '<Upcoming Events />';
const EVENT_SECTION_PHRASE =
    "Stay ahead of the game with LCS's events and workshops!";

const EventSection = () => {
    return (
        <section id="Events">
            <Container size="xl" my="md">
                <Grid grow>
                    <Grid.Col md={6}>
                        <Center style={{ width: '100%', height: '100%' }}>
                            <Flex
                                direction="column"
                                justify="center"
                                wrap="wrap"
                                gap="md"
                            >
                                <Title align="center" variant="gradient" order={1}>
                                    {EVENT_SECTION_TITLE}
                                </Title>
                                <Text align="center" color="white">
                                    {EVENT_SECTION_PHRASE}
                                </Text>
                            </Flex>
                        </Center>
                    </Grid.Col>
                    <Grid.Col md={6}>
                        <EventTable />
                    </Grid.Col>
                </Grid>
            </Container>
        </section>
    );
};

export default EventSection;
