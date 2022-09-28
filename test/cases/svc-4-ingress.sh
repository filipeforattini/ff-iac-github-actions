# #/bin/sh

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-ingress.yml \
    > $DIR_RESULTS/svc-4-ingress.yml

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-ingress-aws-alb.yml \
    > $DIR_RESULTS/svc-4-ingress-aws-alb.yml

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-ingress-traefik.yml \
    > $DIR_RESULTS/svc-4-ingress-traefik.yml
