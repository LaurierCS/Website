import admin from 'firebase-admin';
import { error, isAuthenticated } from '../helpers.js';

export async function createAccount(data, context) {
    if (!isAuthenticated(context)) {
        return error('Permission denied');
    }

    if (!data.email || !data.password || !data.permissions) {
        return error('Must provide email, password, and permissions');
    }

    // verify

    const requester = await admin.auth().getUser(context.auth.uid);
    const requesterClaims = requester.customClaims || {};

    // check whether requester has permission to create account
    let canCreate = true;
    const customClaims = {};
    for (let perm of data.permissions) {
        customClaims[perm] = true;
        if (requesterClaims[perm] != undefined) {
            if (requesterClaims[perm] == false) {
                canCreate = false;
                break;
            }
        } else {
            canCreate = false;
            break;
        }
    }

    if (!canCreate) {
        return error(
            `Does not have permission to create an account with the permissions: ${data.permissions}`
        );
    }

    // create new user account
    try {
        const newUser = await admin.auth().createUser({
            email: data.email,
            password: data.password,
        });

        // set permissions
        await admin.auth().setCustomUserClaims(newUser.uid, customClaims);

        return {
            is_ok: true,
            message: 'User successfully created.',
            user: newUser,
        };
    } catch (e) {
        console.error(e);
        return error(`Could not create user. ERROR: ${e.message}`);
    }
}
