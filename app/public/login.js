// Selecciona el primer elemento en el documento con la clase "error" y lo asigna a la variable mensajeError
const mensajeError = document.getElementsByClassName("error")[0];

// Añade un event listener al formulario con el ID "login-form" para manejar el evento de envío (submit)
document.getElementById("login-form").addEventListener("submit", async (e) => {
  // Previene el comportamiento por defecto del formulario, que es recargar la página
  e.preventDefault();

  // Obtiene los valores de los campos "user" y "password" del formulario
  const user = e.target.children.user.value;
  const password = e.target.children.password.value;

  // Realiza una solicitud HTTP POST asíncrona al servidor para iniciar sesión
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST", // Especifica el método HTTP como POST
    headers: {
      "Content-Type": "application/json" // Define el tipo de contenido de la solicitud como JSON
    },
    body: JSON.stringify({
      // Convierte los datos del formulario en una cadena JSON
      user,
      password
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
