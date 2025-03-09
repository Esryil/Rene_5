import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mensajes } from "../libs/manejoErrores.js";
import { obtenerUsuario } from "../db/usuariosBD.js";


// Generar hash de la contraseña
export function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64, { N: 1024 }).toString("hex");
    return { salt, hash };
}

// Validar contraseña
export function validarPassword(password, salt, hash) {
    return crypto.scryptSync(password, salt, 64, { N: 1024 }).toString("hex") === hash;
}

// Verificar usuario autenticado
export function verificarUsuario(token, req) {
    if (!token) return mensajes(403, "Acceso denegado - Token requerido");

    try {
        const usuario = jwt.verify(token, process.env.SECRET_TOKEN);
        req.usuario = usuario;
        return mensajes(200, "Usuario autenticado");
    } catch (error) {
        return mensajes(403, "Token inválido o expirado");
    }
}

// Verificar si el usuario es administrador
export async function verificarAdmin(req) {
    const respuesta = verificarUsuario(req.cookies.token, req);
    if (respuesta.status !== 200) return mensajes(403, "Acceso denegado");

    const usuario = await obtenerUsuario(req.usuario.id);
    //console.log(usuario.tipoUsuario)
    if (usuario.token.tipoUsuario != "admin") {
        return mensajes(400, "Admin no autorizado");
        //res.status(400).json("Admin no autorizado");
    }
    return mensajes(200,"Admin Autorizado");
}
