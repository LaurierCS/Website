import { Center, Button, TextInput, Box } from "@mantine/core";
import { FC, FormEventHandler, useState } from "react";
import { useAuth } from "@/pages/Admin/AuthProvider";
import { useNavigate } from "react-router-dom";

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
        // redirect
    }

    return (
        <Center style={{ width: "100%", height: "100%" }}>
            <Box>
                <form onSubmit={handleSubmit} className="login-form">
                    <TextInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <TextInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <Button type="submit" disabled={disableSubmit}>Login</Button>
                </form>
            </Box>
        </Center>
    );
};

export default Login;
