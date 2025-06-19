const { EntradaGPUsuario, GranPremio, Carrera, Clasificacion, Sprint } = require('../models');

// Obtener todas las entradas del usuario autenticado con info del Gran Premio y datos de puestos
exports.getEntradas = async (req, res) => {
  try {
    const entradas = await EntradaGPUsuario.findAll({
      where: { UsuarioId: req.usuarioId },
      order: [['fechacreacion', 'DESC']],
      include: [
        {
          model: GranPremio,
          attributes: ['id', 'nombre']
        },
        {
          model: Carrera,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Clasificacion,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Sprint,
          attributes: ['id', 'standings'],
          required: false
        }
      ]
    });
    res.json(entradas);
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
        {
          model: GranPremio,
          attributes: ['id', 'nombre']
        },
        {
          model: Carrera,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Clasificacion,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Sprint,
          attributes: ['id', 'standings'],
          required: false
        }
      ]
    });

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    res.json(entrada);
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

    // Crear datos de carrera (aunque sea array vacío)
    await Carrera.create({
      standings: req.body.carreraStandings || [],
      entradaId: nuevaEntrada.id
    });

    // Crear datos de clasificación (aunque sea array vacío)
    await Clasificacion.create({
      standings: req.body.clasificacionStandings || [],
      entradaId: nuevaEntrada.id
    });

    // Crear datos de sprint (aunque sea array vacío)
    await Sprint.create({
      standings: req.body.sprintStandings || [],
      entradaId: nuevaEntrada.id
    });

    // Obtener la entrada completa con todos los datos
    const entradaCompleta = await EntradaGPUsuario.findByPk(nuevaEntrada.id, {
      include: [
        {
          model: GranPremio,
          attributes: ['id', 'nombre']
        },
        {
          model: Carrera,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Clasificacion,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Sprint,
          attributes: ['id', 'standings'],
          required: false
        }
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
      where: {
        id: req.params.id,
        UsuarioId: req.usuarioId,
      },
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

    // Actualizar o crear datos de carrera
    const [carrera] = await Carrera.findOrCreate({
      where: { entradaId: entrada.id },
      defaults: { standings: req.body.carreraStandings || [], entradaId: entrada.id }
    });
    await carrera.update({ standings: req.body.carreraStandings || [] });

    // Actualizar o crear datos de clasificación
    const [clasificacion] = await Clasificacion.findOrCreate({
      where: { entradaId: entrada.id },
      defaults: { standings: req.body.clasificacionStandings || [], entradaId: entrada.id }
    });
    await clasificacion.update({ standings: req.body.clasificacionStandings || [] });

    // Actualizar o crear datos de sprint
    const [sprint] = await Sprint.findOrCreate({
      where: { entradaId: entrada.id },
      defaults: { standings: req.body.sprintStandings || [], entradaId: entrada.id }
    });
    await sprint.update({ standings: req.body.sprintStandings || [] });

    // Obtener la entrada actualizada con todos los datos
    const entradaActualizada = await EntradaGPUsuario.findByPk(entrada.id, {
      include: [
        {
          model: GranPremio,
          attributes: ['id', 'nombre']
        },
        {
          model: Carrera,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Clasificacion,
          attributes: ['id', 'standings'],
          required: false
        },
        {
          model: Sprint,
          attributes: ['id', 'standings'],
          required: false
        }
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

    // Eliminar datos relacionados
    await Carrera.destroy({ where: { entradaId: entrada.id } });
    await Clasificacion.destroy({ where: { entradaId: entrada.id } });
    await Sprint.destroy({ where: { entradaId: entrada.id } });

    // Eliminar la entrada
    await entrada.destroy();
    res.json({ mensaje: 'Entrada eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la entrada:', error);
    res.status(500).json({ error: 'Error al eliminar la entrada' });
  }
};
