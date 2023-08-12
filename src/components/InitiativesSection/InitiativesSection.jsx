import { Container, Title, Text, Flex, Box } from '@mantine/core';
import InitiativeCard from './InitiativeCard/InitiativeCard';
import {
    PPLogo,
    Plant,
    PodsLogo,
    IconLogo,
    C3PartnerLogo,
    HHPartnerLogo,
    UWCSCPartnerLogo,
    UWDSCPartnerLogo,
} from '@assets';

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
                    <InitiativeCard
                        title="LCS PODS"
                        description="A 3-month long program that groups students into teams to work on a software development project. The goal is to teach students the crucial skills that they’d need to start their careers, as well as create a community of passionate developers."
                        logo={PodsLogo}
                        logoLabel="PODS Logo"
                        partnerLogos={[
                            {
                                label: 'LCS Logo',
                                url: IconLogo,
                                style: { width: '62px' },
                            },
                            {
                                label: 'HH Logo',
                                url: HHPartnerLogo,
                                style: { width: '38px', marginRight: '16px' },
                            },
                            {
                                label: 'C3 Logo',
                                url: C3PartnerLogo,
                                style: { width: '38px' },
                            },
                        ]}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                padding: '2rem',
                            }}
                        >
                            <Box
                                sx={{
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2rem',
                                    textAlign: 'right',
                                    color: 'white',
                                }}
                            >
                                <p>
                                    PODS has 5 major development phases -{' '}
                                    <span className="bold">
                                        Brainstorming, Design, Prototyping, MVP
                                    </span>{' '}
                                    and <span className="bold">Launch</span>.
                                </p>
                                <p>
                                    PODS teams are curated based on skill level,
                                    based on your application's test. Our goal
                                    is for{' '}
                                    <span className="bold">
                                        everyone to learn
                                    </span>{' '}
                                    - nto just one hardcarry.
                                </p>
                                <p>
                                    Each POD will work on one project over the
                                    course of the next three months. These
                                    projects can be{' '}
                                    <span className="bold">
                                        websites, video games, machine learning
                                        models,
                                    </span>
                                    or whatever else the team is interested in!
                                </p>
                            </Box>
                            <img src={Plant} alt="Plant" />
                        </Box>
                    </InitiativeCard>
                    <InitiativeCard
                        title="Project Program"
                        description="A collaboration with Wilfrid Laurier University's LCS and University of Waterloo's CSC and DSC, where students participate in a month-long hackathon!"
                        logo={PPLogo}
                        logoLabel="Project Program Logo"
                        right
                        partnerLogos={[
                            {
                                label: 'LCS Logo',
                                url: IconLogo,
                                style: { width: '62px' },
                            },
                            {
                                label: 'DSC Logo',
                                url: UWDSCPartnerLogo,
                                style: { width: '38px', marginRight: '14px' },
                            },
                            {
                                label: 'CSC Logo',
                                url: UWCSCPartnerLogo,
                                style: { width: '38px' },
                            },
                        ]}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr',
                                padding: '2rem',
                            }}
                        >
                            <img src={Plant} alt="Plant" />
                            <Box
                                sx={{
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2rem',
                                    textAlign: 'left',
                                    color: 'white',
                                }}
                            >
                                <p>NEEDS TO FILL IN CONTENT FOR THIS</p>
                            </Box>
                        </Box>
                    </InitiativeCard>
                </Container>
            </Container>
        </section>
    );
};

export default InitiativesSection;
