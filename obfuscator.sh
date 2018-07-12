#!/bin/bash
sudo rm -rf build
sudo npm run build
sudo javascript-obfuscator ./build/static/js/ --output .  --compact true --dead-code-injection true --dead-code-injection-threshold 0.1  --self-defending true
