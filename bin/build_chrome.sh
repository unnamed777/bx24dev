#/bin/bash
npm run build
rm -rf ./dist_chrome
cp -R ./dist dist_chrome
rm -rf ./dist_chrome/web-ext-artifacts
rm -rf ./dist_chrome/.web-extension-id
# Remove Firefox's containers permission
jq 'del(.permissions[] | select(. == "contextualIdentities"))' ./dist_chrome/manifest.json > ./dist_chrome/manifest.tmp && mv ./dist_chrome/manifest.tmp ./dist_chrome/manifest.json
cd ./dist_chrome && zip -r dist.zip * && cd ..
