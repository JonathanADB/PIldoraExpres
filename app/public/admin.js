// Selecciona el primer botón en el documento y añade un event listener para manejar el evento de clic
document.getElementsByTagName("button")[0].addEventListener("click", () => {
  // Borra la cookie 'jwt' configurando su fecha de expiración en una fecha pasada
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Redirige el navegador a la página de inicio ("/")
  document.location.href = "/";
});
