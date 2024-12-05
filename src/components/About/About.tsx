import React, { useRef } from "react";
import {
    Title,
    Text,
    Container,
    Grid,
    Flex,
    Center,
    createStyles,
    MantineTheme,
} from "@mantine/core";
import { PCDesign } from "@/assets";
import { motion, useInView } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';

const useStyles = createStyles((theme: MantineTheme) => ({
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
        [theme.fn.smallerThan(780)]: {
            fontSize: "1rem",
        },
    },

    highlight: {
        color: theme.colors.blue[4],
        fontWeight: 600,
        fontFamily: "monospace",
    },

    image: {
        width: "100%",
        maxWidth: "500px",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "scale(1.02)",
        },
        [theme.fn.smallerThan(1000)]: {
            maxWidth: "400px",
            marginBottom: "2rem",
        },
    },

    stats: {
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        marginTop: "2rem",
        
        "& > div": {
            flex: "1 1 auto",
        },
    },

    statValue: {
        fontSize: "2.5rem",
        fontWeight: 700,
        color: theme.colors.blue[4],
        fontFamily: "monospace",
    },

    statLabel: {
        fontSize: "1rem",
        color: theme.colors.gray[5],
    }
}));

const STATS = [
    { label: "Founded", value: "2012" },
    { label: "Projects Built", value: "50+" },
    { label: "Workshops Hosted", value: "30+" },
];

const About: React.FC = () => {
    const { classes } = useStyles();
    const titleRef = useRef(null);
    const isInView = useInView(titleRef, { once: true });

    return (
        <section id="About">
            <Container size="xl" my={50}>
                <Grid gutter={50}>
                    <Grid.Col md={6}>
                        <Center h="100%" mt={50}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    src={PCDesign}
                                    alt="Tech Illustration"
                                    className={classes.image}
                                />
                            </motion.div>
                        </Center>
                    </Grid.Col>
                    <Grid.Col md={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Title className={classes.title} mb={30} ref={titleRef}>
                                {isInView ? (
                                    <TypeAnimation
                                        sequence={[
                                            '{"About Us"}',
                                            1000,
                                            '<About Us />',
                                            1000,
                                        ]}
                                        wrapper="span"
                                        speed={50}
                                        repeat={0}
                                    />
                                ) : '<About Us />'}
                            </Title>
                            <Text className={classes.description} mb={30}>
                                The <span className={classes.highlight}>Laurier Computing Society (LCS)</span> is the official student-run club for computer science enthusiasts at Wilfrid Laurier University. At LCS, our mission is to empower students to thrive in STEM by offering unparalleled resources, hands-on experiences, and professional development opportunities.
                            </Text>
                            <Text className={classes.description} mb={30}>
                                Through review sessions, workshops, hackathons, networking events, and industry-leading guest speaker sessions, we bridge the gap between academia and the tech industry. Whether you're just starting your coding journey or you're an experienced developer, LCS provides the tools, connections, and inspiration to help you achieve your goals. Join us to shape the future of technology together!
                            </Text>
                            <div className={classes.stats}>
                                {STATS.map((stat) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <Text className={classes.statValue}>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                            >
                                                <CountUp
                                                    end={parseInt(stat.value) || 0}
                                                    suffix={stat.value.includes('+') ? '+' : ''}
                                                    duration={2}
                                                    start={0}
                                                    enableScrollSpy
                                                    scrollSpyOnce
                                                    scrollSpyDelay={200}
                                                    separator={stat.value.includes('+') ? ',' : ''}
                                                />
                                            </motion.div>
                                        </Text>
                                        <Text className={classes.statLabel}>
                                            {stat.label}
                                        </Text>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </Grid.Col>
                </Grid>
            </Container>
        </section>
    );
};

export default About;
