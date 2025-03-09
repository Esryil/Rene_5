"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _usuariosBD = require("../db/usuariosBD.js");

var _funcionesPassword = require("../middlewares/funcionesPassword.js");

var _usuarioModelo = _interopRequireDefault(require("../models/usuarioModelo.js"));

var _manejoErrores = require("../libs/manejoErrores.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // Cerrar sesión

router.get("/salir", function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.cookie('token', '', {
            expires: new Date(0)
          }).clearCookie('token').status(200).json("Cerrado sesión correctamente");

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Verificar autorización de usuario

router.get("/usuarios", function _callee2(req, res) {
  var respuesta;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            respuesta = (0, _funcionesPassword.usuarioAutorizado)(req.cookies.token, req);
            res.status(respuesta.status).json(respuesta.mensajeUsuario);
          } catch (error) {
            res.status(500).json((0, _manejoErrores.mensajes)(500, "Error al verificar usuario", error.message));
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Verificar si el usuario es administrador

router.get("/administradores", function _callee3(req, res) {
  var respuesta;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _funcionesPassword.adminAutorizado)(req));

        case 3:
          respuesta = _context3.sent;
          res.status(respuesta.status).json(respuesta);
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error al verificar administrador", _context3.t0.message));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Ruta de prueba

router.get("/todos", function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.send("Estas en todos");

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Registro de usuario

router.post("/registro", function _callee5(req, res) {
  var respuesta;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap((0, _usuariosBD.register)(req.body));

        case 3:
          respuesta = _context5.sent;

          if (respuesta.status === 200) {
            res.cookie('token', respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
          } else {
            res.status(respuesta.status).json(respuesta);
          }

          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error en el registro", _context5.t0.message));

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Inicio de sesión

router.post("/login", function _callee6(req, res) {
  var respuesta;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap((0, _usuariosBD.login)(req.body));

        case 3:
          respuesta = _context6.sent;
          res.status(respuesta.status).json(respuesta);
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error en el inicio de sesión", _context6.t0.message));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Obtener todos los usuarios

router.get("/usuarios", function _callee7(req, res) {
  var usuarios;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_usuarioModelo["default"].find());

        case 3:
          usuarios = _context7.sent;
          res.status(usuarios.length ? 200 : 404).json(usuarios.length ? usuarios : (0, _manejoErrores.mensajes)(404, "No hay usuarios disponibles"));
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error al obtener usuarios", _context7.t0.message));

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Obtener usuario por ID

router.get("/usuarios/:id", function _callee8(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_usuarioModelo["default"].findById(req.params.id));

        case 3:
          usuario = _context8.sent;

          if (usuario) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(404).json((0, _manejoErrores.mensajes)(404, "Usuario no encontrado")));

        case 6:
          res.status(200).json(usuario);
          _context8.next = 12;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error al obtener el usuario", _context8.t0.message));

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Borrar usuario por ID

router["delete"]("/usuarios/:id", function _callee9(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_usuarioModelo["default"].findByIdAndDelete(req.params.id));

        case 3:
          usuario = _context9.sent;

          if (usuario) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.status(404).json((0, _manejoErrores.mensajes)(404, "Usuario no encontrado")));

        case 6:
          res.status(200).json((0, _manejoErrores.mensajes)(200, "Usuario borrado correctamente"));
          _context9.next = 12;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error al borrar el usuario", _context9.t0.message));

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Actualizar usuario por ID

router.put("/usuarios/:id", function _callee10(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(_usuarioModelo["default"].findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 3:
          usuario = _context10.sent;

          if (usuario) {
            _context10.next = 6;
            break;
          }

          return _context10.abrupt("return", res.status(404).json((0, _manejoErrores.mensajes)(404, "Usuario no encontrado")));

        case 6:
          res.status(200).json((0, _manejoErrores.mensajes)(200, "Usuario actualizado correctamente", usuario));
          _context10.next = 12;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          res.status(500).json((0, _manejoErrores.mensajes)(500, "Error al actualizar el usuario", _context10.t0.message));

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=usuariosRutas.dev.js.map
