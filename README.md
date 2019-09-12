# Getting started
A running Kubernetes cluster with both Istio and Tiller installed is required.
* `kubectl apply -f -R ./k8s`

## Serverful
* `export NAMESPACE="lise-serverful" RELEASE_NAME="mercury"` 
* `helm charts/lise-serverful --tiller-namespace $NAMESPACE --namespace $NAMESPACE --name $RELEASE_NAME --dep-up`

Then you can test the release by running the following command:
```shell script
curl -v -d '{"name":"usb key", "quantity":3, "unitPrice": 5}' 
  -H "Content-Type: application/json" 
  -X POST http://192.168.1.221:31380/orders
```

## Serverless
* `export NAMESPACE="lise-serverless" RELEASE_NAME="mercury"` 
* `helm charts/lise-serverless --tiller-namespace $NAMESPACE --namespace $NAMESPACE --name $RELEASE_NAME --dep-up`

Then you can test the release by running the following command:
```shell script
curl -v -d '{"name":"usb key", "quantity":3, "unitPrice": 5}' 
  -H "Content-Type: application/json" 
  -H "Ce-Id: orders"
  -H "Ce-Specversion: 0.2"
  -H "Ce-Type: orders"
  -H "Ce-Source: orders"
  -X POST default-broker.lise-serverless.svc.cluster.local
```

# Useful commands
* Enable automatic sidecar injections: `kubectl label namespace $NAMESPACE istio-injection=enabled`
* Enable Knative eventing injection: `kubectl label namespace $NAMESPACE knative-eventing-injection=enabled` 
* Deploy Tiller without sidecar: `helm init --service-account tiller --history-max 200 --tiller-namespace $NAMESPACE --override spec.template.metadata.annotations."sidecar\.istio\.io/inject"="false"`
* Read Kafka messages: `/opt/bitnami/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic $TOPIC --from-beginning` in the kafka pod

# Todo
- [ ] Test serverless from outside with a gateway
- [ ] Setup Helm authentication context
- [ ] Setup TLS
- [ ] Deploy Kafka in production mode (storage, monitoring and authentication)
