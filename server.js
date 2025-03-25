const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Accepter les données JSON
app.use(cors()); // Autoriser les requêtes depuis le front-end

let capteursData = {}; // Stockage temporaire des données

// Endpoint pour recevoir les données de l'ESP32
app.post("/data", (req, res) => {
    capteursData = req.body; // Stocker les dernières données reçues
    console.log("Données reçues :", capteursData);
    res.json({ message: "Données reçues avec succès !" });
});

// Endpoint pour récupérer les dernières données
app.get("/data", (req, res) => {
    res.json(capteursData);
});

app.listen(port, () => {
    console.log(`Serveur API en ligne sur le port ${port}`);
});
