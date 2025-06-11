const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

async function createAdminUser() {
  try {
    // Autenticar con la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    // Verificar si ya existe un usuario administrador
    const existingAdmin = await Usuario.findOne({
      where: { email: 'admin@f1journal.com' }
    });

    if (existingAdmin) {
      console.log('El usuario administrador ya existe.');
      // Actualizar a administrador si no lo es
      if (!existingAdmin.isAdmin) {
        await existingAdmin.update({ isAdmin: true });
        console.log('Usuario actualizado a administrador.');
      }
    } else {
      // Crear un nuevo usuario administrador
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@f1journal.com',
        contrasena: hashedPassword,
        isAdmin: true
      });
      console.log('Usuario administrador creado exitosamente.');
    }

    console.log('Proceso completado.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
    console.log('Conexión a la base de datos cerrada.');
  }
}

// Ejecutar la función
createAdminUser();