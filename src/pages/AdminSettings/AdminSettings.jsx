import { Container, Divider, Title } from '@mantine/core';

const AdminSettings = () => {
    return (
        <Container>
            <Title>Settings</Title>
            <Divider />
            <Container>
                <Title order={2}>Migrate Schema</Title>
            </Container>
        </Container>
    );
};

export default AdminSettings;
