// Importación de módulos necesarios
import bcryptjs from "bcryptjs"; // Módulo para hash y verificación de contraseñas
import jsonwebtoken from "jsonwebtoken"; // Módulo para generar y verificar JWT (JSON Web Tokens)
import dotenv from "dotenv"; // Módulo para cargar variables de entorno desde un archivo .env

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Array de usuarios simulando una base de datos
export const usuarios = [{
  user: "a",
  email: "a@a.com",
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2" // Contraseña hasheada
}]

// Función de inicio de sesión (login)
async function login(req, res) {
  console.log(req.body); // Registrar el cuerpo de la solicitud para depuración
  const user = req.body.user; // Obtener el usuario del cuerpo de la solicitud
  const password = req.body.password; // Obtener la contraseña del cuerpo de la solicitud
  
  // Verificar que se hayan proporcionado usuario y contraseña
  if (!user || !password) {
    return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
  }
  
  // Buscar el usuario en la "base de datos"
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  
  // Verificar si el usuario existe
  if (!usuarioAResvisar) {
    return res.status(400).send({status: "Error", message: "Error durante login"});
  }
  
  // Comparar la contraseña proporcionada con la contraseña hasheada almacenada
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  
  // Verificar si la contraseña es correcta
  if (!loginCorrecto) {
    return res.status(400).send({status: "Error", message: "Error durante login"});
  }
  
  // Generar un token JWT con el nombre de usuario como payload
  const token = jsonwebtoken.sign(
    {user: usuarioAResvisar.user},
    process.env.JWT_SECRET, // Clave secreta para firmar el token
    {expiresIn: process.env.JWT_EXPIRATION} // Configuración de expiración del token
  );

  // Opciones para la cookie que almacenará el token
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Fecha de expiración de la cookie
    path: "/" // Ruta en la que la cookie es válida
  };
  
  // Enviar la cookie al cliente
  res.cookie("jwt", token, cookieOption);
  
  // Responder al cliente con éxito
  res.send({status: "ok", message: "Usuario loggeado", redirect: "/admin"});
}

// Función de registro (register)
async function register(req, res) {
  const user = req.body.user; // Obtener el usuario del cuerpo de la solicitud
  const password = req.body.password; // Obtener la contraseña del cuerpo de la solicitud
  const email = req.body.email; // Obtener el correo electrónico del cuerpo de la solicitud
  
  // Verificar que se hayan proporcionado todos los campos requeridos
  if (!user || !password || !email) {
    return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
  }
  
  // Buscar si el usuario ya existe en la "base de datos"
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  
  // Verificar si el usuario ya existe
  if (usuarioAResvisar) {
    return res.status(400).send({status: "Error", message: "Este usuario ya existe"});
  }
  
  // Generar un salt para hashear la contraseña
  const salt = await bcryptjs.genSalt(5);
  
  // Hashear la contraseña con el salt generado
  const hashPassword = await bcryptjs.hash(password, salt);
  
  // Crear un nuevo objeto de usuario con la contraseña hasheada
  const nuevoUsuario = {
    user, 
    email, 
    password: hashPassword
  };
  
  // Agregar el nuevo usuario al array de usuarios (simulando una base de datos)
  usuarios.push(nuevoUsuario);
  
  console.log(usuarios); // Registrar la lista de usuarios para depuración
  
  // Responder al cliente con éxito
  return res.status(201).send({status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/"});
}

// Exportar las funciones de login y register como parte de un objeto
export const methods = {
  login,
  register
};
