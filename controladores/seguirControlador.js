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

export const listarUsuariosParaSeguir = (req, res) => {
    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    const usuariosDisponibles = usuarios.filter(
        u => u.id !== usuarioLogueado.id
    );

    res.render("seguir/listar", {
        usuarios: usuariosDisponibles,
        usuario: usuarioLogueado,
        seguimientos
    });
};

export const seguirUsuario = (req, res) => {
    const usuarioLogueado = req.session.usuario;
    const usuarioSeguidoId = parseInt(req.params.id);

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    if (usuarioLogueado.id === usuarioSeguidoId) {
        return res.send("No podés seguirte a vos mismo");
    }

    const usuarioExiste = usuarios.find(
        u => u.id === usuarioSeguidoId
    );

    if (!usuarioExiste) {
        return res.send("El usuario que querés seguir no existe");
    }

    const yaSigue = seguimientos.find(
        s => s.seguidorId === usuarioLogueado.id && s.seguidoId === usuarioSeguidoId
    );

    if (yaSigue) {
        return res.send("Ya seguís a este usuario");
    }

    const nuevoSeguimiento = {
        id: seguimientos.length + 1,
        seguidorId: usuarioLogueado.id,
        seguidoId: usuarioSeguidoId
    };

    seguimientos.push(nuevoSeguimiento);

    res.redirect("/seguimientos");
};

export const dejarDeSeguirUsuario = (req, res) => {
    const usuarioLogueado = req.session.usuario;
    const usuarioSeguidoId = parseInt(req.params.id);

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    const indice = seguimientos.findIndex(
        s => s.seguidorId === usuarioLogueado.id && s.seguidoId === usuarioSeguidoId
    );

    if (indice === -1) {
        return res.send("No seguís a este usuario");
    }

    seguimientos.splice(indice, 1);

    res.redirect("/seguimientos");
};

export const mostrarFeedSeguidos = (req, res) => {
    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect("/usuarios/login");
    }

    const usuariosSeguidos = seguimientos
        .filter(s => s.seguidorId === usuarioLogueado.id)
        .map(s => usuarios.find(u => u.id === s.seguidoId));

    res.render("seguir/feed", {
        
        usuario: usuarioLogueado,
        usuariosSeguidos
    });
};
