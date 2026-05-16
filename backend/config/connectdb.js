const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'portfolio_db';

  if (!mongoUri) {
    console.error('❌ MONGO_URI n’est pas défini dans .env');
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      dbName,
    });

    console.log(`✅ MongoDB connecté (${connection.connection.name})`);
  } catch (error) {
    console.error('❌ Échec de la connexion MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
