#/bin/bash
npm run build
web-ext sign \
    --source-dir ./dist \
    --artifacts-dir ./dist/web-ext-artifacts \
    --api-key=$(cut -d' ' -f 1 ./bin/.mozilla_credentials) \
    --api-secret=$(cut -d' ' -f 2 ./bin/.mozilla_credentials)