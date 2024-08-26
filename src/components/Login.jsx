import React, { useState } from "react";
import Carrusel from "./Carrusel";
import appFirebase from "../Credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Login = ({ setUsuario, setMostrarLogin }) => {
  const [registro, setRegistro] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [errores, setErrores] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const clave = e.target.clave.value;

    const nuevosErrores = {};
    if (clave.length < 6) {
      nuevosErrores.clave = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      let userCredential;
      if (registro) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          correo,
          clave
        );

        // Intentamos guardar en Firestore
        try {
          // Utiliza el correo del usuario como ID del documento
          const userDocRef = doc(db, "Usuarios", userCredential.user.email);

          // Guardamos los datos del usuario
          await setDoc(userDocRef, {
            email: userCredential.user.email,
            uid: userCredential.user.uid,
          });

          // Ejemplo de cómo agregar una tarea
          const tareasCollectionRef = collection(userDocRef, "Tareas");
          await addDoc(tareasCollectionRef, {
            titulo: "Mi primera tarea",
            descripcion: "Descripción de la tarea",
            completado: false,
          });

          // Enviar correo de verificación
          await sendEmailVerification(userCredential.user);
          swal(
            "Registro exitoso",
            "Por favor, verifica tu correo electrónico antes de iniciar sesión."
          );
        } catch (dbError) {
          // Si hay un error al guardar en Firestore, borramos la cuenta creada
          await userCredential.user.delete();
          throw new Error(
            "Error al guardar en la base de datos. Intenta de nuevo."
          );
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, correo, clave);

        if (userCredential.user.emailVerified) {
          swal("Usuario iniciado exitosamente");
          setUsuario(userCredential.user);
        } else {
          swal("Verifica tu correo electrónico antes de iniciar sesión.");
        }
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrores({ email: "El correo electrónico ya está en uso." });
      } else {
        console.error("Error en la autenticación:", error.message);
        swal(error.message || "Ha ocurrido un error");
      }
    }
  };

  return (
    <div className="row container p-4">
      <h1 className="titulo">
        <span className="orange-color">L</span>awyou{" "}
        <span className="orange-color">T</span>est{" "}
        <span className="orange-color">A</span>pp
      </h1>
      <hr />
      <Carrusel />
      <div className="col-md-4">
        <div className="mt-5 ms-5">
          <h1>{registro ? "Regístrate" : "Inicia sesión"}</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Dirección de Correo: </label>
              <br />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                id="email"
                required
              />
              {errores.email && (
                <small className="text-danger">{errores.email}</small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Clave: </label>
              <br />
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                id="clave"
                required
              />
              {errores.clave && (
                <small className="text-danger">{errores.clave}</small>
              )}
            </div>

            {registro && (
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terminos"
                  checked={terminosAceptados}
                  onChange={() => setTerminosAceptados(!terminosAceptados)}
                />
                <label className="form-check-label" htmlFor="terminos">
                  Acepto los términos y condiciones de la empresa
                </label>
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={registro && !terminosAceptados}
            >
              {registro ? "Regístrate" : "Inicia Sesión"}
            </button>
          </form>

          <div className="form-group">
            <button
              onClick={() => setRegistro(!registro)}
              className="btn btn-secondary mt-4 form-control"
            >
              {registro
                ? "¿Ya tienes una cuenta? Inicia sesión"
                : "¿No tienes cuenta? Entonces, ¿qué esperas?"}
            </button>
          </div>

          <button
            onClick={() => setMostrarLogin(false)}
            className="btn btn-link mt-3"
          >
            Continuar sin autenticar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
