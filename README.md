# Getting started
A running Kubernetes cluster is required.

## Serverful
Istio should be installed in your cluster.
* `kubectl apply -R -f ./k8s/serverful`
* `export NAMESPACE="lise-serverful" RELEASE_NAME="mercury" NODE_IP="192.168.1.221" GATEWAY_NODE_PORT=31380` 
* `helm init --service-account tiller --history-max 200 --tiller-namespace $NAMESPACE`
* `kubectl label namespace $NAMESPACE istio-injection=enabled`
* `helm charts/lise-serverful --tiller-namespace $NAMESPACE --namespace $NAMESPACE --name $RELEASE_NAME --dep-up`

Then you can test the release by running the following command:
```shell script
curl -v -d '{"name":"usb key", "quantity":3, "unitPrice": 5}' \
  -H "Content-Type: application/json" \
  -X POST "http://$NODE_IP:$GATEWAY_NODE_PORT/orders"
```

## Serverless
OpenFaas should be installed in your cluster.
* `kubectl apply -R -f ./k8s/serverless` 
* `export NODE_IP="192.168.1.221" GATEWAY_NODE_PORT=31112 OF_NAMESPACE=openfaas RELEASE=mercury`
* `helm init --tiller-namespace $OF_NAMESPACE --service-account tiller`
* `helm install ./charts/lise-serverless --dep-up --name $RELEASE --namespace $OF_NAMESPACE --tiller-namespace $OF_NAMESPACE`
* `faas-cli up -f ./src/serverless/stack.yaml`

You can test the release by running the following command:
```shell script
helm test $RELEASE --tiller-namespace $OF_NAMESPACE --cleanup --parallel
```

You can also test the functions:
```shell script
curl -v -d '{"name":"usb key", "quantity":3, "unitPrice": 5}' \
  -H "Content-Type: application/json" \
  -X POST "http://$NODE_IP:$GATEWAY_NODE_PORT/function/order"
```
You can see the two functions been triggered on the gateway ui: `http://$NODE_IP:$GATEWAY_NODE_PORT/ui`

The payment function has been triggered by a message sended at the kafka topic `orders` by the order function.

# Todo
- [ ] Setup Helm authentication context
- [ ] Setup TLS

## Serverful
- [ ] Circuit Breaking
- [ ] Fault Injection
- [ ] Security Policies (rate limit...)
- [ ] Autoscaling
- [ ] Metrics, logs, tracing visualization

## Serverless
- [x] Monitoring: set up Prometheus and Grafana
- [x] Logging: set up Loki with OpenFaas
- [ ] CRUD example

# Commands reminder
* Enable automatic sidecar injections: `kubectl label namespace $NAMESPACE istio-injection=enabled`
* Deploy without a sidecar: `... spec.template.metadata.annotations."sidecar\.istio\.io/inject"="false"`
* Read Kafka messages: `/opt/bitnami/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic $TOPIC --from-beginning` in the kafka pod
