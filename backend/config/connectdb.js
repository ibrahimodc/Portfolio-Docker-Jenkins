const mongoose = require("mongoose");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || "portfolio_db";
  const maxRetries = parseInt(process.env.MONGO_CONNECT_RETRIES, 10) || 10;
  const retryDelayMs =
    parseInt(process.env.MONGO_CONNECT_RETRY_DELAY_MS, 10) || 5000;

  if (!mongoUri) {
    console.error("❌ MONGO_URI n’est pas défini dans .env");
    process.exit(1);
  }

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt += 1;
      const connection = await mongoose.connect(mongoUri, {
        dbName,
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`✅ MongoDB connecté (${connection.connection.name})`);
      return;
    } catch (error) {
      console.warn(
        `⚠️ Tentative ${attempt}/${maxRetries} : échec de la connexion MongoDB (${error.message}).`,
      );
      if (attempt >= maxRetries) {
        console.error(
          "❌ Échec définitif de la connexion MongoDB après plusieurs tentatives.",
        );
        process.exit(1);
      }
      await sleep(retryDelayMs);
    }
  }
};

module.exports = connectDB;
