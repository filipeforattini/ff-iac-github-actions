REPOSITORY=ff-iac-github-actions

ytt \
  -f ../deploy/as-k8s/dependencies.schema.yml \
  -f ../deploy/as-k8s/dependencies.yml \
  -f ./concerns/dependencies.yml \
    > ./tmp/k8s-dependencies.yml

ytt \
  -f ../deploy/as-k8s/dependencies.schema.yml \
  -f ../deploy/as-k8s/dependencies.yml \
  -f ./concerns/dependencies.yml \
  --data-value postgres.helm.auth.database=$REPOSITORY \
  --data-value postgres.helm.auth.username=$REPOSITORY \
    > ./tmp/k8s-dependencies-full.yml
