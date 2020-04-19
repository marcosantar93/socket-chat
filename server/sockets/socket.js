const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearMensaje } = require("../utils/utils");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  // Escuchar el cliente
  client.on("entrarChat", (data, callback) => {
    if (!data.nombre || !data.sala) {
      return callback({ error: true, mensaje: "El nombre/sala es necesario" });
    }
    client.join(data.sala);

    usuarios.agregarPersona(client.id, data.nombre, data.sala);

    client.broadcast
      .to(data.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));

    callback(usuarios.getPersonasPorSala(data.sala));
  });

  client.on("crearMensaje", (data) => {
    const persona = usuarios.getPersona(client.id);
    const mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
  });

  client.on("disconnect", () => {
    const personaBorrada = usuarios.borrarPersona(client.id);
    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        "crearMensaje",
        crearMensaje(
          "Administrador",
          `${personaBorrada.nombre} abandono el chat`
        )
      );
    client.broadcast
      .to(personaBorrada.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
  });

  // Mensajes privados
  client.on("mensajePrivado", (data) => {
    const persona = usuarios.getPersona(client.id);
    client.broadcast
      .to(data.destinatario)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });
});
