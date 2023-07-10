import {
    Box,
    Button,
    Container,
    Divider,
    MultiSelect,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, useForm } from '@mantine/form';
import { createAccount } from '@services/firebase/functions/accounts';

const accountPermissions = [
    { value: 'admin', label: 'Admin' },
    { value: 'event', label: 'Event' },
    { value: 'team', label: 'Team' },
];

const AdminSettings = () => {
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            permissions: [],
        },
        validate: {
            email: isEmail('Email is not valid'),
            password: isNotEmpty('Password cannot be empty'),
            permissions: hasLength(
                { min: 1 },
                'Must set at least one permission'
            ),
        },
    });
    const onNewAccountSubmit = async (values) => {
        console.log(values);
        const results = await createAccount(
            values.email,
            values.password,
            values.permissions
        );
        console.log(results);
        return;
    };
    const setAccountPermissions = (permissions) => {
        form.setFieldValue('permissions', permissions);
    };

    return (
        <Container>
            <Title>Settings</Title>
            <Divider />
            <Container>
                <Title order={2} my={10}>
                    Accounts
                </Title>
                <Box>
                    <Text size="lg">Create new account</Text>
                    <form onSubmit={form.onSubmit(onNewAccountSubmit)}>
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        />
                        <TextInput
                            withAsterisk
                            label="Password"
                            placeholder="password"
                            type="password"
                            {...form.getInputProps('password')}
                        />
                        <MultiSelect
                            data={accountPermissions}
                            label="Account Permissions"
                            onChange={setAccountPermissions}
                            {...form.getInputProps('permissions')}
                        />
                        <Button mt={10} type="submit">
                            Create
                        </Button>
                    </form>
                </Box>
            </Container>
        </Container>
    );
};

export default AdminSettings;
