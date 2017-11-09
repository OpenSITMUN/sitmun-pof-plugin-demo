#!/bin/bash

git clone https://github.com/OpenSITMUN/sitmun-pof-plugin-core.git $PLUGIN_DIR/sitmun-pof-plugin-core
cd $PLUGIN_DIR/sitmun-pof-plugin-core
gradlew clean install