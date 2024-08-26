// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import appFirebase from "../Credenciales";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Home = ({ correoUsuario, handleLogout, setComponenteActual }) => {
  const valorInicial = {
    nombre: "",
    descripcion: "",
    tarea: "",
    priv: "publico",
    completado: false,
  };

  const [user, setUser] = useState(valorInicial);
  const [lista, setLista] = useState([]);
  const [listaM, setListaM] = useState([]);
  const [subid, setSubid] = useState("");
  const [filtroPriv, setFiltroPriv] = useState("");
  const [filtroTarea, setFiltroTarea] = useState("");

  const { nombre, descripcion, tarea, priv, completado } = user;

  const capturarInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //Filtro de privacidad
  const filtrarPrivacidad = (e) => {
    const { value } = e.target;
    setFiltroPriv(value);
  };

  const filtrarTipoTarea = (e) => {
    const { value } = e.target;
    setFiltroTarea(value);
  };

  const getLista = async () => {
    try {
      const userRef = doc(db, "Usuarios", correoUsuario); // Documento del usuario
      const querySnapshot = await getDocs(collection(userRef, "Tareas")); // Subcolección "Tareas"
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setLista(docs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLista();
  }, [correoUsuario]);

  useEffect(() => {
    let listaF = [...lista];

    // Aplicar filtro de privacidad
    if (filtroPriv) {
      listaF = listaF.filter((tarea) => tarea.priv === filtroPriv);
    }

    setListaM(listaF);
  }, [filtroPriv, lista]); // Actualizar cuando cambie el filtro de privacidad o la lista

  useEffect(() => {
    let listaF = [...lista];

    // Aplicar filtro de tipo de tarea
    if (filtroTarea) {
      listaF = listaF.filter((tarea) => tarea.tarea === filtroTarea);
    }

    setListaM(listaF);
  }, [filtroTarea, lista]); // Actualizar cuando cambie el filtro de tipo de tarea o la lista

  const guardarDatos = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "Usuarios", correoUsuario);

    // Agregar validación para evitar guardar tareas vacías
    if (!nombre.trim() || !tarea.trim()) {
      console.error("Error: La tarea no puede estar vacía.");
      return;
    }

    try {
      if (subid === "") {
        // Si subid es una cadena vacía, es una nueva tarea
        await addDoc(collection(userRef, "Tareas"), {
          ...user,
        });
      } else {
        // Si subid tiene un valor, es una actualización
        await setDoc(doc(userRef, "Tareas", subid), {
          ...user,
        });
      }

      setUser({ ...valorInicial }); // Reinicia el formulario
      setSubid(""); // Limpia subid para volver al modo de creación
      getLista(); // Recargar la lista después de guardar o actualizar
    } catch (error) {
      console.error("Error al guardar datos:", error);
    }
  };

  const deleteUser = async (id) => {
    const userRef = doc(db, "Usuarios", correoUsuario);
    await deleteDoc(doc(userRef, "Tareas", id));
    getLista();
  };

  const getOne = async (id) => {
    try {
      const userRef = doc(db, "Usuarios", correoUsuario);
      const docRef = doc(userRef, "Tareas", id);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickPendienteCompletado = async (tarea) => {
    const userRef = doc(db, "Usuarios", correoUsuario);
    await setDoc(doc(userRef, "Tareas", tarea.id), {
      ...tarea,
      completado: !tarea.completado,
    });
    getLista();
  };

  return (
    <div className="container">
      <p>
        Bienvenido, <strong>{correoUsuario}</strong> has iniciado sesión
      </p>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            signOut(auth);
            handleLogout(); // Llamamos al handleLogout para actualizar el estado en App
          }}
        >
          Cerrar sesión
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setComponenteActual("Subscripciones")}
        >
          Subscripciones
        </button>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <h3 className="text-center mb-3">Ingresar Tareas</h3>
          <form onSubmit={guardarDatos}>
            <div className="card card-body">
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  className="form-control mb-3"
                  placeholder="Ingrese su tarea"
                  onChange={capturarInputs}
                  value={nombre}
                />
                <select
                  name="priv"
                  className="form-control mb-3"
                  onChange={capturarInputs}
                  value={priv}
                >
                  <option value="Privado">Privado</option>
                  <option value="Publico">Público</option>
                </select>
                <select
                  name="tarea"
                  className="form-control mb-3"
                  onChange={capturarInputs}
                  value={tarea}
                >
                  <option value="">Tipo de tareas</option>
                  <option value="trabajo">Trabajo</option>
                  <option value="estudio">Estudio</option>
                  <option value="personal">Personal</option>
                </select>
                <input
                  type="text"
                  name="descripcion"
                  className="form-control mb-3"
                  placeholder="Ingresar descripcion (opcional)"
                  onChange={capturarInputs}
                  value={descripcion}
                />
              </div>
              <button className="btn btn-primary">
                {subid === "" ? "Guardar" : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-8">
          <h2 className="text-center mb-5">Lista de Tareas</h2>
          <div className="container-card ">
            <div className="container text-center">
              <div className="row">
                <div className="col">
                  <select
                    name="priv"
                    className="form-select mb-3"
                    onChange={filtrarPrivacidad}
                    value={filtroPriv}
                  >
                    <option value="">Ver todos</option>
                    <option value="Publico">Público</option>
                    <option value="Privado">Privado</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    name="tareasFiltro"
                    className="form-select mb-3"
                    onChange={filtrarTipoTarea}
                    value={filtroTarea}
                  >
                    <option value="">Ver todos</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="estudio">Estudio</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div className="col">
                  <input
                    type="text"
                    placeholder="buscar.."
                    className="input-group-text"
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              {listaM.map((tarea) => (
                <div key={tarea.id}>
                  <p>Nombre: {tarea.nombre}</p>
                  <p>Privacidad: {tarea.priv}</p>
                  <p>Tarea: {tarea.tarea}</p>
                  <p>Estado: {tarea.completado ? "Completado" : "Pendiente"}</p>
                  <p>Descripcion: {tarea.descripcion}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(tarea.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-success m-1"
                    onClick={() => {
                      if (subid === tarea.id) {
                        // Si ya está en modo de actualización para esta tarea, limpia `subid`
                        setSubid("");
                      } else {
                        // Si no, setea el id de la tarea a actualizar
                        setSubid(tarea.id);
                        setUser({ ...tarea }); // Cargar datos de tarea seleccionada en el formulario
                      }
                    }}
                  >
                    {subid === tarea.id
                      ? "Cancelar Actualización"
                      : "Actualizar"}
                  </button>

                  <button
                    className="btn btn-warning m-1"
                    onClick={() => handleClickPendienteCompletado(tarea)}
                  >
                    {tarea.completado
                      ? "Marcar como pendiente"
                      : "Marcar como completado"}
                  </button>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
