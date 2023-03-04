import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import path from 'path';
import fs from 'fs';

export async function setup(options = {}) {
    if (!options.projectId) options.projectId = 'demo-firestore-rules';

    if (!options.firestore) {
        const rulesPath = path.resolve(
            __dirname,
            '../../emulators/config/firestore.rules'
        );
        options.firestore = {
            rules: fs.readFileSync(rulesPath, 'utf8'),
            host: '127.0.0.1',
            port: 8080,
        };
    }

    const testEnv = await initializeTestEnvironment(options);

    return testEnv;
}

expect.extend({
    async toAllow(x) {
        let pass = false;
        try {
            await assertSucceeds(x);
            pass = true;
        } catch (_error) {}

        return {
            pass,
            message: () =>
                'Expected Firebase operation to be allowed, but it failed',
        };
    },

    async toDeny(x) {
        let pass = false;
        try {
            await assertFails(x);
            pass = true;
        } catch (_error) {}

        return {
            pass,
            message: () =>
                'Expected Firebase operation to be denied, but it was allowed',
        };
    },
});
