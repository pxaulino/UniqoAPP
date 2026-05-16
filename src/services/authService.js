import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore/lite";

import { auth, db } from "../config/firebase";
import {
  getUserProfile,
  updateUserLastAccess,
} from "./userService";

export function getFriendlyAuthError(error, context = "general") {
  const code = error?.code;

  if (code === "auth/email-already-in-use") {
    return "Ya existe una cuenta registrada con este correo.";
  }

  if (code === "auth/invalid-email") {
    return "El correo ingresado no es valido.";
  }

  if (code === "auth/weak-password") {
    return "La contrasena debe tener al menos 6 caracteres.";
  }

  if (code === "auth/network-request-failed") {
    return "No pudimos conectar con Firebase. Revisa tu internet e intenta otra vez.";
  }

  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Correo o contrasena incorrectos.";
  }

  if (code === "auth/user-not-found") {
    return "No encontramos una cuenta con este correo.";
  }

  if (code === "auth/too-many-requests") {
    return "Se han realizado demasiados intentos. Espera unos minutos e intenta otra vez.";
  }

  if (code === "auth/missing-password") {
    return "Ingresa tu contrasena para continuar.";
  }

  if (code === "permission-denied") {
    return "No tienes permisos para completar esta accion. Revisa las reglas de Firestore.";
  }

  if (context === "login") {
    return "No pudimos iniciar sesion. Revisa tus datos e intenta nuevamente.";
  }

  if (context === "reset") {
    return "No pudimos enviar el correo de recuperacion. Intenta nuevamente.";
  }

  return "No pudimos crear tu cuenta en este momento. Intenta nuevamente.";
}

export async function registerUser({ nombre, apellido, correo, password }) {
  const cleanNombre = nombre.trim();
  const cleanApellido = apellido.trim();
  const cleanCorreo = correo.trim().toLowerCase();
  const nombreCompleto = `${cleanNombre} ${cleanApellido}`.trim();

  let createdUser = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanCorreo, password);
    createdUser = userCredential.user;

    await updateProfile(createdUser, {
      displayName: nombreCompleto,
    });

    await setDoc(doc(db, "usuarios", createdUser.uid), {
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
    });

    return createdUser;
  } catch (error) {
    if (createdUser) {
      try {
        await deleteUser(createdUser);
      } catch {
        // If cleanup fails, surface the original registration error.
      }
    }

    throw new Error(getFriendlyAuthError(error, "register"));
  }
}

export async function loginUser({ correo, password }) {
  try {
    const cleanCorreo = correo.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, cleanCorreo, password);
    const firebaseUser = userCredential.user;
    const profile = await getUserProfile(firebaseUser.uid);

    if (!profile) {
      await signOut(auth);
      throw new Error("No encontramos tu perfil en Uniqo. Contacta soporte para revisar tu cuenta.");
    }

    if (profile.estado_cuenta !== "activo") {
      await signOut(auth);
      throw new Error("Tu cuenta no esta activa. Contacta soporte si crees que esto es un error.");
    }

    await updateUserLastAccess(firebaseUser.uid);

    return {
      firebaseUser,
      profile,
      isAdmin: profile.rol === "admin" && profile.es_admin === true,
      // Admin users can access the Admin Panel later, but they stay in the normal flow after login.
    };
  } catch (error) {
    if (!error?.code && error instanceof Error) {
      throw error;
    }

    throw new Error(getFriendlyAuthError(error, "login"));
  }
}

export async function resetPassword(correo) {
  try {
    await sendPasswordResetEmail(auth, correo.trim().toLowerCase());
  } catch (error) {
    throw new Error(getFriendlyAuthError(error, "reset"));
  }
}

export async function logoutUser() {
  await signOut(auth);
}
