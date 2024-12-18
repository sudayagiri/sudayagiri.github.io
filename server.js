const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', (req, res) => {
    const { names } = req.body;

    if (!names || names.length === 0) {
        return res.status(400).json({ success: false, message: 'No names provided' });
    }

    // Generate text output
    const textOutput = names.join('\n');

    // Create Excel file
    const worksheet = xlsx.utils.json_to_sheet(names.map(name => ({ Name: name })));
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Names');
    
    const excelFilePath = path.join(__dirname, 'output.xlsx');
    xlsx.writeFile(workbook, excelFilePath);

    // Send response
    res.json({
        success: true,
        excelUrl: '/output.xlsx',
        textOutput
    });
});

// Serve the Excel file
app.get('/output.xlsx', (req, res) => {
    res.sendFile(path.join(__dirname, 'output.xlsx'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});