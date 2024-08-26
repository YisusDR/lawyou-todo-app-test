import React, { useState, useEffect } from "react";
import HomeLocal from "./components/HomeLocal";
import Login from "./components/Login";
import Home from "./components/Home";
import Subscripciones from "./components/Subscripciones";
import appFirebase from "./Credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [componenteActual, setComponenteActual] = useState("Home"); // Nuevo estado para la navegación

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
        setMostrarLogin(false);
        setComponenteActual("HomeLocal"); // Mostrar HomeLocal si no hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setMostrarLogin(true);
  };

  const handleLogout = () => {
    setUsuario(null);
    setMostrarLogin(false);
    setComponenteActual("HomeLocal"); // Volver a HomeLocal al cerrar sesión
  };

  return (
    <div>
      {usuario ? (
        <Home
          correoUsuario={usuario.email}
          handleLogout={handleLogout}
          setComponenteActual={setComponenteActual}
        />
      ) : !mostrarLogin ? (
        <>
          <div className="d-flex justify-content-evenly">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleLoginClick}
            >
              Registro/Login
            </button>
          </div>
          <HomeLocal />
        </>
      ) : (
        <Login setUsuario={setUsuario} setMostrarLogin={setMostrarLogin} />
      )}
    </div>
  );
}

export default App;
