import express from "express";
import{
    listarPublicaciones,
    mostrarFormularioCrear,
    crearPublicacion,
    mostrarDetallePublicacion,
    mostrarFormularioEditar,
    editarPublicacion,
    eliminarPublicacion
} from "../controladores/publicacionControlador.js";



const router = express.Router();


router.get("/",listarPublicaciones)



router.get("/crear", mostrarFormularioCrear);
router.post("/crear",crearPublicacion);

router.get("/:id/editar", mostrarFormularioEditar);
router.post("/:id/editar", editarPublicacion);

router.post("/:id/eliminar",eliminarPublicacion);

router.get("/:id",mostrarDetallePublicacion);
export default router;