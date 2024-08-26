//src/Carrusel.jsx
import React from "react";
import Uno from "../imagenes/1.png";
import Dos from "../imagenes/2.webp";
import Tres from "../imagenes/3.png";

const Carrusel = () => {
  return (
    <div className="col-md-8">
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner rounded rounded-10">
          <div className="carousel-item active">
            <img src={Uno} alt="" className="img-fluid d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src={Dos} alt="" className="img-fluid d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src={Tres} alt="" className="img-fluid d-block w-100" />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carrusel;
