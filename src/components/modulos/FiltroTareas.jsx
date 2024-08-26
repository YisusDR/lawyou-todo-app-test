// src/components/FiltroTareas.jsx
import React from "react";

const FiltroTareas = ({
  filtroPriv,
  setFiltroPriv,
  filtroTarea,
  setFiltroTarea,
}) => {
  return (
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
            <option value="Publico">Público</option>
            <option value="Privado">Privado</option>
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
  );
};

export default FiltroTareas;
