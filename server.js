const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicialización de Firebase Admin con clave de servicio
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
console.log("Proyecto Firebase:", serviceAccount.project_id);
//const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Endpoint para recibir datos y guardarlos en Firestore
app.post('/lectura', async (req, res) => {
  const data = req.body;
  console.log("Datos recibidos:", data);

  try {
    await db.collection('lecturas').add(data);
    res.status(200).send('Datos guardados en Firestore');
  } catch (error) {
    console.error('Error guardando en Firestore:', error);
    res.status(500).send('Error guardando en Firestore');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});