import { Container, Flex, Title, Text, createStyles, MantineTheme } from '@mantine/core';
import EventCarousel from './EventCarousel/EventCarousel';

const useStyles = createStyles((theme: MantineTheme) => ({
    title: {
        [theme.fn.smallerThan(780)] : {
            fontSize: '2rem',
        },
    },

    description: {
        fontWeight: 600,
        [theme.fn.smallerThan(780)] : {
            fontSize: '1rem',
        },
    },
}));

const EVENT_SECTION_TITLE = '<Our Upcoming Events />';
const EVENT_SECTION_PHRASE = '*Updates every month*';

const EventSection: React.FC = () => {
    const { classes } = useStyles();
    return (
        <section id="Events">
            <Container fluid>
                <Flex direction="column" justify="center" wrap="wrap" gap="md">
                    <Title
                        align="center"
                        variant="gradient"
                        order={1}
                        sx={{ fontSize: '3rem' }}
                        className={classes.title}
                    >
                        {EVENT_SECTION_TITLE}
                    </Title>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={(theme: MantineTheme) => ({
                            fontSize: '1.5rem',
                            [theme.fn.smallerThan('sm')]: {
                                fontSize: '1.2rem',
                            },
                        })}
                        className={classes.description}
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
