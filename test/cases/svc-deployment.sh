#/bin/sh
ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-deployment.yml \
    > $DIR_RESULTS/src-deployment-1.yml
