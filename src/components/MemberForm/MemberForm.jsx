import { Avatar, Button, FileInput, Group, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import moment from 'moment';
import { useState } from 'react';

const MemberForm = ({
    firstName = '',
    middleName = '',
    lastName = '',
    position = '',
    email = '',
    picture = '',
    joinDate = moment().toDate(), // timestamp
}) => {
    const form = useForm({
        initialValues: {
            firstName,
            lastName,
            middleName,
            position,
            email,
            joinDate,
            pictureFile: null, // this should be a file object
        },
        validate: {
            firstName: isNotEmpty(),
            lastName: isNotEmpty(),
            position: isNotEmpty(),
            email: isEmail(),
            joinDate: isNotEmpty(),
        },
    });

    const [date, setDate] = useState(joinDate);
    const [pictureFile, setPictureFile] = useState(null);

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                console.log(values);
                console.log(pictureFile);
            })}
        >
            <Group>
                <Avatar size={60} src={picture} radius={60} />
                <FileInput
                    label="Picture"
                    placeholder="Select Picture"
                    accept="image/jpg"
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
                defaultValue={moment().toDate()}
            />
            <Button type="submit" mt="md">
                Save
            </Button>
        </form>
    );
};

export default MemberForm;
