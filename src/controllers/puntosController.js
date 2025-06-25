const EntradaGPUsuario = require('../models/EntradaGPUsuario');
const Carrera = require('../models/Carrera');
const Sprint = require('../models/Sprint');
const Piloto = require('../models/Piloto');
const Equipo = require('../models/Equipo'); // Asegurate de tener este modelo

exports.calcularPuntosDelUsuario = async (req, res) => {
  const usuarioId = req.usuario?.id;

  try {
    const entradas = await EntradaGPUsuario.findAll({
      where: { UsuarioId: usuarioId },
      include: [Carrera, Sprint]
    });

    const puntosPilotos = {};
    const puntosEquipos = {};

    for (const entrada of entradas) {
      const procesarStandings = (standingsRaw) => {
        let standings = standingsRaw;
        if (typeof standings === 'string') {
          try {
            standings = JSON.parse(standings);
          } catch {}
        }
        standings.forEach(item => {
          if (item?.pilotoId && item?.puntos) {
            puntosPilotos[item.pilotoId] = (puntosPilotos[item.pilotoId] || 0) + item.puntos;
          }
          if (item?.equipo && item?.puntos) {
            puntosEquipos[item.equipo] = (puntosEquipos[item.equipo] || 0) + item.puntos;
          }
        });
      };

      if (entrada.Carrera?.standings) procesarStandings(entrada.Carrera.standings);
      if (entrada.Sprint?.standings) procesarStandings(entrada.Sprint.standings);
    }

    // Traer todos los pilotos y equipos registrados
    const todosLosPilotos = await Piloto.findAll({ include: ['Equipo'] });
    const todosLosEquipos = await Equipo.findAll();

    // Construir lista completa de pilotos, con puntos o con 0
    const resultadoPilotos = todosLosPilotos.map(piloto => ({
      pilotoId: piloto.id,
      nombre: piloto.Nombre || 'Desconocido',
      equipo: piloto.Equipo?.Nombre || 'Sin equipo',
      puntos: puntosPilotos[piloto.id] || 0
    })).sort((a, b) => b.puntos - a.puntos);

    // Construir lista completa de equipos, con puntos o con 0
    const resultadoEquipos = todosLosEquipos.map(equipo => ({
      id: equipo.id,
      equipo: equipo.Nombre,
      puntos: puntosEquipos[equipo.Nombre] || 0
    })).sort((a, b) => b.puntos - a.puntos);

    res.json({
      pilotos: resultadoPilotos,
      equipos: resultadoEquipos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al calcular puntos' });
  }
};
