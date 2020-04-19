class Usuarios {
  constructor() {
    this.personas = [];
  }

  agregarPersona(id, nombre, sala) {
    let persona = { id, nombre, sala };
    this.personas.push(persona);
    return this.personas;
  }

  getPersona(id) {
    return this.personas.find((persona) => persona.id === id);
  }

  getPersonas() {
    return this.personas;
  }

  getPersonasPorSala(sala) {
    return this.personas.filter(persona => persona.sala === sala)
  }

  borrarPersona(id) {
    const personaBorrada = this.getPersona(id);
    this.personas = this.personas.filter((persona) => persona.id !== id);
    return personaBorrada;
  }
}

module.exports = {
  Usuarios,
};
