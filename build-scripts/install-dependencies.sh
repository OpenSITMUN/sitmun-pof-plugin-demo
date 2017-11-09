#!/bin/bash
if [ -z $PLUGIN_DIR ]; then
    PLUGIN_DIR=$(mktemp -d)
fi

echo
echo "Install dependencies script ..."
echo

git clone https://github.com/OpenSITMUN/sitmun-pof-plugin-core.git $PLUGIN_DIR/sitmun-pof-plugin-core
cd $PLUGIN_DIR/sitmun-pof-plugin-core
./gradlew clean install