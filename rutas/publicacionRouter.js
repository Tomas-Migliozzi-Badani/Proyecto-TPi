import express from "express";
import{
    listarPublicaciones,
    mostrarFormularioCrear,
    crearPublicacion,
    mostrarDetallePublicacion,
    mostrarFormularioEditar,
    editarPublicacion,
    eliminarPublicacion,
    crearComentario , 
    valorarPublicacion
} from "../controladores/publicacionControlador.js";

import {verificarSesion} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/",verificarSesion,listarPublicaciones);

//publicaciones
router.get("/crear",verificarSesion ,mostrarFormularioCrear);
router.post("/crear",verificarSesion,crearPublicacion);
//comentario
router.post("/:id/comentarios", verificarSesion,crearComentario);

//editar
router.get("/:id/editar", verificarSesion,mostrarFormularioEditar);
router.post("/:id/editar", verificarSesion,editarPublicacion);
//eliminar
router.post("/:id/eliminar",verificarSesion,eliminarPublicacion);
//valoraciones
router.post("/:id/valorar",verificarSesion,valorarPublicacion);
//
router.get("/:id",verificarSesion,mostrarDetallePublicacion);
export default router;