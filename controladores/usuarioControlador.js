const usuarios = [
    {
    id: 1 ,
    nombre: "tomas" ,
    email: "tomasmigliozzi@gmail.com",
    password: "1234"
    }
    ,
    {
        id: 2,
        nombre: "Profesor",
        email: "profesor@test.com",
        password: "123"
    }
]

export const mostrarLogin = (req,res) =>{
    res.render("usuarios/login");
};
export const iniciarSesion = (req,res) => {

    console.log("LOGIN EJECUTADO");
    console.log(req.body);

    const {email,password} = req.body;

    const usuario = usuarios.find(
        u => u.email === email &&
        u.password === password 
    );
    if(!usuario){
        return res.send("Email o contraseña incorrectas");
    }
    req.session.usuario = usuario ;
    console.log("USUARIO GUARDADO:", req.session.usuario);
    res.redirect("/publicaciones");
}
export const mostrarRegistro = (req,res) => {
    res.render("usuarios/registro");
};