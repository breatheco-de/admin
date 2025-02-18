# BreatheCode Admin Client v2.0

## If you use Windows install it

```bash
npm install --g --production windows-build-tools --legacy-peer-deps
```

## Use Nodejs v12

## Installation

1. Fork this repository into your account.
2. Clone your fork repository into your computer `git clone https://github.com/<your_github_username>/admin`
3. Switch to the development branch: `git checkout development`.
4. Remember to move to a new branch when you start a new issue: `git checkout -b <new-branch>`
5. Create the .env file following the template on .env.example and make sure to use the development API host. You can use this command: `cp .env.example .env`
6. Install the packages: `npm install --legacy-peer-deps`
7. Start the development server: `npm run start`

## Running the tests

This section is under development.

## For environments problems

1. When your environment variable has problems. You can use this commands:
   a. `source .env`
   b. `echo $REACT_APP_API_HOST`
   c. `npm run start`

## for nvm problems

use:

```
npm --build-from-source install node-pre-gyp
```

## Prettify:

To format document with eslintrc rules run:

```bash
npm run lint:fix
```

Note: you can use the Exlint Prettier plugin and it will do it automatically for you.
