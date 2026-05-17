const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/all-products', (req, res) => {
    res.render('all-products');
});

app.get('/new-arrivals', (req, res) => {
    res.render('new-arrivals');
});

app.get('/best-selling', (req, res) => {
    res.render('best-selling');
});

app.get('/under-1000', (req, res) => {
    res.render('under-1000');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
