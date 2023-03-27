import { Button, Container, Divider, Group, Title } from '@mantine/core';
import { getDocs, collection, query } from 'firebase/firestore';
import { firestore } from '@scripts/firebase';
import { useState } from 'react';

const AdminSettings = () => {
    const [members, setMembers] = useState([]);

    const getMembers = async () => {
        const colRef = collection(firestore, 'team');
        const q = query(colRef);
        const snapshot = await getDocs(q);
        const _members = [];
        snapshot.forEach((doc) => {
            _members.push(doc.data());
        });

        setMembers([..._members]);

        console.log(_members);
    };

    return (
        <Container>
            <Title>Settings</Title>
            <Divider />
            <Container>
                <Title order={2}>Migrate Schema</Title>
                <Group>
                    <Button onClick={getMembers}>Get</Button>
                    <Button onClick={() => console.log(members)}>Show</Button>
                </Group>
            </Container>
        </Container>
    );
};

export default AdminSettings;
