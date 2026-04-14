const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(__dirname));

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

  reviews.push(newReview);

  fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));

  res.redirect('/');
});

app.get('/reviews', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(reviewsFile));
  res.json(reviews);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});