const publicaciones = [
    {
        id:1 ,
        titulo:"atardecer" , 
        autor: "tomas" , 
        categoria: "Naturaleza"
    },
    {
        id:2 , 
        titulo: "el best" , 
        autor: "anda a saber",
        categoria:"paisajes"
    }
];
export const listarPublicaciones = (req,res) => {
    res.render("publicaciones/listar" , { 
        publicaciones
    });
};


export const mostrarFormularioCrear = (req,res) => {
    console.log("Entro en el formulario");
    res.render("publicaciones/crear");
};

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

export const mostrarDetallePublicacion = (req,res) => {
    const id = parseInt(req.params.id);

    const publicacion = publicaciones.find(
        p => p.id === id 
    );
    if(!publicacion){
        return res.send("publicacion no encontrada");
    }
    res.render("publicaciones/detalle",{
        publicacion
    });
};
export const mostrarFormularioEditar = (req,res) =>{
    res.render("publicaciones/editar");
};