const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
// product-api/server.js
app.use(cors({
    origin: 'https://angular.app.aletcloud.com', // ለአንጉላር ሎካልሆስት ብቻ ፍቃድ መስጠት
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// MySQL ግንኙነት መፍጠር
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // ፖርቱን ወደ ቁጥር ይለውጠዋል (33078)
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

db.connect(err => {
    if (err) {
        console.error('MySQL Connection Failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// 1. አዲስ ምርት መመዝገብ (Create)
// product-api/server.js ውስጥ ያለውን app.post በዚህ ይተኩት

app.post('/api/products', (req, res) => {
    try {
        console.log("ከአንጉላር የመጣ ዳታ:", req.body); 

        const { name, price, description, quantity } = req.body;

        // መረጃው ባዶ አለመሆኑን ማረጋገጫ (ደህንነት)
        if (!name || price === undefined || quantity === undefined) {
            return res.status(400).json({ error: "እባክዎን ሁሉንም መስኮች በትክክል ይሙሉ" });
        }
        
        const sql = "INSERT INTO products (name, price, description, quantity) VALUES (?, ?, ?, ?)";
        
        db.query(sql, [name, price, description, quantity], (err, result) => {
            if (err) {
                console.error("❌ የ SQL ስህተት አጋጥሟል:", err.message); 
                return res.status(500).json({ error: err.message });
            }
            // በተሳካ ሁኔታ ሲመዘገብ ምላሽ መላክ
            return res.status(201).json({ id: result.insertId, name, price, description, quantity });
        });

    } catch (error) {
        // ሰርቨሩ ክራሽ እንዳያደርግ መከላከያ
        console.error("❌ በሰርቨር ላይ ያልታሰበ ስህተት አጋጥሟል:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// 2. ሁሉንም ምርቶች ማግኘት (Read All - ለአንጉላር ዋና ገጽ ዝርዝር ማሳያ)
app.get('/api/products', (req, res) => { // <-- እዚህ ጋር ":id" መኖር የለበትም!
    const sql = "SELECT * FROM products ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ ሁሉንም ዳታ ለማንበብ ሲሞከር የSQL ስህተት አጋጥሟል:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // ሁሉንም ምርቶች በአሬይ ይልካል
    });
});

// 3. አንድን ምርት በID ማግኘት (Read One - ለማሻሻያ/Edit ገጽ ብቻ)
app.get('/api/products/:id', (req, res) => { // <-- እዚህ ጋር ":id" በትክክል ይገባል
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("❌ ነጠላ ዳታ ለማንበብ ሲሞከር ስህተት አጋጥሟል:", err.message);
            return res.status(500).json({ error: err.message });
        }
        // ዳታው በዝርዝር ከመጣ የመጀመሪያውን ይልካል
        const product = Array.isArray(result) ? result[0] : result;
        res.json(product);
    });
});

// 4. የምርት መረጃ ማደስ (Update)
app.put('/api/products/:id', (req, res) => {
    const { name, price, description, quantity } = req.body;
    const sql = "UPDATE products SET name=?, price=?, description=?, quantity=? WHERE id=?";
    db.query(sql, [name, price, description, quantity, req.params.id], (err, result) => {
        if (err) {
            console.error("❌ ለማደስ ሲሞከር ስህተት አጋጥሟል:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product updated successfully" });
    });
});

// 5. ምርት መሰረዝ (Delete)
app.delete('/api/products/:id', (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("❌ ለመሰረዝ ሲሞከር ስህተት አጋጥሟል:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product deleted successfully" });
    });
});


// ሰርቨር ማስነሻ
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
