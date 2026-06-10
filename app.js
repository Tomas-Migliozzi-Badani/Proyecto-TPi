import express from "express";

import publicacionRouter from './rutas/publicacionRouter.js';
import session from "express-session";
import usuarioRouter from './rutas/usuarioRouter.js';
//constantes
const PORT = process.env.PORT || 3000;
const app = express();

//MIDOLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: "fotaza-secreto" ,
        resave: false , 
        saveUninitialized: false
    })
);
app.use((req,res,next) => {
    res.locals.usuario = req.session.usuario ;
    next();
});
//MOtor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');
//RUTAS
app.get('/', (req,res) =>{
    res.render('index');
})
app.get("/perfil",(req,res) =>{
    console.log(req.session);
    res.send(req.session.usuario);
});


app.use("/usuarios",usuarioRouter);
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
