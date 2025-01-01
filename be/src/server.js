import express from "express";
import { readFileSync } from 'fs';
import { join } from 'path';

const app = express();
const port = 3000;

app.get("/api/english.json", (req, res) => {
    try {
        const englishWords = JSON.parse(
            readFileSync(join(__dirname, './controllers/english.json'), 'utf8')
        );
        res.json(englishWords);
    } catch (error) {
        res.status(500).json({ error: "Failed to load word list" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});