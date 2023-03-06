import admin from 'firebase-admin';
import { getReturnObject, isAuthenticated } from '../helpers.js';

function validatePrivateRequest(data, context) {
    if (!isAuthenticated(context)) {
        // unauthorized call, reject
        return {
            pass: false,
            returnObj: getReturnObject(false, 'Must be authenticated.'),
        };
    }

    if (!data.uid || !data.uid instanceof String) {
        return {
            pass: false,
            returnObj: getReturnObject(
                false,
                'Must provide uid and uid must be type of String.'
            ),
        };
    }

    return { pass: true, returnObj: null };
}

async function getUsers(data, context) {
    let requester = null;
    let target = null;
    let errUsers = [];

    try {
        requester = await admin.auth().getUser(context.auth.uid);
    } catch (_e) {
        errUsers.push(context.auth.uid);
    }

    try {
        target = await admin.auth().getUser(data.uid);
    } catch (_e) {
        errUsers.push(data.uid);
    }

    return {
        requester,
        target,
        error: errUsers.length
            ? getReturnObject(
                  false,
                  `Could not identify user(s) with uid: ${errUsers.join(', ')}`
              )
            : null,
    };
}

export async function handleAdminPerms(data, context, permChange) {
    let { pass, returnObj } = validatePrivateRequest(data, context);

    if (!pass) {
        return returnObj;
    }

    let user;
    let otherUser;

    try {
        user = await admin.auth().getUser(context.auth.uid);
    } catch (_e) {
        return getReturnObject(
            false,
            'Could not identify user with uid ' + context.auth.uid
        );
    }

    try {
        otherUser = await admin.auth().getUser(data.uid);
    } catch (_e) {
        return getReturnObject(
            false,
            'Could not identify user with uid ' + data.uid
        );
    }

    try {
        if (user.customClaims && user.customClaims.admin) {
            if (
                otherUser.customClaims &&
                otherUser.customClaims.admin === permChange
            ) {
                return getReturnObject(
                    true,
                    `User with uid: ${otherUser.uid} already has admin permission set to ${permChange}.`
                );
            }
            // proceed
            const claims = admin.auth().setCustomUserClaims(data.uid, {
                ...otherUser.customClaims,
                admin: permChange,
            });
            return getReturnObject(
                true,
                `Admin permission ${
                    permChange ? 'granted to' : 'revoked from'
                } uid: ${data.uid}`,
                claims
            );
        } else {
            return getReturnObject(
                false,
                `Current authenticated user does not have permission to ${
                    permChange ? 'grant' : 'revoke'
                } admin role to others.`
            );
        }
    } catch (error) {}

    return getReturnObject(false, 'Something went wrong internally...');
}
