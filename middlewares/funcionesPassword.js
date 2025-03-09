import crypto from "crypto";
import "dotenv/config";
import jwt from "jsonwebtoken";

export function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex")
    return {
        salt,
        hash
    }
}

export function validarPassword(password, salt, hash) {
    const hashEvaluar = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex")
    return hashEvaluar == hash;
}

export function usuarioAutorizado(req, res, next){
    const token=req.cookies.token;
    if(!token){
        res.json("Usuario no autorizado").status(400);
    }
    console.log(token);
    console.log(process.env.SECRET_TOKEN);
    jwt.verify(token, process.env.SECRET_TOKEN,(error, usuario)=>{
        if(error){
            res.json(400).json("Usuario no autorizado - token no valido").status(400);
        }
        console.log(usuario);
        req.usuario=usuario;
    });
    next();
}

export function adminAutorizado() {

}