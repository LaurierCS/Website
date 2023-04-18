import { functions } from './config';
import { httpsCallable } from 'firebase/functions';

export async function createAccount(email, password, permissions) {
    const func = httpsCallable(functions, 'createAccount');

    const results = await func({ email, password, permissions });

    return results;
}
