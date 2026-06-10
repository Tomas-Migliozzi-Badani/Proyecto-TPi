console.log("CARGUE EL CONTROLADOR DE PUBLICACIONES");
const publicaciones = [
    {
        id:1 ,
        titulo:"atardecer" , 
        autor: "tomas" , 
        categoria: "Naturaleza" , 
        valoracion: 0
    },
    {
        id:2 , 
        titulo: "el best" , 
        autor: "anda a saber",
        categoria:"paisajes" , 
        valoracion: 0 
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
export const crearPublicacion = (req,res) => {
    
    console.log(req.body);

    const nuevaPublicacion = {
        
        id:publicaciones.length + 1 ,
        titulo: req.body.titulo , 
        autor: req.body.autor ,
        descripcion: req.body.descripcion
    
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
        comentarios: comentariosPublicacion
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

    const publicacion = publicaciones.find(
        p => p.id === id 
    );
    if(!publicacion){
        return res.send("Publicacion no encontrada");
    }
    publicacion.titulo = req.body.titulo;
    publicacion.categoria = req.body.categoria;
    publicacion.autor = req.body.autor;

    res.redirect("/publicaciones");
}
export const eliminarPublicacion = (req,res) =>{
    console.log("Entró a eliminar");
    const id = parseInt(req.params.id);

    const indice = publicaciones.findIndex(
        p => p.id === id 
    );
    console.log("ID:", id);
    console.log("Indice:", indice);

    if(indice === -1){
        return res.send("Publicacion no encontrada");
    }
    publicaciones.splice(indice,1);

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
export const seguirUsuario = (req,res) =>{
    const nuevoSeguimiento = {
        seguidor: req.body.seguidor , 
        seguido: req.body.seguido 

    };
    seguidores.push(nuevoSeguimiento); 

    res.redirect("/usuarios");
}