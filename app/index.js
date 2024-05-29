// Importa el módulo express para crear el servidor
import express from "express";
// Importa el middleware cookie-parser para manejar cookies
import cookieParser from 'cookie-parser';

// Fix para obtener el valor de __dirname en módulos ES6
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Importa métodos de los controladores de autenticación
import { methods as authentication } from "./controllers/authentication.controller.js";
// Importa métodos de los middlewares de autorización
import { methods as authorization } from "./middlewares/authorization.js";

// Inicializa la aplicación de express
const app = express();
app.set("port", 4000); // Configura el puerto en 4000
app.listen(app.get("port")); // Inicia el servidor en el puerto configurado
console.log("Servidor corriendo en puerto", app.get("port"));

// Configuración de middlewares
app.use(express.static(__dirname + "/public")); // Sirve archivos estáticos desde el directorio "public"
app.use(express.json()); // Parsea cuerpos de solicitudes en formato JSON
app.use(cookieParser()); // Usa el middleware cookie-parser para manejar cookies

// Definición de rutas
// Ruta para la página principal, accesible solo para usuarios no autenticados
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/login.html"));
// Ruta para la página de registro, accesible solo para usuarios no autenticados
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
// Ruta para la página de administración, accesible solo para administradores
app.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
// Ruta para la API de inicio de sesión
app.post("/api/login", authentication.login);
// Ruta para la API de registro
app.post("/api/register", authentication.register);
