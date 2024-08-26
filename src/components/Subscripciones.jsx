// src/components/Subscripciones.jsx
import React, { useState, useEffect } from "react";
import appFirebase from "../Credenciales";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const db = getFirestore(appFirebase);

const Subscripciones = ({ setUsuarioSeleccionado }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [tareasPublicas, setTareasPublicas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionadoLocal] = useState(null);

  useEffect(() => {
    // Obtener la lista de usuarios
    const obtenerUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Usuarios"));
        const listaUsuarios = querySnapshot.docs.map((doc) => doc.id);
        setUsuarios(listaUsuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    obtenerUsuarios();
  }, []);

  const mostrarTareasPublicas = async (usuario) => {
    setUsuarioSeleccionadoLocal(usuario);
    try {
      const userRef = collection(db, "Usuarios", usuario, "Tareas");
      const q = query(userRef, where("priv", "==", "Publico"));
      const querySnapshot = await getDocs(q);
      const tareas = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTareasPublicas(tareas);
    } catch (error) {
      console.error("Error al obtener tareas públicas:", error);
    }
  };

  return (
    <div className="container">
      <h2>Usuarios Registrados</h2>
      <ul className="list-group">
        {usuarios.map((usuario) => (
          <li key={usuario} className="list-group-item">
            <button
              className="btn btn-link"
              onClick={() => mostrarTareasPublicas(usuario)}
            >
              {usuario}
            </button>
          </li>
        ))}
      </ul>
      {usuarioSeleccionado && (
        <div>
          <h3>Tareas Públicas de {usuarioSeleccionado}</h3>
          <ul className="list-group">
            {tareasPublicas.map((tarea) => (
              <li key={tarea.id} className="list-group-item">
                <p>Nombre: {tarea.nombre}</p>
                <p>Descripción: {tarea.descripcion}</p>
                <p>Tipo: {tarea.tarea}</p>
                <p>Estado: {tarea.completado ? "Completado" : "Pendiente"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Subscripciones;
