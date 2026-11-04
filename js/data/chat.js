window.MPU = window.MPU || {};
MPU.conversaciones = [
  {
    id: 'ingenierias', nombre: 'Secretaría Ingenierías', enLinea: true,
    mensajes: [
      { de: 'ellos', texto: 'Hola, ¿cómo puedo ayudarte?' },
      { de: 'yo', texto: 'Quiero solicitar un cambio de turno de matrícula.' },
      { de: 'ellos', texto: 'Claro. Puedes hacerlo desde Turnos o te guío aquí.' },
      { de: 'yo', texto: 'Prefiero que me guíes, gracias.' },
    ],
  },
  { id: 'ciencias', nombre: 'Secretaría Ciencias', enLinea: false, mensajes: [] },
  { id: 'registro', nombre: 'Registro académico', enLinea: true, mensajes: [{ de: 'ellos', texto: 'Hola, ¿cómo puedo ayudarte?' }] },
];
