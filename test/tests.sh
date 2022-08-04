export REPOSITORY=${REPOSITORY:-"ff-iac-github-actions"}

export DIR_SRC=${DIR_SRC:-"../deploy/as-k8s"}
export DIR_ASSETS=${DIR_ASSETS:-"./assets"}
export DIR_TESTS=${DIR_TESTS:-"./cases"}
export DIR_RESULTS=${DIR_RESULTS:-"./tmp"}

# svc
sh $DIR_TESTS/svc.sh
sh $DIR_TESTS/svc-inputs.sh
sh $DIR_TESTS/svc-service.sh

# app
sh $DIR_TESTS/app.sh

# dependencies
sh $DIR_TESTS/generate-dependencies.sh
