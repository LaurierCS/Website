import functions from 'firebase-functions';
import admin from 'firebase-admin';

import { handlePerms } from './callables/permissions.js';
import { createAccount as handleCreateAccount } from './callables/accounts.js';

admin.initializeApp();

export const setPermission = functions.https.onCall(handlePerms);
export const createAccount = functions.https.onCall(handleCreateAccount);
