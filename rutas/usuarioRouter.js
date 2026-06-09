import express from "express";
import { 
    iniciarSesion, 
    mostrarLogin 

} from "../controladores/usuarioControlador.js";


const router = express.Router();



router.get("/login",mostrarLogin);
router.post("/login", iniciarSesion);

export default router ;