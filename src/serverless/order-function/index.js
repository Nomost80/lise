const express = require('express');
const kafka = require('kafka-node');
const app = express();

console.log('env: ', process.env);

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_HOST
});
const kafkaProducer = new kafka.Producer(kafkaClient);

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'UP'
    });
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

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log('Listening on port', port);
});