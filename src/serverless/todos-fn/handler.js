"use strict";

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const kafka = require('kafka-node');

let mongodbConnection;
let kafkaProducer;

module.exports = async (config) => {
    const app = config.app;

    app.use(express.json());

    app.get('/', async (req, res) => {
        const database = await prepareDB();
        const collection = database.collection('todos');
        const docs = await collection.find({}).toArray();
        res.json(docs).status(200);
    });

    app.post('/', async (req, res) => {
        const database = await prepareDB();
        const collection = database.collection('todos');
        const todo = req.body;
        const { insertedCount, insertedId } = await collection.insertOne(todo);
        if (insertedCount && insertedId)
            res.json({ ...todo, id: insertedId }).status(201);
        else
            res.send().status(500);
    });

    app.put('/:id', async (req, res) => {
        const database = await prepareDB();
        const collection = database.collection('todos');
        const todo = req.body;
        const { modifiedCount } = await collection.updateOne({ _id: req.params.id }, { $set: todo });
        if (modifiedCount) {
            if (todo.completed) {
                const kafka = prepareKafka();
                const message = `La tâche : ${todo.name} a été complété !`;
                kafka.send([{
                    topic: 'task-completed',
                    partition: 0,
                    messages: message
                }], (err, data) => {
                    if (err) res.send(err).status(500);
                });
            }
            res.json(todo).status(200);
        }
        else
            res.send().status(404);
    });

    app.delete('/:id', async (req, res) => {
        const database = await prepareDB();
        const collection = database.collection('todos');
        const { deletedCount } = await collection.deleteOne({ _id: req.params.id });
        if (deletedCount)
            res.send().status(200);
        else
            res.send().status(404);
    });
};

const prepareDB = async () => {
    if (mongodbConnection)
        return mongodbConnection;

    const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_SERVICE } = process.env;
    const url = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_SERVICE}`;
    const client = new MongoClient(url);
    await client.connect();

    mongodbConnection = client.db('lise');
    return mongodbConnection;
};

const prepareKafka = () => {
    if (kafkaProducer)
        return kafkaProducer;

    const kafkaClient = new kafka.KafkaClient({
        kafkaHost: process.env.KAFKA_SERVICE
    });
    kafkaProducer = new kafka.Producer(kafkaClient);
    return kafkaProducer;
};