import { store } from "@/services/firebase";
import { Container, Avatar, Table } from "@mantine/core";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { TeamMember } from "@/components/MeetTheTeam/MeetTheTeam";

const AdminPage: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        const getData = async () => {
            const q = query(
                collection(store, "team"),
                orderBy("departments"),
                orderBy("name")
            );
            const snapshot = await getDocs(q);
            const t: TeamMember[] = [];
            snapshot.forEach((doc) => t.push(doc.data() as TeamMember));
            setTeam(t);
        };
        getData();
    }, []);

    const rows = team.map((member) => (
        <tr key={member.name}>
            <td>
                <Avatar src={member.picture} />
            </td>
            <td>{member.name}</td>
            <td>{member.role}</td>
            <td>{member.departments.join(", ")}</td>
        </tr>
    ));

    return (
        <Container>
            <Table highlightOnHover withColumnBorders horizontalSpacing="xl">
                <thead>
                    <tr>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Departments</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Container>
    );
};

export default AdminPage;
