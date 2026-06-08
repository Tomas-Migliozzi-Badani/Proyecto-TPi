import express from "express";
import{
    listarPublicaciones,
    mostrarFormularioCrear,
    crearPublicacion,
    mostrarDetallePublicacion,
    mostrarFormularioEditar
} from "../controladores/publicacionControlador.js";



const router = express.Router();

router.get("/",listarPublicaciones);



router.get("/crear", mostrarFormularioCrear);
router.post("/crear",crearPublicacion);

router.get("/:id/editar", mostrarFormularioEditar);
//router.post("/:id/editar", editarPublicacion);

router.get("/:id",mostrarDetallePublicacion);
export default router;