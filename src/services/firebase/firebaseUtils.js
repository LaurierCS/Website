import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref as getStorageRef,
    uploadBytes,
} from 'firebase/storage';
import { addDoc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from '@scripts/firebase';

// general todos:
// 1. handle more picture formats
// 2. add error handlers with descriptive error feedback

async function uploadPicture(docId, file, bucket = 'members') {
    const storage = getStorage(app);
    const storageRef = getStorageRef(storage, `${bucket}/${docId}.jpg`);

    // todo: add error handling
    const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'image/jpg',
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}

async function deletePicture(docId, bucket = 'members') {
    const storage = getStorage(app);
    const storageRef = getStorageRef(storage, `${bucket}/${docId}.jpg`);

    try {
        await deleteObject(storageRef);
        console.log('picture deleted');
    } catch (error) {
        console.error(error);
        // todo: add error handling
    }
}

async function addMember(colRef, values, picture) {
    values.date_joined = values.date_joined.toISOString();

    const docRef = await addDoc(colRef, values);

    if (picture) {
        const downloadUrl = await uploadPicture(docRef.id, picture);
        await updateMember(docRef, { picture: downloadUrl }, null);
    }

    return docRef.id;
}

/*
 * Returns: boolean - `true` if updated else `false`
 * */
async function updateMember(docRef, values, picture) {
    if (picture) {
        // upload picture first to get downloadUrl
        // todo: finish this method to upload picture
        const downloadUrl = await uploadPicture(docRef.id, picture);
        values['picture'] = downloadUrl;
    }

    try {
        await updateDoc(docRef, values);
        return true;
    } catch (error) {
        console.error(error);
    }

    return false;
}

async function deleteMember(docRef) {
    await deleteDoc(docRef);
    await deletePicture(docRef.id);
}

export { updateMember, uploadPicture, deletePicture, addMember, deleteMember };
