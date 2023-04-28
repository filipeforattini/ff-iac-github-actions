# #/bin/sh

ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/svc-job.yml \
    > $DIR_RESULTS/svc-4-job.yml
