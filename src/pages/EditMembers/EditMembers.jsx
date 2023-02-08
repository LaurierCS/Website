import { Title, Container, Button } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { MembersTable, MemberForm } from '@components';

const EditMembers = () => {
    return (
        <Container pt={5} size="xl">
            <Title order={1}>Members</Title>
            <Container my={30} fluid>
                <Button
                    onClick={() =>
                        openModal({
                            title: 'Add Member',
                            children: <MemberForm member={{}} isNew={true} />,
                        })
                    }
                >
                    Add Member
                </Button>
            </Container>
            <Container fluid>
                <MembersTable />
            </Container>
        </Container>
    );
};

export default EditMembers;
