import functions from 'firebase-functions';
import admin from 'firebase-admin';

import { handlePerms } from './callables/permissions.js';

admin.initializeApp();

export const setPermission = functions.https.onCall(handlePerms);
