#! /bin/bash
set -e

export INGRESS_INTERNAL_ANNOTATIONS=$HOF_CONFIG/ingress-internal-annotations.yaml
#Whitelist updated with POISE IPs
export INGRESS_EXTERNAL_ANNOTATIONS=$HOF_CONFIG/ingress-external-annotations.yaml
export CONFIGMAP_VALUES=$HOF_CONFIG/configmap-values.yaml
export NGINX_SETTINGS=$HOF_CONFIG/nginx-settings.yaml
export FILEVAULT_NGINX_SETTINGS=$HOF_CONFIG/filevault-nginx-settings.yaml
export FILEVAULT_INGRESS_EXTERNAL_ANNOTATIONS=$HOF_CONFIG/filevault-ingress-external-annotations.yaml
export REDIS_PERSISTENCE_ACCESS_MODES=${REDIS_PERSISTENCE_ACCESS_MODES:-ReadWriteOnce}
export REDIS_PERSISTENCE_STORAGE_CLASS=${REDIS_PERSISTENCE_STORAGE_CLASS:-gp2-encrypted-eu-west-2b}
export REDIS_PERSISTENCE_EXISTING_CLAIM=${REDIS_PERSISTENCE_EXISTING_CLAIM:-}
export REDIS_PERSISTENCE_ANNOTATIONS_FILE=${REDIS_PERSISTENCE_ANNOTATIONS_FILE:-}

kd='kd --insecure-skip-tls-verify --timeout 10m --check-interval 10s'
redis_storage_files='kube/redis/redis-persistent-volume-claim.yml'
redis_runtime_files='kube/redis/redis-service.yml -f kube/redis/redis-network-policy.yml -f kube/redis/redis-deployment.yml'

recreate_redis_pvc_if_image_changed() {
  if [[ ${REDIS_PERSISTENCE_ENABLED} != true ]]; then
    return
  fi

  if [[ -n "${REDIS_PERSISTENCE_EXISTING_CLAIM}" ]]; then
    return
  fi

  current_redis_image=$($kubectl get deployment redis -o jsonpath='{.spec.template.spec.containers[?(@.name=="redis")].image}' 2>/dev/null || true)
  desired_redis_image=$(grep -m1 '^[[:space:]]*image:' kube/redis/redis-deployment.yml | awk '{print $2}')

  if [[ -n "${current_redis_image}" && -n "${desired_redis_image}" && "${current_redis_image}" != "${desired_redis_image}" ]]; then
    echo "Redis image changed (${current_redis_image} -> ${desired_redis_image}), recycling redis deployment while preserving PVC"

    $kubectl delete deployment redis --ignore-not-found=true

    while $kubectl get pods -l app=redis --no-headers 2>/dev/null | grep -q .; do
      sleep 2
    done
  fi
}

if [[ $1 == 'tear_down' ]]; then
  export KUBE_NAMESPACE=$BRANCH_ENV
  export DRONE_SOURCE_BRANCH=$(cat /root/.dockersock/branch_name.txt)

  $kd --delete -f kube/configmaps/configmap.yml
  $kd --delete -f $redis_runtime_files -f kube/app
  echo "Torn Down Branch - $APP_NAME-$DRONE_SOURCE_BRANCH.internal.branch.sas-notprod.homeoffice.gov.uk"
  exit 0
fi

export KUBE_NAMESPACE=$1
export DRONE_SOURCE_BRANCH=$(echo $DRONE_SOURCE_BRANCH | tr '[:upper:]' '[:lower:]' | tr '/' '-')
export kubectl="kubectl --insecure-skip-tls-verify --server=$KUBE_SERVER --namespace=$KUBE_NAMESPACE --token=$KUBE_TOKEN"

if [[ ${KUBE_NAMESPACE} == ${STG_ENV} ]]; then
  export REDIS_PERSISTENCE_ENABLED=true
  export REDIS_PERSISTENCE_SIZE=1Gi
elif [[ ${KUBE_NAMESPACE} == ${PROD_ENV} ]]; then
  export REDIS_PERSISTENCE_ENABLED=true
  export REDIS_PERSISTENCE_SIZE=5Gi
else
  export REDIS_PERSISTENCE_ENABLED=false
fi

if [[ ${KUBE_NAMESPACE} == ${BRANCH_ENV} ]]; then
  $kd -f kube/file-vault/file-vault-ingress.yml
  $kd -f kube/configmaps -f kube/certs
  $kd -f kube/file-vault -f kube/redis -f kube/app
elif [[ ${KUBE_NAMESPACE} == ${UAT_ENV} ]]; then
  $kd -f kube/file-vault/file-vault-ingress.yml
  $kd -f kube/configmaps/configmap.yml
  $kd -f kube/file-vault -f kube/redis -f kube/app
elif [[ ${KUBE_NAMESPACE} == ${STG_ENV} ]]; then
  recreate_redis_pvc_if_image_changed
  $kd -f kube/file-vault/file-vault-ingress.yml
  $kd -f kube/configmaps/configmap.yml -f kube/app/service.yml
  $kd -f kube/app/networkpolicy-internal.yml -f kube/app/ingress-internal.yml
  $kd -f kube/app/networkpolicy-external.yml -f kube/app/ingress-external.yml
  $kd -f $redis_storage_files
  $kd -f $redis_runtime_files -f kube/file-vault -f kube/app/deployment.yml
elif [[ ${KUBE_NAMESPACE} == ${PROD_ENV} ]]; then
  recreate_redis_pvc_if_image_changed
  $kd -f kube/configmaps/configmap.yml -f kube/app/service.yml
  $kd -f kube/file-vault/file-vault-ingress.yml
  $kd -f kube/app/networkpolicy-external.yml -f kube/app/ingress-external.yml
  $kd -f $redis_storage_files
  $kd -f $redis_runtime_files -f kube/file-vault -f kube/app/deployment.yml
fi

sleep $READY_FOR_TEST_DELAY

if [[ ${KUBE_NAMESPACE} == ${BRANCH_ENV} ]]; then
  echo "Branch - $APP_NAME-$DRONE_SOURCE_BRANCH.internal.branch.sas-notprod.homeoffice.gov.uk"
fi
