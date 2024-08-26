// src/components/HomeLocal.jsx
import React from "react";
import Formulario from "./modulos/Formulario"; // Mantén el Formulario como está
import useTareas from "./hooks/useTareas"; // Importa el custom hook

const HomeLocal = () => {
  const {
    user,
    lista,
    subid,
    filtroPriv,
    setFiltroPriv,
    filtroTarea,
    setFiltroTarea,
    capturarInputs,
    guardarDatos,
    deleteUser,
    getOne,
    toggleCompletado,
  } = useTareas(); // Llama al hook sin `correoUsuario` para el modo local

  const tareasFiltradas = lista
    .filter((tarea) => (filtroPriv ? tarea.priv === filtroPriv : true))
    .filter((tarea) => (filtroTarea ? tarea.tarea === filtroTarea : true));

  return (
    <div className="container">
      <p>Bienvenido, usuario no autenticado</p>
      <div className="card-body">
        <div className="row">
          <Formulario
            user={user}
            capturarInputs={capturarInputs}
            guardarDatos={guardarDatos}
            subid={subid}
          />
          <div className="col-md-8">
            <h2 className="text-center mb-5">Lista de Tareas</h2>
            <div className="container-card">
              <div className="container text-center">
                <div className="row">
                  <div className="col">
                    <select
                      name="priv"
                      className="form-select mb-3"
                      onChange={(e) => setFiltroPriv(e.target.value)}
                      value={filtroPriv}
                    >
                      <option value="">Ver todos</option>
                      <option value="publico">Público</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>
                  <div className="col">
                    <select
                      name="tareasFiltro"
                      className="form-select mb-3"
                      onChange={(e) => setFiltroTarea(e.target.value)}
                      value={filtroTarea}
                    >
                      <option value="">Ver todos</option>
                      <option value="trabajo">Trabajo</option>
                      <option value="estudio">Estudio</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {tareasFiltradas.map((tarea) => (
                  <div key={tarea.id}>
                    <p>Nombre: {tarea.nombre}</p>
                    <p>Privacidad: {tarea.priv}</p>
                    <p>Tarea: {tarea.tarea}</p>
                    <p>
                      Estado: {tarea.completado ? "Completado" : "Pendiente"}
                    </p>
                    <p>Descripción: {tarea.descripcion}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteUser(tarea.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-success m-1"
                      onClick={() => getOne(tarea.id)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="btn btn-warning m-1"
                      onClick={() => toggleCompletado(tarea.id)}
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
    </div>
  );
};

export default HomeLocal;
