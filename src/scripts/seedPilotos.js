const { Piloto, Equipo } = require('../models');
const sequelize = require('../config/database');

// Función para poblar la base de datos con los equipos actuales de F1
async function seedEquipos() {
  const equiposCount = await Equipo.count();
  if (equiposCount > 0) {
    console.log('Ya existen equipos en la base de datos');
    return;
  }

  const equipos = [
    { Nombre: 'Red Bull Racing', Pais: 'Austria', Team_chief: 'Christian Horner', Technical_chief: 'Pierre Waché', Puntos: 623, Podios: 242, Carreras: 379, Wins: 115 },
    { Nombre: 'Ferrari', Pais: 'Italia', Team_chief: 'Frédéric Vasseur', Technical_chief: 'Enrico Cardile', Puntos: 524, Podios: 798, Carreras: 1076, Wins: 243 },
    { Nombre: 'Mercedes', Pais: 'Alemania', Team_chief: 'Toto Wolff', Technical_chief: 'James Allison', Puntos: 338, Podios: 286, Carreras: 295, Wins: 125 },
    { Nombre: 'McLaren', Pais: 'Reino Unido', Team_chief: 'Andrea Stella', Technical_chief: 'Peter Prodromou', Puntos: 572, Podios: 510, Carreras: 944, Wins: 183 },
    { Nombre: 'Aston Martin', Pais: 'Reino Unido', Team_chief: 'Mike Krack', Technical_chief: 'Dan Fallows', Puntos: 81, Podios: 9, Carreras: 84, Wins: 0 },
    { Nombre: 'Alpine', Pais: 'Francia', Team_chief: 'Bruno Famin', Technical_chief: 'David Sanchez', Puntos: 15, Podios: 3, Carreras: 84, Wins: 1 },
    { Nombre: 'Williams', Pais: 'Reino Unido', Team_chief: 'James Vowles', Technical_chief: 'Pat Fry', Puntos: 16, Podios: 313, Carreras: 824, Wins: 114 },
    { Nombre: 'RB', Pais: 'Italia', Team_chief: 'Laurent Mekies', Technical_chief: 'Jody Egginton', Puntos: 31, Podios: 1, Carreras: 84, Wins: 0 },
    { Nombre: 'Haas F1 Team', Pais: 'Estados Unidos', Team_chief: 'Ayao Komatsu', Technical_chief: 'Andrea De Zordo', Puntos: 27, Podios: 0, Carreras: 186, Wins: 0 },
    { Nombre: 'Sauber', Pais: 'Suiza', Team_chief: 'Alessandro Alunni Bravi', Technical_chief: 'James Key', Puntos: 0, Podios: 27, Carreras: 568, Wins: 1 }
  ];

  await Equipo.bulkCreate(equipos);
  console.log('✅ Equipos insertados correctamente');
}

// Función para poblar pilotos
async function seedPilotos() {
  await Piloto.destroy({ where: {} });
  console.log('🗑️ Pilotos eliminados');

  const equipos = await Equipo.findAll();
  const equiposMap = {};
  equipos.forEach(e => { equiposMap[e.Nombre] = e.id; });

  const pilotos = [
    { Nombre: 'Max Verstappen', Numero: 1, Pais: 'Países Bajos', Campeonatos: 3, Podios: 107, TotalCarreras: 193, Wins: 59, Puntos: 362, EquipoId: equiposMap['Red Bull Racing'] },
    { Nombre: 'Sergio Pérez', Numero: 11, Pais: 'México', Campeonatos: 0, Podios: 37, TotalCarreras: 261, Wins: 6, Puntos: 151, EquipoId: equiposMap['Red Bull Racing'] },
    { Nombre: 'Charles Leclerc', Numero: 16, Pais: 'Mónaco', Campeonatos: 0, Podios: 35, TotalCarreras: 139, Wins: 5, Puntos: 303, EquipoId: equiposMap['Ferrari'] },
    { Nombre: 'Carlos Sainz', Numero: 55, Pais: 'España', Campeonatos: 0, Podios: 22, TotalCarreras: 193, Wins: 3, Puntos: 221, EquipoId: equiposMap['Ferrari'] },
    { Nombre: 'Lewis Hamilton', Numero: 44, Pais: 'Reino Unido', Campeonatos: 7, Podios: 197, TotalCarreras: 340, Wins: 103, Puntos: 190, EquipoId: equiposMap['Mercedes'] },
    { Nombre: 'George Russell', Numero: 63, Pais: 'Reino Unido', Campeonatos: 0, Podios: 11, TotalCarreras: 108, Wins: 2, Puntos: 148, EquipoId: equiposMap['Mercedes'] },
    { Nombre: 'Lando Norris', Numero: 4, Pais: 'Reino Unido', Campeonatos: 0, Podios: 23, TotalCarreras: 108, Wins: 2, Puntos: 314, EquipoId: equiposMap['McLaren'] },
    { Nombre: 'Oscar Piastri', Numero: 81, Pais: 'Australia', Campeonatos: 0, Podios: 7, TotalCarreras: 40, Wins: 2, Puntos: 258, EquipoId: equiposMap['McLaren'] },
    { Nombre: 'Fernando Alonso', Numero: 14, Pais: 'España', Campeonatos: 2, Podios: 106, TotalCarreras: 387, Wins: 32, Puntos: 62, EquipoId: equiposMap['Aston Martin'] },
    { Nombre: 'Lance Stroll', Numero: 18, Pais: 'Canadá', Campeonatos: 0, Podios: 3, TotalCarreras: 167, Wins: 0, Puntos: 19, EquipoId: equiposMap['Aston Martin'] },
    { Nombre: 'Esteban Ocon', Numero: 31, Pais: 'Francia', Campeonatos: 0, Podios: 3, TotalCarreras: 147, Wins: 1, Puntos: 7, EquipoId: equiposMap['Alpine'] },
    { Nombre: 'Pierre Gasly', Numero: 10, Pais: 'Francia', Campeonatos: 0, Podios: 4, TotalCarreras: 147, Wins: 1, Puntos: 8, EquipoId: equiposMap['Alpine'] },
    { Nombre: 'Alexander Albon', Numero: 23, Pais: 'Tailandia', Campeonatos: 0, Podios: 2, TotalCarreras: 100, Wins: 0, Puntos: 15, EquipoId: equiposMap['Williams'] },
    { Nombre: 'Logan Sargeant', Numero: 2, Pais: 'Estados Unidos', Campeonatos: 0, Podios: 0, TotalCarreras: 40, Wins: 0, Puntos: 1, EquipoId: equiposMap['Williams'] },
    { Nombre: 'Yuki Tsunoda', Numero: 22, Pais: 'Japón', Campeonatos: 0, Podios: 0, TotalCarreras: 80, Wins: 0, Puntos: 22, EquipoId: equiposMap['RB'] },
    { Nombre: 'Daniel Ricciardo', Numero: 3, Pais: 'Australia', Campeonatos: 0, Podios: 32, TotalCarreras: 252, Wins: 8, Puntos: 9, EquipoId: equiposMap['RB'] },
    { Nombre: 'Nico Hülkenberg', Numero: 27, Pais: 'Alemania', Campeonatos: 0, Podios: 0, TotalCarreras: 214, Wins: 0, Puntos: 22, EquipoId: equiposMap['Haas F1 Team'] },
    { Nombre: 'Kevin Magnussen', Numero: 20, Pais: 'Dinamarca', Campeonatos: 0, Podios: 1, TotalCarreras: 172, Wins: 0, Puntos: 5, EquipoId: equiposMap['Haas F1 Team'] },
    { Nombre: 'Valtteri Bottas', Numero: 77, Pais: 'Finlandia', Campeonatos: 0, Podios: 67, TotalCarreras: 226, Wins: 10, Puntos: 0, EquipoId: equiposMap['Sauber'] },
    { Nombre: 'Zhou Guanyu', Numero: 24, Pais: 'China', Campeonatos: 0, Podios: 0, TotalCarreras: 60, Wins: 0, Puntos: 0, EquipoId: equiposMap['Sauber'] }
  ];

  await Piloto.bulkCreate(pilotos);
  console.log('✅ Pilotos insertados correctamente');
}

// Función principal
async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    console.log('Usando base de datos en:', sequelize.options.storage);

    await Equipo.sync({force: true});            // Sincroniza `Equipo` (sin perder datos)
    await Piloto.sync({ force: true });  // Borra y recrea `Piloto`


    await seedEquipos();
    await seedPilotos();

    console.log('🎉 Proceso de población de datos completado.');
  } catch (error) {
    console.error('❌ Error durante la población de datos:', error);
  } finally {
    await sequelize.close();
  }
}

main();
