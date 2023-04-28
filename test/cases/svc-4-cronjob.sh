# #/bin/sh

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-cronjob.yml \
    > $DIR_RESULTS/svc-4-cronjob.yml
