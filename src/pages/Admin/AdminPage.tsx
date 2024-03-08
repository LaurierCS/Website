import { type FormEventHandler, useEffect, useState } from "react";
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
    FileInput,
    Flex,
    Text,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
    type DocumentData,
    DocumentReference,
    collection,
    getDocs,
    orderBy,
    query,
    updateDoc,
    addDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { storage, store } from "@/services/firebase";
import type { TeamMember } from "@/components/MeetTheTeam/MeetTheTeam";
import { useAuth } from "@/pages/Admin/AuthProvider";

interface TeamMemberWithDocRef extends TeamMember {
    isPublic: boolean;
    docRef?: DocumentReference<DocumentData, DocumentData>;
    isNewMember: boolean;
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
    const [newPic, setNewPic] = useState<File | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteMemberName, setDeleteMemberName] = useState("");

    const { logout } = useAuth();

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
                    isPublic: data.is_public,
                    docRef: doc.ref,
                    isNewMember: false,
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
        setNewPic(null);
        setShowConfirmDelete(false);
        setDeleteMemberName("");
    };

    const addMember = () => {
        setActiveMember({
            name: "",
            role: "",
            picture: "",
            departments: [],
            isPublic: false,
            isNewMember: true,
        });
        setOpenModal(true);
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

            if (!activeMember.docRef) {
                // create a new doc
                const docRef = await addDoc(collection(store, "team"), {
                    is_public: false,
                });
                activeMember.docRef = docRef;
            }

            if (newPic !== null) {
                if (!activeMember.isNewMember) {
                    const oldPicRef = ref(storage, activeMember.picture);
                    // delete old picture
                    try {
                        await deleteObject(oldPicRef);
                    } catch (err) {
                        console.error(err);
                        showNotification({
                            autoClose: false,
                            color: "red",
                            title: "Error",
                            message:
                                "Not able to delete old picture from storage. Please provide the dev team with the following reference for manual clean up. Ref: " +
                                oldPicRef.toString(),
                        });
                    }
                }

                // upload new picture
                const storageRef = ref(
                    storage,
                    "team/" + activeMember.name + activeMember.docRef.id
                );
                const snap = await uploadBytes(storageRef, newPic);
                activeMember.picture = await getDownloadURL(snap.ref);
            }

            await updateDoc(activeMember.docRef, {
                name: activeMember.name,
                role: activeMember.role,
                is_public: activeMember.isPublic,
                departments: activeMember.departments,
                picture: activeMember.picture,
            });

            if (activeMember.isNewMember) {
                activeMember.isNewMember = false;
                setTeam((old) => [...old, activeMember]);
            } else {
                // update the table with the new changes
                setTeam((old) =>
                    old.map((item) => {
                        if (
                            item.docRef &&
                            activeMember.docRef &&
                            item.docRef.id === activeMember.docRef.id
                        ) {
                            return {
                                name: activeMember.name,
                                role: activeMember.role,
                                departments: activeMember.departments,
                                isPublic: activeMember.isPublic,
                                picture: activeMember.picture,
                                isNewMember: item.isNewMember,
                                docRef: item.docRef,
                            };
                        }

                        return item;
                    })
                );
            }

            closeModal();
            updateNotification({
                id: notificationId,
                color: "green",
                title: "Saved!",
                message: "Changes successfully saved in firestore!",
                loading: false,
            });
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
        }
    };

    const handleDelete: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!activeMember || !activeMember.docRef) return;

        const notificationId = randomId();
        try {
            setIsSaving(true);
            showNotification({
                id: notificationId,
                autoClose: 5000, // 5 seconds
                color: "red",
                title: "Deleting...",
                message: "Deleting member from firestore...",
                loading: true,
            });

            await deleteDoc(doc(store, "team", activeMember.docRef.id));

            // update the team list
            setTeam((old) =>
                old.filter(
                    (entry) => entry.docRef?.id !== activeMember.docRef?.id
                )
            );

            closeModal();
            updateNotification({
                id: notificationId,
                color: "red",
                title: "Deleted!",
                message: "You have forever deleted a member. How cruel... T.T",
                loading: false,
            });
        } catch (err) {
            console.error(err);
            updateNotification({
                id: notificationId,
                color: "red",
                title: "Error Deleting",
                message:
                    "Not able to delete member. Please contact the dev team to proceed manually.",
                loading: false,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof TeamMemberWithDocRef,
        /* eslint-disable-next-line */
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
        <tr
            key={member.docRef?.id ?? member.name}
            onClick={() => editMember(member)}
        >
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
            <Flex justify="space-between" align="center" py="lg">
                <Button onClick={addMember}>Add Member</Button>
                <Button onClick={logout} variant="outline">
                    Logout
                </Button>
            </Flex>
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
                    <FileInput
                        value={newPic}
                        onChange={setNewPic}
                        accept="image/*"
                        label="Picture"
                    />
                    <Space h="lg" />
                    <Flex justify="space-between">
                        <Button type="submit" disabled={isSaving}>
                            Save
                        </Button>
                        {activeMember && !activeMember.isNewMember && (
                            <Button
                                color="red"
                                disabled={isSaving}
                                onClick={() => setShowConfirmDelete(true)}
                                variant="outline"
                            >
                                Delete
                            </Button>
                        )}
                    </Flex>
                </form>
                {showConfirmDelete && (
                    <>
                        <Space h="xl" />
                        <form onSubmit={handleDelete}>
                            <Text color="red">
                                Type {activeMember ? activeMember.name : ""} to
                                proceed.
                            </Text>
                            <Space h="lg" />
                            <TextInput
                                label="Confirm Member Name"
                                value={deleteMemberName}
                                onChange={(e) =>
                                    setDeleteMemberName(e.target.value)
                                }
                                required
                            />
                            <Space h="lg" />
                            <Button
                                color="red"
                                disabled={
                                    isSaving ||
                                    (!!activeMember &&
                                        activeMember.name !== deleteMemberName)
                                }
                                type="submit"
                            >
                                Erase This Member From Existence
                            </Button>
                        </form>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default AdminPage;
