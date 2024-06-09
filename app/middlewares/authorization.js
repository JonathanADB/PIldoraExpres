// Importa la librería jsonwebtoken para manejar JWTs
import jsonwebtoken from "jsonwebtoken";
// Importa la librería dotenv para manejar variables de entorno
import dotenv from "dotenv";
// Importa el objeto 'usuarios' desde el controlador de autenticación
import { usuarios } from "./../controllers/authentication.controller.js";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Middleware para permitir el acceso solo a administradores
function soloAdmin(req, res, next) {
  // Revisa si el usuario está logueado revisando la cookie
  const logueado = revisarCookie(req);
  if (logueado) return next(); // Si está logueado, permite continuar con la siguiente función de middleware
  return res.redirect("/"); // Si no está logueado, redirige a la página principal
}

// Middleware para permitir el acceso solo a usuarios no autenticados (público)
function soloPublico(req, res, next) {
  // Revisa si el usuario está logueado revisando la cookie
  const logueado = revisarCookie(req);
  if (!logueado) return next(); // Si no está logueado, permite continuar con la siguiente función de middleware
  return res.redirect("/admin"); // Si está logueado, redirige a la página de administrador
}

// Función para revisar la cookie y verificar el JWT
function revisarCookie(req) {
  try {
    // Obtiene el valor de la cookie 'jwt' desde el encabezado de la solicitud
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    // Verifica y decodifica el token JWT usando la clave secreta
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificada); // Muestra la información decodificada en la consola
    // Busca el usuario correspondiente en la lista de usuarios
    const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    console.log(usuarioAResvisar); // Muestra la información del usuario en la consola
    if (!usuarioAResvisar) {
      return false; // Si el usuario no existe, retorna false
    }
    return true; // Si el usuario existe, retorna true
  } catch {
    return false; // Si hay un error (ej. cookie no válida o no existe), retorna false
  }
}

// Exporta los métodos para ser utilizados en otras partes de la aplicación
export const methods = {
  soloAdmin,
  soloPublico,
}
