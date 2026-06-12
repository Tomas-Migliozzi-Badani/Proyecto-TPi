import { pool } from "../database/conexion.js";
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

export const crearPublicacion = async (req, res) => {
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.redirect("/usuarios/login");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Buscar o crear categoría
        let categoriaResultado = await client.query(
            "SELECT id_categoria FROM categorias WHERE nombre = $1",
            [req.body.categoria]
        );

        let idCategoria;

        if (categoriaResultado.rows.length > 0) {
            idCategoria = categoriaResultado.rows[0].id_categoria;
        } else {
            const nuevaCategoria = await client.query(
                "INSERT INTO categorias (nombre) VALUES ($1) RETURNING id_categoria",
                [req.body.categoria]
            );

            idCategoria = nuevaCategoria.rows[0].id_categoria;
        }

        // 2. Crear publicación
        const publicacionResultado = await client.query(
            `INSERT INTO publicaciones 
                (titulo, descripcion, id_usuario, id_categoria)
             VALUES ($1, $2, $3, $4)
             RETURNING id_publicacion`,
            [
                req.body.titulo,
                req.body.descripcion,
                usuario.id,
                idCategoria
            ]
        );

        const idPublicacion = publicacionResultado.rows[0].id_publicacion;

        // 3. Guardar imagen Base64
        if (req.body.imagenBase64) {
            await client.query(
                `INSERT INTO imagenes 
                    (id_publicacion, url_imagen, licencia)
                 VALUES ($1, $2, $3)`,
                [
                    idPublicacion,
                    req.body.imagenBase64,
                    "sin copyright"
                ]
            );
        }

        await client.query("COMMIT");

        res.redirect("/publicaciones");

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Error al crear publicación con imagen");
        console.error(error);

        res.send("Error al crear la publicación");

    } finally {
        client.release();
    }
};
export const listarPublicaciones = async (req, res) => {
    const termino = req.query.buscar;

    try {
        let resultado;

        if (termino) {
            resultado = await pool.query(
                `SELECT 
                    p.id_publicacion AS id,
                    p.titulo,
                    p.descripcion,
                    p.id_usuario AS "autorId",
                    u.nombre AS autor,
                    c.nombre AS categoria,
                    COALESCE(
                        json_agg(i.url_imagen) 
                        FILTER (WHERE i.id_imagen IS NOT NULL),
                        '[]'
                    ) AS imagenes
                FROM publicaciones p
                INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN imagenes i ON p.id_publicacion = i.id_publicacion
                WHERE LOWER(p.titulo) LIKE LOWER($1)
                GROUP BY p.id_publicacion, u.nombre, c.nombre
                ORDER BY p.id_publicacion DESC`,
                [`%${termino}%`]
            );
        } else {
            resultado = await pool.query(
                `SELECT 
                    p.id_publicacion AS id,
                    p.titulo,
                    p.descripcion,
                    p.id_usuario AS "autorId",
                    u.nombre AS autor,
                    c.nombre AS categoria,
                    COALESCE(
                        json_agg(i.url_imagen) 
                        FILTER (WHERE i.id_imagen IS NOT NULL),
                        '[]'
                    ) AS imagenes
                FROM publicaciones p
                INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN imagenes i ON p.id_publicacion = i.id_publicacion
                GROUP BY p.id_publicacion, u.nombre, c.nombre
                ORDER BY p.id_publicacion DESC`
            );
        }

        res.render("publicaciones/listar", {
            publicaciones: resultado.rows,
            termino
        });

    } catch (error) {
        console.error("Error al listar publicaciones");
        console.error(error);

        res.send("Error al listar publicaciones");
    }
};
export const mostrarFormularioCrear = (req,res) => {
    console.log("Entro en el formulario");
    res.render("publicaciones/crear");
};




export const mostrarDetallePublicacion = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const resultado = await pool.query(
            `SELECT 
                p.id_publicacion AS id,
                p.titulo,
                p.descripcion,
                p.id_usuario AS "autorId",
                u.nombre AS autor,
                c.nombre AS categoria,

                COALESCE((
                    SELECT ROUND(AVG(v.puntaje)::numeric, 1)
                    FROM valoraciones v
                    INNER JOIN imagenes img ON v.id_imagen = img.id_imagen
                    WHERE img.id_publicacion = p.id_publicacion
                ), 0) AS valoraciones,

                COALESCE((
                    SELECT COUNT(v.id_valoracion)::int
                    FROM valoraciones v
                    INNER JOIN imagenes img ON v.id_imagen = img.id_imagen
                    WHERE img.id_publicacion = p.id_publicacion
                ), 0) AS "cantidadValoracion",

                COALESCE(
                    json_agg(i.url_imagen) 
                    FILTER (WHERE i.id_imagen IS NOT NULL),
                    '[]'
                ) AS imagenes

            FROM publicaciones p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN imagenes i ON p.id_publicacion = i.id_publicacion
            WHERE p.id_publicacion = $1
            GROUP BY p.id_publicacion, u.nombre, c.nombre`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.send("publicacion no encontrada");
        }

        const publicacion = resultado.rows[0];

        const comentariosResultado = await pool.query(
            `SELECT 
                c.id_comentario AS id,
                c.id_publicacion AS "publicacionId",
                c.texto,
                c.fecha_creacion,
                u.nombre AS autor
            FROM comentarios c
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.id_publicacion = $1
              AND c.activo = true
            ORDER BY c.fecha_creacion ASC`,
            [id]
        );

        const comentariosPublicacion = comentariosResultado.rows;

        res.render("publicaciones/detalle", {
            publicacion,
            comentarios: comentariosPublicacion,
            usuario: req.session.usuario
        });

    } catch (error) {
        console.error("Error al mostrar detalle de publicación");
        console.error(error);

        res.send("Error al mostrar detalle de publicación");
    }
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
export const crearComentario = async (req, res) => {
    const publicacionId = parseInt(req.params.id);
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.redirect("/usuarios/login");
    }

    try {
        await pool.query(
            `INSERT INTO comentarios 
                (id_publicacion, id_usuario, texto)
             VALUES ($1, $2, $3)`,
            [
                publicacionId,
                usuario.id,
                req.body.texto
            ]
        );

        res.redirect(`/publicaciones/${publicacionId}`);

    } catch (error) {
        console.error("Error al crear comentario");
        console.error(error);

        res.send("Error al crear comentario");
    }
};
export const valorarPublicacion = async (req, res) => {
    const publicacionId = parseInt(req.params.id);
    const usuario = req.session.usuario;
    const puntaje = parseInt(req.body.puntaje);

    if (!usuario) {
        return res.redirect("/usuarios/login");
    }

    if (isNaN(puntaje) || puntaje < 1 || puntaje > 5) {
        return res.send("Puntaje inválido");
    }

    try {
        const publicacionResultado = await pool.query(
            `SELECT id_publicacion, id_usuario
             FROM publicaciones
             WHERE id_publicacion = $1`,
            [publicacionId]
        );

        if (publicacionResultado.rows.length === 0) {
            return res.send("Publicación no encontrada");
        }

        const publicacion = publicacionResultado.rows[0];

        if (publicacion.id_usuario === usuario.id) {
            return res.send("No podés valorar tu propia publicación");
        }

        const imagenResultado = await pool.query(
            `SELECT id_imagen
             FROM imagenes
             WHERE id_publicacion = $1
             ORDER BY id_imagen ASC
             LIMIT 1`,
            [publicacionId]
        );

        if (imagenResultado.rows.length === 0) {
            return res.send("La publicación no tiene imagen para valorar");
        }

        const idImagen = imagenResultado.rows[0].id_imagen;

        const yaValoro = await pool.query(
            `SELECT id_valoracion
             FROM valoraciones
             WHERE id_imagen = $1
               AND id_usuario = $2`,
            [idImagen, usuario.id]
        );

        if (yaValoro.rows.length > 0) {
            return res.send("Ya valoraste esta imagen");
        }

        await pool.query(
            `INSERT INTO valoraciones
                (id_imagen, id_usuario, puntaje)
             VALUES ($1, $2, $3)`,
            [idImagen, usuario.id, puntaje]
        );

        res.redirect(`/publicaciones/${publicacionId}`);

    } catch (error) {
        console.error("Error al valorar imagen");
        console.error(error);

        res.send("Error al valorar imagen");
    }
};
export const seguirUsuario = (req,res) =>{
    const nuevoSeguimiento = {
        seguidor: req.body.seguidor , 
        seguido: req.body.seguido 

    };
    seguidores.push(nuevoSeguimiento); 

    res.redirect("/usuarios");
}