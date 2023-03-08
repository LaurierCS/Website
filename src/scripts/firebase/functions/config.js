import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { app } from '@scripts/firebase';
// init functions

const functions = getFunctions(app);

if (import.meta.env.DEV) {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

export { functions };
