import { Group, Avatar, Text, Badge, ActionIcon } from '@mantine/core';
import { deleteMember } from '../../scripts/firebaseUtils';
import { openConfirmModal, openModal } from '@mantine/modals';
import { MemberForm } from '@components';
import moment from 'moment';
import { IconTrash, IconPencil, IconCopy } from '@tabler/icons-react';
import { getFirestore, doc } from 'firebase/firestore';
import firebaseApp, { DB_COLLECTION } from '../../scripts/config';

const MembersTableRow = ({ member }) => {
    const {
        firstName,
        lastName,
        email,
        position,
        picture,
        joinDate,
        middleName = '',
    } = member;

    const handleDelete = () => {
        openConfirmModal({
            title: 'Delete Member',
            centered: true,
            children: (
                <Text>
                    Are you sure you want to delete this member? This action is
                    destructive and data won't be restorable.
                </Text>
            ),
            labels: { confirm: 'Delete Member', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                // note: firebase db
                const db = getFirestore(firebaseApp);
                const docRef = doc(db, DB_COLLECTION, member.docId);
                await deleteMember(docRef);
            },
        });
    };

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
                                    children: <MemberForm member={member} />,
                                })
                            }
                        >
                            <IconPencil size={16} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon color="red" onClick={handleDelete}>
                            <IconTrash size={16} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        </>
    );
};

export default MembersTableRow;
