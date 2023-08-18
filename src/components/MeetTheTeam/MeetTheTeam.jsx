import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { flushSync } from 'react-dom';
import {
    Flex,
    Box,
    Container,
    Title,
    Text,
    Avatar,
    SimpleGrid,
    createStyles,
} from '@mantine/core';
import { FratBoiDug } from '../../assets';
import { store } from '../../services/firebase';

const MEET_THE_TEAM_TITLE = '<Meet The Team />';
const MEET_THE_THEAM_PHRASE = 'Meet the masterminds behind the club!';

const memberStyles = createStyles((theme) => ({
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        [theme.fn.smallerThan('sm')]: {
            fontSize: 16,
        },
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 9999,

        [theme.fn.smallerThan('sm')]: {
            width: 80,
            height: 80,
        },
    },
}));

const sectionStyles = createStyles((theme) => ({
    dugContainer: {
        position: 'relative',
        maxWidth: 640,

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
    dug: {
        width: '100%',
    },
    dugName: {
        position: 'absolute',
        right: 0,
        bottom: '5%',
    },
}));

const Member = ({ name, role, picture }) => {
    const { classes } = memberStyles();
    return (
        <Flex align="center" gap={18}>
            <Box>
                <Avatar
                    src={picture}
                    alt={`${name}'s picture`}
                    className={classes.avatar}
                />
            </Box>
            <Box>
                <Text as="p" className={classes.text}>
                    {name}
                </Text>
                <Text as="p" className={classes.text}>
                    {role}
                </Text>
            </Box>
        </Flex>
    );
};

const Department = ({ name, members }) => {
    return (
        <Box my={64}>
            <Title
                order={2}
                sx={{ fontSize: 40, color: 'white', marginBottom: 32 }}
            >
                {name}
            </Title>
            <SimpleGrid
                verticalSpacing="xl"
                breakpoints={[
                    {
                        minWidth: 'lg',
                        cols: 3,
                        spacing: 120,
                    },
                    { minWidth: 'md', cols: 2, spacing: 80 },
                    { minWidth: 'sm', cols: 1 },
                ]}
            >
                {members.map((member, i) => (
                    <Member
                        key={`${name}-${i}`}
                        name={member.name}
                        role={member.role}
                        picture={member.picture}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
};

const MeetTheTeam = () => {
    const [presidents, setPresidents] = useState([]);
    const [admin, setAdmin] = useState([]);
    const [development, setDevelopment] = useState([]);
    const [events, setEvents] = useState([]);
    const [communication, setCommunication] = useState([]);
    const [communityMod, setCommunityMod] = useState([]);
    const [outreach, setOutreach] = useState([]);

    const { classes } = sectionStyles();

    useEffect(() => {
        (async () => {
            const q = query(collection(store, 'team'));
            const snapshot = await getDocs(q);

            const team = [];
            snapshot.forEach((doc) => team.push(doc.data()));

            // orgnaize team by department
            const presidentMembers = team.filter((member) =>
                member.departments.includes('president')
            );
            const adminMembers = team.filter((member) =>
                member.departments.includes('admin')
            );
            const developmentMembers = team.filter((member) =>
                member.departments.includes('development')
            );
            const eventsMembers = team.filter((member) =>
                member.departments.includes('events')
            );
            const commMembers = team.filter((member) =>
                member.departments.includes('comms')
            );
            const communityMembers = team.filter((member) =>
                member.departments.includes('community')
            );
            const outreachMembers = team.filter((member) =>
                member.departments.includes('outreach')
            );
            // put in flush sync to update the states in one batch
            // because this current function is async and it can cause multiple renders
            flushSync(() => {
                setPresidents(presidentMembers);
                setAdmin(adminMembers);
                setDevelopment(developmentMembers);
                setEvents(eventsMembers);
                setCommunication(commMembers);
                setCommunityMod(communityMembers);
                setOutreach(outreachMembers);
            });
        })();
    }, []);

    return (
        <section id="Team">
            <Container fluid px="6%">
                <Flex align="center" justify="center" gap={120}>
                    <Box>
                        <Title
                            variant="gradient"
                            order={1}
                            sx={{ fontSize: 48 }}
                        >
                            {MEET_THE_TEAM_TITLE}
                        </Title>
                        <Text sx={{ fontSize: 32 }}>
                            {MEET_THE_THEAM_PHRASE}
                        </Text>
                    </Box>
                    <Box className={classes.dugContainer}>
                        <img src={FratBoiDug} className={classes.dug} />
                        <Text className={classes.dugName} aria-hidden="true">
                            (and Dug)
                        </Text>
                    </Box>
                </Flex>
            </Container>
            <Container fluid px="6%">
                <Department name="Presidents" members={presidents} />
                <Department name="Admin" members={admin} />
                <Department name="Development" members={development} />
                <Department name="Events" members={events} />
                <Department name="Communication" members={communication} />
                <Department
                    name="Community Moderation"
                    members={communityMod}
                />
                <Department name="Outreach" members={outreach} />
            </Container>
        </section>
    );
};

export default MeetTheTeam;
