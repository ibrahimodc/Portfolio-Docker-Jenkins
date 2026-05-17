const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'portfolio_db';

  if (!mongoUri) {
    console.warn('MONGO_URI absent - mode fichier JSON active (pas de MongoDB)');
    return;
  }

  try {
    const connection = await mongoose.connect(mongoUri, { dbName });
    console.log('MongoDB connecte (' + connection.connection.name + ')');
  } catch (error) {
    console.error('Echec connexion MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
