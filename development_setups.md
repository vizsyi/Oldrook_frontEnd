## Init sass
- Checking the version:
node -v
- Creating a package.json file:
npm init

## Installing live-server globally
npm install live-server -g

## Setting up a simple build process
npm install node-sass --save-dev
npm install concat --save-dev
npm install autoprefixer --save-dev
npm install postcss-cli --save-dev
npm install npm-run-all --save-dev

## Setting up development tools
npm install eslint --save-dev
### Prettier
npm install --save-dev prettier
echo {} > .prettierrc
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
### Stylelint
npm install --save-dev stylelint stylelint-scss stylelint-config-standard-scss

## Installing dependencies
npm install

## Init Express
npm init -y
npm install express

## Start Express
node index.js

## Dockerizing
1. create Dockerfile
2. create .dockerignore file
