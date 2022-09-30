import { useState, useRef } from 'react';
import { Paper, TextField, Button, FormControl } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { updatePassword } from '@firebase/auth';

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, UpdateProfile, updateEmail } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    function handleSubmit(event) {
        event.preventDefault();

        const password = passwordRef.current.value;
        const passwordConfirm = passwordConfirmRef.current.value;
        const email = emailRef.current.value;

        if (password !== passwordConfirm) {
            return setError("Passwords do not match");
        }
        // else if (!validator.isStrongPassword(password, { minLength: 6 })) {
        //     return setError("Password must contain at least 1 [a-z], 1 [A-Z], 1 Symbol, and 1 [0-9]");
        // }

        const promises = [];
        setLoading(true);
        setError('');
        if (email !== currentUser.email) {
            promises.push(updateEmail(email));
        }
        if (password) {
            promises.push(updatePassword(password));
        }

        Promise.all(promises).then(() => {
            history.push("/dashboard");
        }).catch((error) => {
            setError("Failed to update account");
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });

    }

    return (
        <AuthProvider>
            <Paper>
                <h2>Update Profile</h2>
                <div>
                    <p>{error}</p>
                    <FormControl>
                        <TextField inputRef={emailRef} label="Email" defaultValue={currentUser.email}></TextField>
                    </FormControl>

                    <FormControl>
                        <TextField inputRef={passwordRef} label="Password" placeholder="Leave blank to keep the same"></TextField>
                    </FormControl>

                    <FormControl>
                        <TextField inputRef={passwordConfirmRef} label="Confirm Password" placeholder="Leave blank to keep the same"></TextField>
                    </FormControl>

                    <Button onClick={handleSubmit} disabled={loading}>Update</Button>

                </div>
                <div>
                    <Link to="/dashboard">Cancel</Link>
                </div>

            </Paper>
        </AuthProvider >
    );
}
