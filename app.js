import express from "express";

import publicacionRouter from './rutas/publicacionRouter.js';
//import categoriaRouter from './rutas/categoriaRouter.js';
//constantes
const PORT = process.env.PORT || 3000;
const app = express();

//MIDOLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//MOtor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');
//RUTAS
app.get('/', (req,res) =>{
    res.render('index');
})
app.use("/publicaciones",publicacionRouter);
//app.use("/categorias",categoriaRouter);
/*app.get('/categorias', (req,res)=>{
    res.render('categorias');
});*/
//servidor
app.listen(PORT, (err) => {
    if(err){
    console.error('Error al iniciar el servidor')
    return;
    }
    console.log(`servidor escuchando el puerto ${PORT}`);
});
