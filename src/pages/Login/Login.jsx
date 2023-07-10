import { Container } from '@mantine/core';
import React from 'react';
import { Footer } from '@components';
import { Form, Button } from 'react-bootstrap';
import './login.css';
import { useAuth } from '@hooks';

const LoginPage = () => {
    const { signIn } = useAuth();
    const loginUser = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signIn(email, password)
            .then((_user) => {
                alert('Welcome LCS Admin');
                window.location.replace(
                    document.URL.substring(0, document.URL.length - 5) +
                    'admin-portal'
                );
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <div>
            <div className="wrapper">
                <Container>
                    <Form
                        className="center"
                        onSubmit={(e) => {
                            loginUser(e);
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                id="email"
                                type="email"
                                placeholder="Enter email"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                id="password"
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3"></Form.Group>
                        <Button variant="outline-light" type="submit">
                            Login
                        </Button>
                    </Form>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;