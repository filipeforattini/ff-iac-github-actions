ENVIRONMENTASNAMESPACES=FALSE
REPOSITORY=ff-iac-github-actions
TAG=latest
REGISTRY=ghcr.io
ORGANIZATION=filipeforattini
ECOSYSTEM=ff
SECRETS_LIST=S1,S2
CONFIGS_LIST=C1,C2

ytt \
  -f ../deploy/as-k8s/service.schema.yml \
  -f ../deploy/as-k8s/service.yml \
  -f ./concerns/k8s-values.yml \
  --data-value ecosystem=$ECOSYSTEM \
  --data-value organization=$ORGANIZATION \
  --data-value repository=$REPOSITORY \
  --data-value containerRegistry=$REGISTRY \
  --data-value tag=$TAG \
  --data-value-yaml deployment.imagePullSecrets=true \
  --data-value-yaml envFromSecrets="[$SECRETS_LIST]" \
  --data-value-yaml envFromConfigMaps="[$CONFIGS_LIST]" \
  --data-value-yaml envFromDependencies="[$(cat ./tmp/k8s-dependencies.yml | yq -P '.dependencies')]" \
  --data-value-yaml pipelineControl.environmentsAsNamespaces=$ENVIRONMENTASNAMESPACES \
    > ./tmp/k8s-to-apply.yml
