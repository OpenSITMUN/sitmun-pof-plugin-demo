#!/bin/bash
echo
echo "Building script ..."
echo

cd $TRAVIS_BUILD_DIR
./gradlew assemble
./gradlew check