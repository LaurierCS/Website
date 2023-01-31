import './HeroSection.css';
import { Title, Text, BackgroundImage, Container, Flex, Image, Center, createStyles, Button } from "@mantine/core";
import { CorpImage, IconLogo } from '@assets';
import {FaDiscord} from "react-icons/fa";

const HERO_SECTION_TITLE = '<Laurier Computing Society/>';
const HERO_SECTION_HOOK = "Wilfrid Laurier University's official student operated computer science society.";
const HERO_SECTION_TEXT = "Some other mini text that talks about us lol";

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
                            <Center>
                                <Image
                                    src={IconLogo}
                                    width={120}
                                    height={90}
                                    align="center"
                                    pb="4rem"
                            />
                            </Center>

                            {/*Hero Text*/}
                            <Title pb='10rem' align="center" size={55} fw={700} variant="gradient" order={1}>
                                {HERO_SECTION_TITLE}
                            </Title>
                            <Text align="center" fz="xl" fw={500} c="white">
                                {HERO_SECTION_HOOK}
                            </Text>
                            <Text pt="2rem" align="center" fz="xl" fw={300} c="white">
                                {HERO_SECTION_TEXT}
                            </Text>

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
                            <Image
                                src={CorpImage}
                                height={750}
                            />
                        </BackgroundImage>
                    </Flex>
                </Center>
            </Container>
        </section>
    );

};

export default HeroSection;