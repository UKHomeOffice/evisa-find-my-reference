# Prompts: PVC Creation for Redis Persistent Storage

> Context: [PR #62 — FMRF-68: Adding persistent volume storage](https://github.com/UKHomeOffice/evisa-find-my-reference/pull/62)

## Overview

This document describes the prompts, decisions, and configuration introduced to enable
Kubernetes PersistentVolumeClaim (PVC) creation for the Redis deployment.

Without a PVC, Redis data (cache/session state) is stored in an ephemeral `emptyDir`
volume, which is lost whenever the pod restarts, is rescheduled, or crashes. The PVC
ensures data persists across pod lifecycle events.

---

## Environment Variables

The following environment variables control Redis persistence behaviour. They are defined
globally in `.drone.yml` and can be overridden per deployment step.

| Variable                             | Default                       | Description                                                                                     |
|--------------------------------------|-------------------------------|-------------------------------------------------------------------------------------------------|
| `REDIS_PERSISTENCE_ENABLED`          | `"false"`                     | Set to `"true"` to enable PVC-backed Redis storage.                                             |
| `REDIS_PERSISTENCE_SIZE`             | _(none)_                      | Storage size for the PVC (e.g. `1Gi`, `5Gi`). Required when persistence is enabled.            |
| `REDIS_PERSISTENCE_ACCESS_MODES`     | `ReadWriteOnce`               | Kubernetes access mode for the PVC.                                                              |
| `REDIS_PERSISTENCE_STORAGE_CLASS`    | `gp2-encrypted-eu-west-2b`   | Storage class to use. Set to `""` or `"null"` to omit `storageClassName` from the PVC spec.    |
| `REDIS_PERSISTENCE_EXISTING_CLAIM`   | `""`                          | Name of a pre-existing PVC to bind. If set, no new PVC is created.                              |
| `REDIS_PERSISTENCE_ANNOTATIONS_FILE` | `""`                          | Path to a YAML file whose contents are injected as PVC annotations.                              |

### Per-environment overrides (`.drone.yml`)

| Environment | `REDIS_PERSISTENCE_ENABLED` | `REDIS_PERSISTENCE_SIZE` |
|-------------|------------------------------|--------------------------|
| Staging     | `"true"`                     | `1Gi`                    |
| Production  | `"true"`                     | `5Gi`                    |
| Branch/UAT  | `"false"` (default)          | _(not set)_              |

---

## PVC Template (`kube/redis/redis-persistent-volume-claim.yml`)

The PVC is rendered by `kd` (kubernetes deployer) using Go-style template substitution.
The file is only applied when `REDIS_PERSISTENCE_ENABLED` is `"true"`.

```yaml
{{ if eq .REDIS_PERSISTENCE_ENABLED "true" }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  {{ if eq .KUBE_NAMESPACE .BRANCH_ENV }}
  name: redis-pvc-{{ .DRONE_SOURCE_BRANCH }}
  {{ else }}
  name: redis-pvc
  {{ end }}
  {{ if ne .REDIS_PERSISTENCE_ANNOTATIONS_FILE "" }}
  annotations:
{{ file .REDIS_PERSISTENCE_ANNOTATIONS_FILE | indent 4 }}
  {{ end }}
spec:
  accessModes:
    - {{ .REDIS_PERSISTENCE_ACCESS_MODES }}
  {{ if and (ne .REDIS_PERSISTENCE_STORAGE_CLASS "") (ne .REDIS_PERSISTENCE_STORAGE_CLASS "null") }}
  storageClassName: {{ .REDIS_PERSISTENCE_STORAGE_CLASS }}
  {{ end }}
  resources:
    requests:
      storage: {{ .REDIS_PERSISTENCE_SIZE }}
{{ end }}
```

Key behaviours:
- **Branch environments** get a unique PVC named `redis-pvc-<branch>` to avoid collisions.
- **Staging/Production** share a single named PVC `redis-pvc`.
- The PVC is skipped entirely when `REDIS_PERSISTENCE_ENABLED != "true"`, leaving volume
  binding to the `emptyDir` fallback in `redis-deployment.yml`.

---

## Redis Deployment Volume Binding (`kube/redis/redis-deployment.yml`)

The deployment template conditionally mounts the PVC or falls back to `emptyDir`:

```yaml
securityContext:
  fsGroup: 994
  fsGroupChangePolicy: OnRootMismatch
...
volumes:
  {{ if and (eq .REDIS_PERSISTENCE_ENABLED "true") (ne .REDIS_PERSISTENCE_EXISTING_CLAIM "") }}
  - name: data
    persistentVolumeClaim:
      claimName: {{ .REDIS_PERSISTENCE_EXISTING_CLAIM }}
  {{ else if eq .REDIS_PERSISTENCE_ENABLED "true" }}
  - name: data
    persistentVolumeClaim:
      {{ if eq .KUBE_NAMESPACE .BRANCH_ENV }}
      claimName: redis-pvc-{{ .DRONE_SOURCE_BRANCH }}
      {{ else }}
      claimName: redis-pvc
      {{ end }}
  {{ else }}
  - name: data
    emptyDir: {}
  {{ end }}
```

The `fsGroup: 994` security context ensures the Redis process has correct filesystem
permissions on the mounted volume without requiring a full recursive `chown`.

---

## Deployment Sequence (`bin/deploy.sh`)

### Staging and Production

1. **Detect Redis image change** — `recreate_redis_pvc_if_image_changed()` checks whether
   the running Redis image differs from the desired image in `redis-deployment.yml`.
   - If images differ: delete the existing `redis` Deployment and wait for all Redis pods
     to terminate before continuing. The PVC is **not** deleted, so data is preserved.
2. **Apply PVC** — `kd -f kube/redis/redis-persistent-volume-claim.yml`
   - Kubernetes will no-op if the PVC already exists with the same spec (idempotent).
3. **Apply Redis runtime resources** — service, network policy, and deployment.

```bash
# Staging example
recreate_redis_pvc_if_image_changed
$kd -f kube/redis/redis-persistent-volume-claim.yml
$kd -f kube/redis/redis-service.yml \
    -f kube/redis/redis-network-policy.yml \
    -f kube/redis/redis-deployment.yml \
    -f kube/file-vault \
    -f kube/app/deployment.yml
```

### Branch and UAT environments

Persistence is **disabled** (`REDIS_PERSISTENCE_ENABLED=false`). The PVC template renders
empty, so no PVC is created. Redis uses `emptyDir` storage.

### Tear-down

On `tear_down`, only runtime resources (service, network policy, deployment, app) are
deleted. PVCs are **not** removed automatically during tear-down to prevent accidental
data loss.

To explicitly remove Redis PVCs during clean-up, `bin/clean_up.sh` iterates over existing
PVCs and deletes any named `redis-pvc*`:

```bash
for each in $($kubectl get pvc -o jsonpath="{.items[*].metadata.name}"); do
  if [[ ${each} == redis-pvc* ]]; then
    $kubectl delete pvc "$each"
  fi
done
```

---

## Decision Log

| Decision | Rationale |
|---|---|
| PVC applied before Deployment | Ensures the claim exists before the pod tries to bind it, avoiding `Pending` pod state. |
| Delete Deployment (not PVC) on image upgrade | Preserves data while forcing a clean pod restart with the new image. Avoids PVC re-bind issues. |
| `emptyDir` fallback | Branch and UAT environments do not need persistence; this avoids unnecessary storage costs. |
| `fsGroupChangePolicy: OnRootMismatch` | Reduces startup time by skipping recursive permission changes when ownership is already correct. |
| Branch-scoped PVC name | Prevents PVC name collisions when multiple feature branches are deployed simultaneously. |
