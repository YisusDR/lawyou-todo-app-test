// src/components/ListaTareas.jsx
import React from "react";
import BotonesTarea from "./BotonesTarea"; // Importa el componente de botones

const ListaTareas = ({ lista, deleteUser, getOne, toggleCompletado }) => {
  return (
    <div className="col-md-8">
      <h2 className="text-center mb-5">Lista de Tareas</h2>
      <div className="container-card">
        <div className="card-body">
          {lista.map((tarea) => (
            <div key={tarea.id}>
              <p>Nombre: {tarea.nombre}</p>
              <p>Privacidad: {tarea.priv}</p>
              <p>Tarea: {tarea.tarea}</p>
              <p>Estado: {tarea.completado ? "Completado" : "Pendiente"}</p>
              <p>Descripción: {tarea.descripcion}</p>
              {/* Usar componente BotonesTarea para las acciones */}
              <BotonesTarea
                tarea={tarea}
                deleteUser={deleteUser}
                getOne={getOne}
                toggleCompletado={toggleCompletado}
              />
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaTareas;
