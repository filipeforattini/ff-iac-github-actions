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



K8S_NAMESPACE ?= ff-svc-nodejs-dev
K8S_LABELS ?= "--kubeconfig $(HOME)/.kube/ff-mini.yml"
DEPENDENCY_FILE ?= "$(PWD)/test/tmp/k8s-dependencies-full.yml"
DEPENDENCY_FILE_EMPTY ?= "$(PWD)/test/tmp/k8s-dependencies-empty.yml"

deps-add:
	make dep-mysql-add && make dep-postgres-add	&& make dep-rabbitmq-add && make dep-elasticsearch-add && make dep-redis-add

deps-del:
	make dep-mysql-del && make dep-postgres-del	&& make dep-rabbitmq-del && make dep-elasticsearch-del && make dep-redis-del

dep-mysql-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=mysql \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-mysql-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=mysql \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh

dep-postgres-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=postgres \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-postgres-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=postgres \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh

dep-rabbitmq-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=rabbitmq \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-rabbitmq-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=rabbitmq \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh

dep-elasticsearch-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=elasticsearch \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-elasticsearch-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=elasticsearch \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh

dep-redis-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=redis \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-redis-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=redis \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh
