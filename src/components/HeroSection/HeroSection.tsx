import {
    Title,
    Text,
    BackgroundImage,
    Container,
    Flex,
    Image,
    Center,
    MediaQuery,
    Button,
    createStyles,
} from '@mantine/core';
import { IconLogo } from '@assets';
import { FaDiscord } from 'react-icons/fa';

const HERO_SECTION_TITLE = '<Laurier Computing Society />';
const HERO_SECTION_HOOK =
    'The official Computer Science club at Wilfrid Laurier University!';
const HERO_SECTION_TEXT_1 = 'Student Lead';
const HERO_SECTION_TEXT_2 = 'Established 2012';
const HERO_SECTION_TEXT_3 = 'Career Driven';


const useStyles = createStyles((theme) => ({
    container: {
        [theme.fn.smallerThan('340')]: {
            padding: '0',
        },  

        [theme.fn.largerThan('2000')]: {
            paddingTop: '20rem',
        }
    },

    title: {
        fontSize: 50,
        [theme.fn.smallerThan('780')]: {
            fontSize: '2rem',
        },
    },

    logo: {
        '&:hover': {
            WebkitAnimation: 'spin 4s linear infinite',
            MozAnimation: 'spin 4s linear infinite',
            animation: 'spin 4s linear infinite',
        },

        '@-moz-keyframes spin': {
            '100%': {
                '-moz-transform': 'rotate(360deg)',
            },
        },

        '@-webkit-keyframes spin': {
            '100%': {
                '-webkit-transform': 'rotate(360deg)',
            },
        },

        '@keyframes spin': {
            '100%': {
                '-webkit-transform': 'rotate(360deg)',
                transform: 'rotate(360deg)',
            },
        },
        [theme.fn.smallerThan('340')]: {
            display: 'none',
        },
    },
}));

const HeroSection = () => {
    const { classes } = useStyles();
    return (
        <section id="top">
            <Container py="8rem" size="xl" my="md" className={classes.container}>
                <Center style={{ width: '100%', height: '100%' }}>
                    <Flex
                        direction="column"
                        justify="center"
                        wrap="wrap"
                        gap="md"
                    >
                        <BackgroundImage src="">
                            <MediaQuery
                                query="(max-width: 768px)"
                                styles={{
                                    height: '0.5rem',
                                    marginBottom: '2rem',
                                }}
                            >
                                <Center>
                                    <Image
                                        src={IconLogo}
                                        width={120}
                                        height={90}
                                        align="center"
                                        pb="2rem"
                                        className={classes.logo}
                                    />
                                </Center>
                            </MediaQuery>

                            <Title
                                pb="3rem"
                                align="center"
                                fw={700}
                                variant="gradient"
                                order={1}
                                className={classes.title}
                            >
                                {HERO_SECTION_TITLE}
                            </Title>
           
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
                                <Text
                                    pt="2rem"
                                    align="center"
                                    fz="xl"
                                    fw={300}
                                    c="white"
                                >
                                    {HERO_SECTION_TEXT_1}
                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                    {HERO_SECTION_TEXT_2}
                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                    {HERO_SECTION_TEXT_3}
                                </Text>
                            </MediaQuery>

                            {/*Discord Button*/}
                            <Center py="5rem">
                                <Button
                                    component="a"
                                    href="https://discord.gg/lauriercs"
                                    size="lg"
                                    leftIcon={<FaDiscord />}
                                    style={{ backgroundColor: '#6998DF' }}
                                    target="_blank"
                                    rel="external noreferrer"
                                >
                                    Join our Discord!
                                </Button>
                            </Center>
                        </BackgroundImage>
                    </Flex>
                </Center>
            </Container>
        </section>
    );
};

export default HeroSection;
