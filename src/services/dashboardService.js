import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";

import { db } from "../config/firebase";
import { getUserProfile } from "./userService";

function withId(snapshot) {
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

async function getDocument(collectionName, id) {
  if (!id) return null;
  const snapshot = await getDoc(doc(db, collectionName, id));
  return withId(snapshot);
}

export async function getUserSubjects(uid, usuarioPensumId) {
  if (!uid || !usuarioPensumId) return [];

  const subjectsQuery = query(
    collection(db, "usuarios_materias"),
    where("usuario_id", "==", uid),
    where("usuario_pensum_id", "==", usuarioPensumId)
  );

  const snapshot = await getDocs(subjectsQuery);

  return snapshot.docs.map((subjectDoc) => ({
    id: subjectDoc.id,
    ...subjectDoc.data(),
  }));
}

export async function getCurrentUserDashboard(uid) {
  if (!uid) {
    throw new Error("No hay una sesion activa. Inicia sesion para continuar.");
  }

  const user = await getUserProfile(uid);

  if (!user) {
    throw new Error("No encontramos tu perfil en Uniqo. Contacta soporte para revisar tu cuenta.");
  }

  if (user.estado_cuenta !== "activo") {
    return {
      user,
      blocked: true,
      reason: "Tu cuenta no esta activa. Contacta soporte si crees que esto es un error.",
    };
  }

  if (!user.tiene_pensum_activo) {
    return {
      user,
      blocked: false,
      hasActivePensum: false,
      university: null,
      career: null,
      pensum: null,
      userPensum: null,
      subjects: [],
    };
  }

  const [university, career, pensum, userPensum, subjects] = await Promise.all([
    getDocument("universidades_verificadas", user.universidad_actual_id),
    getDocument("carreras_verificadas", user.carrera_actual_id),
    getDocument("pensums_verificados", user.pensum_actual_id),
    getDocument("usuarios_pensum", user.usuario_pensum_activo_id),
    getUserSubjects(uid, user.usuario_pensum_activo_id),
  ]);

  return {
    user,
    blocked: false,
    hasActivePensum: true,
    university,
    career,
    pensum,
    userPensum,
    subjects,
  };
}
