import {
    Group,
    Avatar,
    Text,
    Badge,
    ActionIcon,
    ScrollArea,
    Table,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { MemberForm } from '@components';
import moment from 'moment';
import { IconTrash, IconPencil, IconCopy } from '@tabler/icons-react';
import {
    getFirestore,
    query,
    collection,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import firebaseApp from '../../scripts/config.js';
import { useEffect, useState } from 'react';

const MembersTableRow = ({ member, onDelete }) => {
    const {
        firstName,
        lastName,
        email,
        position,
        picture,
        joinDate,
        middleName = '',
    } = member;

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
                                    children: <MemberForm {...member} />,
                                })
                            }
                        >
                            <IconPencil size={16} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon
                            color="red"
                            onClick={() => {
                                const confirmed = onDelete(member);

                                if (confirmed) {
                                    // update table
                                } else {
                                    // do nothing
                                }
                            }}
                        >
                            <IconTrash size={16} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        </>
    );
};

const MembersTable = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        (async () => {
            // get data from backend
            const db = getFirestore(firebaseApp);
            const colRef = collection(db, 'members');
            const q = query(colRef);
            const snapshot = await getDocs(q);

            // fill members
            const allMembers = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const timestamp = new Timestamp(
                    data.joinDate.seconds,
                    data.joinDate.nanoseconds
                );
                data.joinDate = timestamp.toDate();
                data.docId = doc.id; // might need the id for update/delete
                allMembers.push(data);
            });

            setMembers([...allMembers]);
        })();
    }, []);

    const rows = members.map((memberData) => {
        // at the moment we are using the name to create the key for reach row
        // however, using the email should be better since each email is guarantee to be unique.
        return (
            <MembersTableRow
                member={memberData}
                onDelete={(member) => {
                    console.log(member);
                }}
                key={`${memberData.firstName}-${memberData.lastName}/${memberData.position}`}
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
                        <th>Join Date</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
};

MembersTable.MembersTableRow = MembersTableRow;
export default MembersTable;
