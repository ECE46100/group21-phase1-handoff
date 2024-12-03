# Define variables
SRC_DIR=src
OUT_DIR=dist
ARGS= 

all: build run
test: build professor-tests
	
# Builds project using TypeScript Compiler into ./dist folder
build:
	npx tsc
#	tsc --project tsconfig.json

# Runs project using Node.js
run2:
	@node $(OUT_DIR)/index.js $(ARGS)

# Run tests with vitest on project
tests: build
	npm test --silent || [ $$? -eq 1 ] || exit 1

# Run tests on project
professor-tests:
	@echo "-> Running Professor Test Cases"
	@echo "-> CASE 1/6"
	node $(OUT_DIR)/index.js "https://www.npmjs.com/package/wat4hjs"
	@echo "-> CASE 2/6"
	node $(OUT_DIR)/index.js "https://github.com/mrdoob/three.js/"
	@echo "-> CASE 3/6"
	node $(OUT_DIR)/index.js "https://www.npmjs.com/package/socket.io"
	@echo "-> CASE 4/6"
	node $(OUT_DIR)/index.js "https://github.com/prathameshnetake/libvlc"
	@echo "-> CASE 5/6"
	node $(OUT_DIR)/index.js "https://www.npmjs.com/package/react"
	@echo "-> CASE 6/6"
	node $(OUT_DIR)/index.js "https://www.npmjs.com/package/unlicensed"

# Remove current compiled project files
clean: 
	rm -rf $(OUT_DIR)