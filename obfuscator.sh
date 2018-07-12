#!/bin/bash
sudo rm -rf build
sudo npm run build
sudo javascript-obfuscator ./build/static/js/ --output . --control-flow-flattening true --dead-code-injection true --dead-code-injection-threshold 0.1 --transform-object-keys true  --disable-console-output true --string-array true 
