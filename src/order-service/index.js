const express = require('express');
const kafka = require('kafka-node');
const app = express();

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'localhost:9092'
});
const kafkaProducer = new kafka.Producer(kafkaClient);

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'World';
    res.send(`Hello ${target}!`);
});

app.post('/orders', (req, res) => {
    console.log('New order: ', req.body);
    kafkaProducer.send([{
        topic: 'orders',
        messages: JSON.stringify(req.body),
        partitions: 1
    }], (err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(201).end();
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Listening on port', port);
});