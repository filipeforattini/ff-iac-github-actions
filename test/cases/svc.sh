#/bin/sh
ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-empty.yml \
    > $DIR_RESULTS/svc-1-empty.yml
