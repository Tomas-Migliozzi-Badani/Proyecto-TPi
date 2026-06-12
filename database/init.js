import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./conexion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const rutaSQL = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(rutaSQL, "utf8");

    await pool.query(sql);

    console.log("Base de datos inicializada correctamente");

    await pool.end();
} catch (error) {
    console.error("Error al inicializar la base de datos");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);

    await pool.end();
}


