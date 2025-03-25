const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const SensorData = require('./models/SensorData'); // Import du modèle

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Autorise toutes les connexions (tu peux restreindre ça plus tard)
    }
});
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API des capteurs ! 🚀");
});

app.get('/api/sensors', async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 }); // Tri par date descendante
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error });
    }
});

app.use(express.json());

// 📌 Connexion MongoDB
const mongoURI = 'mongodb://ranimferjeoui16:<Ranim*@2580>@cluster0-shard-00-00.vd7qi.mongodb.net:27017,cluster0-shard-00-01.vd7qi.mongodb.net:27017/?replicaSet=atlas-ahcmuu-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB Atlas'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// 📌 Route POST pour stocker les données et envoyer en temps réel via WebSocket
app.post('/api/sensors', async (req, res) => {
    try {
        const data = new SensorData(req.body);
        await data.save();

        // 🚀 Envoyer les nouvelles données à tous les clients connectés
        io.emit('newData', data);

        res.status(201).json({ message: '✅ Données enregistrées', data });
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error });
    }
});

// 📌 WebSocket : Écoute des connexions des clients
io.on('connection', (socket) => {
    console.log('🟢 Un client est connecté !');

    socket.on('disconnect', () => {
        console.log('🔴 Un client s’est déconnecté');
    });
});

// 🌍 Démarrer le serveur
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`🚀 Serveur API + WebSocket en ligne sur le port ${PORT}`));
