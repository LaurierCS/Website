import { Container, Title, Text, Flex, Box, createStyles, MantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
import ReviewSessions from "./initiatives/ReviewSessions";
import MTP from "./initiatives/MTP";
import PODS from "./initiatives/PODS";
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const useStyles = createStyles((theme: MantineTheme) => ({
    wrapper: {
        position: 'relative',
        overflow: 'hidden',
    },

    title: {
        fontSize: "3.5rem",
        fontFamily: "monospace",
        background: theme.fn.gradient({ from: "blue.4", to: "cyan.4" }),
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        [theme.fn.smallerThan(780)]: {
            fontSize: "2rem",
        },
    },

    description: {
        fontSize: "1.2rem",
        lineHeight: 1.6,
        color: theme.colors.gray[3],
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
        [theme.fn.smallerThan(780)]: {
            fontSize: "1rem",
            padding: "0 1rem",
        },
    },

    initiativesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2rem",
        width: "100%",
        alignItems: "stretch",
        
        "& > div": {
            height: "100%",
            display: "flex",
        },
        
        [theme.fn.smallerThan("md")]: {
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "1rem",
            padding: 0,
        },
    },

    highlight: {
        color: theme.colors.blue[4],
        fontWeight: 600,
        fontFamily: "monospace",
    },

    titleWrapper: {
        width: "800px",
        margin: "0 auto",
        textAlign: "left",
        transition: "all 0.3s ease",
        paddingLeft: "250px",
        
        "&.centered": {
            textAlign: "center",
            paddingLeft: 0,
        },

        [theme.fn.smallerThan(780)]: {
            width: "300px",
            paddingLeft: "50px",
        },
    },
}));

const SECTION_TITLE = "<Our Initiatives />";
const SECTION_PHRASE = "Empowering students through hands-on experience and real-world projects. Build your portfolio, expand your network, and grow your skills with our diverse range of programs.";

const InitiativesSection: React.FC = () => {
    const { classes } = useStyles();
    const titleRef = useRef(null);
    const isInView = useInView(titleRef, { once: true });

    return (
        <section id="Initiatives" style={{ width: "100%" }}>
            <Container size="xl" my={100} px={{ base: "1rem", sm: "2rem" }} style={{ width: "100%" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <Title className={classes.title} align="center" mb={30} ref={titleRef}>
                        {isInView ? (
                            <TypeAnimation
                                sequence={[
                                    '<Our Initiatives\u00A0/>',
                                    1000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={0}
                            />
                        ) : '<Our Initiatives\u00A0/>'}
                    </Title>
                    <Text className={classes.description} mb={50}>
                        {SECTION_PHRASE}
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{ height: "100%" }}
                >
                    <div className={classes.initiativesGrid}>
                        <ReviewSessions />
                        <MTP />
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};

export default InitiativesSection;
