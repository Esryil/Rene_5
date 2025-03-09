import mongoose from "mongoose";
import { mensajes } from "../libs/manejoErrores.js";

export async function conectarBD() {
    try {
        const respuesta=await mongoose.connect("mongodb://localhost:27017/appMongo");
        return mensajes(200, "Conexion a la BD ok");
        
       
    } catch (error) {
        //console.log(error);
        return mensajes(400, "Error al conectarse a la BD", error);
    }

}

