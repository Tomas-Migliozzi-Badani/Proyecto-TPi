import { pool } from "../database/conexion.js";
const usuarios = [
    {
        id: 1,
        nombre: "tomas",
        email: "tomasmigliozzi@gmail.com"
    },
    {
        id: 2,
        nombre: "Profesor",
        email: "profesor@test.com"
    },
    {
        id: 3,
        nombre: "Sol",
        email: "sol@test.com"
    }
];

const seguimientos = [];

export const listarUsuariosParaSeguir = async (req, res) => {
    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    try {
        const usuariosResultado = await pool.query(
            `SELECT 
                id_usuario AS id,
                nombre,
                email
            FROM usuarios
            WHERE id_usuario <> $1
              AND activo = true
            ORDER BY nombre ASC`,
            [usuarioLogueado.id]
        );

        const seguimientosResultado = await pool.query(
            `SELECT 
                id_usuario_seguidor AS "seguidorId",
                id_usuario_seguido AS "seguidoId"
            FROM seguidores
            WHERE id_usuario_seguidor = $1`,
            [usuarioLogueado.id]
        );

        res.render("seguir/listar", {
            usuario: usuarioLogueado,
            usuarios: usuariosResultado.rows,
            seguimientos: seguimientosResultado.rows
        });

    } catch (error) {
        console.error("Error al listar usuarios para seguir");
        console.error(error);

        res.send("Error al listar usuarios para seguir");
    }
};


export const dejarDeSeguirUsuario = async (req, res) => {
    const usuarioLogueado = req.session.usuario;
    const usuarioSeguidoId = parseInt(req.params.id);

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    try {
        const resultado = await pool.query(
            `DELETE FROM seguidores
             WHERE id_usuario_seguidor = $1
               AND id_usuario_seguido = $2`,
            [usuarioLogueado.id, usuarioSeguidoId]
        );

        if (resultado.rowCount === 0) {
            return res.send("No seguís a este usuario");
        }

        res.redirect("/seguimientos");

    } catch (error) {
        console.error("Error al dejar de seguir usuario");
        console.error(error);

        res.send("Error al dejar de seguir usuario");
    }
};
export const seguirUsuario = async (req, res) => {
    const usuarioLogueado = req.session.usuario;
    const usuarioSeguidoId = parseInt(req.params.id);

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    if (usuarioLogueado.id === usuarioSeguidoId) {
        return res.send("No podés seguirte a vos mismo");
    }

    try {
        const usuarioExiste = await pool.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE id_usuario = $1
               AND activo = true`,
            [usuarioSeguidoId]
        );

        if (usuarioExiste.rows.length === 0) {
            return res.send("El usuario que querés seguir no existe");
        }

        await pool.query(
            `INSERT INTO seguidores
                (id_usuario_seguidor, id_usuario_seguido)
             VALUES ($1, $2)`,
            [usuarioLogueado.id, usuarioSeguidoId]
        );

        res.redirect("/seguimientos");

    } catch (error) {
        if (error.code === "23505") {
            return res.send("Ya seguís a este usuario");
        }

        console.error("Error al seguir usuario");
        console.error(error);

        res.send("Error al seguir usuario");
    }
};
export const mostrarFeedSeguidos = async (req, res) => {
    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    try {
        const usuariosSeguidosResultado = await pool.query(
            `SELECT 
                u.id_usuario AS id,
                u.nombre,
                u.email
            FROM seguidores s
            INNER JOIN usuarios u 
                ON s.id_usuario_seguido = u.id_usuario
            WHERE s.id_usuario_seguidor = $1
            ORDER BY u.nombre ASC`,
            [usuarioLogueado.id]
        );

        const publicacionesResultado = await pool.query(
            `SELECT 
                p.id_publicacion AS id,
                p.titulo,
                p.descripcion,
                u.nombre AS autor,
                c.nombre AS categoria,
                COALESCE(
                    json_agg(i.url_imagen)
                    FILTER (WHERE i.id_imagen IS NOT NULL),
                    '[]'
                ) AS imagenes
            FROM seguidores s
            INNER JOIN publicaciones p 
                ON s.id_usuario_seguido = p.id_usuario
            INNER JOIN usuarios u 
                ON p.id_usuario = u.id_usuario
            LEFT JOIN categorias c 
                ON p.id_categoria = c.id_categoria
            LEFT JOIN imagenes i 
                ON p.id_publicacion = i.id_publicacion
            WHERE s.id_usuario_seguidor = $1
            GROUP BY p.id_publicacion, u.nombre, c.nombre
            ORDER BY p.fecha_creacion DESC`,
            [usuarioLogueado.id]
        );

        res.render("seguir/feed", {
            usuario: usuarioLogueado,
            usuariosSeguidos: usuariosSeguidosResultado.rows,
            publicaciones: publicacionesResultado.rows
        });

    } catch (error) {
        console.error("Error al mostrar publicaciones de usuarios seguidos");
        console.error(error);

        res.send("Error al mostrar publicaciones de usuarios seguidos");
    }
};