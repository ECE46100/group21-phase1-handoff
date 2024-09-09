# ECE461 Team Project

## Important Install Note

When installing dependencies, if errors, use:

- npm uninstall @types/node

and then

- npm install @types/node@18 --savedev

## Makefile Usage:

make build                  - build program into dist/

make run ARGS="\_\_\_"      - run program in dist/ with ARGS "\_\_\_"

make ARGS="\_\_\_"          - build and run program with ARGS "\_\_\_"

### Old Method 

Currently invoke methods as such:

Step 1. Compile: npx tsc

Step 2. Invoke:
node dist/cli.js install
node dist/cli.js sample_url

## Contributors:
- Trent Calibo
- Ola Kosowska
- Zack Kouba
- Nathan Kap