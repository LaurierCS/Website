import {
    Container,
    Grid,
    Center,
    Flex,
    MediaQuery,
    Title,
    Text,
} from '@mantine/core';

const EVENT_SECTION_TITLE = '<Our Upcoming Events />';
const EVENT_SECTION_PHRASE = '*Updates every month*';

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
                                <MediaQuery query="(max-width: 768px)">
                                    <Title
                                        align="center"
                                        variant="gradient"
                                        order={1}
                                    >
                                        {EVENT_SECTION_TITLE}
                                    </Title>
                                </MediaQuery>
                                <Text align="center" color="white">
                                    {EVENT_SECTION_PHRASE}
                                </Text>
                            </Flex>
                        </Center>
                    </Grid.Col>
                    <Grid.Col md={6}></Grid.Col>
                </Grid>
            </Container>
        </section>
    );
};

export default EventSection;
