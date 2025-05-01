const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static('public'));

app.get('/componente1', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'componente1.html'));
});
app.get('/componente2', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'componente2.html'));
});
app.get('/componente3', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'componente3.html'));
});
app.get('/componente4', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'componente4.html'));
});
app.get('/componente5', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'componente5.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
