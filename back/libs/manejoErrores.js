export function mensajes(status, mensajeUsuario, mensajeOriginal= "", token=""){
    return {                                                                                                     //los 3 que estan adentro son atributos
        status,
        mensajeUsuario,
        mensajeOriginal,
        token
    }
}