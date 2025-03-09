"use client"
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { peticionRegistro } from "@/api/peticiones";

export default function Registro(){
    const {register, handleSubmit} = useForm();
    return(
        <>
        <h1>Registrate</h1>
        <form action="" onSubmit={handleSubmit(async(usuario)=>{
            const respuesta = await peticionRegistro(usuario);
            console.log(respuesta);
            
        })}>
            <input type="text" placeholder="Usuario"{... register("username")} /><br/><br/>
            <input type="text" placeholder="Correo"{... register ("email")} /><br/><br/>
            <input type="text" placeholder="Password"{... register("password")} /><br/><br/>
            <button type="submit">Registrar Usuario</button>
        </form>
        </>
    );
}