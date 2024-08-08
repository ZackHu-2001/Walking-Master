import { db } from "./FirebaseSetup";
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";

export const getGameInfo = async (id) => {
    const querySnapshot = await getDocs(collection(db, "games"));
    querySnapshot.forEach((doc) => {
        if (doc.id === id) {
            return doc.data();
        }
    });
}

export const addGame = async (game) => {
    return await addDoc(collection(db, "games"), game);
}

export const getComment = async (id) => {
    const querySnapshot = await getDocs(collection(db, "comments"));
    querySnapshot.forEach((doc) => {
        if (doc.id === id) {
            return doc.data();
        }
    });
}

export const addComment = async (comment) => {
    return await addDoc(collection(db, "comments"), comment);
}

export const getUser = async (id) => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        if (doc.id === id) {
            return doc.data();
        }
    });
}

export const addUser = async (user) => {
    return await addDoc(collection(db, "users"), user);
}
