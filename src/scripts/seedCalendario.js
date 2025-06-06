const { GranPremio } = require('../models/index');
const sequelize = require('../config/database');

// Función para poblar la base de datos con el calendario F1 2025
async function seedCalendario() {
  // Verificar si ya existen grandes premios
  const gpCount = await GranPremio.count();
  if (gpCount > 0) {
    console.log('Ya existen Grandes Premios en la base de datos');
    return;
  }

  // Datos del calendario F1 2025
  const grandesPremios = [
    { 
      nombre: "Gran Premio de Australia", 
      circuito: "Albert Park", 
      fecha: "2025-03-16", 
      pais: "Australia"
    },
    { 
      nombre: "Gran Premio de China", 
      circuito: "Circuito Internacional de Shanghái", 
      fecha: "2025-03-23", 
      pais: "China"
    },
    { 
      nombre: "Gran Premio de Japón", 
      circuito: "Suzuka", 
      fecha: "2025-04-06", 
      pais: "Japón"
    },
    { 
      nombre: "Gran Premio de Bahréin", 
      circuito: "Circuito Internacional de Bahréin", 
      fecha: "2025-04-13", 
      pais: "Baréin"
    },
    { 
      nombre: "Gran Premio de Arabia Saudita", 
      circuito: "Jeddah Corniche Circuit", 
      fecha: "2025-04-20", 
      pais: "Arabia Saudita"
    },
    { 
      nombre: "Gran Premio de Miami", 
      circuito: "Miami International Autodrome", 
      fecha: "2025-05-04", 
      pais: "Estados Unidos"
    },
    { 
      nombre: "Gran Premio de Emilia-Romaña", 
      circuito: "Imola", 
      fecha: "2025-05-18", 
      pais: "Italia"
    },
    { 
      nombre: "Gran Premio de Mónaco", 
      circuito: "Circuito de Mónaco", 
      fecha: "2025-05-25", 
      pais: "Mónaco"
    },
    { 
      nombre: "Gran Premio de España", 
      circuito: "Circuit de Barcelona-Catalunya", 
      fecha: "2025-06-01", 
      pais: "España"
    },
    { 
      nombre: "Gran Premio de Canadá", 
      circuito: "Circuito Gilles Villeneuve", 
      fecha: "2025-06-08", 
      pais: "Canadá"
    },
    { 
      nombre: "Gran Premio de Austria", 
      circuito: "Red Bull Ring", 
      fecha: "2025-06-29", 
      pais: "Austria"
    },
    { 
      nombre: "Gran Premio de Gran Bretaña", 
      circuito: "Silverstone", 
      fecha: "2025-07-06", 
      pais: "Reino Unido"
    },
    { 
      nombre: "Gran Premio de Hungría", 
      circuito: "Hungaroring", 
      fecha: "2025-08-03", 
      pais: "Hungría"
    },
    { 
      nombre: "Gran Premio de Países Bajos", 
      circuito: "Circuito de Zandvoort", 
      fecha: "2025-08-31", 
      pais: "Países Bajos"
    },
    { 
      nombre: "Gran Premio de Italia", 
      circuito: "Monza", 
      fecha: "2025-09-07", 
      pais: "Italia"
    },
    { 
      nombre: "Gran Premio de Azerbaiyán", 
      circuito: "Circuito de Bakú", 
      fecha: "2025-09-21", 
      pais: "Azerbaiyán"
    },
    { 
      nombre: "Gran Premio de Singapur", 
      circuito: "Marina Bay Street Circuit", 
      fecha: "2025-10-05", 
      pais: "Singapur"
    },
    { 
      nombre: "Gran Premio de Estados Unidos", 
      circuito: "Circuito de las Américas", 
      fecha: "2025-10-19", 
      pais: "Estados Unidos"
    },
    { 
      nombre: "Gran Premio de México", 
      circuito: "Autódromo Hermanos Rodríguez", 
      fecha: "2025-10-26", 
      pais: "México"
    },
    { 
      nombre: "Gran Premio de Brasil", 
      circuito: "Interlagos", 
      fecha: "2025-11-09", 
      pais: "Brasil"
    },
    { 
      nombre: "Gran Premio de Las Vegas", 
      circuito: "Las Vegas Street Circuit", 
      fecha: "2025-11-22", 
      pais: "Estados Unidos"
    },
    { 
      nombre: "Gran Premio de Catar", 
      circuito: "Losail International Circuit", 
      fecha: "2025-11-30", 
      pais: "Catar"
    },
    { 
      nombre: "Gran Premio de Abu Dhabi", 
      circuito: "Yas Marina", 
      fecha: "2025-12-07", 
      pais: "Emiratos Árabes Unidos"
    }
  ];

  // Insertar grandes premios
  await GranPremio.bulkCreate(grandesPremios);
  console.log('Calendario F1 2025 insertado correctamente');
}

// Función principal para ejecutar el script
async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    console.log('Usando base de datos en:', sequelize.options.storage);
    
    // Sincronizar los modelos con la base de datos
    await sequelize.sync({ force: false });
    
    // Insertar el calendario
    await seedCalendario();
    
    console.log('Proceso de población del calendario completado.');
  } catch (error) {
    console.error('Error durante la población de datos:', error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
  }
}

// Ejecutar el script
main();