import { pool } from "./conexion.js";

try {
    const resultado = await pool.query("SELECT NOW()");
    console.log("Conexión exitosa a PostgreSQL");
    console.log(resultado.rows[0]);

    await pool.end();
} catch (error) {
    console.error("Error al conectar con PostgreSQL");
    console.error(error.message);
}