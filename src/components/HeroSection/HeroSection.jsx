import './HeroSection.css';
import './../../../src/main.css'
import { Title, Text, BackgroundImage, Container, Flex, Image, Center, MediaQuery, Button } from "@mantine/core";
import { CorpImage, IconLogo } from '@assets';
import {FaDiscord} from "react-icons/fa";

const HERO_SECTION_TITLE = '<Laurier Computing Society />';
const HERO_SECTION_HOOK = "The official Computer Science club at Wilfrid Laurier University!";
const HERO_SECTION_TEXT_1 = "Student Lead";
const HERO_SECTION_TEXT_2 = "Established 2012";
const HERO_SECTION_TEXT_3 = "Career Driven";

const HeroSection = () => {
    return (
        <section id="top">
            <Container py='8rem' size="xl" my="md">
                <Center style={{ width: '100%', height: '100%' }}>
                    <Flex
                        direction="column"
                        justify="center"
                        wrap="wrap"
                        gap="md"
                    >
                        {/*Leaving as a possible placeholder for bg img*/}
                        <BackgroundImage
                            src=""
                        > 
                            {/*Icon Logo*/}
                            <MediaQuery 
                                query="(max-width: 768px)"
                                styles={{ height: '0.5rem', marginBottom: '2rem' }}
                            >
                                <Center>
                                    <Image
                                        src={IconLogo}
                                        width={120}
                                        height={90}
                                        align="center"
                                        pb="2rem"
                                />
                                </Center>
                            </MediaQuery>

                            {/*Hero Text*/}
                            <MediaQuery 
                                query="(min-width: 768px)"
                                styles={{ fontSize: '3rem' }}
                            >
                                <Title pb='3rem' align="center" fw={700} c="gradient" order={1}>
                                    {HERO_SECTION_TITLE}
                                </Title>
                            </MediaQuery>

                            <MediaQuery 
                                query="(max-width: 768px)"
                                styles={{ fontSize: '1.2rem' }}
                            >
                                <Text align="center" fz="xl" fw={500} c="white">
                                    {HERO_SECTION_HOOK}
                                </Text>
                            </MediaQuery>

                            <MediaQuery 
                                query="(max-width: 768px)"
                                styles={{ fontSize: '1rem' }}
                            >
                                <Text pt="2rem" align="center" fz="xl" fw={300} c="white">
                                    {HERO_SECTION_TEXT_1}&nbsp;&nbsp;|&nbsp;&nbsp;{HERO_SECTION_TEXT_2}&nbsp;&nbsp;|&nbsp;&nbsp;{HERO_SECTION_TEXT_3}
                                </Text>
                            </MediaQuery> 

                            {/*Discord Button*/}
                            <Center py="5rem">
                                <Button
                                    variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} size="lg"
                                    leftIcon={<FaDiscord/>}
                                >
                                    Join our Discord!
                                </Button>
                            </Center>

                            {/*Hero Image*/}
                            {/* <Image
                                src={CorpImage}
                                height={750}
                            /> */}
                        </BackgroundImage>
                    </Flex>
                </Center>
            </Container>
        </section>
    );

};

export default HeroSection;