import React from "react";
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

const useStyles = createStyles((theme: MantineTheme) => ({
    title: {
        [theme.fn.smallerThan(780)]: {
            fontSize: "2rem",
        },  
    },
    
    image: {
        [theme.fn.smallerThan(1000)]: {
            paddingBottom: "3rem",
        },
    },

    description: {
        fontSize: "1.5rem",

        [theme.fn.smallerThan(780)]: {
            fontSize: "1rem",
        },
    },
    
    grid: {
        [theme.fn.largerThan(2000)]: {

        },
    },
}));

const ABOUT_US_TITLE = "<About Us />";
const ABOUT_US_TEXT =
    "The Laurier Computing Society (LCS) is the official student-run club for computer science enthusiasts at Wilfrid Laurier University. At LCS, our mission is to empower students to thrive in STEM by offering unparalleled resources, hands-on experiences, and professional development opportunities. Through review sessions, workshops, hackathons, networking events, and industry-leading guest speaker sessions, we bridge the gap between academia and the tech industry. Whether you're just starting your coding journey or you're an experienced developer, LCS provides the tools, connections, and inspiration to help you achieve your goals. Join us to shape the future of technology together!";

const About: React.FC = () => {
    const { classes } = useStyles();
    return (
        <section id="About">
            <Container size="xl" my="md">
                <Grid grow gutter={5} gutterXl={100} className={classes.grid}>
                    <Grid.Col md={6}>
                        <img 
                            src={PCDesign}
                            style={{ width: "90%" }} 
                            className={classes.image}
                        />
                    </Grid.Col>
                    <Grid.Col md={6}>
                        <Center sx={{ width: "100%", height: "100%" }}>
                            <Flex
                                direction="column"
                                justify="center"
                                wrap="wrap"
                                gap="md"
                            >
                                <Title
                                    align="center"
                                    variant="gradient"
                                    order={1}
                                    sx={() => ({
                                        fontSize: "3rem",
                                    })}
                                    className={classes.title}
                                >
                                    {ABOUT_US_TITLE}
                                </Title>
                                <Text 
                                    align="center" 
                                    color="white"
                                    className={classes.description}
                                >
                                    {ABOUT_US_TEXT}
                                </Text>
                            </Flex>
                        </Center>
                    </Grid.Col>
                </Grid>
            </Container>
        </section>
    );
};

export default About;
