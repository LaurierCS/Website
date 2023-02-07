import {
    Group,
    Avatar,
    Text,
    Badge,
    ActionIcon,
    ScrollArea,
    Table,
    Pagination,
    Center,
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
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import firebaseApp from '../../scripts/config.js';
import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';

const ROWS_PER_PAGE = 15;

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
                            onClick={() => onDelete(member)}
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
    const [activePage, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            // get data from backend
            const db = getFirestore(firebaseApp);
            const colRef = collection(db, 'members');
            const q = query(colRef, orderBy('firstName'));
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
                data.email = 'test2341@mylaurier.ca'; // todo: remove this line later when all members have their email
                allMembers.push(data);
            });

            setMembers([...allMembers]);
        })();
    }, []);

    const rows = useMemo(() => {
        // Currently, all members are being query in a single transaction
        // instead of slicing the array, we can setup the query in useEffect
        // to use a limit and startsafter.

        return members
            .slice((activePage - 1) * ROWS_PER_PAGE, ROWS_PER_PAGE * activePage)
            .map((memberData) => {
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

        // note: room for improvement for the dependency array
        // need `members` so that we get the rows rendered when fetch is done
        // need `activePage` for pagination
    }, [members, activePage]);

    return (
        <Container>
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
            <Center>
                <Pagination
                    page={activePage}
                    onChange={setPage}
                    total={Math.ceil(members.length / ROWS_PER_PAGE)}
                />
            </Center>
        </Container>
    );
};

MembersTable.MembersTableRow = MembersTableRow;
export default MembersTable;
