const { EntradaGPUsuario, GranPremio, Carrera, Clasificacion, Sprint } = require('../models');
const { actualizarPuntos, restarPuntosDeEntrada } = require('./actualizarPuntos');
const { Op } = require('sequelize');

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

// Crear entrada con validaciones de una por GP y orden
exports.crearEntrada = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { GranPremioId } = req.body;

    const yaExiste = await EntradaGPUsuario.findOne({
      where: { UsuarioId: usuarioId, GranPremioId }
    });

    if (yaExiste) {
      return res.status(400).json({ error: 'Ya existe una entrada para este Gran Premio.' });
    }

    const gpActual = await GranPremio.findByPk(GranPremioId);
    if (!gpActual) {
      return res.status(404).json({ error: 'Gran Premio no encontrado.' });
    }

    const rondaActual = gpActual.ronda;
    const gpsAnteriores = await GranPremio.findAll({
      where: { ronda: { [Op.lt]: rondaActual } },
      order: [['ronda', 'ASC']]
    });

    for (const gp of gpsAnteriores) {
      const entradaAnterior = await EntradaGPUsuario.findOne({
        where: { UsuarioId: usuarioId, GranPremioId: gp.id }
      });
      if (!entradaAnterior) {
        return res.status(400).json({ error: `Falta la entrada para el Gran Premio de la ronda ${gp.ronda}: "${gp.nombre}".` });
      }
    }

    const nuevaEntrada = await EntradaGPUsuario.create({
      Titulo: req.body.Titulo,
      GranPremioId,
      resumengeneral: req.body.resumengeneral,
      notaspersonales: req.body.notaspersonales,
      fechacreacion: req.body.fechacreacion,
      UsuarioId: usuarioId,
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

    await actualizarPuntos({
      sprint: req.body.sprintStandings,
      carrera: req.body.carreraStandings
    });

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
