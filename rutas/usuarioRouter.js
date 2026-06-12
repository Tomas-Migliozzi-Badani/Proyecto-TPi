import express from "express";
import { 
    iniciarSesion, 
    mostrarLogin 

} from "../controladores/usuarioControlador.js";


const router = express.Router();

router.get("/registro", (req, res) => {
    res.render("usuarios/login", {
        mensajeRegistro:"Debe ingresar con algún usuario autorizado"
    });
});

router.get("/login",mostrarLogin);
router.post("/login", iniciarSesion);

export default router ;