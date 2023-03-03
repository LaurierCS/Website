import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { getDoc, doc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import './helpers';

describe('Firestore rules', () => {
    let testEnv;
    let unauthed;
    let unauthed_firestore;
    const TEST_COLLECTIONS = ['team', 'events'];
    const ACCOUNTS = {
        normal: 'GadhwYtretuMoRWatW5ItOTrPHYS',
        admin: 'PSZJ9EQ85Ik41BkBTpMriN3mucjr',
        event: '2Pzu1Mk3hynwOwt4LzJOQarRo3dZ',
        team: 'wejiQXHwPypT0iZXWim2q62OkKzx',
    };
    beforeAll(async () => {
        const rulesPath = path.resolve(
            __dirname,
            '../../emulators/config/firestore.rules'
        );
        testEnv = await initializeTestEnvironment({
            projectId: 'demo-firestore-rules',
            firestore: {
                rules: fs.readFileSync(rulesPath, 'utf8'),
                host: '127.0.0.1',
                port: 8080,
            },
        });

        unauthed = testEnv.unauthenticatedContext();
        unauthed_firestore = unauthed.firestore();
    });

    afterAll(async () => {
        await testEnv.cleanup();
    });

    test('success when reading public documents', async () => {
        for (let collection of TEST_COLLECTIONS) {
            await expect(
                getDoc(doc(unauthed_firestore, collection, 'public-doc'))
            ).toAllow();
        }
    });

    test('fail when reading private documents', async () => {
        for (let collection of TEST_COLLECTIONS) {
            await expect(
                getDoc(doc(unauthed_firestore, collection, 'private-doc'))
            ).toDeny();
        }
    });

    test('fail when reading document without public field', async () => {
        for (let collection of TEST_COLLECTIONS) {
            await expect(
                getDoc(doc(unauthed_firestore, collection, 'no-public-field'))
            ).toDeny();
        }
    });

    test('success when reading public/private and no defined public field documents when authenticated', async () => {
        const authed = testEnv.authenticatedContext(ACCOUNTS.normal);
        const firestore = authed.firestore();
        for (let collection of TEST_COLLECTIONS) {
            await expect(
                getDoc(doc(firestore, collection, 'public-doc'))
            ).toAllow();
        }

        for (let collection of TEST_COLLECTIONS) {
            await expect(
                getDoc(doc(firestore, collection, 'private-doc'))
            ).toAllow();
        }

        for (let collection of TEST_COLLECTIONS) {
            await expect(
                getDoc(doc(firestore, collection, 'no-public-field'))
            ).toAllow();
        }
    });
});
