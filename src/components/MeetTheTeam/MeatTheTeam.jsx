import { Flex, Box, Container, Title, Text } from '@mantine/core';
import { FratBoiDug } from '../../assets';
import { store } from '../../services/firebase';
import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';

const MEET_THE_TEAM_TITLE = '<Meet The Team />';
const MEET_THE_THEAM_PHRASE = 'Meet the masterminds behind the club!';

const MeetTheTeam = () => {
    const [admin, setAdmin] = useState([]);
    const [development, setDevelopment] = useState([]);
    const [events, setEvents] = useState([]);
    const [communication, setCommunication] = useState([]);
    const [communityMod, setCommunityMod] = useState([]);
    const [outreach, setOutreach] = useState([]);

    useEffect(() => {
        (async () => {
            const q = query(collection(store, 'team'));
            const snapshot = await getDocs(q);

            const team = [];
            snapshot.forEach((doc) => team.push(doc.data()));

            console.log(team);
        })();
    }, []);

    return (
        <section id="meetTheTeam">
            <Container fluid>
                <Flex align="center" justify="space-around">
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
                    <Box sx={{ maxWidth: '640px' }}>
                        <img src={FratBoiDug} style={{ width: '100%' }} />
                    </Box>
                </Flex>
            </Container>
        </section>
    );
};

export default MeetTheTeam;
