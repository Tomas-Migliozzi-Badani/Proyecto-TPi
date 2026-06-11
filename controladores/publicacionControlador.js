console.log("CARGUE EL CONTROLADOR DE PUBLICACIONES");
const publicaciones = [
    {
        id:1 ,
        titulo:"atardecer" , 
        autor: "tomas" , 
        autorId :1  ,
        categoria: "Naturaleza" , 
        valoraciones: 0 ,
        cantidadValoracion: 0
    },
    {
        id:2 , 
        titulo: "el best" , 
        autor: "anda a saber",
        autorId :2 ,
        categoria:"paisajes" , 
        valoraciones: 0 ,
        cantidadValoracion: 0
    }
];
const seguidores = [
    {
        seguidor: "tomas" ,
        seguido: "Profesor"
    }
]
const comentarios = [{
    id : 1 ,
    publicacionId: 1 ,
    autor: "profesor" , 
    texto: "excelente diseño"
    }   
];  
const valoraciones = [];

export const crearPublicacion = (req,res) => {
    
    console.log(req.body);

    const usuario = req.session.usuario;

    if(!usuario) {
        return res.redirect("/usuarios/login");
    }

    const nuevaPublicacion = {
        
        id:publicaciones.length + 1 ,
        titulo: req.body.titulo , 
        autor: req.body.autor ,
        autorId: usuario.id ,
        categoria: req.body.categoria , 
        descripcion: req.body.descripcion ,
        valoraciones: 0 ,
        cantidadValoracion: 0  
    
    };
    
    publicaciones.push(nuevaPublicacion);

    res.redirect("/publicaciones");
};
export const listarPublicaciones = (req,res) => {
    
    console.log("Query",req.query);

    const termino = req.query.buscar;

    console.log("termino", termino);

    let publicacionFiltradas = publicaciones;

    if(termino){
        publicacionFiltradas = publicaciones.filter (
            p => p.titulo.toLowerCase().includes(
                termino.toLowerCase()
            )
        );
    }
    console.log("Resultado:",publicacionFiltradas);


    res.render("publicaciones/listar" , { 
        publicaciones: publicacionFiltradas,
        termino
    });
}; 
export const mostrarFormularioCrear = (req,res) => {
    console.log("Entro en el formulario");
    res.render("publicaciones/crear");
};



export const mostrarDetallePublicacion = (req,res) => {
    const id = parseInt(req.params.id);

    const publicacion = publicaciones.find(
        p => p.id === id 
    );
    if(!publicacion){
        return res.send("publicacion no encontrada");
    }
    const comentariosPublicacion = comentarios.filter(
        c => c.publicacionId === id 
    );


    res.render("publicaciones/detalle",{
        publicacion ,
        comentarios: comentariosPublicacion ,
        usuario: req.session.usuario 
    });
};
export const mostrarFormularioEditar = (req,res) =>{
    const id = parseInt(req.params.id);

    const publicacion = publicaciones.find(
        p => p.id === id 
    );
    if(!publicacion){
        return res.send("Publicacion no encontrada");

    }
    res.render("publicaciones/editar",{
       publicacion 
    });
};
export const editarPublicacion = (req,res) =>{
    const id = parseInt(req.params.id);
    const usuario = req.session.usuario ;
    const publicacion = publicaciones.find(
        p => p.id === id 
    );
    if(!usuario){
        return res.redirect("/usuarios/login");
    }
    if(!publicacion){
        return res.send("Publicacion no encontrada");
    }
    if(publicacion.autorId !== usuario.id) {
        return res.send("No podes editar una publicacion que no es tuya");
    }
    
    publicacion.titulo = req.body.titulo;
    publicacion.categoria = req.body.categoria;
    publicacion.autor = req.body.autor;
    publicacion.descripcion = req.body.descripcion;

    res.redirect(`/publicaciones/${id}`);
}
export const eliminarPublicacion = (req,res) =>{
     console.log("Entró a eliminar");

    const id = parseInt(req.params.id);
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.redirect("/usuarios/login");
    }

    const indice = publicaciones.findIndex(
        p => p.id === id
    );

    if (indice === -1) {
        return res.send("Publicacion no encontrada");
    }

    const publicacion = publicaciones[indice];

    if (publicacion.autorId !== usuario.id) {
        return res.send("No podes eliminar una publicacion que no es tuya");
    }

    publicaciones.splice(indice, 1);

    res.redirect("/publicaciones");
}    
//comentarios
export const crearComentario = (req,res) =>{
    
    const publicacionId = parseInt(req.params.id);

    const nuevoComentario = {
        id: comentarios.length + 1 ,
        publicacionId , 
        autor: req.body.autor , 
        texto: req.body.texto 
    };

    comentarios.push(nuevoComentario);

    res.redirect(`/publicaciones/${publicacionId}`)
}
export const valorarPublicacion = (req, res) => {
    const publicacionId = parseInt(req.params.id);
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.redirect("/usuarios/login");
    }

    const publicacion = publicaciones.find(
        p => p.id === publicacionId
    );

    if (!publicacion) {
        return res.send("Publicación no encontrada");
    }

    // El autor no puede valorar su propia publicación
    if (publicacion.autorId === usuario.id) {
        return res.send("No podés valorar tu propia publicación");
    }

    const puntaje = parseInt(req.body.puntaje);

    if (isNaN(puntaje) || puntaje < 1 || puntaje > 5) {
        return res.send("La valoración debe ser entre 1 y 5");
    }

    const yaValoro = valoraciones.find(
        v => v.publicacionId === publicacionId && v.usuarioId === usuario.id
    );

    if (yaValoro) {
        return res.send("Ya valoraste esta publicación");
    }

    const nuevaValoracion = {
        id: valoraciones.length + 1,
        publicacionId: publicacionId,
        usuarioId: usuario.id,
        puntaje: puntaje
    };

    valoraciones.push(nuevaValoracion);

    const valoracionesDeEstaPublicacion = valoraciones.filter(
        v => v.publicacionId === publicacionId
    );

    const suma = valoracionesDeEstaPublicacion.reduce(
        (acumulador, v) => acumulador + v.puntaje,
        0
    );

    publicacion.cantidadValoracion = valoracionesDeEstaPublicacion.length;
    publicacion.valoraciones = (suma / publicacion.cantidadValoracion).toFixed(1);

    res.redirect(`/publicaciones/${publicacionId}`);
};
export const seguirUsuario = (req,res) =>{
    const nuevoSeguimiento = {
        seguidor: req.body.seguidor , 
        seguido: req.body.seguido 

    };
    seguidores.push(nuevoSeguimiento); 

    res.redirect("/usuarios");
}