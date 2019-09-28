require "kafka"
require "json"

smtp_server = ENV.fetch("SMTP_SERVER")

class Handler
  def run(req)
    logger = Logger.new($stderr)
    kafka = Kafka.new([ENV.fetch("KAFKA_SERVICE")], client_id: "order-fn-producer", logger: logger)
    producer = kafka.producer

    consumer = kafka.consumer(group_id: "mail-consumer")
    consumer.subscribe("task-completed")
    trap("TERM") { consumer.stop }

    consumer.each_message do |message|
      Net::SMTP.start(smtp_server, ENV.fetch("SMTP_PORT"), smtp_server, ENV.fetch("SMTP_USERNAME"), ENV.fetch("SMTP_PASSWORD")) do |smtp|
        smtp.send_message(message, "from@smtp.mailtrap.io", "to@smtp.mailtrap.io")
      end
    end
  end
end
