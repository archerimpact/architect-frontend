#!/bin/bash
sudo rm -rf build
sudo npm run build
sudo javascript-obfuscator ./build/static/js/ --output .  --compact true --control-flow-flattening true  --control-flow-flattening-threshold 0.1 --dead-code-injection true --dead-code-injection-threshold 0.1 --disable-console-output true --domain-lock '.archerimpact.com' --self-defending true 
