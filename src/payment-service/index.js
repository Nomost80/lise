const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'kafka-service:9092'
});

const kafkaConsumer = new kafka.Consumer(
    kafkaClient,
    [{ topic: 'orders', partitions: 1 }],
    {
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: false
    }
);

kafkaConsumer.on('message', message => {
   console.log('Order received: ', JSON.parse(message.value))
});