import express from "express";
import{
    listarPublicaciones,
    mostrarFormularioCrear,
    crearPublicacion,
    mostrarDetallePublicacion,
    mostrarFormularioEditar,
    editarPublicacion,
    eliminarPublicacion,
    crearComentario
} from "../controladores/publicacionControlador.js";

import {verificarSesion} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/",verificarSesion,listarPublicaciones);

//publicaciones


router.get("/crear",verificarSesion ,mostrarFormularioCrear);
router.post("/crear",verificarSesion,crearPublicacion);

router.post("/:id/comentarios", crearComentario);


router.get("/:id/editar", mostrarFormularioEditar);
router.post("/:id/editar", editarPublicacion);

router.post("/:id/eliminar",eliminarPublicacion);

router.get("/:id",mostrarDetallePublicacion);
export default router;