import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";


// ✅ CREATE mission
export const createMission = async (data) => {
  return await addDoc(collection(db, "missions"), {
    ...data,
    createdAt: new Date(),
  });
};


// ✅ GET all missions (one time)
export const getMissions = async () => {
  const snapshot = await getDocs(collection(db, "missions"));

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};


// 🔥 REAL-TIME missions (IMPORTANT)
export const subscribeMissions = (callback) => {
  return onSnapshot(collection(db, "missions"), (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    callback(data);
  });
};


// ✏️ UPDATE mission
export const updateMission = async (id, data) => {
  const ref = doc(db, "missions", id);
  return await updateDoc(ref, data);
};