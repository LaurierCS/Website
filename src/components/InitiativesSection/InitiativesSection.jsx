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
                    <Title align="center" variant="gradient" order={1}>
                        {SECTION_TITLE}
                    </Title>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={{ fontSize: '32px' }}
                    >
                        {SECTION_PHRASE}
                    </Text>
                    <Text
                        span
                        align="center"
                        color="white"
                        sx={{
                            fontSize: '32px',
                            marginTop: '32px',
                            marginBottom: '32px',
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
