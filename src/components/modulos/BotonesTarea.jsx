// src/components/BotonesTarea.jsx
import React from "react";

const BotonesTarea = ({ tarea, deleteUser, getOne, toggleCompletado }) => {
  return (
    <>
      <button className="btn btn-danger" onClick={() => deleteUser(tarea.id)}>
        Eliminar
      </button>
      <button className="btn btn-success m-1" onClick={() => getOne(tarea.id)}>
        Actualizar
      </button>
      <button
        className="btn btn-warning m-1"
        onClick={() => toggleCompletado(tarea.id)}
      >
        {tarea.completado ? "Marcar como pendiente" : "Marcar como completado"}
      </button>
    </>
  );
};

export default BotonesTarea;
