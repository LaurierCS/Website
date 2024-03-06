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
    Checkbox,
    Badge,
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
import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";

interface TeamMemberWithDocRef extends TeamMember {
    isPublic: boolean;
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
    const [activeMember, setActiveMember] =
        useState<TeamMemberWithDocRef | null>(null);
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

                console.log(doc.id, doc.ref.id);

                t.push({
                    name: data.name,
                    role: data.role,
                    departments: data.departments,
                    picture: data.picture,
                    isPublic: data.is_public,
                    docRef: doc.ref,
                });
            });
            setTeam(t);
        };
        getData();
    }, []);

    const editMember = (member: TeamMemberWithDocRef) => {
        setActiveMember(member);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setActiveMember(null);
    };

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!activeMember) return;

        const notificationId = randomId();
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
            await updateDoc(activeMember.docRef, {
                name: activeMember.name,
                role: activeMember.role,
                is_public: activeMember.isPublic,
                departments: activeMember.departments,
            });
            // update the table with the new changes
            setTeam((old) =>
                old.map((item) => {
                    if (item.docRef.id === activeMember.docRef.id) {
                        return {
                            name: activeMember.name,
                            role: activeMember.role,
                            departments: activeMember.departments,
                            docRef: item.docRef,
                            isPublic: item.isPublic,
                            picture: item.picture,
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

    const handleInputChange = (
        field: keyof TeamMemberWithDocRef,
        value: any
    ) => {
        if (activeMember) {
            const member = { ...activeMember };
            // typescript being annoying here...
            member[field] = value as never;
            setActiveMember(member);
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
            <td>
                <Badge color={member.isPublic ? "green" : "red"}>
                    {member.isPublic ? "YES" : "NO"}
                </Badge>
            </td>
        </tr>
    ));

    return (
        <Container size="lg">
            <Title>Admin Page</Title>
            <Space h="lg" />
            <Table highlightOnHover withColumnBorders horizontalSpacing="xl">
                <thead>
                    <tr>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Departments</th>
                        <th>Visible in prod</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            <Modal opened={openModal} onClose={closeModal} title="Edit Member">
                <form onSubmit={handleSave}>
                    <TextInput
                        label="Name"
                        value={activeMember ? activeMember.name : ""}
                        onChange={(e) =>
                            handleInputChange("name", e.target.value)
                        }
                        disabled={isSaving}
                        required
                    />
                    <Space h="lg" />
                    <TextInput
                        label="Role"
                        value={activeMember ? activeMember.role : ""}
                        onChange={(e) =>
                            handleInputChange("role", e.target.value)
                        }
                        disabled={isSaving}
                        required
                    />
                    <Space h="lg" />
                    <MultiSelect
                        label="Departments"
                        value={activeMember ? activeMember.departments : []}
                        onChange={(data) =>
                            handleInputChange("departments", data)
                        }
                        data={departments}
                        disabled={isSaving}
                        required
                    />
                    <Space h="lg" />
                    <Checkbox
                        label="Is ready to show in the landing page?"
                        onChange={(e) =>
                            handleInputChange(
                                "isPublic",
                                e.currentTarget.checked
                            )
                        }
                        checked={activeMember ? activeMember.isPublic : false}
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
