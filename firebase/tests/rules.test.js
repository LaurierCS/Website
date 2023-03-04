import { getDoc, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { setup } from './helpers';

describe('Firestore rules', () => {
    let testEnv;
    let unauthed;
    let unauthed_firestore;
    const TEST_COLLECTIONS = ['team', 'events'];
    const ACCOUNTS = {
        normal: {
            uid: 'GadhwYtretuMoRWatW5ItOTrPHYS',
            options: {},
        },
        admin: {
            uid: 'PSZJ9EQ85Ik41BkBTpMriN3mucjr',
            options: {
                admin: true,
            },
        },
        event: {
            uid: '2Pzu1Mk3hynwOwt4LzJOQarRo3dZ',
            options: {
                event: true,
            },
        },
        team: {
            uid: 'wejiQXHwPypT0iZXWim2q62OkKzx',
            options: {
                team: true,
            },
        },
    };

    beforeAll(async () => {
        testEnv = await setup();
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
        const authed = testEnv.authenticatedContext(
            ACCOUNTS.normal.uid,
            ACCOUNTS.normal.options
        );
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

    test('success when create/update/delete "team" collection with perms.', async () => {
        const authed = testEnv.authenticatedContext(
            ACCOUNTS.team,
            ACCOUNTS.team.options
        );
        const firestore = authed.firestore();
        const collection = 'team';

        // create a new document
        const dummyData = {
            is_public: true,
        };
        const id = `demo-firestore-rules-${Date.now()}`;
        const docRef = doc(firestore, collection, id);

        await expect(setDoc(docRef, dummyData)).toAllow();

        let docSnap = await getDoc(docRef);
        expect(docSnap.data().is_public).toBeTruthy();

        // update the field
        await expect(updateDoc(docRef, { is_public: false }));
        docSnap = await getDoc(docRef);
        expect(docSnap.data().is_public).toBeFalsy();

        // delete the doc
        await expect(deleteDoc(docRef)).toAllow();
    });

    test('success when create/update/delete in "events" collection with perms.', async () => {
        const authed = testEnv.authenticatedContext(
            ACCOUNTS.event,
            ACCOUNTS.event.options
        );
        const firestore = authed.firestore();
        const collection = 'events';

        // create a new document
        const dummyData = {
            is_public: true,
        };
        const id = `demo-firestore-rules-${Date.now()}`;
        const docRef = doc(firestore, collection, id);

        await expect(setDoc(docRef, dummyData)).toAllow();

        let docSnap = await getDoc(docRef);
        expect(docSnap.data().is_public).toBeTruthy();

        // update the field
        await expect(updateDoc(docRef, { is_public: false }));
        docSnap = await getDoc(docRef);
        expect(docSnap.data().is_public).toBeFalsy();

        // delete the doc
        await expect(deleteDoc(docRef)).toAllow();
    });

    test('success when create/update/delete in all collections with admin perms', async () => {
        const authed = testEnv.authenticatedContext(
            ACCOUNTS.admin,
            ACCOUNTS.admin.options
        );
        const firestore = authed.firestore();
        for (let collection of TEST_COLLECTIONS) {
            // create a new document
            const dummyData = {
                is_public: true,
            };
            const id = `demo-firestore-rules-${Date.now()}`;
            const docRef = doc(firestore, collection, id);

            await expect(setDoc(docRef, dummyData)).toAllow();

            let docSnap = await getDoc(docRef);
            expect(docSnap.data().is_public).toBeTruthy();

            // update the field
            await expect(updateDoc(docRef, { is_public: false }));
            docSnap = await getDoc(docRef);
            expect(docSnap.data().is_public).toBeFalsy();

            // delete the doc
            await expect(deleteDoc(docRef)).toAllow();
        }
    });

    test('fail when modifying document withouth perms', async () => {
        const authed = testEnv.authenticatedContext(
            ACCOUNTS.normal,
            ACCOUNTS.normal.options
        );
        const firestore = authed.firestore();
        for (let collection of TEST_COLLECTIONS) {
            const dummyData = {
                is_public: true,
            };
            const id = `demo-firestore-rules-${Date.now()}`;
            const docRef = doc(firestore, collection, id);
            await expect(setDoc(docRef, dummyData)).toDeny();

            // this should not be possible.
            await expect(
                updateDoc(doc(firestore, collection, 'public-doc'), {
                    is_public: false,
                })
            ).toDeny();
            await expect(
                updateDoc(doc(firestore, collection, 'private-doc'), {
                    is_public: true,
                })
            ).toDeny();
            await expect(
                updateDoc(doc(firestore, collection, 'no-public-field'), {
                    is_public: false,
                })
            ).toDeny();
        }
    });
});
