const { Piloto, Equipo, GranPremio } = require('../models/index');

const F1Controller = {
  // Controlador para pilotos
  getAllPilotos: async (req, res) => {
    try {
      const pilotos = await Piloto.findAll({
        include: [{ model: Equipo, attributes: ['Nombre'] }]
      });
      res.json(pilotos);
    } catch (error) {
      console.error('Error al obtener pilotos:', error);
      res.status(500).json({ message: 'Error al obtener pilotos' });
    }
  },

  getPilotoById: async (req, res) => {
    try {
      const piloto = await Piloto.findByPk(req.params.id, {
        include: [{ model: Equipo, attributes: ['Nombre'] }]
      });
      if (!piloto) {
        return res.status(404).json({ message: 'Piloto no encontrado' });
      }
      res.json(piloto);
    } catch (error) {
      console.error('Error al obtener piloto:', error);
      res.status(500).json({ message: 'Error al obtener piloto' });
    }
  },

  // Controlador para equipos
  getAllEquipos: async (req, res) => {
    try {
      const equipos = await Equipo.findAll({
        include: [{ model: Piloto, attributes: ['Nombre', 'Numero'] }]
      });
      res.json(equipos);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ message: 'Error al obtener equipos' });
    }
  },

  getEquipoById: async (req, res) => {
    try {
      const equipo = await Equipo.findByPk(req.params.id, {
        include: [{ model: Piloto }]
      });
      if (!equipo) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
      res.json(equipo);
    } catch (error) {
      console.error('Error al obtener equipo:', error);
      res.status(500).json({ message: 'Error al obtener equipo' });
    }
  },

  // Funciones para el administrador
  createPiloto: async (req, res) => {
    try {
      const piloto = await Piloto.create(req.body);
      res.status(201).json(piloto);
    } catch (error) {
      console.error('Error al crear piloto:', error);
      res.status(500).json({ message: 'Error al crear piloto' });
    }
  },

  updatePiloto: async (req, res) => {
    try {
      const piloto = await Piloto.findByPk(req.params.id);
      if (!piloto) {
        return res.status(404).json({ message: 'Piloto no encontrado' });
      }
      await piloto.update(req.body);
      res.json(piloto);
    } catch (error) {
      console.error('Error al actualizar piloto:', error);
      res.status(500).json({ message: 'Error al actualizar piloto' });
    }
  },

  createEquipo: async (req, res) => {
    try {
      const equipo = await Equipo.create(req.body);
      res.status(201).json(equipo);
    } catch (error) {
      console.error('Error al crear equipo:', error);
      res.status(500).json({ message: 'Error al crear equipo' });
    }
  },

  updateEquipo: async (req, res) => {
    try {
      const equipo = await Equipo.findByPk(req.params.id);
      if (!equipo) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
      await equipo.update(req.body);
      res.json(equipo);
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
      res.status(500).json({ message: 'Error al actualizar equipo' });
    }
  },

  getAllGrandesPremios: async (req, res) => {
    try {
      const grandesPremios = await GranPremio.findAll({
        order: [['fecha', 'ASC']]
      });
      res.json(grandesPremios);
    } catch (error) {
      console.error('Error al obtener grandes premios:', error);
      res.status(500).json({ message: 'Error al obtener grandes premios' });
    }
  },

  getGranPremioById: async (req, res) => {
    try {
      const granPremio = await GranPremio.findByPk(req.params.id);
      if (!granPremio) {
        return res.status(404).json({ message: 'Gran Premio no encontrado' });
      }
      res.json(granPremio);
    } catch (error) {
      console.error('Error al obtener gran premio:', error);
      res.status(500).json({ message: 'Error al obtener gran premio' });
    }
  },

  createGranPremio: async (req, res) => {
    try {
      const granPremio = await GranPremio.create(req.body);
      res.status(201).json(granPremio);
    } catch (error) {
      console.error('Error al crear gran premio:', error);
      res.status(500).json({ message: 'Error al crear gran premio' });
    }
  },

  updateGranPremio: async (req, res) => {
    try {
      const granPremio = await GranPremio.findByPk(req.params.id);
      if (!granPremio) {
        return res.status(404).json({ message: 'Gran Premio no encontrado' });
      }
      await granPremio.update(req.body);
      res.json(granPremio);
    } catch (error) {
      console.error('Error al actualizar gran premio:', error);
      res.status(500).json({ message: 'Error al actualizar gran premio' });
    }
  },

  deleteGranPremio: async (req, res) => {
    try {
      const granPremio = await GranPremio.findByPk(req.params.id);
      if (!granPremio) {
        return res.status(404).json({ message: 'Gran Premio no encontrado' });
      }
      await granPremio.destroy();
      res.json({ message: 'Gran Premio eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar gran premio:', error);
      res.status(500).json({ message: 'Error al eliminar gran premio' });
    }
  }
};

module.exports = F1Controller;