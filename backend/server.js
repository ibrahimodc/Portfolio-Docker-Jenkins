/**
 * server.js — API REST Portfolio
 * Base de données : projects.json (généré automatiquement)
 * Stack : Express.js · pas de MongoDB · zéro dépendance lourde
 */
require("dotenv").config();require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/connectdb");
const projetRoutes = require("./routes/projetRoutes");

const app = express();
const PORT = process.env.PORT || 3002;

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

// ── Helpers JSON ──────────────────────────────────────────────────────────────
function lireDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function ecrireDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── Routes API ────────────────────────────────────────────────────────────────

// GET /api/projets  — liste tous les projets
app.get("/api/projets", (_req, res) => {
  const projets = lireDB();
  res.json({ success: true, count: projets.length, data: projets });
});

// GET /api/projets/:id  — un seul projet
app.get("/api/projets/:id", (req, res) => {
  const projets = lireDB();
  const projet = projets.find((p) => p._id === req.params.id);
  if (!projet)
    return res
      .status(404)
      .json({ success: false, message: "Projet non trouvé." });
  res.json({ success: true, data: projet });
});

// POST /api/projets  — créer un projet
app.post("/api/projets", (req, res) => {
  const { libelle, description, technologies, lien, imageUrl } = req.body;
  if (!libelle)
    return res
      .status(400)
      .json({ success: false, message: "Le libellé est obligatoire." });

  const projets = lireDB();
  const newProjet = {
    _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    libelle,
    description: description || "",
    technologies: Array.isArray(technologies)
      ? technologies
      : technologies
        ? technologies.split(",").map((t) => t.trim())
        : [],
    lien: lien || "",
    imageUrl: imageUrl || "",
    createdAt: new Date().toISOString(),
  };

  projets.push(newProjet);
  ecrireDB(projets);
  res.status(201).json({ success: true, data: newProjet });
});

// PUT /api/projets/:id  — modifier un projet
app.put("/api/projets/:id", (req, res) => {
  const projets = lireDB();
  const index = projets.findIndex((p) => p._id === req.params.id);
  if (index === -1)
    return res
      .status(404)
      .json({ success: false, message: "Projet non trouvé." });

  const { libelle, description, technologies, lien, imageUrl } = req.body;
  projets[index] = {
    ...projets[index],
    ...(libelle !== undefined && { libelle }),
    ...(description !== undefined && { description }),
    ...(technologies !== undefined && {
      technologies: Array.isArray(technologies)
        ? technologies
        : technologies.split(",").map((t) => t.trim()),
    }),
    ...(lien !== undefined && { lien }),
    ...(imageUrl !== undefined && { imageUrl }),
    updatedAt: new Date().toISOString(),
  };

  ecrireDB(projets);
  res.json({ success: true, data: projets[index] });
});

// DELETE /api/projets/:id  — supprimer un projet
app.delete("/api/projets/:id", (req, res) => {
  const projets = lireDB();
  const nouveaux = projets.filter((p) => p._id !== req.params.id);
  if (nouveaux.length === projets.length)
    return res
      .status(404)
      .json({ success: false, message: "Projet non trouvé." });

  ecrireDB(nouveaux);
  res.json({ success: true, message: "Projet supprimé." });
});

// Santé de l'API et routes
app.use('/api', projetRoutes);

// SPA fallback
app.get("*", (_req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html")),
);

// ── Démarrage ─────────────────────────────────────────────────────────────────
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🌐  Serveur          : http://localhost:${PORT}`);
    console.log(`🔗  API Projets      : http://localhost:${PORT}/api/projets\n`);
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
