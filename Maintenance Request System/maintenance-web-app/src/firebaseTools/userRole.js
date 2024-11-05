import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
        return userDoc.data().userType;
    }
    return null;
};