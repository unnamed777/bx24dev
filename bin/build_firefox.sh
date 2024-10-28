#/bin/bash
npm run build
jq 'del(.background.service_worker)' manifest.json > manifest.tmp && mv manifest.tmp manifest.json
jq 'del(.sandbox)' manifest.json > manifest.tmp && mv manifest.tmp manifest.json
jq 'del(.content_security_policy.sandbox)' manifest.json > manifest.tmp && mv manifest.tmp manifest.json
web-ext sign \
    --source-dir ./dist \
    --artifacts-dir ./dist/web-ext-artifacts \
    --api-key=$(cut -d' ' -f 1 ./bin/.mozilla_credentials) \
    --api-secret=$(cut -d' ' -f 2 ./bin/.mozilla_credentials)