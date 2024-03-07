import { Center, Button, TextInput, Box, Container, Image } from "@mantine/core";
import { FC, FormEventHandler, useState } from "react";
import { useAuth } from "@/pages/Admin/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { IconLogo } from "@assets";

import "./Login.css";

const Login: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(false);
    const navigate = useNavigate();

    const { user, login } = useAuth();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }

        try {
            setDisableSubmit(true);
            await login(email, password);
            navigate("/admin");
        } catch (err) {
            console.error(err);
        } finally {
            setDisableSubmit(false);
        }
    };

    if (user) {
        return <Navigate to="/admin" />;
    }

    return (
        <Container className="login-container">
            <Center>
                <Box>
                    <Image src={IconLogo} />
                    <form onSubmit={handleSubmit} className="login-form">
                        <TextInput
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={disableSubmit}>
                            Login
                        </Button>
                    </form>
                </Box>
            </Center>
        </Container>
    );
};

export default Login;
