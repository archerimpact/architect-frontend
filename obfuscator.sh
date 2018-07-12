#!/bin/bash
sudo rm -rf build
sudo npm run build
sudo javascript-obfuscator ./build/static/js/ --output . --dead-code-injection true --dead-code-injection-threshold 0.1