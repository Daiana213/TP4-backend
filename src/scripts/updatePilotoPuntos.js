const { Piloto, Equipo } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Tabla de puntos a asignar
const pilotosPuntos = [
  { Nombre: 'Oscar Piastri', Equipo: 'McLaren', Puntos: 198 },
  { Nombre: 'Lando Norris', Equipo: 'McLaren', Puntos: 176 },
  { Nombre: 'Max Verstappen', Equipo: 'Red Bull', Puntos: 155 },
  { Nombre: 'George Russell', Equipo: 'Mercedes', Puntos: 136 },
  { Nombre: 'Charles Leclerc', Equipo: 'Ferrari', Puntos: 104 },
  { Nombre: 'Lewis Hamilton', Equipo: 'Ferrari', Puntos: 79 },
  { Nombre: 'Kimi Antonelli', Equipo: 'Mercedes', Puntos: 63 },
  { Nombre: 'Alexander Albon', Equipo: 'Williams', Puntos: 42 },
  { Nombre: 'Esteban Ocon', Equipo: 'Haas', Puntos: 22 },
  { Nombre: 'Isack Hadjar', Equipo: 'Racing Bulls', Puntos: 21 },
  { Nombre: 'Nico Hülkenberg', Equipo: 'Sauber', Puntos: 20 },
  { Nombre: 'Lance Stroll', Equipo: 'Aston Martin', Puntos: 14 },
  { Nombre: 'Carlos Sainz', Equipo: 'Williams', Puntos: 13 },
  { Nombre: 'Pierre Gasly', Equipo: 'Alpine', Puntos: 11 },
  { Nombre: 'Yuki Tsunoda', Equipo: 'Racing Bulls', Puntos: 10 },
  { Nombre: 'Fernando Alonso', Equipo: 'Aston Martin', Puntos: 8 },
  { Nombre: 'Oliver Bearman', Equipo: 'Haas', Puntos: 6 },
  { Nombre: 'Liam Lawson', Equipo: 'Racing Bulls', Puntos: 4 },
  { Nombre: 'Franco Colapinto', Equipo: 'Alpine', Puntos: 0 },
  { Nombre: 'Jack Doohan', Equipo: 'Alpine', Puntos: 0 },
  { Nombre: 'Gabriel Bortoleto', Equipo: 'Sauber', Puntos: 0 },
];

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // Borrar todos los pilotos existentes
    await Piloto.destroy({ where: {} });
    console.log('🗑️ Pilotos eliminados');

    // Obtener todos los equipos
    const equipos = await Equipo.findAll();
    const equiposMap = {};
    equipos.forEach(e => { equiposMap[e.Nombre] = e.id; });

    // Crear los nuevos pilotos
    for (const pilotoData of pilotosPuntos) {
      // Buscar el equipo por nombre
      const equipo = await Equipo.findOne({ where: { Nombre: { [Op.like]: `%${pilotoData.Equipo}%` } } });
      if (!equipo) {
        console.warn(`Equipo no encontrado para ${pilotoData.Nombre}: ${pilotoData.Equipo}`);
        continue;
      }
      
      // Crear el piloto
      await Piloto.create({
        Nombre: pilotoData.Nombre,
        Puntos: pilotoData.Puntos,
        EquipoId: equipo.id,
        // Valores por defecto para otros campos
        Numero: 0,
        Pais: 'N/A',
        Campeonatos: 0,
        Podios: 0,
        TotalCarreras: 0,
        Wins: 0
      });
      console.log(`Creado: ${pilotoData.Nombre} (${pilotoData.Equipo}) - Puntos: ${pilotoData.Puntos}`);
    }
    console.log('✅ Pilotos creados correctamente');
  } catch (err) {
    console.error('Error creando pilotos:', err);
  } finally {
    await sequelize.close();
  }
}

main(); 