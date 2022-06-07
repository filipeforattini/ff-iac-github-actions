deploy_repository="alpha-svc-recruiters"
deploy_namespace="alpha-svc-recruiters-dev"
deploy_version="0.0.1"

ytt \
  -f ./deploy/as-k8s/dependencies.schema.yml \
  -f ./deploy/as-k8s/dependencies.yml \
  -f ./dependencies.yml \
  --data-value postgres.helm.auth.database=${deploy_repository} \
  --data-value postgres.helm.auth.username=${deploy_repository} \
    > ./k8s-dependencies.yml

echo "#info   :: start"
if [ $(cat ./k8s-dependencies.yml | yq -P '.postgres.enabled') = true ]; then
  POSTGRES_PASSWORD=$(openssl rand -hex 16)
  kubectl get secret -n ${deploy_namespace} svc-postgres 2> /dev/null
  if [ $? -gt 0 ]; then
    echo "#info   :: secret does not exists!"
    echo "#info   :: creating secret..."
    kubectl create secret generic -n ${deploy_namespace} svc-postgres --from-literal="hash=$(cat ./k8s-dependencies.yml | yq -P '.postgres.hash')" --from-literal="password=$POSTGRES_PASSWORD" --from-literal="postgres-password=$(openssl rand -hex 16)" --from-literal="replication-password=$(openssl rand -hex 16)" --from-literal="connection-string=postgres://${deploy_repository}:$POSTGRES_PASSWORD@svc-postgres-postgresql:5432/${deploy_repository}"
    kubectl create secret generic -n ${deploy_namespace} svc-postgres-${deploy_version} --from-literal="hash=$(cat ./k8s-dependencies.yml | yq -P '.postgres.hash')" --from-literal="password=$POSTGRES_PASSWORD" --from-literal="postgres-password=$(openssl rand -hex 16)" --from-literal="replication-password=$(openssl rand -hex 16)" --from-literal="connection-string=postgres://${deploy_repository}:$POSTGRES_PASSWORD@svc-postgres-postgresql:5432/${deploy_repository}"
    echo "#info   :: secret created."
    echo "#info   :: helm version:"
    cat ./k8s-dependencies.yml | yq -P '.postgres.version'
    echo "#info   :: helm config:"
    cat ./k8s-dependencies.yml | yq -P '.postgres.helm'
    echo "#info   :: helm installing..."
    cat ./k8s-dependencies.yml | yq -P '.postgres.helm' | helm install -n ${deploy_namespace} svc-postgres bitnami/postgresql --version $(cat ./k8s-dependencies.yml | yq -P '.postgres.version') --values -
    echo "#info   :: helm installed."
  else
    echo "#info   :: secret exists"
    POSTGRES_ADMIN_PASSWORD=$(kubectl get secret -n ${deploy_namespace} svc-postgres -o jsonpath="{.data.postgres-password}" | base64 -d)
    # cat ./k8s-dependencies.yml | yq -P '.postgres.helm' | helm diff upgrade --dry-run --debug -n ${deploy_namespace} svc-postgres bitnami/postgresql --set global.postgresql.auth.postgresPassword=$POSTGRES_ADMIN_PASSWORD --values -
  fi
else 
  echo "#info   :: helm deleting..."
  helm delete -n ${deploy_namespace} svc-postgres 2> /dev/null
  echo "#info   :: helm deleted."
fi
