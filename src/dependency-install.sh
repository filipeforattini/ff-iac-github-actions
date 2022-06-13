#/bin/sh

# variables
K8S_LABELS="${K8S_LABELS:-""}"
K8S_NAMESPACE="${K8S_NAMESPACE:-"default"}"
K8S_REPOSITORY="${K8S_REPOSITORY:-"acm-svc-service"}"

DEPENDENCY_NAME="${DEPENDENCY_NAME:-"postgres"}"
DEPENDENCY_FILE="${DEPENDENCY_FILE:-"./manifests/k8s-dependency.yml"}"
DEPENDENCY_CHART="${DEPENDENCY_CHART:-"acme"}"
DEPENDENCY_SECRET_NAME="dep-secret-$DEPENDENCY_NAME"
REPOSITORY_TAG_VERSION="${REPOSITORY_TAG_VERSION:-"0.0.1"}"

# utils
info () {
  echo "[$DEPENDENCY_NAME] info  | $*"
}

# execution
info checking $DEPENDENCY_NAME dependency

if [ $(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.enabled") = true ]; then
  info $DEPENDENCY_NAME is enabled
  info getting secret
  K8S_SECRET=$(kubectl $K8S_LABELS get secret -n $K8S_NAMESPACE dep-$DEPENDENCY_NAME --ignore-not-found)

  if [ "${#K8S_SECRET}" -lt 1 ]; then
    info secret does not exists!

    DEPENDENCY_PORT=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.port")
    info dependency will use port $DEPENDENCY_PORT

    DEPENDENCY_PROTOCOL=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.protocol")
    DEPENDENCY_HAS_PASSWORD=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.hasPassword")
    DEPENDENCY_SERVICE_NAME=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.serviceName")

    if [ "$DEPENDENCY_HAS_PASSWORD" = "true" ]; then
      info this dependency has password

      info generating password
      DEPENDENCY_PASSWORD=$(openssl rand -hex 16)
      DEPENDENCY_ROOT_PASSWORD=$(openssl rand -hex 16)
      DEPENDENCY_CONNECTION_STRING="connection-string=$DEPENDENCY_PROTOCOL$K8S_REPOSITORY:$DEPENDENCY_PASSWORD@$DEPENDENCY_SERVICE_NAME:$DEPENDENCY_PORT/$K8S_REPOSITORY"

      kubectl $K8S_LABELS create secret generic \
        -n $K8S_NAMESPACE \
        $DEPENDENCY_SECRET_NAME \
          --from-literal="hash=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.hash")" \
          --from-literal="password=$DEPENDENCY_PASSWORD" \
          --from-literal="$DEPENDENCY_NAME-password=$DEPENDENCY_ROOT_PASSWORD" \
          --from-literal="$DEPENDENCY_CONNECTION_STRING"
          
      kubectl $K8S_LABELS create secret generic \
        -n $K8S_NAMESPACE \
        $DEPENDENCY_SECRET_NAME-$REPOSITORY_TAG_VERSION \
          --from-literal="hash=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.hash")" \
          --from-literal="password=$DEPENDENCY_PASSWORD" \
          --from-literal="$DEPENDENCY_NAME-password=$DEPENDENCY_ROOT_PASSWORD" \
          --from-literal="$DEPENDENCY_CONNECTION_STRING"
    else
      info this dependency does not have password
      DEPENDENCY_CONNECTION_STRING="connection-string=${DEPENDENCY_PROTOCOL}dep-$DEPENDENCY_NAME-$DEPENDENCY_NAME:$DEPENDENCY_PORT/$K8S_REPOSITORY"

      kubectl $K8S_LABELS create secret generic \
        -n $K8S_NAMESPACE \
        $DEPENDENCY_SECRET_NAME \
          --from-literal="hash=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.hash")" \
          --from-literal="$DEPENDENCY_CONNECTION_STRING" 

      kubectl $K8S_LABELS create secret generic \
        -n $K8S_NAMESPACE \
        $DEPENDENCY_SECRET_NAME-$REPOSITORY_TAG_VERSION \
          --from-literal="hash=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.hash")" \
          --from-literal="$DEPENDENCY_CONNECTION_STRING" 
    fi

    if [ "$DEPENDENCY_NAME" = "rabbitmq" ]; then
      info extra secrets created for rabbitmq!
      RABBITMQ_EARLANG_COOKIE=$(openssl rand -hex 16 | base64)

      kubectl $K8S_LABELS patch secret \
        -n $K8S_NAMESPACE \
        $DEPENDENCY_SECRET_NAME \
          -p="{\"data\":{\"rabbitmq-erlang-cookie\": \"$RABBITMQ_EARLANG_COOKIE\"}}" -v=1

      kubectl $K8S_LABELS patch secret \
        -n $K8S_NAMESPACE \
        $DEPENDENCY_SECRET_NAME-$REPOSITORY_TAG_VERSION \
          -p="{\"data\":{\"rabbitmq-erlang-cookie\": \"$RABBITMQ_EARLANG_COOKIE\"}}" -v=1
    fi
    info secrets created!

    info applying helm...
    SECRET_OPTION="--set \"$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.secretKey")=$DEPENDENCY_SECRET_NAME\""

    cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.values" | helm install $K8S_LABELS \
      -n $K8S_NAMESPACE \
      dep-$DEPENDENCY_NAME \
        $(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.chart") $SECRET_OPTION \
        --version $(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.version") \
        --values -

    info helm applied!
  else
    info secret exists
    info not searching for helm changes tho...

    # info helm diff
    # cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.values" | helm diff upgrade $K8S_LABELS \
    #   -n $K8S_NAMESPACE \
    #   dep-$DEPENDENCY_NAME \
    #     $(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.chart") \
    #     --version $(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.version") \
    #     --set "auth.password=$(echo $K8S_SECRET | jq ".password" | base64 -d)" \
    #     --set "auth.${DEPENDENCY_NAME}Password=$(echo $K8S_SECRET | jq ".$DEPENDENCY_NAME-password" | base64 -d)" \
    #     --values -
  fi

  info helm status
  helm status $K8S_LABELS \
    -n $K8S_NAMESPACE \
    dep-$DEPENDENCY_NAME
else 
  info $DEPENDENCY_NAME is disabled

  info helm deleting...
  helm delete $K8S_LABELS -n $K8S_NAMESPACE dep-$DEPENDENCY_NAME 2> /dev/null
  info helm deleted!

  info secrets deleting...
  kubectl $K8S_LABELS delete secret -n $K8S_NAMESPACE $DEPENDENCY_SECRET_NAME
  info secrets deleted!
fi
