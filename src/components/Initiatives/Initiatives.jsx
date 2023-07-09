import './Initiatives.css';
import {createStyles, Image, Accordion, Grid, Container, Text} from "@mantine/core";

const INITIATIVES_TITLE = "<Our Initiatives />";
const INITIATIVES_TEXT = "At LCS, we understand how important building a good portfolio is. That's why we give students the opporunities to do so!";
const INITIATIVES_LABEL = "Check out our current projects:";
const PODS_TITLE = "LCS PODS";
const PODS_SUMMARY = "A 3-month long program that groups students into teams to work on a software development project. The goal is to teach students the crucial skills that they'd need to start their careers, as well as create a community of passionate developers."
const TEMP_PODS_DETAILS = "PODS has 5 major development phases - Brainstorming, Design, Prototyping, MVP, and Launch. PODS teams are curated based on skill level, based on your application’s test. Our goal is for everyone to learn - not just one hardcarry. Each POD will work on one project over the course of the next three months. These projects can be websites, video games, machine learning models, or whatever else the team is interested in!";
const PP_TITLE = "Project Program";
const PP_SUMMARY = "A collaboration with Wilfrid Laurier University’s LCS and University of Waterloo’s CSC and DSC, where students participate in a month-long hackathon!";
const TEMP_PP_DETAILS = "something something something stuff stuff stuff super cool stuff";

/*const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.sm,
      },
    
    item: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        border: `${rem(1)} solid transparent`,
        position: 'relative',
        zIndex: 0,
        transition: 'transform 150ms ease',
    
        '&[data-active]': {
          transform: 'scale(1.03)',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          boxShadow: theme.shadows.md,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
          borderRadius: theme.radius.md,
          zIndex: 1,
        },
    },

    chevron: {
        '&[data-rotate]': {
          transform: 'rotate(-90deg)',
        },
    },
}));
*/
const Initiatives = () => {
    //const { classes } = useStyles();

    return (
        <section id="Initiatives">
            <Container size="xs" px="xs">
                <Text align="center" order={1}>
                    {INITIATIVES_TITLE}
                </Text>
                <Text align="center">
                    {INITIATIVES_TEXT}
                </Text>
                <Text align="center">
                    {INITIATIVES_LABEL}
                </Text>
                
                <Accordion variant="separated" radius="md" order={6} /*classNames={classes} className={classes.item}*/>
                    <Accordion.Item value="pods" align="center" >
                        <Accordion.Control>
                            <Grid columns={50}>
                                <Grid.Col span={35} align="right">
                                    {PODS_TITLE}
                                </Grid.Col>
                                <Grid.Col span={35} align="right">
                                    {PODS_SUMMARY}
                                </Grid.Col>
                                <Grid.Col span={15} align="left">

                                </Grid.Col>

                                <Accordion.Panel>
                                    <Grid.Col span={35} align="right">
                                        {TEMP_PODS_DETAILS}
                                    </Grid.Col>
                                    <Grid.Col span={15} align="left">

                                    </Grid.Col>
                                </Accordion.Panel>
                            </Grid>
                        </Accordion.Control>
                    </Accordion.Item>
                    
                    <Accordion.Item value="pp" align="center">
                        <Accordion.Control>
                            <Grid columns={50}>
                                <Grid.Col span={35} align="left">
                                    {PP_TITLE}
                                </Grid.Col>
                                <Grid.Col span={35} align="left">
                                    {PP_SUMMARY}
                                </Grid.Col>
                                <Grid.Col span={15} align="right">

                                </Grid.Col>

                                <Accordion.Panel>
                                    <Grid.Col span={35} align="left">
                                        {TEMP_PP_DETAILS}
                                    </Grid.Col>
                                    <Grid.Col span={15} align="right">

                                    </Grid.Col>
                                </Accordion.Panel>
                            </Grid>
                        </Accordion.Control>
                    </Accordion.Item>
                </Accordion>

            </Container>
        </section>
    );
};

export default Initiatives;