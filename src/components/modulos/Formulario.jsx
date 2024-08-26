// src/components/Formulario.jsx
import React from "react";

const Formulario = ({ user, capturarInputs, guardarDatos, subid }) => {
  const { nombre, descripcion, tarea, priv } = user;

  return (
    <div className="col-md-4">
      <h3 className="text-center mb-3">
        {subid === "" ? "Ingresar Tareas" : "Actualizar Tareas"}
      </h3>
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
              disabled
            >
              <option value="Publico">Público</option>
              <option value="Privado">Privado</option>
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
  );
};

export default Formulario;
