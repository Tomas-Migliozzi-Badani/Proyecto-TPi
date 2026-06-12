# Proyecto TPI - Fotaza 2

Proyecto integrador de la materia **Programación Web II**.

La aplicación permite gestionar publicaciones de fotografías dentro de una comunidad de usuarios. Los usuarios autorizados pueden iniciar sesión, crear publicaciones con imágenes, buscar publicaciones, comentar, valorar imágenes y seguir a otros usuarios.

---

## Tecnologías utilizadas

* Node.js
* Express
* Pug
* PostgreSQL
* Express Session
* dotenv
* HTML
* CSS
* JavaScript

---

## Funcionalidades implementadas

### Autenticación de usuarios

La aplicación cuenta con inicio de sesión para usuarios autorizados.

Los usuarios no autenticados no pueden interactuar con la aplicación. Para crear publicaciones, comentar, valorar o seguir usuarios, es necesario iniciar sesión.

También se agregó una opción visual de registro. Al ingresar a “Registrate”, el sistema informa que se debe ingresar con un usuario autorizado.

---

### Creación de publicaciones

Los usuarios logueados pueden crear publicaciones con:

* Título
* Categoría
* Descripción
* Imagen

Las publicaciones se guardan en la base de datos PostgreSQL.

---

### Gestión de imágenes

Cada publicación permite cargar una imagen desde el formulario.

La imagen se convierte a Base64 y se guarda en la tabla `imagenes` de la base de datos.

Las imágenes se muestran tanto en el listado de publicaciones como en el detalle de cada publicación.

---

### Buscador de publicaciones/imágenes

La aplicación cuenta con un buscador que permite filtrar publicaciones por título.

También se puede resetear la búsqueda para volver a ver todas las publicaciones.

---

### Comentarios

Los usuarios logueados pueden comentar publicaciones.

Los comentarios se guardan en PostgreSQL y se muestran en el detalle de cada publicación.

---

### Valoración de imágenes

Los usuarios logueados pueden valorar imágenes/publicaciones con un puntaje de 1 a 5.

Reglas implementadas:

* Un usuario no puede valorar su propia publicación.
* Un usuario no puede valorar dos veces la misma imagen.
* Se muestra el promedio de valoración.
* Se muestra la cantidad de valoraciones.

Las valoraciones se guardan en PostgreSQL.

---

### Seguimiento de usuarios

La aplicación permite seguir y dejar de seguir usuarios.

Reglas implementadas:

* Un usuario puede seguir a otro usuario.
* Un usuario puede dejar de seguir a otro usuario.
* Un usuario no puede seguirse a sí mismo.
* El sistema evita seguir al mismo usuario más de una vez.
* Existe una sección de publicaciones de usuarios seguidos.

Los seguimientos se guardan en PostgreSQL.

---

## Base de datos

El proyecto utiliza PostgreSQL.

La estructura de la base de datos se encuentra en:

```txt
database/init.sql
```

Tablas principales:

* roles
* usuarios
* categorias
* publicaciones
* imagenes
* etiquetas
* publicacion_etiquetas
* comentarios
* valoraciones
* seguidores

El proyecto también incluye un archivo de inicialización:

```txt
database/init.js
```

Este archivo permite ejecutar el script SQL desde Node.js mediante el comando:

```bash
npm run db:init
```

Importante: el script `init.sql` reinicia la estructura de la base de datos. Si ya existen datos cargados, al ejecutarlo se pueden borrar porque contiene instrucciones `DROP TABLE`.

---

## Variables de entorno

El proyecto utiliza variables de entorno para configurar el puerto, la conexión con PostgreSQL y la clave de sesión.

Se incluye el archivo:

```txt
.env.example
```

Ejemplo de configuración:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fotaza2
DB_USER=postgres
DB_PASSWORD=tu_password_de_postgres

SESSION_SECRET=tu_clave_secreta
```

Para ejecutar el proyecto localmente se debe crear un archivo `.env` en la raíz del proyecto usando como base el archivo `.env.example`.

El archivo `.env` real no debe subirse al repositorio.

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Entrar a la carpeta del proyecto

```bash
cd Proyecto-TPi
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear la base de datos

Crear en PostgreSQL una base de datos llamada:

```txt
fotaza2
```

Esto puede hacerse desde pgAdmin o desde SQL Shell.

### 5. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

### 6. Inicializar las tablas

```bash
npm run db:init
```

### 7. Iniciar la aplicación

```bash
npm start
```

La aplicación queda disponible en:

```txt
http://localhost:3000
```

---

## Scripts disponibles

### Instalar dependencias

```bash
npm install
```

### Iniciar la aplicación

```bash
npm start
```

### Iniciar en modo desarrollo

```bash
npm run dev
```

### Inicializar base de datos

```bash
npm run db:init
```

### Probar conexión a PostgreSQL

```bash
npm run db:test
```

---

## Usuarios de prueba

Usuarios disponibles para probar el sistema:

| Usuario  | Email                                         | Contraseña | Rol           |
| -------- | --------------------------------------------- | ---------- | usuario       |
| Profesor | [profesor@test.com](mailto:profesor@test.com) | 123       | usuario       |
| Admin    | [tomasmigliozzi@gmail.com](mailto:tomasmigliozzi@gmail.com)       | 1234       | administrador |

Aclaración: los usuarios de prueba deben coincidir con los cargados en `database/init.sql`.

---

## Flujo recomendado para probar la aplicación

1. Iniciar sesión con un usuario de prueba.
2. Crear una publicación con imagen.
3. Ver la publicación en el listado.
4. Entrar al detalle de la publicación.
5. Cerrar sesión.
6. Iniciar sesión con otro usuario.
7. Comentar la publicación.
8. Valorar la imagen.
9. Seguir al usuario autor de la publicación.
10. Ingresar a la sección de publicaciones de usuarios seguidos.
11. Verificar que aparezca la publicación correspondiente.

---

## Requisitos de regularización cubiertos

El proyecto implementa los requisitos solicitados para regularizar:

* Creación de publicación.
* Buscador de publicaciones/imágenes.
* Módulo de comentarios.
* Valoración de imágenes.
* Seguimiento de usuarios.

---

## Problemas encontrados durante el desarrollo

Durante el desarrollo se presentaron distintos problemas técnicos:

* Configuración inicial de PostgreSQL en una computadora.
* Error de conexión `ECONNREFUSED` cuando PostgreSQL no estaba activo.
* Error por columna `VARCHAR(255)` al intentar guardar imágenes en Base64.
* Errores de indentación en archivos Pug.
* Ajustes en rutas y controladores.
* Migración progresiva desde datos en memoria hacia PostgreSQL.

---

## Soluciones aplicadas

* Se configuró PostgreSQL con una base llamada `fotaza2`.
* Se creó un archivo `.env.example` para documentar las variables de entorno necesarias.
* Se creó `database/init.sql` con la estructura de tablas.
* Se creó `database/init.js` para ejecutar la inicialización con `npm run db:init`.
* Se modificó la columna de imagen para usar `TEXT`, permitiendo guardar imágenes Base64.
* Se corrigieron errores de sintaxis e indentación en vistas Pug.
* Se migraron a PostgreSQL las publicaciones, imágenes, comentarios, valoraciones y seguimientos.

---

## Estado actual del proyecto

Actualmente la aplicación permite:

* Iniciar sesión con usuarios autorizados.
* Crear publicaciones con imágenes.
* Guardar publicaciones e imágenes en PostgreSQL.
* Buscar publicaciones.
* Ver detalle de publicación.
* Comentar publicaciones.
* Guardar comentarios en PostgreSQL.
* Valorar imágenes.
* Guardar valoraciones en PostgreSQL.
* Seguir y dejar de seguir usuarios.
* Ver publicaciones de usuarios seguidos.

---

## Deploy

El proyecto está preparado para ser desplegado en un servidor Node.js.

Para producción se deben configurar las variables de entorno correspondientes a la base de datos y al servidor.

Pendiente para despliegue final:

* Crear base PostgreSQL en el servicio elegido.
* Configurar variables de entorno en el servidor.
* Ejecutar la inicialización de la base.
* Probar la URL pública de la aplicación.

---

## Repositorio

Repositorio del proyecto:

```txt
URL_DEL_REPOSITORIO
```

Aplicación en producción:

```txt
URL_DE_LA_APP
```

---

## Autor

Proyecto desarrollado para la materia **Programación Web II**.
