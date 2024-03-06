import { store } from "@/services/firebase";
import {
    Container,
    Avatar,
    Table,
    Modal,
    Title,
    Space,
    TextInput,
    MultiSelect,
    Button,
} from "@mantine/core";
import {
    type DocumentData,
    DocumentReference,
    collection,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import { type FormEventHandler, useEffect, useState } from "react";
import type { TeamMember } from "@/components/MeetTheTeam/MeetTheTeam";
import { showNotification, updateNotification } from "@mantine/notifications";

interface TeamMemberWithDocRef extends TeamMember {
    docRef: DocumentReference<DocumentData, DocumentData>;
}

const departments = [
    { value: "admin", label: "Admin" },
    { value: "development", label: "Development" },
    { value: "outreach", label: "Outreach" },
    { value: "community", label: "Community" },
    { value: "comms", label: "Communication" },
    { value: "events", label: "Events" },
    { value: "president", label: "President" },
];

const AdminPage: React.FC = () => {
    const [team, setTeam] = useState<TeamMemberWithDocRef[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editDepartments, setEditDepartments] = useState<string[]>([]);
    const [activeDoc, setActiveDoc] = useState<DocumentReference<
        DocumentData,
        DocumentData
    > | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const q = query(
                collection(store, "team"),
                orderBy("departments"),
                orderBy("name")
            );
            const snapshot = await getDocs(q);
            const t: TeamMemberWithDocRef[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();

                t.push({
                    name: data.name,
                    role: data.role,
                    departments: data.departments,
                    picture: data.picture,
                    docRef: doc.ref,
                });
            });
            setTeam(t);
        };
        getData();
    }, []);

    const editMember = (member: TeamMemberWithDocRef) => {
        setEditName(member.name);
        setEditRole(member.role);
        setEditDepartments(member.departments);
        setActiveDoc(member.docRef);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setEditName("");
        setEditRole("");
        setEditDepartments([]);
        setActiveDoc(null);
    };

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        // TODO: add some notifications to let user know
        if (!editName || !editRole || !editDepartments.length || !activeDoc)
            return;

        const notificationId = "savingNotification" + editName;
        try {
            setIsSaving(true);
            showNotification({
                id: notificationId,
                autoClose: 5000, // 5 seconds
                color: "blue",
                title: "Saving...",
                message: "Saving changes in firestore...",
                loading: true,
            });
            await updateDoc(activeDoc, {
                name: editName,
                role: editRole,
                departments: editDepartments,
            });
            // update the table with the new changes
            setTeam((old) =>
                old.map((item) => {
                    if (item.docRef.id === activeDoc.id) {
                        return {
                            name: editName,
                            role: editRole,
                            departments: editDepartments,
                            picture: item.picture,
                            docRef: item.docRef,
                        };
                    }

                    return item;
                })
            );
        } catch (err) {
            console.error(err);
            updateNotification({
                id: notificationId,
                color: "red",
                title: "Error Saving",
                message:
                    "Not able to save changes in firestore. Please contact the dev team.",
                loading: false,
            });
        } finally {
            setIsSaving(false);
            updateNotification({
                id: notificationId,
                color: "green",
                title: "Saved!",
                message: "Changes successfully saved in firestore!",
                loading: false,
            });
        }
    };

    const rows = team.map((member) => (
        <tr key={member.name} onClick={() => editMember(member)}>
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
            <Title>Admin Page</Title>
            <Space h="lg" />
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
            <Modal opened={openModal} onClose={closeModal} title="Edit Member">
                <form onSubmit={handleSave}>
                    <TextInput
                        label="Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isSaving}
                        required
                    />
                    <Space h="lg" />
                    <TextInput
                        label="Role"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        disabled={isSaving}
                        required
                    />
                    <Space h="lg" />
                    <MultiSelect
                        label="Departments"
                        value={editDepartments}
                        onChange={setEditDepartments}
                        data={departments}
                        disabled={isSaving}
                        required
                    />
                    <Space h="lg" />
                    <Button type="submit" disabled={isSaving}>
                        Save
                    </Button>
                </form>
            </Modal>
        </Container>
    );
};

export default AdminPage;
