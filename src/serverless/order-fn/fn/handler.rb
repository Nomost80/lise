require "kafka"

class Handler
  def run(body, headers)
    logger = Logger.new($stderr)
    kafka = Kafka.new([ENV.fetch("KAFKA_SERVICE_URL")], client_id: "order-fn-producer", logger: logger)
    producer = kafka.producer

    producer.produce(body, topic: "orders", partition: 0)
    producer.deliver_messages
    producer.shutdown

    return body
  end
end