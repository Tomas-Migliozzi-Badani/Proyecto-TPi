import express from "express";

import {
    listarUsuariosParaSeguir,
    seguirUsuario,
    dejarDeSeguirUsuario,
    mostrarFeedSeguidos
} from "../controladores/seguirControlador.js";

import { verificarSesion } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verificarSesion, listarUsuariosParaSeguir);

router.post("/:id/seguir", verificarSesion, seguirUsuario);

router.post("/:id/dejar-de-seguir", verificarSesion, dejarDeSeguirUsuario);

router.get("/feed", verificarSesion, mostrarFeedSeguidos);

export default router;