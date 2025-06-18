const { EntradaGPUsuario, GranPremio } = require('../models');

// Obtener todas las entradas del usuario autenticado con info del Gran Premio
exports.getEntradas = async (req, res) => {
  try {
    const entradas = await EntradaGPUsuario.findAll({
      where: { UsuarioId: req.usuarioId },
      order: [['fechacreacion', 'DESC']],
      include: [{
        model: GranPremio,
        attributes: ['id', 'nombre']
      }]
    });
    res.json(entradas);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    res.status(500).json({ error: 'Error al obtener entradas' });
  }
};

// Obtener una entrada por ID con info del Gran Premio
exports.getEntradaPorId = async (req, res) => {
  try {
    const entrada = await EntradaGPUsuario.findOne({
      where: {
        id: req.params.id,
        UsuarioId: req.usuarioId,
      },
      include: [{
        model: GranPremio,
        attributes: ['id', 'nombre']
      }]
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

// Crear, actualizar y eliminar quedan igual (opcionalmente podés agregar includes si querés devolver info del Gran Premio)
exports.crearEntrada = async (req, res) => {
  try {
    const nuevaEntrada = await EntradaGPUsuario.create({
      Titulo: req.body.Titulo,
      GranPremioId: req.body.GranPremioId,
      resumengeneral: req.body.resumen,
      notaspersonales: req.body.notasPersonales,
      fechacreacion: req.body.fecha,
      UsuarioId: req.usuarioId,
    });

    res.status(201).json(nuevaEntrada);
  } catch (error) {
    console.error('Error al crear la entrada:', error);
    res.status(500).json({ error: 'Error al crear la entrada' });
  }
};

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
      resumengeneral: req.body.resumen,
      notaspersonales: req.body.notasPersonales,
      fechacreacion: req.body.fecha,
    });

    res.json(entrada);
  } catch (error) {
    console.error('Error al actualizar la entrada:', error);
    res.status(500).json({ error: 'Error al actualizar la entrada' });
  }
};

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

    await entrada.destroy();
    res.json({ mensaje: 'Entrada eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la entrada:', error);
    res.status(500).json({ error: 'Error al eliminar la entrada' });
  }
};
