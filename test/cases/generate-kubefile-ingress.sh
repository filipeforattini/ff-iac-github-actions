#/bin/sh

ytt \
  -f ../deploy/as-k8s/service.schema.yml \
  -f ../deploy/as-k8s/service.yml \
  -f ./concerns/k8s-values-ingress-nginx.yml \
    > ./tmp/k8s-to-apply-ingress-nginx.yml

ytt \
  -f ../deploy/as-k8s/service.schema.yml \
  -f ../deploy/as-k8s/service.yml \
  -f ./concerns/k8s-values-ingress-alb.yml \
    > ./tmp/k8s-to-apply-ingress-alb.yml

ytt \
  -f ../deploy/as-k8s/service.schema.yml \
  -f ../deploy/as-k8s/service.yml \
  -f ./concerns/k8s-values-ingress-traefik.yml \
    > ./tmp/k8s-to-apply-ingress-traefik.yml

