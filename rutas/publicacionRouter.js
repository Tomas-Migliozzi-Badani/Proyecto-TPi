const express = require('express');
const router = express.Router();

const publicacionController = require('../controladores/publicacionControlador');


router.get("/",publicacionController.listarPublicaciones);

module.exports = router;