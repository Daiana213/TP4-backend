const { Piloto, Equipo } = require('../models');

const sumarPuntos = (lista, acumuladorPilotos, acumuladorEquipos) => {
  for (const entry of lista) {
    const pilotoId = entry.pilotoId;
    if (!pilotoId) continue;
    const puntos = entry.puntos || 0;
    acumuladorPilotos[pilotoId] = (acumuladorPilotos[pilotoId] || 0) + puntos;
  }
};

const restarPuntos = (lista, acumuladorPilotos, acumuladorEquipos) => {
  for (const entry of lista) {
    const pilotoId = entry.pilotoId;
    if (!pilotoId) continue;
    const puntos = entry.puntos || 0;
    acumuladorPilotos[pilotoId] = (acumuladorPilotos[pilotoId] || 0) - puntos;
  }
};

const actualizarPuntos = async ({ sprint, carrera }) => {
  const puntosPorPiloto = {};
  const puntosPorEquipo = {};

  sumarPuntos(sprint || [], puntosPorPiloto, puntosPorEquipo);
  sumarPuntos(carrera || [], puntosPorPiloto, puntosPorEquipo);

  for (const pilotoId in puntosPorPiloto) {
    const piloto = await Piloto.findByPk(pilotoId);
    if (!piloto) continue;

    const puntos = puntosPorPiloto[pilotoId];
    await piloto.increment('Puntos', { by: puntos });

    if (piloto.EquipoId) {
      puntosPorEquipo[piloto.EquipoId] = (puntosPorEquipo[piloto.EquipoId] || 0) + puntos;
    }
  }

  for (const equipoId in puntosPorEquipo) {
    const equipo = await Equipo.findByPk(equipoId);
    if (!equipo) continue;

    const puntos = puntosPorEquipo[equipoId];
    await equipo.increment('Puntos', { by: puntos });
  }
};

const restarPuntosDeEntrada = async ({ sprint, carrera }) => {
    const puntosPorPiloto = {};
    const puntosPorEquipo = {};
  
    restarPuntos(sprint || [], puntosPorPiloto, puntosPorEquipo);
    restarPuntos(carrera || [], puntosPorPiloto, puntosPorEquipo);
  
    for (const pilotoId in puntosPorPiloto) {
      const piloto = await Piloto.findByPk(pilotoId);
      if (!piloto) continue;
  
      const puntosARestar = puntosPorPiloto[pilotoId]; // número negativo
      await piloto.increment('Puntos', { by: puntosARestar });
  
      // Refrescar el piloto para obtener el valor actualizado
      await piloto.reload();
  
      if (piloto.Puntos < 0) {
        await piloto.update({ Puntos: 0 });
      }
  
      if (piloto.EquipoId) {
        puntosPorEquipo[piloto.EquipoId] = (puntosPorEquipo[piloto.EquipoId] || 0) + puntosARestar;
      }
    }
  
    for (const equipoId in puntosPorEquipo) {
      const equipo = await Equipo.findByPk(equipoId);
      if (!equipo) continue;
  
      const puntosARestar = puntosPorEquipo[equipoId]; // número negativo
      await equipo.increment('Puntos', { by: puntosARestar });
  
      // Refrescar el equipo para obtener el valor actualizado
      await equipo.reload();
  
      if (equipo.Puntos < 0) {
        await equipo.update({ Puntos: 0 });
      }
    }
  };
  

module.exports = {
  actualizarPuntos,
  restarPuntosDeEntrada
};
