const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'UP'
    });
});

app.post('/', (req, res) => {
    const message = req.body.Body;
    console.log('Headers: ', req.headers);
    console.log('Order received: ', message);
    res.status(200).end();
});