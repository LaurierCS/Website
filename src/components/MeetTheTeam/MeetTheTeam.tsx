import { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { flushSync } from "react-dom";
import {
    Flex,
    Box,
    Container,
    Title,
    Text,
    Avatar,
    SimpleGrid,
    createStyles,
    MantineTheme,
} from "@mantine/core";
import { FratBoiDug } from "../../assets";
import { store } from "../../services/firebase";

const MEET_THE_TEAM_TITLE = "<Meet The Team />";
const MEET_THE_THEAM_PHRASE = "Meet the masterminds behind the club!";

const memberStyles = createStyles((theme: MantineTheme) => ({
    textName: {
        color: "white",
        fontWeight: "bold",
        fontSize: 24,
        [theme.fn.smallerThan(780)]: {
            fontSize: "1rem",
        },
    },

    textRole: {
        color: "white",
        fontSize: 24,
        [theme.fn.smallerThan(780)]: {
            fontSize: "1rem",
        },
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 9999,

        [theme.fn.smallerThan("sm")]: {
            width: 80,
            height: 80,
        },
    },
}));

const sectionStyles = createStyles((theme: MantineTheme) => ({
    title: {
        [theme.fn.smallerThan(780)]: {
            fontSize: "2rem",
        },
    },

    description: {
        [theme.fn.smallerThan(780)]: {
            paddingTop: "1rem",
            fontSize: "1rem",
            marginBottom: "-6rem",
            marginTop: "1rem",
        },
    },

    dugContainer: {
        position: "relative",
        maxWidth: 640,

        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    dug: {
        width: "100%",
    },

    dugName: {
        position: "absolute",
        right: 0,
        bottom: "5%",
    },
}));

const deptStyles = createStyles((theme) => ({
    deptTitle: {
        [theme.fn.smallerThan(780)]: {
            fontSize: "1.5rem",
        },
    },
}));

interface MemberProps {
    name: string;
    role: string;
    picture: string;
}

const Member: React.FC<MemberProps> = ({ name, role, picture }) => {
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
                <p className={classes.textName}>{name}</p>
                <p className={classes.textRole}>{role}</p>
            </Box>
        </Flex>
    );
};

interface DepartmentProps {
    name: string;
    members: MemberProps[];
}

const Department: React.FC<DepartmentProps> = ({ name, members }) => {
    const { classes } = deptStyles();
    return (
        <Box my={64}>
            <Title
                order={2}
                sx={{ fontSize: 40, color: "white", marginBottom: 32 }}
                className={classes.deptTitle}
            >
                {name}
            </Title>
            <SimpleGrid
                verticalSpacing="xl"
                breakpoints={[
                    {
                        minWidth: "lg",
                        cols: 3,
                        spacing: 120,
                    },
                    { minWidth: "md", cols: 2, spacing: 80 },
                    { minWidth: "sm", cols: 1 },
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

export interface TeamMember {
    name: string;
    role: string;
    picture: string;
    departments: string[];
}

const MeetTheTeam: React.FC = () => {
    const [presidents, setPresidents] = useState<TeamMember[]>([]);
    const [admin, setAdmin] = useState<TeamMember[]>([]);
    const [development, setDevelopment] = useState<TeamMember[]>([]);
    const [events, setEvents] = useState<TeamMember[]>([]);
    const [communication, setCommunication] = useState<TeamMember[]>([]);
    const [communityMod, setCommunityMod] = useState<TeamMember[]>([]);
    const [outreach, setOutreach] = useState<TeamMember[]>([]);

    const { classes } = sectionStyles();

    useEffect(() => {
        (async () => {
            const q = query(
                collection(store, "team"),
                where("is_public", "==", true)
            );
            const snapshot = await getDocs(q);

            const team: TeamMember[] = [];
            snapshot.forEach((doc) => {
                team.push(doc.data() as TeamMember);
            });

            const presidentMembers = team.filter((member) =>
                member.departments.includes("president")
            );
            const adminMembers = team.filter((member) =>
                member.departments.includes("admin")
            );
            const developmentMembers = team.filter((member) =>
                member.departments.includes("development")
            );
            const eventsMembers = team.filter((member) =>
                member.departments.includes("events")
            );
            const commMembers = team.filter((member) =>
                member.departments.includes("comms")
            );
            const communityMembers = team.filter((member) =>
                member.departments.includes("community")
            );
            const outreachMembers = team.filter((member) =>
                member.departments.includes("outreach")
            );

            const prefix = "VP of";
            const sort = (a: TeamMember, b: TeamMember) => {
                if (a.role.startsWith(prefix) && !b.role.startsWith(prefix)) {
                    return -1;
                }
                if (!a.role.startsWith(prefix) && b.role.startsWith(prefix)) {
                    return 1;
                }
                return 0;
            };
            adminMembers.sort(sort);
            developmentMembers.sort(sort);
            eventsMembers.sort(sort);
            commMembers.sort(sort);
            communityMembers.sort(sort);
            outreachMembers.sort(sort);

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
            <Container fluid px="6%" my={150}>
                <Flex align="center" justify="center" gap={120}>
                    <Box>
                        <Title
                            variant="gradient"
                            order={1}
                            sx={{ fontSize: 48 }}
                            className={classes.title}
                        >
                            {MEET_THE_TEAM_TITLE}
                        </Title>
                        <Text
                            sx={{ fontSize: 32 }}
                            className={classes.description}
                        >
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
            <Container fluid px="10%">
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
