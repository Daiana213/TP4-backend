const { EntradaGPUsuario, GranPremio, Carrera, Clasificacion, Sprint, Piloto, Equipo } = require('../models');

// Función auxiliar para procesar standings y actualizar puntos de pilotos
async function procesarStandingsYActualizarPuntos(standings, tipo) {
  if (!standings || standings.length === 0) return;

  for (const posicion of standings) {
    if (!posicion.piloto || !posicion.puntos) {
      console.warn(`Datos inválidos en ${tipo}:`, posicion);
      continue;
    }

    const puntos = parseInt(posicion.puntos) || 0;
    if (puntos <= 0) continue;

    // Buscar piloto por nombre
    const piloto = await Piloto.findOne({
      where: { Nombre: posicion.piloto },
      include: [{ model: Equipo, attributes: ['id', 'Nombre'] }]
    });

    if (!piloto) {
      console.warn(`Piloto no encontrado: ${posicion.piloto}`);
      continue;
    }

    // Sumar puntos al piloto
    const puntosAnteriores = piloto.Puntos || 0;
    const nuevosPuntos = puntosAnteriores + puntos;
    await piloto.update({ Puntos: nuevosPuntos });


    // Actualizar puntos del equipo si existe
    if (piloto.Equipo) {
      const equipo = await Equipo.findByPk(piloto.Equipo.id);
      if (equipo) {
        // Recalcular puntos totales del equipo
        const pilotosEquipo = await Piloto.findAll({
          where: { EquipoId: equipo.id },
          attributes: ['Puntos']
        });
        
        const totalPuntosEquipo = pilotosEquipo.reduce((sum, p) => sum + (p.Puntos || 0), 0);
        await equipo.update({ Puntos: totalPuntosEquipo });
        
      }
    }
  }
}

// Función auxiliar para revertir puntos (restar puntos)
async function revertirPuntosDeStandings(standings, tipo) {
  if (!standings || standings.length === 0) return;

  for (const posicion of standings) {
    if (!posicion.piloto || !posicion.puntos) {
      continue;
    }

    const puntos = parseInt(posicion.puntos) || 0;
    if (puntos <= 0) continue;

    // Buscar piloto por nombre
    const piloto = await Piloto.findOne({
      where: { Nombre: posicion.piloto },
      include: [{ model: Equipo, attributes: ['id', 'Nombre'] }]
    });

    if (!piloto) {
      continue;
    }

    // Restar puntos al piloto
    const puntosAnteriores = piloto.Puntos || 0;
    const nuevosPuntos = Math.max(0, puntosAnteriores - puntos); // No permitir puntos negativos
    await piloto.update({ Puntos: nuevosPuntos });

    console.log(`🔄 ${tipo}: ${posicion.piloto} -${puntos} pts (Total: ${nuevosPuntos})`);

    // Actualizar puntos del equipo si existe
    if (piloto.Equipo) {
      const equipo = await Equipo.findByPk(piloto.Equipo.id);
      if (equipo) {
        // Recalcular puntos totales del equipo
        const pilotosEquipo = await Piloto.findAll({
          where: { EquipoId: equipo.id },
          attributes: ['Puntos']
        });
        
        const totalPuntosEquipo = pilotosEquipo.reduce((sum, p) => sum + (p.Puntos || 0), 0);
        await equipo.update({ Puntos: totalPuntosEquipo });
        
        console.log(`🏁 Equipo ${equipo.Nombre} actualizado: ${totalPuntosEquipo} pts`);
      }
    }
  }
}

// Función auxiliar para revertir puntos al eliminar entrada
async function revertirPuntosDeEntrada(entradaId) {
  try {
    const entrada = await EntradaGPUsuario.findByPk(entradaId, {
      include: [
        { model: Carrera, attributes: ['standings'], required: false },
        { model: Sprint, attributes: ['standings'], required: false }
      ]
    });

    if (!entrada) return;

    // Revertir puntos de carrera
    if (entrada.Carrera && entrada.Carrera.standings) {
      const standingsCarrera = JSON.parse(entrada.Carrera.standings);
      await revertirPuntosDeStandings(standingsCarrera, 'Carrera (revertir)');
    }

    // Revertir puntos de sprint
    if (entrada.Sprint && entrada.Sprint.standings) {
      const standingsSprint = JSON.parse(entrada.Sprint.standings);
      await revertirPuntosDeStandings(standingsSprint, 'Sprint (revertir)');
    }
  } catch (error) {
    console.error('Error al revertir puntos:', error);
  }
}

// Obtener todas las entradas del usuario autenticado con info del Gran Premio y datos de puestos
exports.getEntradas = async (req, res) => {
  try {
    const entradas = await EntradaGPUsuario.findAll({
      where: { UsuarioId: req.usuarioId },
      order: [['fechacreacion', 'DESC']],
      include: [
        { model: GranPremio, attributes: ['id', 'nombre'] },
        { model: Carrera, attributes: ['id', 'standings'], required: false },
        { model: Clasificacion, attributes: ['id', 'standings'], required: false },
        { model: Sprint, attributes: ['id', 'standings'], required: false }
      ]
    });

    const entradasParseadas = entradas.map(e => ({
      ...e.toJSON(),
      Carrera: e.Carrera ? { ...e.Carrera.toJSON(), standings: JSON.parse(e.Carrera.standings) } : null,
      Clasificacion: e.Clasificacion ? { ...e.Clasificacion.toJSON(), standings: JSON.parse(e.Clasificacion.standings) } : null,
      Sprint: e.Sprint ? { ...e.Sprint.toJSON(), standings: JSON.parse(e.Sprint.standings) } : null,
    }));

    res.json(entradasParseadas);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    res.status(500).json({ error: 'Error al obtener entradas' });
  }
};

// Obtener una entrada por ID con info del Gran Premio y datos de puestos
exports.getEntradaPorId = async (req, res) => {
  try {
    const entrada = await EntradaGPUsuario.findOne({
      where: {
        id: req.params.id,
        UsuarioId: req.usuarioId,
      },
      include: [
        { model: GranPremio, attributes: ['id', 'nombre'] },
        { model: Carrera, attributes: ['id', 'standings'], required: false },
        { model: Clasificacion, attributes: ['id', 'standings'], required: false },
        { model: Sprint, attributes: ['id', 'standings'], required: false }
      ]
    });

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    const entradaParseada = {
      ...entrada.toJSON(),
      Carrera: entrada.Carrera ? { ...entrada.Carrera.toJSON(), standings: JSON.parse(entrada.Carrera.standings) } : null,
      Clasificacion: entrada.Clasificacion ? { ...entrada.Clasificacion.toJSON(), standings: JSON.parse(entrada.Clasificacion.standings) } : null,
      Sprint: entrada.Sprint ? { ...entrada.Sprint.toJSON(), standings: JSON.parse(entrada.Sprint.standings) } : null,
    };

    res.json(entradaParseada);
  } catch (error) {
    console.error('Error al obtener entrada:', error);
    res.status(500).json({ error: 'Error al obtener entrada' });
  }
};

// Crear entrada con datos de puestos y actualizar puntos automáticamente
exports.crearEntrada = async (req, res) => {
  try {
    const nuevaEntrada = await EntradaGPUsuario.create({
      Titulo: req.body.Titulo,
      GranPremioId: req.body.GranPremioId,
      resumengeneral: req.body.resumengeneral,
      notaspersonales: req.body.notaspersonales,
      fechacreacion: req.body.fechacreacion,
      UsuarioId: req.usuarioId,
      tieneSprint: req.body.tieneSprint
    });

    // Procesar carrera y actualizar puntos
    if (req.body.carreraStandings?.length > 0) {
      await Carrera.create({
        standings: JSON.stringify(req.body.carreraStandings),
        entradaId: nuevaEntrada.id
      });
      await procesarStandingsYActualizarPuntos(req.body.carreraStandings, 'Carrera');
    }

    // Procesar clasificación (no suma puntos)
    if (req.body.clasificacionStandings?.length > 0) {
      await Clasificacion.create({
        standings: JSON.stringify(req.body.clasificacionStandings),
        entradaId: nuevaEntrada.id
      });
    }

    // Procesar sprint y actualizar puntos
    if (req.body.tieneSprint && req.body.sprintStandings?.length > 0) {
      await Sprint.create({
        standings: JSON.stringify(req.body.sprintStandings),
        entradaId: nuevaEntrada.id
      });
      await procesarStandingsYActualizarPuntos(req.body.sprintStandings, 'Sprint');
    }

    const entradaCompleta = await EntradaGPUsuario.findByPk(nuevaEntrada.id, {
      include: [
        { model: GranPremio, attributes: ['id', 'nombre'] },
        { model: Carrera, attributes: ['id', 'standings'], required: false },
        { model: Clasificacion, attributes: ['id', 'standings'], required: false },
        { model: Sprint, attributes: ['id', 'standings'], required: false }
      ]
    });

    res.status(201).json(entradaCompleta);
  } catch (error) {
    console.error('Error al crear la entrada:', error);
    res.status(500).json({ error: 'Error al crear la entrada' });
  }
};

// Actualizar entrada con datos de puestos y recalcular puntos
exports.actualizarEntrada = async (req, res) => {
  try {
    const entrada = await EntradaGPUsuario.findOne({
      where: { id: req.params.id, UsuarioId: req.usuarioId }
    });

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    // Primero revertir los puntos de la entrada anterior
    await revertirPuntosDeEntrada(entrada.id);

    await entrada.update({
      Titulo: req.body.Titulo,
      GranPremioId: req.body.GranPremioId,
      resumengeneral: req.body.resumengeneral,
      notaspersonales: req.body.notaspersonales,
      fechacreacion: req.body.fechacreacion,
      tieneSprint: req.body.tieneSprint
    });

    // Procesar carrera y actualizar puntos
    if (req.body.carreraStandings?.length > 0) {
      const [carrera] = await Carrera.findOrCreate({
        where: { entradaId: entrada.id },
        defaults: { standings: JSON.stringify(req.body.carreraStandings), entradaId: entrada.id }
      });
      await carrera.update({ standings: JSON.stringify(req.body.carreraStandings) });
      await procesarStandingsYActualizarPuntos(req.body.carreraStandings, 'Carrera');
    }

    // Procesar clasificación (no suma puntos)
    if (req.body.clasificacionStandings?.length > 0) {
      const [clasificacion] = await Clasificacion.findOrCreate({
        where: { entradaId: entrada.id },
        defaults: { standings: JSON.stringify(req.body.clasificacionStandings), entradaId: entrada.id }
      });
      await clasificacion.update({ standings: JSON.stringify(req.body.clasificacionStandings) });
    }

    // Procesar sprint y actualizar puntos
    if (req.body.tieneSprint && req.body.sprintStandings?.length > 0) {
      const [sprint] = await Sprint.findOrCreate({
        where: { entradaId: entrada.id },
        defaults: { standings: JSON.stringify(req.body.sprintStandings), entradaId: entrada.id }
      });
      await sprint.update({ standings: JSON.stringify(req.body.sprintStandings) });
      await procesarStandingsYActualizarPuntos(req.body.sprintStandings, 'Sprint');
    }

    const entradaActualizada = await EntradaGPUsuario.findByPk(entrada.id, {
      include: [
        { model: GranPremio, attributes: ['id', 'nombre'] },
        { model: Carrera, attributes: ['id', 'standings'], required: false },
        { model: Clasificacion, attributes: ['id', 'standings'], required: false },
        { model: Sprint, attributes: ['id', 'standings'], required: false }
      ]
    });

    res.json(entradaActualizada);
  } catch (error) {
    console.error('Error al actualizar la entrada:', error);
    res.status(500).json({ error: 'Error al actualizar la entrada' });
  }
};

// Eliminar entrada y sus datos relacionados, revertir puntos
exports.eliminarEntrada = async (req, res) => {
  try {
    const entrada = await EntradaGPUsuario.findOne({
      where: {
        id: req.params.id,
        UsuarioId: req.usuarioId,
      },
    });

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    // Revertir puntos antes de eliminar
    await revertirPuntosDeEntrada(entrada.id);

    await Carrera.destroy({ where: { entradaId: entrada.id } });
    await Clasificacion.destroy({ where: { entradaId: entrada.id } });
    await Sprint.destroy({ where: { entradaId: entrada.id } });

    await entrada.destroy();
    res.json({ mensaje: 'Entrada eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la entrada:', error);
    res.status(500).json({ error: 'Error al eliminar la entrada' });
  }
};
