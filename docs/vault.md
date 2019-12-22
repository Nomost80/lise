https://banzaicloud.com/blog/inject-secrets-into-pods-vault-revisited/
https://github.com/banzaicloud/bank-vaults/tree/master/charts
https://github.com/helm/charts/tree/master/stable/consul
https://github.com/helm/charts/tree/master/incubator/vault

```shell script
helm template --name=mercury vault --set vault.dev=false --set vault.config.ui=true --set vault.config.storage.consul.address="mercury-consul:8500",vault.config.storage.consul.path="vault" > vault.yaml
```
