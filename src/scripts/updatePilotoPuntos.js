const { Piloto, Equipo } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Tabla de puntos a asignar
const pilotosPuntos = [
  { Nombre: 'Oscar Piastri', Equipo: 'McLaren', Puntos: 198, Campeonatos: 0, Wins: 1, Podios: 10, fechaNacimiento: '2001-05-06', Pais: 'Australia', Numero: 81 },
  { Nombre: 'Lando Norris', Equipo: 'McLaren', Puntos: 176, Campeonatos: 0, Wins: 6, Podios: 34, fechaNacimiento: '1999-11-13', Pais: 'Reino Unido', Numero: 4 },
  { Nombre: 'Max Verstappen', Equipo: 'Red Bull', Puntos: 155, Campeonatos: 4, Wins: 65, Podios: 117, fechaNacimiento: '1997-09-30', Pais: 'Países Bajos', Numero: 1 },
  { Nombre: 'George Russell', Equipo: 'Mercedes', Puntos: 136, Campeonatos: 0, Wins: 4, Podios: 20, fechaNacimiento: '1998-02-15', Pais: 'Reino Unido', Numero: 63 },
  { Nombre: 'Charles Leclerc', Equipo: 'Ferrari', Puntos: 104, Campeonatos: 0, Wins: 8, Podios: 46, fechaNacimiento: '1997-10-16', Pais: 'Mónaco', Numero: 16 },
  { Nombre: 'Lewis Hamilton', Equipo: 'Ferrari', Puntos: 79, Campeonatos: 7, Wins: 105, Podios: 202, fechaNacimiento: '1985-01-07', Pais: 'Reino Unido', Numero: 44 },
  { Nombre: 'Kimi Antonelli', Equipo: 'Mercedes', Puntos: 63, Campeonatos: 0, Wins: 0, Podios: 1, fechaNacimiento: '2006-08-25', Pais: 'Italia', Numero: 12 },
  { Nombre: 'Alexander Albon', Equipo: 'Williams', Puntos: 42, Campeonatos: 0, Wins: 0, Podios: 2, fechaNacimiento: '1996-03-23', Pais: 'Tailandia', Numero: 23 },
  { Nombre: 'Esteban Ocon', Equipo: 'Haas', Puntos: 22, Campeonatos: 0, Wins: 1, Podios: 4, fechaNacimiento: '1996-09-17', Pais: 'Francia', Numero: 31 },
  { Nombre: 'Isack Hadjar', Equipo: 'Racing Bulls', Puntos: 21, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2004-09-28', Pais: 'Fracia', Numero: 6 },
  { Nombre: 'Nico Hülkenberg', Equipo: 'Sauber', Puntos: 20, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '1987-08-19', Pais: 'Alemania', Numero: 27 },
  { Nombre: 'Lance Stroll', Equipo: 'Aston Martin', Puntos: 14, Campeonatos: 0, Wins: 0, Podios: 3, fechaNacimiento: '1998-10-29', Pais: 'Canadá', Numero: 18 },
  { Nombre: 'Carlos Sainz', Equipo: 'Williams', Puntos: 13, Campeonatos: 0, Wins: 4, Podios: 27, fechaNacimiento: '1994-09-01', Pais: 'España', Numero: 55 },
  { Nombre: 'Pierre Gasly', Equipo: 'Alpine', Puntos: 11, Campeonatos: 0, Wins: 1, Podios: 5, fechaNacimiento: '1996-02-07', Pais: 'Francia', Numero: 10 },
  { Nombre: 'Yuki Tsunoda', Equipo: 'Racing Bulls', Puntos: 10, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2000-05-11', Pais: 'Japón', Numero: 22 },
  { Nombre: 'Fernando Alonso', Equipo: 'Aston Martin', Puntos: 8, Campeonatos: 2, Wins: 32, Podios: 106, fechaNacimiento: '1981-07-29', Pais: 'España', Numero: 14 },
  { Nombre: 'Oliver Bearman', Equipo: 'Haas', Puntos: 6, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2005-08-25', Pais: 'Reino Unido', Numero: 87 },
  { Nombre: 'Liam Lawson', Equipo: 'Racing Bulls', Puntos: 4, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2002-02-11', Pais: 'Reino Unido', Numero: 30 },
  { Nombre: 'Franco Colapinto', Equipo: 'Alpine', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2003-05-27', Pais: 'Argentina', Numero: 43 },
  { Nombre: 'Gabriel Bortoleto', Equipo: 'Sauber', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2004-10-14', Pais: 'Argentina', Numero: 5 },
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

    // Crear los nuevos pilotos con los puntos actualizados
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
        EquipoId: equipo.id,
        Puntos: pilotoData.Puntos,
        Campeonatos: pilotoData.Campeonatos,
        Wins: pilotoData.Wins,
        Podios: pilotoData.Podios,
        fechaNacimiento: pilotoData.fechaNacimiento,
        Pais: pilotoData.Pais,
        Numero: pilotoData.Numero
      });
      console.log(`Creado: ${pilotoData.Nombre} (${pilotoData.Equipo}) - Puntos: ${pilotoData.Puntos}`);
    }
    console.log('✅ Pilotos creados con puntos actualizados.');

    // Actualizar puntos de equipos
    console.log('\n🔄 Actualizando puntos de equipos...');
    const equiposConPilotos = await Equipo.findAll({
      include: [{
        model: Piloto,
        attributes: ['Puntos']
      }]
    });

    for (const equipo of equiposConPilotos) {
      const totalPuntos = equipo.Pilotos.reduce((sum, piloto) => sum + piloto.Puntos, 0);
      const oldPuntos = equipo.Puntos;
      equipo.Puntos = totalPuntos;
      await equipo.save();
      console.log(`Equipo ${equipo.Nombre}: ${oldPuntos} -> ${totalPuntos} puntos`);
    }
    console.log('✅ Puntos de equipos actualizados.');

  } catch (err) {
    console.error('Error creando pilotos:', err);
  } finally {
    await sequelize.close();
  }
}

main(); 