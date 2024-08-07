import { db } from "./FirebaseSetup";
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";

export const readImage = async (id) => {
    const querySnapshot = await getDocs(collection(db, "images"));
    querySnapshot.forEach((doc) => {
        if (doc.id === id) {
            return doc.data();
        }
    });
}