import {
    Text,
    BackgroundImage,
    Container,
    Flex,
    Image,
    Center,
    MediaQuery,
    Button,
    createStyles,
    MantineTheme,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useViewportSize } from '@mantine/hooks';
import { IconLogo } from "@/assets";
import { FaDiscord } from "react-icons/fa";
import "./HeroSection.css";

const HERO_SECTION_TITLE = "<Laurier Computing Society\u00A0/>";
const HERO_SECTION_HOOK =
    "The official Computer Science club at Wilfrid Laurier University!";
const HERO_SECTION_TEXT_1 = "Student Lead";
const HERO_SECTION_TEXT_2 = "Established 2012";
const HERO_SECTION_TEXT_3 = "Career Driven";


const useStyles = createStyles((theme: MantineTheme) => ({
    container: {
        width: "100%",
        maxWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        [theme.fn.smallerThan(340)]: {
            padding: "1rem",
        },
        [theme.fn.largerThan(2000)]: {
            padding: "0",
        }
    },

    title: {
        fontSize: 50,
        width: "100%",
        textAlign: "center",
        [theme.fn.smallerThan(780)]: {
            fontSize: "2rem",
            padding: "0 1rem",
        },
    },

    logo: {
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "scale(1.05) rotate(360deg)",
            filter: "brightness(1.2)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
        [theme.fn.smallerThan(340)]: {
            display: "none",
        },
    },

    glitchContainer: {
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 1rem",
        overflow: "hidden",
    },

    discordButton: {
        backgroundColor: "#5865F2",
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(88, 101, 242, 0.25)",
            backgroundColor: "#4752C4"
        },
        "&:active": {
            transform: "translateY(0)",
        }
    },
}));
const HeroSection: React.FC = () => {
    const { classes } = useStyles();
    const { height } = useViewportSize();

    return (
        <motion.section
            style={{ height: "100vh" }}
            id="top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <Container size="xl" className={classes.container}>
                <Center style={{ width: "100%", height: "100%" }}>
                    <Flex
                        direction="column"
                        justify="center"
                        align="center"
                        wrap="wrap"
                        gap="md"
                        style={{ width: "100%" }}
                    >
                        <BackgroundImage src="" style={{ width: "100%" }}>
                            <MediaQuery
                                query="(max-width: 768px)"
                                styles={{
                                    height: "0.5rem",
                                    marginBottom: "2rem",
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                        duration: 0.5,
                                        delay: 0.3
                                    }}
                                >
                                    <Center>
                                        <Image
                                            src={IconLogo}
                                            width={120}
                                            height={90}
                                            pb="2rem"
                                            className={classes.logo}
                                        />
                                    </Center>
                                </motion.div>
                            </MediaQuery>

                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className={classes.glitchContainer}
                            >
                                <div className="glitch-container">
                                    <div className="stack" style={{ "--stacks": 3 } as React.CSSProperties}>
                                        <span style={{ "--index": 0 } as React.CSSProperties}>{HERO_SECTION_TITLE}</span>
                                        <span style={{ "--index": 1 } as React.CSSProperties}>{HERO_SECTION_TITLE}</span>
                                        <span style={{ "--index": 2 } as React.CSSProperties}>{HERO_SECTION_TITLE}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <MediaQuery
                                query="(max-width: 768px)"
                                styles={{ fontSize: "1.2rem" }}
                            >
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                >
                                    <Text align="center" fz="xl" fw={500} c="white">
                                        {HERO_SECTION_HOOK}
                                    </Text>
                                </motion.div>
                            </MediaQuery>

                            <MediaQuery
                                query="(max-width: 768px)"
                                styles={{ fontSize: "1rem" }}
                            >
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.9 }}
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
                                </motion.div>
                            </MediaQuery>

                            <Center py="5rem">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 1.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component="a"
                                        href="https://discord.gg/lauriercs"
                                        size="lg"
                                        leftIcon={<FaDiscord />}
                                        className={classes.discordButton}
                                        target="_blank"
                                        rel="external noreferrer"
                                    >
                                        Join our Discord!
                                    </Button>
                                </motion.div>
                            </Center>
                        </BackgroundImage>
                    </Flex>
                </Center>
            </Container>
        </motion.section>
    );
};

export default HeroSection;
