const { EntradaGPUsuario, GranPremio, Carrera, Clasificacion, Sprint } = require('../models');

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

// Crear entrada con datos de puestos
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

    if (req.body.carreraStandings?.length > 0) {
      await Carrera.create({
        standings: JSON.stringify(req.body.carreraStandings),
        entradaId: nuevaEntrada.id
      });
    }

    if (req.body.clasificacionStandings?.length > 0) {
      await Clasificacion.create({
        standings: JSON.stringify(req.body.clasificacionStandings),
        entradaId: nuevaEntrada.id
      });
    }

    if (req.body.tieneSprint && req.body.sprintStandings?.length > 0) {
      await Sprint.create({
        standings: JSON.stringify(req.body.sprintStandings),
        entradaId: nuevaEntrada.id
      });
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

// Actualizar entrada con datos de puestos
exports.actualizarEntrada = async (req, res) => {
  try {
    const entrada = await EntradaGPUsuario.findOne({
      where: { id: req.params.id, UsuarioId: req.usuarioId }
    });

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    await entrada.update({
      Titulo: req.body.Titulo,
      GranPremioId: req.body.GranPremioId,
      resumengeneral: req.body.resumengeneral,
      notaspersonales: req.body.notaspersonales,
      fechacreacion: req.body.fechacreacion,
      tieneSprint: req.body.tieneSprint
    });

    if (req.body.carreraStandings?.length > 0) {
      const [carrera] = await Carrera.findOrCreate({
        where: { entradaId: entrada.id },
        defaults: { standings: JSON.stringify(req.body.carreraStandings), entradaId: entrada.id }
      });
      await carrera.update({ standings: JSON.stringify(req.body.carreraStandings) });
    }

    if (req.body.clasificacionStandings?.length > 0) {
      const [clasificacion] = await Clasificacion.findOrCreate({
        where: { entradaId: entrada.id },
        defaults: { standings: JSON.stringify(req.body.clasificacionStandings), entradaId: entrada.id }
      });
      await clasificacion.update({ standings: JSON.stringify(req.body.clasificacionStandings) });
    }

    if (req.body.tieneSprint && req.body.sprintStandings?.length > 0) {
      const [sprint] = await Sprint.findOrCreate({
        where: { entradaId: entrada.id },
        defaults: { standings: JSON.stringify(req.body.sprintStandings), entradaId: entrada.id }
      });
      await sprint.update({ standings: JSON.stringify(req.body.sprintStandings) });
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

// Eliminar entrada y sus datos relacionados
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
