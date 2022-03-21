#/bin/bash
npm run build
rm -rf ./dist_chrome
cp -R ./dist dist_chrome
rm -rf ./dist_chrome/web-ext-artifacts
rm -rf ./dist_chrome/.web-extension-id
sed -i '' -e 's/"storage",/"storage"/' -e '/contextualIdentities/d' ./dist_chrome/manifest.json
cd ./dist_chrome && zip -r dist.zip * && cd ..
