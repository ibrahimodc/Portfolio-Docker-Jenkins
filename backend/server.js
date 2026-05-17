/**
 * server.js — API REST Portfolio
 * Stack : Express.js + MongoDB
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/connectdb");
const projetRoutes = require("./routes/projetRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir le frontend statique
app.use(express.static(path.join(__dirname, "../frontend")));

// Logger
app.use((req, _res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}]  ${req.method}  ${req.originalUrl}`,
  );
  next();
});

// Santé de l'API et routes
app.use("/api", projetRoutes);

// SPA fallback
app.get("*", (_req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html")),
);

// ── Démarrage ─────────────────────────────────────────────────────────────────
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🌐  Serveur          : http://localhost:${PORT}`);
    console.log(
      `🔗  API Projets      : http://localhost:${PORT}/api/projets\n`,
    );
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `\n⚠️  Le port ${PORT} est déjà utilisé. Arrêtez le service existant ou définissez un autre PORT.`,
      );
    } else {
      console.error(error);
    }
    process.exit(1);
  });
});
