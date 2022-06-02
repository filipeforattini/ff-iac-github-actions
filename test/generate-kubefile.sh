#/bin/sh

ytt \
  -f ../deploy/as-k8s/service.schema.yml \
  -f ../deploy/as-k8s/service.yml \
  -f ./concerns/k8s-values.yml \
    > ./tmp/k8s-to-apply.yml

ECOSYSTEM=ff
ENVIRONMENTASNAMESPACES=FALSE
ORGANIZATION=filipeforattini
REGISTRY=ghcr.io
REPOSITORY=ff-iac-github-actions
TAG=latest

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
  --data-value-yaml envFromSecrets="[]" \
  --data-value-yaml envFromConfigMaps="[]" \
  --data-value-yaml envFromDependencies="[]" \
  --data-value-yaml pipelineControl.environmentsAsNamespaces=$ENVIRONMENTASNAMESPACES \
    > ./tmp/k8s-to-apply-empty.yml

CONFIGS_LIST=$(if test -f ./concerns/k8s-configs-keys.txt; then cat ./concerns/k8s-configs-keys.txt; else echo ''; fi)
SECRETS_LIST=$(if test -f ./concerns/k8s-secrets-keys.txt; then cat ./concerns/k8s-secrets-keys.txt; else echo ''; fi)
DEPENDENCIES_LIST=$(if test -f ./concerns/k8s-dependencies.yml; then cat ./concerns/k8s-dependencies.yml; else echo ''; fi)

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
  --data-value-yaml envFromDependencies="[$DEPENDENCIES_LIST]" \
  --data-value-yaml pipelineControl.environmentsAsNamespaces=$ENVIRONMENTASNAMESPACES \
    > ./tmp/k8s-to-apply-full.yml
