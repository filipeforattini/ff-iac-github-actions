REPOSITORY=${REPOSITORY:-"ff-svc-moleculer"}

ytt \
  -f $DIR_SRC/dependencies.schema.yml \
  -f $DIR_SRC/dependencies.yml \
  -f $DIR_ASSETS/dependencies-moleculer.yml \
  --data-value repository=$REPOSITORY \
    > $DIR_RESULTS/k8s-dependencies-moleculer.yml

