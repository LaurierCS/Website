import { type FormEventHandler, useEffect, useState } from "react";
import { format, set } from "date-fns";
import {
    Container,
    Modal,
    Title,
    Space,
    TextInput,
    Button,
    Checkbox,
    Flex,
    Text,
    Card,
    SimpleGrid,
    Textarea,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
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
import { store } from "@/services/firebase";

interface EventInfo {
    date: Date;
    description: string;
    icon: string;
    igPost: string;
    isPublicDate: boolean;
    isPublicPlace: boolean;
    isPublicTime: boolean;
    visible: boolean;
    title: string;
    place: string;
    docRef?: DocumentReference<DocumentData, DocumentData>;
}

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<EventInfo[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [activeEvent, setActiveEvent] = useState<EventInfo | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingNewEvent, setIsAddingNewEvent] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteConfirmationStr, setDeleteConfirmationStr] = useState("");

    useEffect(() => {
        const getData = async () => {
            const q = query(
                collection(store, "events"),
                orderBy("date", "desc")
            );
            const snapshot = await getDocs(q);
            const evts: EventInfo[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                evts.push({
                    date: data.date.toDate(),
                    description: data.description,
                    icon: data.icon,
                    igPost: data.igPost,
                    isPublicDate: data.isPublicDate,
                    isPublicTime: data.isPublicTime,
                    isPublicPlace: data.isPublicPlace,
                    visible: data.visible,
                    title: data.title,
                    place: data.place,
                    docRef: doc.ref,
                });
            });
            setEvents(evts);
        };
        getData();
    }, []);

    const editEvent = (event: EventInfo) => {
        setIsAddingNewEvent(false);
        setActiveEvent(event);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setActiveEvent(null);
        setShowConfirmDelete(false);
        setDeleteConfirmationStr("");
    };

    const addEvent = () => {
        setIsAddingNewEvent(true);
        setActiveEvent({
            date: new Date(),
            description: "",
            icon: "🔔",
            igPost: "",
            title: "",
            place: "",
            isPublicDate: false,
            isPublicPlace: false,
            isPublicTime: false,
            visible: false,
        });
        setOpenModal(true);
    };

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!activeEvent) return;
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

            if (!activeEvent.docRef) {
                // create a new doc
                const cloned = { ...activeEvent };
                delete cloned.docRef;
                const docRef = await addDoc(
                    collection(store, "events"),
                    cloned
                );
                activeEvent.docRef = docRef;
            } else {
                await updateDoc(activeEvent.docRef, {
                    date: activeEvent.date,
                    description: activeEvent.description,
                    icon: activeEvent.icon,
                    igPost: activeEvent.igPost,
                    isPublicDate: activeEvent.isPublicDate,
                    isPublicTime: activeEvent.isPublicTime,
                    isPublicPlace: activeEvent.isPublicPlace,
                    visible: activeEvent.visible,
                    title: activeEvent.title,
                    place: activeEvent.place,
                });
            }

            if (isAddingNewEvent) {
                setEvents((old) => [...old, { ...activeEvent }]);
            } else {
                setEvents((old) =>
                    old.map((event) => {
                        if (
                            event.docRef &&
                            activeEvent.docRef &&
                            event.docRef.id === activeEvent.docRef.id
                        ) {
                            return {
                                ...activeEvent,
                            };
                        }
                        return event;
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

        if (!activeEvent || !activeEvent.docRef) return;

        const notificationId = randomId();
        try {
            setIsSaving(true);
            showNotification({
                id: notificationId,
                autoClose: 5000, // 5 seconds
                color: "red",
                title: "Deleting...",
                message: "Deleting event from firestore...",
                loading: true,
            });

            await deleteDoc(doc(store, "events", activeEvent.docRef.id));

            // update the team list
            setEvents((old) =>
                old.filter(
                    (entry) => entry.docRef?.id !== activeEvent.docRef?.id
                )
            );

            closeModal();
            updateNotification({
                id: notificationId,
                color: "red",
                title: "Deleted!",
                message: "You have forever deleted an event. How cruel... T.T",
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

    const handleInputChange = (
        field: keyof EventInfo,
        /* eslint-disable-next-line */
        value: any
    ) => {
        if (activeEvent && !isSaving) {
            const event = { ...activeEvent };
            // typescript being annoying here...
            event[field] = value as never;
            setActiveEvent(event);
        }
    };

    const renderEventCards = () => {
        return events.map((event) => (
            <Card key={event.title} withBorder onClick={() => editEvent(event)}>
                <Text weight={500} color="white">
                    {event.title}
                </Text>
                <Text size="sm">
                    Date: {format(event.date, "dd/MM/yyyy - hh:mm a")}
                </Text>
            </Card>
        ));
    };

    return (
        <Container size="lg">
            <Title>Events Page</Title>
            <Flex justify="space-between" align="center" py="lg">
                <Button onClick={addEvent}>Add Event</Button>
            </Flex>
            <Space h="lg" />
            <SimpleGrid cols={4}>{renderEventCards()}</SimpleGrid>
            <Modal opened={openModal} onClose={closeModal} title="Edit Event">
                <form onSubmit={handleSave}>
                    <TextInput
                        label="Icon (enter an emoji)"
                        value={activeEvent ? activeEvent.icon : "🔔"}
                        onChange={(e) =>
                            handleInputChange("icon", e.target.value)
                        }
                        disabled={isSaving}
                        required
                    />
                    <TextInput
                        label="Title"
                        value={activeEvent ? activeEvent.title : ""}
                        onChange={(e) =>
                            handleInputChange("title", e.target.value)
                        }
                        disabled={isSaving}
                        required
                    />
                    <TextInput
                        label="Place"
                        value={activeEvent ? activeEvent.place : ""}
                        onChange={(e) =>
                            handleInputChange("place", e.target.value)
                        }
                        disabled={isSaving}
                        required
                    />
                    <Flex gap="sm">
                        <DatePicker
                            label="Date"
                            withAsterisk
                            value={activeEvent ? activeEvent.date : new Date()}
                            onChange={(v) => {
                                if (activeEvent && v) {
                                    handleInputChange(
                                        "date",
                                        set(v, {
                                            hours: activeEvent.date.getHours(),
                                            minutes:
                                                activeEvent.date.getMinutes(),
                                            seconds:
                                                activeEvent.date.getSeconds(),
                                            milliseconds:
                                                activeEvent.date.getMilliseconds(),
                                        })
                                    );
                                }
                            }}
                            disabled={isSaving}
                            required
                        />
                        <TimeInput
                            label="Time"
                            format="12"
                            value={activeEvent ? activeEvent.date : new Date()}
                            withAsterisk
                            onChange={(v) => {
                                if (activeEvent && v) {
                                    handleInputChange(
                                        "date",
                                        set(v, {
                                            year: activeEvent.date.getFullYear(),
                                            month: activeEvent.date.getMonth(),
                                            date: activeEvent.date.getDate(),
                                        })
                                    );
                                }
                            }}
                            disabled={isSaving}
                            required
                        />
                    </Flex>
                    <Textarea
                        label="Description"
                        value={activeEvent ? activeEvent.description : ""}
                        onChange={(e) =>
                            handleInputChange("description", e.target.value)
                        }
                        minRows={5}
                        maxRows={7}
                        disabled={isSaving}
                        required
                    />
                    <TextInput
                        label="Instagram Post URL"
                        value={activeEvent ? activeEvent.igPost : ""}
                        onChange={(e) =>
                            handleInputChange("igPost", e.target.value)
                        }
                        disabled={isSaving}
                    />
                    <Space h="lg" />
                    <Flex gap="sm" direction="column">
                        <Checkbox
                            label="Is date (i.e dd/mm) ready to show in the landing page?"
                            onChange={(e) =>
                                handleInputChange(
                                    "isPublicDate",
                                    e.currentTarget.checked
                                )
                            }
                            checked={
                                activeEvent ? activeEvent.isPublicDate : false
                            }
                            disabled={isSaving}
                        />
                        <Checkbox
                            label="Is place (i.e BA111) ready to show in the landing page?"
                            onChange={(e) =>
                                handleInputChange(
                                    "isPublicPlace",
                                    e.currentTarget.checked
                                )
                            }
                            checked={
                                activeEvent ? activeEvent.isPublicPlace : false
                            }
                            disabled={isSaving}
                        />
                        <Checkbox
                            label="Is time (i.e 7:00PM) ready to show in the landing page?"
                            onChange={(e) =>
                                handleInputChange(
                                    "isPublicTime",
                                    e.currentTarget.checked
                                )
                            }
                            checked={
                                activeEvent ? activeEvent.isPublicTime : false
                            }
                            disabled={isSaving}
                        />
                        <Checkbox
                            label="Is event visible in the landing page?"
                            onChange={(e) =>
                                handleInputChange(
                                    "visible",
                                    e.currentTarget.checked
                                )
                            }
                            checked={activeEvent ? activeEvent.visible : false}
                            disabled={isSaving}
                        />
                    </Flex>
                    <Space h="lg" />
                    <Flex justify="space-between">
                        <Button type="submit" disabled={isSaving}>
                            Save
                        </Button>
                        {activeEvent && !isAddingNewEvent && (
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
                            <Text color="red">Type {"DELETE"} to proceed.</Text>
                            <Space h="lg" />
                            <TextInput
                                value={deleteConfirmationStr}
                                onChange={(e) =>
                                    setDeleteConfirmationStr(e.target.value)
                                }
                                required
                            />
                            <Space h="lg" />
                            <Button
                                color="red"
                                disabled={
                                    isSaving ||
                                    (!!activeEvent &&
                                        "DELETE" !== deleteConfirmationStr)
                                }
                                type="submit"
                            >
                                Erase This Event From Existence
                            </Button>
                        </form>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default EventsPage;
