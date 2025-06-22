const { Piloto, Equipo } = require('../models');
const sequelize = require('../config/database');

const pilotosPuntos = [
  { Nombre: 'Oscar Piastri', Equipo: 'McLaren', Puntos: 0, Campeonatos: 0, Wins: 1, Podios: 10, fechaNacimiento: '2001-05-06', Pais: 'Australia', Numero: 81 },
  { Nombre: 'Lando Norris', Equipo: 'McLaren', Puntos: 0, Campeonatos: 0, Wins: 6, Podios: 34, fechaNacimiento: '1999-11-13', Pais: 'Reino Unido', Numero: 4 },
  { Nombre: 'Max Verstappen', Equipo: 'Red Bull', Puntos: 0, Campeonatos: 4, Wins: 65, Podios: 117, fechaNacimiento: '1997-09-30', Pais: 'Países Bajos', Numero: 1 },
  { Nombre: 'George Russell', Equipo: 'Mercedes', Puntos: 0, Campeonatos: 0, Wins: 4, Podios: 20, fechaNacimiento: '1998-02-15', Pais: 'Reino Unido', Numero: 63 },
  { Nombre: 'Charles Leclerc', Equipo: 'Ferrari', Puntos: 0, Campeonatos: 0, Wins: 8, Podios: 46, fechaNacimiento: '1997-10-16', Pais: 'Mónaco', Numero: 16 },
  { Nombre: 'Lewis Hamilton', Equipo: 'Ferrari', Puntos: 0, Campeonatos: 7, Wins: 105, Podios: 202, fechaNacimiento: '1985-01-07', Pais: 'Reino Unido', Numero: 44 },
  { Nombre: 'Kimi Antonelli', Equipo: 'Mercedes', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 1, fechaNacimiento: '2006-08-25', Pais: 'Italia', Numero: 12 },
  { Nombre: 'Alexander Albon', Equipo: 'Williams', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 2, fechaNacimiento: '1996-03-23', Pais: 'Tailandia', Numero: 23 },
  { Nombre: 'Esteban Ocon', Equipo: 'Haas', Puntos: 0, Campeonatos: 0, Wins: 1, Podios: 4, fechaNacimiento: '1996-09-17', Pais: 'Francia', Numero: 31 },
  { Nombre: 'Isack Hadjar', Equipo: 'Racing Bulls', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2004-09-28', Pais: 'Francia', Numero: 6 },
  { Nombre: 'Nico Hülkenberg', Equipo: 'Sauber', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '1987-08-19', Pais: 'Alemania', Numero: 27 },
  { Nombre: 'Lance Stroll', Equipo: 'Aston Martin', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 3, fechaNacimiento: '1998-10-29', Pais: 'Canadá', Numero: 18 },
  { Nombre: 'Carlos Sainz', Equipo: 'Williams', Puntos: 0, Campeonatos: 0, Wins: 4, Podios: 27, fechaNacimiento: '1994-09-01', Pais: 'España', Numero: 55 },
  { Nombre: 'Pierre Gasly', Equipo: 'Alpine', Puntos: 0, Campeonatos: 0, Wins: 1, Podios: 5, fechaNacimiento: '1996-02-07', Pais: 'Francia', Numero: 10 },
  { Nombre: 'Yuki Tsunoda', Equipo: 'Racing Bulls', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2000-05-11', Pais: 'Japón', Numero: 22 },
  { Nombre: 'Fernando Alonso', Equipo: 'Aston Martin', Puntos: 0, Campeonatos: 2, Wins: 32, Podios: 106, fechaNacimiento: '1981-07-29', Pais: 'España', Numero: 14 },
  { Nombre: 'Oliver Bearman', Equipo: 'Haas', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2005-08-25', Pais: 'Reino Unido', Numero: 87 },
  { Nombre: 'Liam Lawson', Equipo: 'Racing Bulls', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2002-02-11', Pais: 'Reino Unido', Numero: 30 },
  { Nombre: 'Franco Colapinto', Equipo: 'Alpine', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2003-05-27', Pais: 'Argentina', Numero: 43 },
  { Nombre: 'Gabriel Bortoleto', Equipo: 'Sauber', Puntos: 0, Campeonatos: 0, Wins: 0, Podios: 0, fechaNacimiento: '2004-10-14', Pais: 'Argentina', Numero: 5 },
];

// Equipos con campos adicionales (ajustados)
const equiposDatos = [
  { Nombre: 'McLaren', Puntos: 0, Podios: 44, Carrera: 860, Wins: 183, Pais: 'Reino Unido', Team_chief: 'Andrea Stella', Technical_chief: 'James Key' },
  { Nombre: 'Red Bull', Puntos: 0, Podios: 150, Carrera: 800, Wins: 80, Pais: 'Austria', Team_chief: 'Christian Horner', Technical_chief: 'Paul Monaghan' },
  { Nombre: 'Mercedes', Puntos: 0, Podios: 160, Carrera: 900, Wins: 120, Pais: 'Reino Unido', Team_chief: 'Toto Wolff', Technical_chief: 'Mike Elliott' },
  { Nombre: 'Ferrari', Puntos: 0, Podios: 220, Carrera: 1000, Wins: 240, Pais: 'Italia', Team_chief: 'Frédéric Vasseur', Technical_chief: 'Enrico Cardile' },
  { Nombre: 'Williams', Puntos: 0, Podios: 120, Carrera: 950, Wins: 110, Pais: 'Reino Unido', Team_chief: 'Jost Capito', Technical_chief: 'François-Xavier Demaison' },
  { Nombre: 'Haas', Puntos: 0, Podios: 5, Carrera: 100, Wins: 1, Pais: 'Estados Unidos', Team_chief: 'Guenther Steiner', Technical_chief: 'Simone Resta' },
  { Nombre: 'Racing Bulls', Puntos: 0, Podios: 0, Carrera: 10, Wins: 0, Pais: 'Francia', Team_chief: 'Jean Dupont', Technical_chief: 'Claire Martin' },
  { Nombre: 'Sauber', Puntos: 0, Podios: 8, Carrera: 500, Wins: 0, Pais: 'Suiza', Team_chief: 'Frederik Vasseur', Technical_chief: 'Jörg Zander' },
  { Nombre: 'Aston Martin', Puntos: 0, Podios: 20, Carrera: 350, Wins: 2, Pais: 'Reino Unido', Team_chief: 'Mike Krack', Technical_chief: 'Andrew Green' },
  { Nombre: 'Alpine', Puntos: 0, Podios: 15, Carrera: 250, Wins: 3, Pais: 'Francia', Team_chief: 'Davide Brivio', Technical_chief: 'Pat Fry' }
];

async function resetPilotosYEquipos() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    // Borrar todos los registros
    await Piloto.destroy({ where: {} });
    await Equipo.destroy({ where: {} });
    console.log('Tablas Piloto y Equipo vaciadas.');

    // Insertar equipos con los datos nuevos
    for (const equipoData of equiposDatos) {
      await Equipo.create(equipoData);
      console.log(`Equipo creado: ${equipoData.Nombre}`);
    }

    // Insertar pilotos y asociarlos con el equipo correcto
    for (const pilotoData of pilotosPuntos) {
      const equipo = await Equipo.findOne({ where: { Nombre: pilotoData.Equipo } });
      if (!equipo) {
        console.warn(`⚠️ Equipo no encontrado para piloto ${pilotoData.Nombre}`);
        continue;
      }

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
      console.log(`Piloto creado: ${pilotoData.Nombre} (Equipo: ${pilotoData.Equipo})`);
    }

    console.log('✅ Datos reiniciados correctamente.');
  } catch (error) {
    console.error('Error en el script:', error);
  } finally {
    await sequelize.close();
  }
}

resetPilotosYEquipos();
