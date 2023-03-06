import functions from 'firebase-functions';
import admin from 'firebase-admin';

import { handleAdminPerms, handleEventPerms } from './callables/permissions.js';

admin.initializeApp();

export const grantAdminPermission = functions.https.onCall(
    async (data, context) => await handleAdminPerms(data, context, true)
);

export const revokeAdminPermission = functions.https.onCall(
    async (data, context) => await handleAdminPerms(data, context, false)
);

export const grantEventPermission = functions.https.onCall(
    async (data, context) => await handleEventPerms(data, context, true)
);

export const revokeEventPermission = functions.https.onCall(
    async (data, context) => await handleEventPerms(data, context, false)
);
