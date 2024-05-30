// Importa los módulos necesarios: jsonwebtoken para manejar JWT y dotenv para manejar variables de entorno
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

// Importa la lista de usuarios desde el controlador de autenticación
import { usuarios } from "./../controllers/authentication.controller.js";

// Configura dotenv para cargar variables de entorno desde un archivo .env
dotenv.config();

/**
 * Middleware para permitir el acceso solo a administradores.
 * Revisa si el usuario está autenticado antes de permitir el acceso.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
function soloAdmin(req, res, next) {
  const logueado = revisarCookie(req); // Verifica si el usuario está autenticado
  if (logueado) return next(); // Si está autenticado, continúa con la solicitud
  return res.redirect("/"); // Si no está autenticado, redirige a la página de inicio
}

/**
 * Middleware para permitir el acceso solo a usuarios no autenticados.
 * Revisa si el usuario no está autenticado antes de permitir el acceso.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
function soloPublico(req, res, next) {
  const logueado = revisarCookie(req); // Verifica si el usuario está autenticado
  if (!logueado) return next(); // Si no está autenticado, continúa con la solicitud
  return res.redirect("/admin"); // Si está autenticado, redirige a la página de administración
}

/**
 * Función para revisar la cookie JWT y verificar la autenticidad del usuario.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @returns {boolean} - Devuelve true si el usuario está autenticado, false en caso contrario.
 */
function revisarCookie(req) {
  try {
    // Extrae la cookie JWT de las cookies de la solicitud
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    
    // Verifica y decodifica el JWT utilizando la clave secreta almacenada en las variables de entorno
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificada);
    
    // Busca al usuario decodificado en la lista de usuarios
    const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    console.log(usuarioAResvisar);
    
    // Si el usuario no se encuentra en la lista, retorna false
    if (!usuarioAResvisar) {
      return false;
    }
    // Si el usuario se encuentra en la lista, retorna true
    return true;
  } catch {
    // Si ocurre un error (p.ej., cookie no válida), retorna false
    return false;
  }
}

// Exporta los métodos soloAdmin y soloPublico para su uso en otras partes de la aplicación
export const methods = {
  soloAdmin,
  soloPublico,
};
