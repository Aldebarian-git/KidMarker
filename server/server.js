const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Activer le parsing JSON
app.use(express.json());

// Chemin vers le fichier JSON
const dataFilePath = path.join(__dirname, "data.json");

// Fonction pour lire les données depuis le fichier
function readData() {
  return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
}

// Fonction pour écrire les données dans le fichier
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

// Routes d'API

// Récupérer les données des utilisateurs
app.get("/api/users", (req, res) => {
  console.log("Requête reçue sur /api/users");
  const data = readData();
  res.json(data.users);
});

// Ajouter ou retirer des points pour un utilisateur
app.post("/api/users/:name/points", (req, res) => {
  const { name } = req.params;
  const { points } = req.body;
  const data = readData();

  if (data.users[name]) {
    data.users[name].points += points;
    if (data.users[name].points < 0) {
      data.users[name].points = 0; // Empêcher les points négatifs
    }
    writeData(data);
    res.json(data.users[name]);
  } else {
    res.status(404).send("Utilisateur introuvable");
  }
});

// Échanger une récompense
app.post("/api/users/:name/rewards", (req, res) => {
  const { name } = req.params;
  const { reward, cost } = req.body;
  const data = readData();

  if (data.users[name]) {
    if (data.users[name].points >= cost) {
      data.users[name].points -= cost;
      data.users[name].rewards.push(reward);
      writeData(data);
      res.json(data.users[name]);
    } else {
      res.status(400).send("Points insuffisants");
    }
  } else {
    res.status(404).send("Utilisateur introuvable");
  }
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "/")));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution : http://localhost:${PORT}`);
});
