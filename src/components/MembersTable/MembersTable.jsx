import {
    ScrollArea,
    Table,
    Pagination,
    Center,
    Container,
} from '@mantine/core';
import {
    getFirestore,
    query,
    collection,
    orderBy,
    onSnapshot,
    Timestamp,
} from 'firebase/firestore';
import { app } from '@scripts/firebase';
import { useEffect, useMemo, useState } from 'react';
import { MembersTableRow } from '@components';

const ROWS_PER_PAGE = 15;

const MembersTable = () => {
    const [members, setMembers] = useState([]);
    const [activePage, setPage] = useState(1);

    useEffect(() => {
        const db = getFirestore(app);
        const colRef = collection(db, 'members');
        const q = query(colRef, orderBy('firstName'));
        const unsub = onSnapshot(q, (snapshot) => {
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
                if (!data.email) {
                    data.email = 'missing@mylaurier.ca'; // todo: remove this line later when all members have their email
                }
                allMembers.push(data);
            });

            setMembers([...allMembers]);
        });

        return unsub;
    }, []);

    const rows = useMemo(() => {
        // Currently, all members are being query in a single transaction
        // instead of slicing the array, we can setup the query in useEffect
        // to use a limit and startsafter.

        return members
            .slice((activePage - 1) * ROWS_PER_PAGE, ROWS_PER_PAGE * activePage)
            .map((memberData) => {
                return (
                    <MembersTableRow
                        member={memberData}
                        key={memberData.docId}
                    />
                );
            });

        // note: room for improvement for the dependency array
        // need `members` so that we get the rows rendered when fetch is done
        // need `activePage` for pagination
    }, [members, activePage]);

    return (
        <Container fluid m={0} p={0}>
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

export default MembersTable;
