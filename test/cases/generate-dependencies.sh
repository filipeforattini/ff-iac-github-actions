REPOSITORY=${REPOSITORY:-"ff-iac-github-actions"}

ytt \
  -f $DIR_SRC/dependencies.schema.yml \
  -f $DIR_SRC/dependencies.yml \
  -f $DIR_ASSETS/dependencies-empty.yml \
  --data-value repository=$REPOSITORY \
    > $DIR_RESULTS/k8s-dependencies-empty.yml

ytt \
  -f $DIR_SRC/dependencies.schema.yml \
  -f $DIR_SRC/dependencies.yml \
  -f $DIR_ASSETS/dependencies-full.yml \
  --data-value repository=$REPOSITORY \
    > $DIR_RESULTS/k8s-dependencies.yml

ytt \
  -f $DIR_SRC/dependencies.schema.yml \
  -f $DIR_SRC/dependencies.yml \
  -f $DIR_ASSETS/dependencies-full.yml \
  --data-value repository=$REPOSITORY \
    > $DIR_RESULTS/k8s-dependencies-full.yml
