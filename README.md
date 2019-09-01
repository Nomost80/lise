# Getting started
A running Kubernetes cluster with both Istio and Tiller installed is required.
* `kubectl apply -f -R ./k8s`
* `export NAMESPACE="lise-microservices-dev" RELEASE_NAME="mercury"` 
* `helm install helm --tiller-namespace $NAMESPACE install helm --namespace $NAMESPACE --name $RELEASE_NAME --dep-up`

Then you can test the release by running the following command:
```shell script
curl -v -d '{"name":"usb key", "quantity":3, "unitPrice", 5}' -H "Content-Type: application/json" -X POST http://192.168.1.221:31380/orders
```

# Useful commands
* Enable automatic sidecar injections: `kubectl label namespace $NAMESPACE istio-injection=enabled`
* Deploy Tiller without sidecar: `helm init --service-account tiller --history-max 200 --tiller-namespace $NAMESPACE --override spec.template.metadata.annotations."sidecar\.istio\.io/inject"="false"`