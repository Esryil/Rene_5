import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { crearToken } from "../libs/jwt.js";
import { mensajes } from "../libs/manejoErrores.js";

// Registrar usuario
export async function registrarUsuario({ username, email, password, tipoUsuario = "usuario" }) {
    try {
        if (await User.findOne({ username }) || await User.findOne({ email })) {
            return mensajes(400, "El usuario o correo ya está registrado");
        }

        console.log("Contraseña recibida:", password);
        const { salt, hash } = encriptarPassword(password);
        console.log("Hash generado:", hash);

        const nuevoUsuario = new User({ username, email, password: hash, salt, tipoUsuario });
        const usuarioGuardado = await nuevoUsuario.save();

        const token = await crearToken({ id: usuarioGuardado._id, tipoUsuario });
        return mensajes(201, "Usuario registrado con éxito", "", token);
    } catch (error) {
        console.log("❌ Error en registrarUsuario:", error);  // <-- NUEVO LOG
        return mensajes(500, "Error al registrar usuario", error);
    }
}

// Autenticar usuario
export async function iniciarSesion({ username, password }) {
    try {
        const usuario = await User.findOne({ username });
        if (!usuario || !validarPassword(password, usuario.salt, usuario.password)) {
            return mensajes(401, "Credenciales incorrectas");
        }

        const token = await crearToken({ id: usuario._id, tipoUsuario: usuario.tipoUsuario });
        return mensajes(200, "Inicio de sesión exitoso", "", token);
    } catch (error) {
        return mensajes(500, "Error al iniciar sesión", error);
    }
}

// Obtener todos los usuarios
export async function listarUsuarios() {
    try {
        const usuarios = await User.find();
        return mensajes(usuarios.length ? 200 : 404, usuarios.length ? "Usuarios encontrados" : "No hay usuarios registrados", "", usuarios);
    } catch (error) {
        return mensajes(500, "Error al obtener usuarios", error);
    }
}

// Obtener usuario por ID
export async function obtenerUsuario(id) {
    try {
        const usuario = await User.findById(id);
        return usuario ? mensajes(200, "Usuario encontrado", "", usuario) : mensajes(404, "Usuario no encontrado");
    } catch (error) {
        return mensajes(500, "Error al buscar usuario", error);
    }
}

// Eliminar usuario
export async function eliminarUsuario(id) {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(id);
        return usuarioEliminado ? mensajes(200, "Usuario eliminado correctamente") : mensajes(404, "Usuario no encontrado");
    } catch (error) {
        return mensajes(500, "Error al eliminar usuario", error);
    }
}

// Actualizar usuario
export async function actualizarUsuario(id, datos) {
    try {
        const usuarioActualizado = await User.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
        return usuarioActualizado ? mensajes(200, "Usuario actualizado", "", usuarioActualizado) : mensajes(404, "Usuario no encontrado");
    } catch (error) {
        return mensajes(500, "Error al actualizar usuario", error);
    }
}
