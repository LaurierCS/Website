import React from 'react';
import { Title, Accordion, createStyles, Flex } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    item: {
        backgroundColor: '#2C3844',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: theme.colors.blue[4],

        '&[data-active]': {
            border: 'none',
            backgroundColor: '#2C3844',
        },
    },
    control: {
        color: 'white',
        fontWeight: 'bold',
    },
    accordion: {
        width: '65%',

        [theme.fn.smallerThan('sm')]: {
            width: '85%',
        },
    },
    emojiContainer: {
        marginRight: '1rem',
    },
    panel: {
        color: '#E7EBF5',
        fontWeight: 'bold',
        position: 'relative',
        zIndex: 2,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        overflow: 'hidden',

        ['&::before']: {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.45,
            background: theme.fn.gradient({
                from: 'blue.4',
                to: 'accents.1',
            }),
            zIndex: -1,
        },
    },
}));

const FAQ_TITLE = '<Frequently Asked Questiens />';

const FAQ = () => {
    const { classes } = useStyles();
    return (
        <section id="FAQ">
            <div className="Accord">
                <Title
                    order={1}
                    sx={{ fontSize: '3rem' }}
                    align="center"
                    variant="gradient"
                    mb="2rem"
                >
                    {FAQ_TITLE}
                </Title>
                <Flex justify="center">
                    <Accordion
                        variant="separated"
                        defaultValue="customization"
                        className={classes.accordion}
                    >
                        <Accordion.Item value="who" className={classes.item}>
                            <Accordion.Control className={classes.control}>
                                <span className={classes.emojiContainer}>
                                    🐦
                                </span>
                                Who are we?
                            </Accordion.Control>
                            <Accordion.Panel className={classes.panel}>
                                Laurier Computing Society is the official
                                student operated society of Wilfrid Laurier
                                University’s Computer Science department. <br />
                                <br />
                                We strive to help students realise their
                                potential in STEM by enriching their academic
                                and professional development. <br />
                                <br />
                                Our objective is to create initiatives and
                                events to involve students in tech to challenge
                                and improve their skills, and foster a sense of
                                community.
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item
                            value="where-type"
                            className={classes.item}
                        >
                            <Accordion.Control className={classes.control}>
                                <span className={classes.emojiContainer}>
                                    ⏰
                                </span>
                                What type of events do you run?
                            </Accordion.Control>
                            <Accordion.Panel className={classes.panel}>
                                We run a wide range of events. We have our
                                signature 'Meet the Professionals' events that
                                let students and professionals connect and get
                                information about the industry. <br />
                                <br />
                                We also run events such as our “Learn a Tool
                                Series”, where we showcase and preview different
                                popular technologies used in the industry that
                                can help students personally, in projects, or in
                                their careers. <br />
                                <br />
                                We also run fun events, such as regular socials,
                                gaming events, and competitions! Stay tuned on
                                our socials to learn more!
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="how" className={classes.item}>
                            <Accordion.Control className={classes.control}>
                                <span className={classes.emojiContainer}>
                                    🤓
                                </span>{' '}
                                How do I become an official member?
                            </Accordion.Control>
                            <Accordion.Panel className={classes.panel}>
                                You don't have to do anything special! Just
                                attend 2 of our events a term to be considered a
                                part of the club! <br />
                                <br />
                                If you want to be a part of the executive team,
                                feel free to contact any of the executive
                                members for more information!
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item
                            value="where-do"
                            className={classes.item}
                        >
                            <Accordion.Control className={classes.control}>
                                <span className={classes.emojiContainer}>
                                    💻
                                </span>
                                Where do you upload content online?
                            </Accordion.Control>
                            <Accordion.Panel className={classes.panel}>
                                We post our content typically on Twitch as
                                livestreams and post the edited version onto our
                                YouTube page for viewing. <br />
                                <br />
                                This content includes review sessions,
                                workshops, meet the professionals, information
                                on the coop process, and more! <br />
                                <br />
                                We also give updates on events to upcoming
                                events on our Instagram, Discord and other
                                socials.
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="are" className={classes.item}>
                            <Accordion.Control className={classes.control}>
                                <span className={classes.emojiContainer}>
                                    💰
                                </span>
                                Are there any giveways currently?
                            </Accordion.Control>
                            <Accordion.Panel className={classes.panel}>
                                We do monthly money gift card giveaways on our
                                socials, so follow us there! <br />
                                <br />
                                Make sure to attend our virtual and in-person
                                events to get a chance to enter giveways or
                                competitions to earn rewards!
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="noidea" className={classes.item}>
                            <Accordion.Control className={classes.control}>
                                <span className={classes.emojiContainer}>
                                    🗿
                                </span>{' '}
                                What else does LCS do?
                            </Accordion.Control>
                            <Accordion.Panel className={classes.panel}>
                                We host a yearly hackathon called HawkHacks that
                                includes $20k+ in prizes for the winners and has
                                contestants from all over the world. <br />
                                <br />
                                We also host LCS PODS which aims to help student
                                start off their career with a solid project in
                                their portfolio. <br />
                                <br />
                                In addition, we run Project Program, in
                                collaboration with the University Of Waterloo's
                                Computer Science and Data Science Clubs, to help
                                students pair up with mentors and create a
                                project to compete with others for prizes!
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Flex>
            </div>
        </section>
    );
};

export default FAQ;
