const express = require('express');
const path = require('path');
const db = require('./config/db');
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'templates')));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/donate', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'donate.html'));
});

app.get('/Policy/user-agreement.pdf', (req, res) => {
  res.sendFile(path.join(__dirname, 'Policy', 'user-agreement.pdf'));
});

app.get('/Policy/privacy-policy.pdf', (req, res) => {
  res.sendFile(path.join(__dirname, 'Policy', 'privacy-policy.pdf'));
});

app.get('/Policy/payments.pdf', (req, res) => {
  res.sendFile(path.join(__dirname, 'Policy', 'payments.pdf'));
});

app.post('/check-user', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Не вказано ім\'я користувача' });
  }
 
  // Важливо: замініть "qbcoreframework_23426e" на вашу власну назву, але залиште ".players" без змін.
  // Змінюйте тільки частину до крапки.
  
  const query = 'SELECT COUNT(*) AS count FROM qbcoreframework_23426e.players WHERE name = ?';
  db.query(query, [name], (error, results) => {
    if (error) {
      console.error('Помилка при виконанні запиту:', error);
      return res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
    const exists = results[0].count > 0;
    res.json({ exists });
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'templates', '404.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
