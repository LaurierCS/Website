import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// IMPORTANT: THIS FUNCTION HAS NOT BEEN TESTED!
async function uploadPicture(docId, file, storage) {
    const storageRef = ref(storage, `team/${docId}.jpg`);
    const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'image/jpg',
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}

export { uploadPicture };
