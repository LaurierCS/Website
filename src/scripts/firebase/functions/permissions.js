import { functions } from './config';
import { httpsCallable } from 'firebase/functions';

export async function setPermission(uid, permType, permSet) {
    const func = httpsCallable(functions, 'setPermission');

    const results = await func({
        uid,
        permType,
        permSet,
    });

    return results;
}
