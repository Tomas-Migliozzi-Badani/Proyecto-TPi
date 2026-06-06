import express from "express";
import{
    listarPublicaciones,
    mostrarFormularioCrear
} from "../controladores/publicacionControlador.js";



const router = express.Router();



router.get("/",listarPublicaciones);

router.get("/crear",mostrarFormularioCrear);

export default router;