const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8000']
}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Файл не знайдено' });
        }
    });
});

const getNews = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
        return JSON.parse(data).news || [];
    } catch (error) {
        console.error('Помилка при зчитуванні config.json:', error);
        return [];
    }
};

const getServerInfo = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'server.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Помилка при зчитуванні server.json:', error);
        return {};
    }
};

const getUpdateInfo = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'update.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Помилка при зчитуванні update.json:', error);
        return {};
    }
};

app.get('/api/news', (req, res) => {
    const news = getNews();
    res.json(news);
});

app.get('/api/server', (req, res) => {
    const serverInfo = getServerInfo();
    res.json(serverInfo);
});

app.get('/api/update', (req, res) => {
    const updateInfo = getUpdateInfo();
    res.json(updateInfo);
});

app.post('/api/news', (req, res) => {
    const newNews = req.body;
    const news = getNews();

    const newId = news.length ? Math.max(...news.map(n => n.id)) + 1 : 1;
    newNews.id = newId;

    news.push(newNews);

    try {
        fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify({ news }, null, 2));
        res.status(201).json(newNews);
    } catch (error) {
        console.error('Помилка при записі в config.json:', error);
        res.status(500).json({ error: 'Не вдалося зберегти новину' });
    }
});

app.put('/api/server', (req, res) => {
    const updatedServerInfo = req.body;

    try {
        fs.writeFileSync(path.join(__dirname, 'server.json'), JSON.stringify(updatedServerInfo, null, 2));
        res.status(200).json(updatedServerInfo);
    } catch (error) {
        console.error('Помилка при записі в server.json:', error);
        res.status(500).json({ error: 'Не вдалося оновити інформацію сервера' });
    }
});


app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});
