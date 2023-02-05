import {
    Title,
    Container,
    Group,
    Avatar,
    Text,
    Badge,
    ActionIcon,
    ScrollArea,
    Table,
} from '@mantine/core';
import { IconTrash, IconPencil, IconCopy } from '@tabler/icons-react';

const MembersTableRow = ({ firstName, lastName, picture, email, position }) => {
    return (
        <>
            <tr>
                <td>
                    <Group spacing="sm">
                        <Avatar size={30} src={picture} radius={30} />
                        <Text size="sm" weight={500}>
                            {`${firstName} ${lastName}`}
                        </Text>
                    </Group>
                </td>

                <td>
                    <Badge>{position}</Badge>
                </td>
                <td>
                    <Group>
                        <Text size="sm">{email}</Text>
                        <ActionIcon>
                            <IconCopy size={16} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
                <td>
                    <Group spacing={0} position="right">
                        <ActionIcon>
                            <IconPencil size={16} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon color="red">
                            <IconTrash size={16} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        </>
    );
};

const MembersTable = ({ data }) => {
    const rows = data.map((item) => {
        return (
            <MembersTableRow
                {...item}
                key={`${item.firstName}-${item.lastName}`}
            />
        );
    });

    return (
        <ScrollArea>
            <Table verticalSpacing="sm">
                <thead>
                    <tr>
                        <th>Member</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
};

const mockData = [
    {
        firstName: 'Juan',
        lastName: 'Wu',
        position: 'Dev',
        email: 'wuch6840@mylaurier.ca',
        picture:
            'https://firebasestorage.googleapis.com/v0/b/lcs-frontpage.appspot.com/o/team%2Feijf7UomgQxFcqdiv7jM.jpg?alt=media&token=695f530a-7815-4918-aeae-12a8f47d6620',
    },
];

const EditMembers = () => {
    return (
        <Container>
            <Title order={1}>Members</Title>
            <Container fluid>
                <MembersTable data={mockData} />
            </Container>
        </Container>
    );
};

export default EditMembers;
