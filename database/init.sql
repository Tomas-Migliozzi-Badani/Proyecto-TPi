DROP TABLE IF EXISTS valoraciones;
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS seguidores;
DROP TABLE IF EXISTS imagenes;
DROP TABLE IF EXISTS publicacion_etiquetas;
DROP TABLE IF EXISTS etiquetas;
DROP TABLE IF EXISTS publicaciones;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    id_rol INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_usuario INT NOT NULL,
    id_categoria INT,
    permite_comentarios BOOLEAN NOT NULL DEFAULT true,
    activa BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_publicacion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_publicacion_categoria
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE imagenes (
    id_imagen SERIAL PRIMARY KEY,
    id_publicacion INT NOT NULL,
    url_imagen TEXT NOT NULL,
    licencia VARCHAR(30) NOT NULL,
    marca_agua VARCHAR(100),

    CONSTRAINT fk_imagen_publicacion
        FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion)
        ON DELETE CASCADE,

    CONSTRAINT chk_licencia
        CHECK (licencia IN ('copyright', 'sin copyright'))
);

CREATE TABLE etiquetas (
    id_etiqueta SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE publicacion_etiquetas (
    id_publicacion INT NOT NULL,
    id_etiqueta INT NOT NULL,

    PRIMARY KEY (id_publicacion, id_etiqueta),

    CONSTRAINT fk_pub_etiqueta_publicacion
        FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion)
        ON DELETE CASCADE,

    CONSTRAINT fk_pub_etiqueta_etiqueta
        FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id_etiqueta)
        ON DELETE CASCADE
);

CREATE TABLE comentarios (
    id_comentario SERIAL PRIMARY KEY,
    id_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,
    texto TEXT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT fk_comentario_publicacion
        FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion)
        ON DELETE CASCADE,

    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE valoraciones (
    id_valoracion SERIAL PRIMARY KEY,
    id_imagen INT NOT NULL,
    id_usuario INT NOT NULL,
    puntaje INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_valoracion_imagen
        FOREIGN KEY (id_imagen) REFERENCES imagenes(id_imagen)
        ON DELETE CASCADE,

    CONSTRAINT fk_valoracion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),

    CONSTRAINT chk_puntaje
        CHECK (puntaje BETWEEN 1 AND 5),

    CONSTRAINT unq_usuario_imagen
        UNIQUE (id_imagen, id_usuario)
);
CREATE TABLE seguidores (
    id_seguidor SERIAL PRIMARY KEY,
    id_usuario_seguidor INT NOT NULL,
    id_usuario_seguido INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_seguidor
        FOREIGN KEY (id_usuario_seguidor) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_seguido
        FOREIGN KEY (id_usuario_seguido) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT unq_seguidor_seguido
        UNIQUE (id_usuario_seguidor, id_usuario_seguido),

    CONSTRAINT chk_no_seguirse
        CHECK (id_usuario_seguidor <> id_usuario_seguido)
);
INSERT INTO roles (nombre) VALUES
('usuario'),
('administrador');

INSERT INTO usuarios (nombre, email, password, id_rol) VALUES
('Tomas', 'tomasmigliozzi@gmail.com', '1234', 1),
('Profesor', 'profesor@test.com', '123', 1);


INSERT INTO categorias (nombre) VALUES
('Paisajes'),
('Retratos'),
('Naturaleza');

INSERT INTO etiquetas (nombre) VALUES
('foto'),
('arte'),
('viaje');