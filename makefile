.PHONY: all test clean

all: render

render:
	ytt \
		-f ./workflows

help:
	ytt website

test:
	cd ./test; \
		sh generate-dependencies.sh; \
		sh generate-kubefile.sh; \
		sh generate-kubefile-ingress.sh;
