# Builds project using TypeScript Compiler into ./dist folder
build:
	tsc
#	tsc --project tsconfig.json

# Runs project using Node.js
run:
	node dist/index.js

# Run tests on project
# test:
# 	jest

# Remove current compiled project files
clean: rm -rf dist

# Build and run project
start: build run