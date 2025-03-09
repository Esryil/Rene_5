import { Router } from "express";
import { registrarUsuario, iniciarSesion } from "../db/usuariosBD.js";
import User from "../models/usuarioModelo.js";
import { verificarUsuario } from "../middlewares/funcionesPassword.js";
import { encriptarPassword } from "../middlewares/funcionesPassword.js";

const router = Router();

// ====== Todo lo de registro y login ======

/* Registro de usuario nuevo
   POST: http://localhost:3000/api/registro
   Body: {
    "nombre": "Juan",
    "email": "juan@mail.com",
    "password": "123456"
   }
   Retorna: Token en cookie y mensaje de éxito
*/
router.post("/registro", async (req, res) => {
    const respuesta = await registrarUsuario(req.body);
    res.cookie('token', respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});

/* Login de usuario
   POST: http://localhost:3000/api/ingresar
   Body: {
    "email": "juan@mail.com",
    "password": "123456"
   }
   Retorna: Token y datos del usuario
*/
router.post("/ingresar", async (req, res) => {
    const respuesta = await iniciarSesion(req.body);
    res.status(respuesta.status).json(respuesta);
});

/* Cerrar sesión
   GET: http://localhost:3000/api/salir
   No necesita body ni parámetros
*/
router.get("/salir", async (req, res) => {
    res.send("Estas en salir");
});

// ====== Funciones básicas de usuarios ======

/* Ver lista de usuarios
   GET: http://localhost:3000/api/usuarios
   No necesita body
   Retorna: Array con todos los usuarios
*/
router.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los usuarios", error: error.message });
    }
});

/* Buscar un usuario específico
   GET: http://localhost:3000/api/buscar/123456
   (reemplaza 123456 por el ID real del usuario)
   No necesita body
   Retorna: Datos del usuario encontrado
*/
router.get("/buscar/:id", async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el usuario", error: error.message });
    }
});

/* Borrar un usuario
   DELETE: http://localhost:3000/api/borrar/123456
   (reemplaza 123456 por el ID del usuario a borrar)
   No necesita body
   Retorna: Mensaje de confirmación
*/
router.delete("/borrar/:id", async (req, res) => {
    try {
        const usuario = await User.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json({ mensaje: "Usuario borrado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al borrar el usuario", error: error.message });
    }
});

/* Editar datos de usuario
   PUT: http://localhost:3000/api/editar/123456
   (reemplaza 123456 por el ID del usuario)
   Body: {
    "nombre": "Nuevo Nombre",
    "email": "nuevo@mail.com"
   }
   Retorna: Usuario actualizado
*/
router.put("/editar/:id", async (req, res) => {
    try {
        const usuario = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json({ mensaje: "Usuario actualizado correctamente", usuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el usuario", error: error.message });
    }
});

// ====== Otras funciones extras ======

/* Cambiar rol de usuario (entre admin y normal)
   PUT: http://localhost:3000/api/cambiar-tipo-usuario/123456
   Necesita: Token en las cookies
   No necesita body
   Retorna: Usuario con su nuevo rol
*/
router.put("/cambiar-tipo-usuario/:id", async (req, res) => {
    const usuarioAutenticado = verificarUsuario(req.cookies.token, req);
    if (usuarioAutenticado.status !== 200) {
        return res.status(403).json({ mensaje: "Acceso denegado. Debes estar autenticado para cambiar el tipo de usuario." });
    }
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        usuario.tipoUsuario = usuario.tipoUsuario === "usuario" ? "admin" : "usuario";
        await usuario.save();
        res.status(200).json({ mensaje: `Tipo de usuario cambiado a ${usuario.tipoUsuario}`, usuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar tipo de usuario", error: error.message });
    }
});

/* Cambiar contraseña
   PUT: http://localhost:3000/api/cambiar-password
   Body: {
    "id": "123456",
    "password": "nueva_contraseña"
   }
   Retorna: Mensaje de confirmación
*/
router.put("/cambiar-password", async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) return res.status(400).json({ mensaje: "ID y nueva contraseña son requeridos" });

        const usuario = await User.findById(id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const { salt, hash } = encriptarPassword(password);
        usuario.password = hash;
        usuario.salt = salt;
        await usuario.save();

        res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cambiar contraseña", error: error.message });
    }
});

export default router;