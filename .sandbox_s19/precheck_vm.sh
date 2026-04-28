#!/usr/bin/env bash
# Precheck VM (slide 26)
echo "Kernel: $(uname -r)"
echo "CPU(s): $(nproc)"
echo "RAM MB: $(free -m | awk '/Mem:/ {print $2}')"