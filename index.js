const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/schoolImages', express.static('schoolImages'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Demo',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: './schoolImages/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to avoid name collisions
    },
});

const upload = multer({ storage });

app.post('/addSchool', upload.single('image'), (req, res) => {
    const { name, address, city, state, contact, email_id } = req.body;
    const image = req.file ? `/schoolImages/${req.file.filename}` : null;

    const sql = `INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, address, city, state, contact, image, email_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'School added successfully' });
    });
});


// GET: Fetch Schools
app.get('/getSchools', (req, res) => {
    db.query('SELECT id, name, address, city, image FROM schools', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
