.PHONY: all test clean

all: render

render:
	ytt \
		-f ./workflows

help:
	ytt website

REPOSITORY ?= ff-svc-moleculerjs

test:
	export REPOSITORY=${REPOSITORY} \
	&& cd ./test; sh ./tests.sh;

K8S_NAMESPACE ?= ff-svc-moleculerjs-dev
K8S_LABELS ?= ""
DEPENDENCY_FILE ?= "$(PWD)/test/tmp/k8s-dependencies-full.yml"
DEPENDENCY_FILE_EMPTY ?= "$(PWD)/test/tmp/k8s-dependencies-empty.yml"

deps-add:
	true \
		&& make dep-mysql-add \
		&& make dep-postgres-add	\
		&& make dep-rabbitmq-add \
		&& make dep-elasticsearch-add \
		&& make dep-redis-add \
		&& make dep-nats-add \
		&& make dep-etcd-add

deps-del:
	true \
		&& make dep-mysql-del \
		&& make dep-postgres-del \
		&& make dep-rabbitmq-del \
		&& make dep-elasticsearch-del \
		&& make dep-redis-del \
		&& make dep-nats-del \
		&& make dep-etcd-del

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

dep-nats-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=nats \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-nats-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=nats \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh

dep-etcd-add:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=etcd \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE) \
		./src/dependency-install.sh

dep-etcd-del:
	K8S_NAMESPACE=$(K8S_NAMESPACE) \
	K8S_LABELS=$(K8S_LABELS) \
	DEPENDENCY_NAME=etcd \
	DEPENDENCY_FILE=$(DEPENDENCY_FILE_EMPTY) \
		./src/dependency-install.sh

