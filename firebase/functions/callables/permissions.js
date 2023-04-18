import admin from 'firebase-admin';
import { getReturnObject } from '../helpers.js';

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

function validatePrivateRequest(data, context) {
    if (!isAuthenticated(context)) {
        // unauthorized call, reject
        return {
            error: getReturnObject(false, 'Must be authenticated.'),
        };
    }

    if (!data.uid || !data.uid instanceof String) {
        return {
            error: getReturnObject(
                false,
                'Must provide uid and uid must be type of String.'
            ),
        };
    }

    return { error: null };
}

export async function handlePerms(data, context) {
    const validationResult = validatePrivateRequest(data, context);

    if (validationResult.error) {
        return validationResult.error;
    }

    const users = await getUsers(data, context);

    if (users.error) {
        return users.error;
    }

    try {
        const permType = data.permType;
        const permSet = data.permSet;
        const requesterClaims = users.requester.customClaims || {};
        const targetClaims = users.target.customClaims || {};

        if (
            (requesterClaims.admin || requesterClaims[permType]) &&
            targetClaims[permType] !== permSet
        ) {
            targetClaims[permType] = permSet;
            const claims = admin
                .auth()
                .setCustomUserClaims(data.uid, targetClaims);
            return getReturnObject(
                true,
                `${permType} permission ${
                    permSet ? 'granted to' : 'revoked from'
                } uid: ${data.uid}`,
                claims
            );
        } else if (targetClaims[permType] === permSet) {
            return getReturnObject(
                true,
                `User with uid: ${users.target.uid} already has ${permType} permission set to ${permSet}.`
            );
        } else {
            return getReturnObject(
                false,
                `Current authenticated user does not have permission to ${
                    permSet ? 'grant' : 'revoke'
                } ${permType} role to others.`
            );
        }
    } catch (error) {}

    return getReturnObject(false, 'Something went wrong internally...');
}
