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
debug () {
  echo "[$DEPENDENCY_NAME] debug  | $*"
}ada

info () {
  echo "[$DEPENDENCY_NAME]  info  | $*"
}

error () {
  echo "[$DEPENDENCY_NAME]  error  | $*"
  exit 1
}

# execution
debug K8S_LABELS=$K8S_LABELS
debug K8S_NAMESPACE=$K8S_NAMESPACE
debug K8S_REPOSITORY=$K8S_REPOSITORY
info checking $DEPENDENCY_NAME dependency

if [ $(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.enabled") = true ]; then
  info $DEPENDENCY_NAME is enabled

  info getting secret...
  debug kubectl $K8S_LABELS get secret -n $K8S_NAMESPACE $DEPENDENCY_SECRET_NAME --ignore-not-found
  K8S_SECRET=$(kubectl $K8S_LABELS get secret -n $K8S_NAMESPACE $DEPENDENCY_SECRET_NAME --ignore-not-found)
  if [ $? -eq 0 ]; then
    debug response = $K8S_SECRET
  else
    error cannot connect
  fi

  if [ "${#K8S_SECRET}" -lt 1 ]; then
    info secret does not exists!

    CONTROL_HASH=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.hash")
    CONTROL_CHART=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.chart")
    CONTROL_VERSION=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.version")
    CONTROL_SECRETS=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.secrets[]") # fix me
    CONTROL_SECRETS_KEYS=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.secretKeys[]")
    CONNECTION_PORT=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.connection.port")
    CONNECTION_SECRET=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.connection.secret")
    CONNECTION_PROTOCOL=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.connection.protocol")
    CONNECTION_USERNAME=$K8S_REPOSITORY
    CONNECTION_DATABASE=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.connection.database")
    CONNECTION_HOSTNAME=$(cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.control.connection.serviceName")

    CMD_SECRET_CREATE=" --from-literal=hash=$CONTROL_HASH "
    SECRET_CONNECTION="$CONNECTION_PROTOCOL"
    SECRET_CONNECTION_OTHER_NAMESPACE="$CONNECTION_PROTOCOL"
    
    for SECRET_KEY_ITEM in $CONTROL_SECRETS_KEYS; do
      if [ "$SECRET_KEY_ITEM" != "$CONNECTION_SECRET" ]; then
        debug generating [$SECRET_KEY_ITEM] secret
        CMD_SECRET_CREATE="$CMD_SECRET_CREATE --from-literal=$SECRET_KEY_ITEM=$(openssl rand -hex 16) "
      fi
    done

    if [ "${#CONNECTION_SECRET}" -gt 0 ]; then
      debug generating [$CONNECTION_SECRET] secret
      info dependency needs credentials to connect
      TEMP_SECRET=$(openssl rand -hex 16)
      CMD_SECRET_CREATE="$CMD_SECRET_CREATE --from-literal=$CONNECTION_SECRET=$TEMP_SECRET "
      SECRET_CONNECTION="${SECRET_CONNECTION}${CONNECTION_USERNAME}:$TEMP_SECRET@"
      SECRET_CONNECTION_OTHER_NAMESPACE="${SECRET_CONNECTION_OTHER_NAMESPACE}${CONNECTION_USERNAME}:$TEMP_SECRET@"
    fi

    SECRET_CONNECTION="${SECRET_CONNECTION}${CONNECTION_HOSTNAME}:$CONNECTION_PORT$CONNECTION_DATABASE"
    SECRET_CONNECTION_OTHER_NAMESPACE="${SECRET_CONNECTION_OTHER_NAMESPACE}${CONNECTION_HOSTNAME}.$K8S_NAMESPACE:$CONNECTION_PORT$CONNECTION_DATABASE"
    
    CMD_SECRET_CREATE="$CMD_SECRET_CREATE --from-literal=connection-string=$SECRET_CONNECTION "
    CMD_SECRET_CREATE="$CMD_SECRET_CREATE --from-literal=connection-string-othernamespace=$SECRET_CONNECTION_OTHER_NAMESPACE "

    info create $DEPENDENCY_SECRET_NAME...
    kubectl $K8S_LABELS create secret generic -n $K8S_NAMESPACE \
      $DEPENDENCY_SECRET_NAME $CMD_SECRET_CREATE
    info $DEPENDENCY_SECRET_NAME created!
    
    info create $DEPENDENCY_SECRET_NAME-$REPOSITORY_TAG_VERSION...
    kubectl $K8S_LABELS create secret generic -n $K8S_NAMESPACE \
      $DEPENDENCY_SECRET_NAME-$REPOSITORY_TAG_VERSION $CMD_SECRET_CREATE
    info $DEPENDENCY_SECRET_NAME-$REPOSITORY_TAG_VERSION created!

    SECRET_OPTION=""
    for SECRET_ITEM in $CONTROL_SECRETS; do
      debug added options to [$SECRET_ITEM] secret
      SECRET_OPTION="$SECRET_OPTION --set $SECRET_ITEM=$DEPENDENCY_SECRET_NAME"
    done
    debug secret option = $SECRET_OPTION

    info applying helm...
    cat $DEPENDENCY_FILE | yq -P ".$DEPENDENCY_NAME.values" | helm install $K8S_LABELS \
      -n $K8S_NAMESPACE \
      dep-$DEPENDENCY_NAME \
        $CONTROL_CHART \
        --version $CONTROL_VERSION \
        $SECRET_OPTION \
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
  
    info helm status
    helm status $K8S_LABELS \
      -n $K8S_NAMESPACE \
      dep-$DEPENDENCY_NAME
  fi
else 
  info $DEPENDENCY_NAME is disabled

  info helm deleting...
  helm delete $K8S_LABELS -n $K8S_NAMESPACE dep-$DEPENDENCY_NAME 2> /dev/null
  info helm deleted!

  info secrets deleting...
  kubectl $K8S_LABELS delete secret -n $K8S_NAMESPACE $DEPENDENCY_SECRET_NAME
  info secrets deleted!
fi
