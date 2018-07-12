#!/bin/bash
rm -rf ./dist
cp -r ./src ./dist
npm run babel
javascript-obfuscator ./dist/components/Canvas/Graph/package --output . --control-flow-flattening true --dead-code-injection true --dead-code-injection-threshold 0.1 
