import { Container, Title, Text, Flex, Box } from '@mantine/core';
import PODS from './initiatives/PODS';
import ReviewSessions from './initiatives/ReviewSessions';

const SECTION_TITLE = '<Our Initiatives />';
const SECTION_PHRASE =
    'At LCS, we understand how important building a good portfolio is. That’s why we give students the opportunities to do so!';

const InitiativesSection = () => {
    return (
        <section id="Initiatives">
            <Container size="xl">
                <Flex direction="column" justify="center" wrap="wrap" gap="md">
                    <Title
                        align="center"
                        variant="gradient"
                        order={1}
                        sx={{ fontSize: '3rem' }}
                    >
                        {SECTION_TITLE}
                    </Title>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={{ fontSize: '1.5rem' }}
                    >
                        {SECTION_PHRASE}
                    </Text>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={{
                            fontSize: '1.5rem',
                            marginTop: '1.5rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        Check out our current projects:
                    </Text>
                </Flex>
                <Container fluid className="space-y-2">
                    <PODS />
                    <ReviewSessions />
                </Container>
            </Container>
        </section>
    );
};

export default InitiativesSection;
