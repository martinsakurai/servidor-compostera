const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicialización de Firebase Admin con clave de servicio
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
console.log("Proyecto Firebase:", serviceAccount.project_id);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Endpoint para recibir datos y guardarlos en Firestore
app.post('/lectura', async (req, res) => {
  let data = req.body;
  console.log("Datos recibidos:", data);

  try {
    // Si no envía timestamp, agregamos el del servidor
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    await db.collection('lecturas').add(data);
    res.status(200).send('Datos guardados en Firestore');
  } catch (error) {
    console.error('Error guardando en Firestore:', error);
    res.status(500).send('Error guardando en Firestore');
  }
});

// Nuevo endpoint para obtener las últimas 10 lecturas
app.get('/ultimas', async (req, res) => {
  try {
    const snapshot = await db.collection('lecturas')
      .orderBy('timestamp', 'desc')  // orden descendente: más recientes primero
      .limit(10)                     // solo las 10 primeras
      .get();

    const lecturas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(lecturas);
  } catch (error) {
    console.error('Error obteniendo lecturas:', error);
    res.status(500).send('Error obteniendo lecturas');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});