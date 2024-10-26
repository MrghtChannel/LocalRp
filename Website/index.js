const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'templates')));

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Сторінка donate
app.get('/donate', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'donate.html'));
});

// Сторінка 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'templates', '404.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
