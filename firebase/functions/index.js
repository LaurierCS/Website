import functions from 'firebase-functions';
import admin from 'firebase-admin';

import { handleGrantAdminPerms } from './callables/permissions.js';

admin.initializeApp();

export const grantAdminPermission = functions.https.onCall(
    handleGrantAdminPerms
);
