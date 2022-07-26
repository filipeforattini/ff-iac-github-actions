#/bin/sh
ytt \
  -f $DIR_SRC/service.schema.yml \
  -f $DIR_SRC/service \
  -f $DIR_ASSETS/app.yml \
    > $DIR_RESULTS/app.yml
