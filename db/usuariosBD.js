import User from "../models/usuarioModelo.js";                     //importamos los modelos de nuestro usuario
import { encriptarPassword, usuarioAutorizado, validarPassword } from "../middlewares/funcionespassword.js"  //importar las funciones que programamos anteriormente
import { crearToken} from "../libs/jwt.js"
import { mensajes } from "../libs/manejoErrores.js";

export async function register({ username, email, password }) {
    try {
        const usuarioExistente = await User.findOne({ username });
        const emailExistente = await User.findOne({ email });

        if (usuarioExistente || emailExistente) {
            return mensajes(400, "Usuario duplicado");
        }

        const { salt, hash } = encriptarPassword(password);                                     //se llama a la funcion password y se le coloca el valor de password
        const data = new User({ username, email, password: hash, salt });                                       //crear un objeto donde le mandaremos nuestras variables pasa el password encriptado y el salto
        var respuesta = await data.save();
        const token = await crearToken({id: respuesta._id});
        return mensajes(200, "Registro agregado correctamente", "", token);
    } catch (error) {
        return mensajes(400, "Error al registar al usuario", error);
    }
}

export const login = async ({ username, password }) => {
    try {
        const usuarioCorrecto = await User.findOne({ username });
        if (!usuarioCorrecto) {
            //console.log("usuario incorrecto");
            
            return mensajes(400, "datos incorreectos")
        }
        
        const passwordCorrecto = validarPassword(password, usuarioCorrecto.salt, usuarioCorrecto.password);
        if (!passwordCorrecto) {
            //console.log("password incorrecto");
            
            return mensajes(400, "datos incorrectos");
        }
        //console.log("correcto");
        
        return mensajes(200, "ingreso correcto")
    } catch (error) {
        //console.log("catch - incorrecto");
        
        return mensajes(400, "datos incorrectos");
    }
}

// Mostrar todos los usuarios
export async function obtenerUsuarios() {
    try {
        const usuarios = await User.find();
        return mensajes(200, "Usuarios obtenidos correctamente", "", usuarios);
    } catch (error) {
        return mensajes(400, "Error al obtener los usuarios", error);
    }
}

// Buscar usuario por ID
export async function obtenerUsuarioPorId(id) {
    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return mensajes(404, "Usuario no encontrado");
        }
        return mensajes(200, "Usuario encontrado correctamente", "", usuario);
    } catch (error) {
        return mensajes(400, "Error al buscar el usuario", error);
    }
}

// Borrar usuario por ID
export async function borrarUsuarioPorId(id) {
    try {
        const usuario = await User.findByIdAndDelete(id);
        if (!usuario) {
            return mensajes(404, "Usuario no encontrado");
        }
        return mensajes(200, "Usuario borrado correctamente");
    } catch (error) {
        return mensajes(400, "Error al borrar el usuario", error);
    }
}

// Actualizar usuario por ID
export async function actualizarUsuarioPorId(id, nuevosDatos) {
    try {
        const usuario = await User.findByIdAndUpdate(id, nuevosDatos, { new: true });
        if (!usuario) {
            return mensajes(404, "Usuario no encontrado");
        }
        return mensajes(200, "Usuario actualizado correctamente", "", usuario);
    } catch (error) {
        return mensajes(400, "Error al actualizar el usuario", error);
    }
}

export const usuarios = async(id)=>{
    console.log(id);
    
}