const { Piloto, Equipo, GranPremio } = require('../models/index');

const F1Controller = {
  // --- PILOTOS ---

  // Obtener todos los pilotos con su equipo
  getAllPilotos: async (req, res) => {
    try {
      const pilotos = await Piloto.findAll({
        include: [{ model: Equipo, attributes: ['Nombre'] }],
        order: [['Nombre', 'ASC']]
      });
      res.json(pilotos);
    } catch (error) {
      console.error('Error al obtener pilotos:', error);
      res.status(500).json({ message: 'Error al obtener pilotos' });
    }
  },

  // Obtener piloto por ID con su equipo
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

  // Crear un nuevo piloto
  createPiloto: async (req, res) => {
    try {
      const piloto = await Piloto.create(req.body);
      // Traer piloto con equipo para respuesta
      const pilotoConEquipo = await Piloto.findByPk(piloto.id, {
        include: [{ model: Equipo, attributes: ['id', 'Nombre'] }]
      });
      res.status(201).json(pilotoConEquipo);
    } catch (error) {
      console.error('Error al crear piloto:', error);
      res.status(500).json({ message: 'Error al crear piloto' });
    }
  },

  // Actualizar piloto
  updatePiloto: async (req, res) => {
    try {
      const piloto = await Piloto.findByPk(req.params.id);
      if (!piloto) {
        return res.status(404).json({ message: 'Piloto no encontrado' });
      }
      await piloto.update(req.body);
      const pilotoActualizado = await Piloto.findByPk(req.params.id, {
        include: [{ model: Equipo, attributes: ['id', 'Nombre'] }]
      });
      res.json(pilotoActualizado);
    } catch (error) {
      console.error('Error al actualizar piloto:', error);
      res.status(500).json({ message: 'Error al actualizar piloto' });
    }
  },

  // Eliminar piloto
  deletePiloto: async (req, res) => {
    try {
      const eliminado = await Piloto.destroy({ where: { id: req.params.id } });
      if (!eliminado) {
        return res.status(404).json({ message: 'Piloto no encontrado' });
      }
      res.json({ message: 'Piloto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar piloto:', error);
      res.status(500).json({ message: 'Error al eliminar piloto' });
    }
  },

  // --- EQUIPOS ---

  // Obtener todos los equipos con sus pilotos
  getAllEquipos: async (req, res) => {
    try {
      const equipos = await Equipo.findAll({
        include: [{ model: Piloto, attributes: ['Nombre', 'Numero'] }],
        order: [['Nombre', 'ASC']]
      });
      res.json(equipos);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ message: 'Error al obtener equipos' });
    }
  },

  // Obtener equipo por ID con sus pilotos
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

  // Crear un nuevo equipo
  createEquipo: async (req, res) => {
    try {
      const equipo = await Equipo.create(req.body);
      const equipoConPilotos = await Equipo.findByPk(equipo.id, {
        include: [{ model: Piloto, attributes: ['id', 'Nombre', 'Numero'] }]
      });
      res.status(201).json(equipoConPilotos);
    } catch (error) {
      console.error('Error al crear equipo:', error);
      res.status(500).json({ message: 'Error al crear equipo' });
    }
  },

  // Actualizar equipo
  updateEquipo: async (req, res) => {
    try {
      const equipo = await Equipo.findByPk(req.params.id);
      if (!equipo) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
      await equipo.update(req.body);
      const equipoActualizado = await Equipo.findByPk(req.params.id, {
        include: [{ model: Piloto, attributes: ['id', 'Nombre', 'Numero'] }]
      });
      res.json(equipoActualizado);
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
      res.status(500).json({ message: 'Error al actualizar equipo' });
    }
  },

  // Eliminar equipo
  deleteEquipo: async (req, res) => {
    try {
      const eliminado = await Equipo.destroy({ where: { id: req.params.id } });
      if (!eliminado) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
      res.json({ message: 'Equipo eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      res.status(500).json({ message: 'Error al eliminar equipo' });
    }
  },

  // --- GRANDES PREMIOS ---

  // Obtener todos los grandes premios ordenados por fecha ascendente
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

  // Obtener gran premio por ID
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

  // Crear gran premio
  createGranPremio: async (req, res) => {
    try {
      const { nombre, fecha, circuito, pais, numero_vueltas, horarios } = req.body;

      // Validaciones
      if (!nombre || !fecha || !circuito || !pais) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      // Validar fecha
      const fechaCarrera = new Date(fecha);
      if (isNaN(fechaCarrera.getTime())) {
        return res.status(400).json({ message: 'Fecha inválida' });
      }

      // Validar horario
      if (horarios < 0 || horarios > 23) {
        return res.status(400).json({ message: 'El horario debe estar entre 0 y 23' });
      }

      // Validar número de vueltas
      if (numero_vueltas < 1) {
        return res.status(400).json({ message: 'El número de vueltas debe ser mayor a 0' });
      }

      const granPremio = await GranPremio.create({
        nombre,
        fecha: fechaCarrera,
        circuito,
        pais,
        numero_vueltas: Number(numero_vueltas) || 0,
        horarios: Number(horarios) || 0
      });
      
      res.status(201).json(granPremio);
    } catch (error) {
      console.error('Error al crear gran premio:', error);
      res.status(500).json({ message: 'Error al crear gran premio' });
    }
  },

  // Actualizar gran premio
  updateGranPremio: async (req, res) => {
    try {
      const granPremio = await GranPremio.findByPk(req.params.id);
      if (!granPremio) {
        return res.status(404).json({ message: 'Gran Premio no encontrado' });
      }

      const { nombre, fecha, circuito, pais, numero_vueltas, horarios } = req.body;

      // Validaciones
      if (!nombre || !fecha || !circuito || !pais) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      // Validar fecha
      const fechaCarrera = new Date(fecha);
      if (isNaN(fechaCarrera.getTime())) {
        return res.status(400).json({ message: 'Fecha inválida' });
      }

      // Validar horario
      if (horarios < 0 || horarios > 23) {
        return res.status(400).json({ message: 'El horario debe estar entre 0 y 23' });
      }

      // Validar número de vueltas
      if (numero_vueltas < 1) {
        return res.status(400).json({ message: 'El número de vueltas debe ser mayor a 0' });
      }

      await granPremio.update({
        nombre,
        fecha: fechaCarrera,
        circuito,
        pais,
        numero_vueltas: Number(numero_vueltas) || 0,
        horarios: Number(horarios) || 0
      });
      
      res.json(granPremio);
    } catch (error) {
      console.error('Error al actualizar gran premio:', error);
      res.status(500).json({ message: 'Error al actualizar gran premio' });
    }
  },

  // Eliminar gran premio
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