#/bin/sh
ECOSYSTEM=ff
ENVIRONMENTASNAMESPACES=FALSE
ORGANIZATION=filipeforattini
REGISTRY=ghcr.io
REPOSITORY=ff-iac-github-actions
TAG=latest

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-empty.yml \
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
    > $DIR_RESULTS/src-inputs-1.yml

CONFIGS_LIST=$(if test -f $DIR_ASSETS/k8s-configs-keys.txt; then cat $DIR_ASSETS/k8s-configs-keys.txt; else echo ''; fi)
SECRETS_LIST=$(if test -f $DIR_ASSETS/k8s-secrets-keys.txt; then cat $DIR_ASSETS/k8s-secrets-keys.txt; else echo ''; fi)
DEPENDENCIES_LIST=$(if test -f ./tmp/k8s-dependencies-full.yml; then cat ./tmp/k8s-dependencies-full.yml | yq -P '.dependencies'; fi)

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-empty.yml \
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
    > $DIR_RESULTS/src-inputs-2.yml
