import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));



//Server
const app = express();
//cargo la instanciua de express y donde quiero usar en que puerto que escuche 
app.set("port",4000);
app.listen(app.get("port"));
console.log("servidor corriendo en puerto",app.get("port"));


//Configuracion
app.use(express.static(__dirname + "/public"));

//Rutas
app.get("/", (req, res)=> res.sendFile(__dirname + "/pages/login.html"))
app.get("/register", (req, res)=> res.sendFile(__dirname + "/pages/register.html"))
