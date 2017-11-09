#!/bin/bash
cd $TRAVIS_BUILD_DIR

./gradlew assemble

#gradlew clean bootRun no termina (lanza un servidor)
./gradlew check # Necesitamos que termine para probar
