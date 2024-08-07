import { addDoc, collection, doc, deleteDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './FirebaseSetup';

export async function writeToDB(data, collectionName) {
    const updatedData = { ...data, owner: auth.currentUser.uid };
    try {
        await addDoc(collection(db, collectionName), updatedData);
    } catch (err) {
        console.error(err);
    }
}

export async function deleteFromDB(docId, collectionName) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
    } catch (err) {
        console.error(err);
    }
}

export async function updateDetails(docId, collectionName, data) {
    try {
        await updateDoc(doc(db, collectionName, docId), data);
    } catch (err) {
        console.error(err);
    }
}

export async function readAllDocs(collectionName){
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        let newArray = [];
        querySnapshot.forEach((doc) => {
            newArray.push({ ...doc.data(), id: docSnapShot.id });
        });}
        catch(err){
            console.error(err);
        }
}
