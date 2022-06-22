REPOSITORY=${REPOSITORY:-"ff-iac-github-actions"}

ytt \
  -f ../deploy/as-k8s/dependencies.schema.yml \
  -f ../deploy/as-k8s/dependencies.yml \
  -f ./concerns/dependencies-empty.yml \
  --data-value repository=$REPOSITORY \
    > ./tmp/k8s-dependencies-empty.yml

ytt \
  -f ../deploy/as-k8s/dependencies.schema.yml \
  -f ../deploy/as-k8s/dependencies.yml \
  -f ./concerns/dependencies-full.yml \
  --data-value repository=$REPOSITORY \
    > ./tmp/k8s-dependencies.yml

ytt \
  -f ../deploy/as-k8s/dependencies.schema.yml \
  -f ../deploy/as-k8s/dependencies.yml \
  -f ./concerns/dependencies-full.yml \
  --data-value repository=$REPOSITORY \
    > ./tmp/k8s-dependencies-full.yml
