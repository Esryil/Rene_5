import axios from "axios";
const API = "http://localhost:3000/api";

export const peticionRegistro = async (usuario)=>{
    console.log("estas en la funcion registro");

    console.log(usuario);
    
    return await axios.post(`${API}/registro`,usuario);
}