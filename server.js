const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para leer datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..'))); // ajusta según dónde esté tu HTML

const reviewsFile = path.join(__dirname, 'reviews.json');

// Crear archivo reviews.json si no existe
if (!fs.existsSync(reviewsFile)) {
  fs.writeFileSync(reviewsFile, JSON.stringify([]));
}

// Ruta para manejar los comentarios
app.post('/addReview', (req, res) => {
  const newReview = req.body;

  // Leer reseñas existentes
  const reviews = JSON.parse(fs.readFileSync(reviewsFile));
  
  // Agregar la nueva reseña
  reviews.push(newReview);

  // Guardar en archivo
  fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));

  // Respuesta al usuario
  res.send(`
    <h2>¡Gracias por tu reseña!</h2>
    <a href="/">Volver a la página</a>
    <h3>Reseñas guardadas:</h3>
    <pre>${JSON.stringify(reviews, null, 2)}</pre>
  `);
});

// Ruta para mostrar todas las reseñas en formato JSON
app.get('/reviews', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(reviewsFile));
  res.json(reviews);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, 'web')));
