#/bin/sh
ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-service.yml \
    > $DIR_RESULTS/src-service-1.yml

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-service-aws.yml \
    > $DIR_RESULTS/src-service-2-aws.yml
