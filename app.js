import express from "express";

//constantes,
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
    res.render('publicaciones/index');
})
//servidor
app.listen(PORT, () => {
    console.log(`servidor escuchando el puerto ${PORT}`);
});
