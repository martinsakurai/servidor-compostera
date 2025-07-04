const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para entender JSON en el cuerpo de las peticiones
app.use(express.json());

app.post('/lectura', (req, res) => {
  const data = req.body;
  console.log("Datos recibidos:", data);

  // Aquí podrías guardar datos, procesarlos, etc.

  res.status(200).send('Datos recibidos correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});