// src/hooks/useTareas.js
import { useState, useEffect } from "react";

const useTareas = (correoUsuario = null) => {
  const valorInicial = {
    nombre: "",
    descripcion: "",
    tarea: "",
    priv: "publico",
    completado: false,
  };

  const [user, setUser] = useState(valorInicial);
  const [lista, setLista] = useState([]);
  const [subid, setSubid] = useState("");
  const [filtroPriv, setFiltroPriv] = useState("");
  const [filtroTarea, setFiltroTarea] = useState("");

  useEffect(() => {
    if (correoUsuario) {
      getLista();
    } else {
      const storedTareas = JSON.parse(localStorage.getItem("tareas")) || [];
      setLista(storedTareas);
    }
  }, [correoUsuario]);

  const getLista = async () => {
    if (!correoUsuario) return;

    try {
      const userRef = doc(db, "Usuarios", correoUsuario);
      const querySnapshot = await getDocs(collection(userRef, "Tareas"));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setLista(docs);
    } catch (error) {
      console.log(error);
    }
  };

  const capturarInputs = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (correoUsuario) {
      const userRef = doc(db, "Usuarios", correoUsuario);
      try {
        if (subid === "") {
          await addDoc(collection(userRef, "Tareas"), {
            ...user,
          });
        } else {
          await setDoc(doc(userRef, "Tareas", subid), {
            ...user,
          });
        }
        getLista();
      } catch (error) {
        console.error("Error al guardar datos:", error);
      }
    } else {
      let nuevasTareas = [...lista];
      if (subid === "") {
        const nuevaTarea = { ...user, id: Date.now() };
        nuevasTareas.push(nuevaTarea);
      } else {
        nuevasTareas = nuevasTareas.map((tarea) =>
          tarea.id === subid ? { ...user, id: subid } : tarea
        );
      }
      localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
      setLista(nuevasTareas);
    }
    setUser({ ...valorInicial });
    setSubid("");
  };

  const deleteUser = async (id) => {
    if (correoUsuario) {
      const userRef = doc(db, "Usuarios", correoUsuario);
      await deleteDoc(doc(userRef, "Tareas", id));
      getLista();
    } else {
      const nuevasTareas = lista.filter((tarea) => tarea.id !== id);
      localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
      setLista(nuevasTareas);
    }
  };

  const getOne = async (id) => {
    if (correoUsuario) {
      try {
        const userRef = doc(db, "Usuarios", correoUsuario);
        const docRef = doc(userRef, "Tareas", id);
        const docSnap = await getDoc(docRef);
        setUser(docSnap.data());
        setSubid(id);
      } catch (error) {
        console.log(error);
      }
    } else {
      const tarea = lista.find((tarea) => tarea.id === id);
      setUser(tarea);
      setSubid(id);
    }
  };

  const toggleCompletado = async (id) => {
    if (correoUsuario) {
      const userRef = doc(db, "Usuarios", correoUsuario);
      await setDoc(doc(userRef, "Tareas", id), {
        ...user,
        completado: !user.completado,
      });
      getLista();
    } else {
      const nuevasTareas = lista.map((tarea) =>
        tarea.id === id ? { ...tarea, completado: !tarea.completado } : tarea
      );
      localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
      setLista(nuevasTareas);
    }
  };

  return {
    user,
    setUser,
    lista,
    setLista,
    subid,
    setSubid,
    filtroPriv,
    setFiltroPriv,
    filtroTarea,
    setFiltroTarea,
    capturarInputs,
    guardarDatos,
    deleteUser,
    getOne,
    toggleCompletado,
  };
};

export default useTareas;
