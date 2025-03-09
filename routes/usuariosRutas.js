import { Router } from "express";
import { register, login, obtenerUsuarios, obtenerUsuarioPorId, borrarUsuarioPorId, actualizarUsuarioPorId } from "../db/usuariosBD.js";
import { usuarioAutorizado } from "../middlewares/funcionespassword.js";
const router = Router();

// Ruta para mostrar todos los usuarios
router.get("/usuarios", async (req, res) => {
    const respuesta = await obtenerUsuarios();
    res.status(respuesta.status).json(respuesta);
});

// Ruta para buscar un usuario por ID
router.get("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const respuesta = await obtenerUsuarioPorId(id);
    res.status(respuesta.status).json(respuesta);
});

// Ruta para borrar un usuario por ID
router.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const respuesta = await borrarUsuarioPorId(id);
    res.status(respuesta.status).json(respuesta);
});

// Ruta para actualizar un usuario por ID
router.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const nuevosDatos = req.body;
    const respuesta = await actualizarUsuarioPorId(id, nuevosDatos);
    res.status(respuesta.status).json(respuesta);
});

// Rutas existentes (registro, login, etc.)
router.post("/registro", async (req, res) => {
    const respuesta = await register(req.body);
    res.cookie('token', respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.post("/ingresar", async (req, res) => {
    const respuesta = await login(req.body);
    res.status(respuesta.status).json(respuesta);
});

router.get("/salir", async (req, res) => {
    res.cookie('token','').status(200).json("Cerraste sesion correctamente")
});

router.get("/usuario", usuarioAutorizado, async (req, res) => {
    console.log(req.usuario);
    res.send("Estas en usuarios");
});

router.get("/administradores", async (req, res) => {
    res.send("Estas en administradores");
});


export default router;