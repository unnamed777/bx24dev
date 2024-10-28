#/bin/bash
npm run build

jq 'del(.background.service_worker)' ./dist/manifest.json > ./dist/manifest.tmp && mv ./dist/manifest.tmp ./dist/manifest.json
jq 'del(.sandbox)' ./dist/manifest.json > ./dist/manifest.tmp && mv ./dist/manifest.tmp ./dist/manifest.json
jq 'del(.content_security_policy.sandbox)' ./dist/manifest.json > ./dist/manifest.tmp && mv ./dist/manifest.tmp ./dist/manifest.json

web-ext sign \
    --source-dir ./dist \
    --artifacts-dir ./dist/web-ext-artifacts \
    --api-key=$(cut -d' ' -f 1 ./bin/.mozilla_credentials) \
    --api-secret=$(cut -d' ' -f 2 ./bin/.mozilla_credentials) \
    --channel listed