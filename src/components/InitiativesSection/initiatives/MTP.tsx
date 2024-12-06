import { Box, Text, List, ThemeIcon, createStyles, MantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
import { FaLightbulb, FaQuestionCircle, FaNetworkWired } from "react-icons/fa";

const useStyles = createStyles((theme: MantineTheme) => ({
    card: {
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: theme.radius.lg,
        padding: "2rem",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        height: "100%",

        [theme.fn.smallerThan("sm")]: {
            padding: "1.5rem",
        },
    },

    title: {
        fontSize: "1.8rem",
        fontWeight: 700,
        marginBottom: "1rem",
        color: "white",

        [theme.fn.smallerThan("sm")]: {
            fontSize: "1.4rem",
        },

        [theme.fn.smallerThan("xs")]: {
            fontSize: "1.2rem",
        },
    },

    description: {
        fontSize: "1.1rem",
        lineHeight: 1.6,
        color: theme.colors.gray[3],
        marginBottom: "1.5rem",

        [theme.fn.smallerThan("sm")]: {
            fontSize: "1rem",
            marginBottom: "1rem",
        },
    },

    listWrapper: {
        marginTop: 0,
    },

    listItem: {
        color: theme.colors.gray[3],
        fontSize: "1.1rem",
        lineHeight: 1.6,
        marginBottom: "0.5rem",

        [theme.fn.smallerThan("sm")]: {
            fontSize: "1rem",
        },
    },
}));

const MTP = () => {
    const { classes } = useStyles();

    return (
        <motion.div
            style={{ width: "100%", height: "100%" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <Box className={classes.card}>
                <Text className={classes.title}>🧑‍💻 Meet the Professionals</Text>
                <Text className={classes.description}>
                Join us for an exclusive opportunity to connect with professionals as we bring the coolest guest speakers from the tech industry. Hear from their experiences, learn about their journeys, make meaningful connections, and more!
                </Text>
                <div className={classes.listWrapper}>
                    <List spacing="md">
                        <List.Item 
                            icon={
                                <ThemeIcon color="blue" size={24} radius="xl">
                                    <FaLightbulb size={16} />
                                </ThemeIcon>
                            }
                            className={classes.listItem}
                        >
                            Get insider tips on job searching and interview preparation
                        </List.Item>
                        <List.Item 
                            icon={
                                <ThemeIcon color="blue" size={24} radius="xl">
                                    <FaQuestionCircle size={16} />
                                </ThemeIcon>
                            }
                            className={classes.listItem}
                        >
                            Participate in open Q&A sessions with industry experts
                        </List.Item>
                        <List.Item 
                            icon={
                                <ThemeIcon color="blue" size={24} radius="xl">
                                    <FaNetworkWired size={16} />
                                </ThemeIcon>
                            }
                            className={classes.listItem}
                        >
                            Build your professional network through one-on-one connections
                        </List.Item>
                    </List>
                </div>
            </Box>
        </motion.div>
    );
};

export default MTP;