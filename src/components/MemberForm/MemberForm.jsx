import { Avatar, Button, FileInput, Group, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { closeAllModals } from '@mantine/modals';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { doc, getFirestore, collection } from 'firebase/firestore';
import moment from 'moment';
import { useState } from 'react';
import firebaseApp, { DB_COLLECTION } from '../../scripts/config';
import { addMember, updateMember } from '../../scripts/firebaseUtils';

const MemberForm = ({ member, isNew = false }) => {
    const {
        firstName = '',
        middleName = '',
        lastName = '',
        position = '',
        email = '',
        picture = '',
        joinDate = moment().toDate(),
    } = member;

    const [pictureFile, setPictureFile] = useState(null);
    const [date, setDate] = useState(joinDate);
    const form = useForm({
        initialValues: {
            firstName,
            lastName,
            middleName,
            position,
            email,
            joinDate,
        },
        validate: {
            firstName: isNotEmpty(),
            lastName: isNotEmpty(),
            position: isNotEmpty(),
            email: isEmail(),
            joinDate: isNotEmpty(),
        },
    });

    const handleSubmit = async (values) => {
        const db = getFirestore(firebaseApp);
        if (isNew) {
            const colRef = collection(db, DB_COLLECTION);
            const docId = await addMember(colRef, values, pictureFile);
            // todo: show notification
        } else {
            // note: firebase db
            const docRef = doc(db, DB_COLLECTION, member.docId);
            const data = {};
            let isModified = false;
            for (const field in values) {
                if (form.isDirty(field)) {
                    data[field] = values[field];
                    isModified = true;
                }
            }

            if (isModified || pictureFile) {
                const updated = await updateMember(docRef, data, pictureFile);

                if (updated) {
                    // todo: show notification
                }
            }
        }

        closeAllModals();
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group>
                <Avatar size={60} src={picture} radius={60} />
                <FileInput
                    label="Picture"
                    placeholder="Select Picture"
                    accept="image/jpeg"
                    value={pictureFile}
                    onChange={setPictureFile}
                />
            </Group>
            <TextInput
                label="First Name"
                placeholder="First Name"
                withAsterisk
                {...form.getInputProps('firstName')}
            />
            <TextInput
                label="Last Name"
                placeholder="Last Name"
                withAsterisk
                {...form.getInputProps('lastName')}
            />
            <TextInput
                label="Middle Name"
                placeholder="Middle Name"
                {...form.getInputProps('middleName')}
            />
            <TextInput
                label="Email"
                placeholder="Email"
                withAsterisk
                {...form.getInputProps('email')}
            />
            <TextInput
                label="Position"
                placeholder="Position"
                withAsterisk
                {...form.getInputProps('position')}
            />
            <DatePicker
                withAsterisk
                label="Join Date"
                value={date}
                onChange={setDate}
                defaultValue={joinDate}
            />
            <Button type="submit" mt="md">
                Save
            </Button>
        </form>
    );
};

export default MemberForm;
