// Selecciona el primer elemento en el documento con la clase "error" y lo asigna a la variable mensajeError
const mensajeError = document.getElementsByClassName("error")[0];

// Añade un event listener al formulario con el ID "register-form" para manejar el evento de envío (submit)
document.getElementById("register-form").addEventListener("submit", async (e) => {
  // Previene el comportamiento por defecto del formulario, que es recargar la página
  e.preventDefault();

  // Muestra en la consola el valor del campo de entrada "user" del formulario
  console.log(e.target.children.user.value);

  // Realiza una solicitud HTTP POST asíncrona al servidor para registrar un nuevo usuario
  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST", // Especifica el método HTTP como POST
    headers: {
      "Content-Type": "application/json" // Define el tipo de contenido de la solicitud como JSON
    },
    body: JSON.stringify({
      // Convierte los datos del formulario en una cadena JSON
      user: e.target.children.user.value, // Obtiene el valor del campo "user"
      email: e.target.children.email.value, // Obtiene el valor del campo "email"
      password: e.target.children.password.value // Obtiene el valor del campo "password"
    })
  });

  // Si la respuesta no es OK (status no es 200-299), muestra el mensaje de error
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);

  // Convierte la respuesta del servidor a un objeto JSON
  const resJson = await res.json();

  // Si el JSON de la respuesta contiene una propiedad "redirect", redirige a la URL especificada
  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});
