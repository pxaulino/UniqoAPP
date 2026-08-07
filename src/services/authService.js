import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../config/firebase";
import {
  createUserProfile,
  getUserProfile,
  isAdminUser,
  updateLastAccess,
} from "./userService";

export function getFriendlyAuthError(error, context = "general") {
  const code = error?.code;

  if (code === "auth/email-already-in-use") {
    return "Este correo ya esta registrado.";
  }

  if (code === "auth/invalid-email") {
    return "El correo no tiene un formato valido.";
  }

  if (code === "auth/weak-password") {
    return "La contrasena debe tener al menos 6 caracteres.";
  }

  if (code === "auth/network-request-failed") {
    return "No se pudo conectar. Verifica tu internet.";
  }

  if (code === "auth/wrong-password") {
    return "La contrasena es incorrecta.";
  }

  if (code === "auth/invalid-credential") {
    return "El correo o la contrasena son incorrectos.";
  }

  if (code === "auth/user-not-found") {
    return "No existe una cuenta con este correo.";
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
  const cleanNombre = (nombre || "").trim();
  const cleanApellido = (apellido || "").trim();
  const cleanCorreo = (correo || "").trim().toLowerCase();
  const nombreCompleto = `${cleanNombre} ${cleanApellido}`.trim();

  let createdUser = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanCorreo, password);
    createdUser = userCredential.user;

    await updateProfile(createdUser, {
      displayName: nombreCompleto,
    });

    const profile = await createUserProfile(createdUser.uid, {
      nombre: cleanNombre,
      apellido: cleanApellido,
      correo: cleanCorreo,
    });

    return {
      firebaseUser: createdUser,
      profile,
      isAdmin: false,
    };
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

    await updateLastAccess(firebaseUser.uid);

    return {
      firebaseUser,
      profile,
      isAdmin: await isAdminUser(profile),
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
