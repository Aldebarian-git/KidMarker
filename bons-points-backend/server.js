const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint pour la page d'accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur de Bons Points et Récompenses !");
});

// Endpoint pour récupérer les données
app.get("/data", (req, res) => {
  try {
    const data = fs.readFileSync("data.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).send("Erreur lors de la lecture des données");
  }
});

// Endpoint pour sauvegarder les données
app.post("/data", (req, res) => {
  try {
    fs.writeFileSync("data.json", JSON.stringify(req.body));
    res.send("Données sauvegardées avec succès !");
  } catch (error) {
    res.status(500).send("Erreur lors de la sauvegarde des données");
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
