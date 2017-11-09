#!/bin/bash
git clone https://github.com/OpenSITMUN/sitmun-pof-plugin-core.git $PLUGIN1DIR

$PLUGIN1DIR/gradlew clean install
