import admin from 'firebase-admin';
import { getReturnObject } from '../helpers.js';

export async function handleGrantAdminPerms(data, context) {
    if (!context.auth) {
        // unauthorized call, reject
        return getReturnObject(false, 'Must be authenticated.');
    }

    if (!data.uid || !data.uid instanceof String) {
        return getReturnObject(
            false,
            'Must provide grantee uid and it must be of type String'
        );
    }

    let user;
    let grantee;

    try {
        user = await admin.auth().getUser(context.auth.uid);
    } catch (_e) {
        return getReturnObject(
            false,
            'Could not identify user with uid ' + context.auth.uid
        );
    }

    try {
        grantee = await admin.auth().getUser(data.uid);
    } catch (_e) {
        return getReturnObject(
            false,
            'Could not identify user with uid ' + data.uid
        );
    }

    try {
        if (user.customClaims && user.customClaims.admin) {
            if (grantee.customClaims && grantee.customClaims.admin) {
                return getReturnObject(
                    true,
                    `User with uid: ${grantee.uid} already has admin permission.`
                );
            }
            // proceed
            const claims = admin.auth().setCustomUserClaims(data.uid, {
                ...grantee.customClaims,
                admin: true,
            });
            return getReturnObject(
                true,
                `Admin permission granted to uid: ${data.uid}`,
                claims
            );
        } else {
            return getReturnObject(
                false,
                'Current authenticated user does not have permission to grant admin role to others.'
            );
        }
    } catch (error) {}

    return getReturnObject(false, 'Something went wrong internally...');
}
