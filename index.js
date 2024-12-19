const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12753080',
    password: 'Il2RI5SRzN',
    database: 'sql12753080',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

// POST: Add School with Base64 Image
app.post('/addSchool', upload.single('image'), (req, res) => {
    const { name, address, city, state, contact, email_id } = req.body;

    // Convert image buffer to Base64
    const imageBase64 = req.file ? req.file.buffer.toString('base64') : null;

    const sql = `INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, address, city, state, contact, imageBase64, email_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'School added successfully' });
    });
});

// GET: Fetch Schools
app.get('/getSchools', (req, res) => {
    const sql = 'SELECT id, name, address, city, image FROM schools';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);

        // Decode Base64 images before sending (optional)
        const schools = results.map((school) => ({
            ...school,
            image: school.image ? `data:image/jpeg;base64,${school.image}` : null,
        }));
        res.send(schools);
    });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
