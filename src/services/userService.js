import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

import { db } from "../config/firebase";

export async function createUserProfile(uid, userData) {
  const cleanNombre = (userData?.nombre || "").trim();
  const cleanApellido = (userData?.apellido || "").trim();
  const cleanCorreo = (userData?.correo || "").trim().toLowerCase();
  const nombreCompleto = `${cleanNombre} ${cleanApellido}`.trim();
  const userRef = doc(db, "usuarios", uid);

  const profile = {
    nombre: cleanNombre,
    apellido: cleanApellido,
    nombre_completo: nombreCompleto,
    correo: cleanCorreo,
    foto_url: "",

    rol: "usuario",
    es_admin: false,
    estado_cuenta: "activo",

    tiene_pensum_activo: false,
    usuario_pensum_activo_id: "",
    universidad_actual_id: "",
    carrera_actual_id: "",
    pensum_actual_id: "",
    tipo_pensum_actual: "",

    carrera_finalizada: false,
    progreso_porcentaje: 0,
    creditos_aprobados: 0,
    creditos_totales: 0,
    materias_aprobadas: 0,
    materias_totales: 0,
    materias_en_curso: 0,
    materias_pendientes: 0,

    periodo_actual: 0,
    tipo_periodo: "",

    idioma: "es",
    tema: "sistema",
    notificaciones_activas: true,

    creado_en: serverTimestamp(),
    actualizado_en: serverTimestamp(),
    ultimo_acceso: serverTimestamp(),
  };

  await setDoc(userRef, profile);

  return {
    id: uid,
    ...profile,
  };
}

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

export async function updateLastAccess(uid) {
  const userRef = doc(db, "usuarios", uid);

  await updateDoc(userRef, {
    ultimo_acceso: serverTimestamp(),
    actualizado_en: serverTimestamp(),
  });
}

export const updateUserLastAccess = updateLastAccess;

export async function isAdminUser(uidOrProfile) {
  const profile = typeof uidOrProfile === "string" ? await getUserProfile(uidOrProfile) : uidOrProfile;

  return profile?.rol === "admin" && profile?.es_admin === true;
}
