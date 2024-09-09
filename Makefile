# Define variables
SRC_DIR=src
OUT_DIR=dist
ARGS= 

all: build run

# Builds project using TypeScript Compiler into ./dist folder
build:
	tsc
#	tsc --project tsconfig.json

# Runs project using Node.js
run:
	node $(OUT_DIR)/index.js $(ARGS)

# Run tests on project
# test:
# 	jest

# Remove current compiled project files
clean: rm -rf $(OUT_DIR)