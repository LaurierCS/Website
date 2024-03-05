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
    "The Laurier Computing Society is the official student-run club for \
computer science enthusiasts at Wilfrid Laurier University. Our mission is to empower students \
to reach their full potential in STEM by providing a wealth of resources and opportunities for \
academic and professional development. Our organization is dedicated to creating a vibrant community of tech-savvy students \
who are passionate about learning, creating, and innovating. Our focus is to provide members \
with hands-on experience through workshops, hackathons, networking events, and guest speaker \
sessions. Whether you're a beginner or a seasoned pro, the Laurier Computing Society has \
something for everyone. Join us today and be a part of the future of technology!";

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
