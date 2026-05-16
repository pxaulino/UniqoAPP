import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";

import { db } from "../config/firebase";

export async function getUserProfile(uid) {
  const userRef = doc(db, "usuarios", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateUserLastAccess(uid) {
  const userRef = doc(db, "usuarios", uid);

  await updateDoc(userRef, {
    ultimo_acceso: serverTimestamp(),
    actualizado_en: serverTimestamp(),
  });
}
