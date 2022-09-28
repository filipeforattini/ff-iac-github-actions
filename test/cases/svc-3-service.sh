#/bin/sh
ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-service.yml \
    > $DIR_RESULTS/svc-3-service.yml

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-service-lb-aws-alb.yml \
    > $DIR_RESULTS/svc-3-service-aws.yml
