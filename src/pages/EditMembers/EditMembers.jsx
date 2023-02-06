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
    Button,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconTrash, IconPencil, IconCopy } from '@tabler/icons-react';
import { CustomizableModal, MemberForm } from '@components';
import moment from 'moment';

const MembersTableRow = ({
    firstName,
    lastName,
    middleName = '',
    picture,
    email,
    position,
    joinDate,
}) => {
    return (
        <>
            <tr>
                <td>
                    <Group spacing="sm">
                        <Avatar size={30} src={picture} radius={30} />
                        <Text truncate size="sm" weight={500}>
                            {[firstName, middleName, lastName].join(' ')}
                        </Text>
                    </Group>
                </td>

                <td>
                    <Badge>{position}</Badge>
                </td>
                <td>
                    <Group position="apart">
                        <Text size="sm">{email}</Text>
                        <ActionIcon>
                            <IconCopy size={16} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
                <td>
                    <Text>{moment(joinDate).format('DD/MM/YY')}</Text>
                </td>
                <td>
                    <Group spacing={0} position="right">
                        <ActionIcon
                            onClick={() =>
                                openModal({
                                    title: 'Edit Member',
                                    children: (
                                        <MemberForm
                                            firstName={firstName}
                                            lastName={lastName}
                                            middleName={middleName}
                                            email={email}
                                            position={position}
                                            joinDate={joinDate}
                                            picture={picture}
                                        />
                                    ),
                                })
                            }
                        >
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
        return <MembersTableRow {...item} key={item.email} />;
    });

    return (
        <ScrollArea>
            <Table verticalSpacing="sm">
                <thead>
                    <tr>
                        <th>Member</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Join Date</th>
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
        joinDate: moment().toDate(), // placeholder timestamp
    },
    {
        firstName: 'Juan',
        middleName: 'Carlos',
        lastName: 'Wu',
        position: 'Dev',
        email: 'wuch6840-2@mylaurier.ca',
        picture:
            'https://firebasestorage.googleapis.com/v0/b/lcs-frontpage.appspot.com/o/team%2Feijf7UomgQxFcqdiv7jM.jpg?alt=media&token=695f530a-7815-4918-aeae-12a8f47d6620',
        joinDate: moment().toDate(), // placeholder timestamp
    },
];

const EditMembers = () => {
    return (
        <Container pt={5}>
            <Title order={1}>Members</Title>
            <Container my={30}>
                <Button
                    onClick={() =>
                        openModal({
                            title: 'Add Member',
                            children: <MemberForm />,
                        })
                    }
                >
                    Add Member
                </Button>
            </Container>
            <Container fluid>
                <MembersTable data={mockData} />
            </Container>
        </Container>
    );
};

export default EditMembers;
