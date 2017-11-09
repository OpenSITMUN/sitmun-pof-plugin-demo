#!/bin/bash

$TRAVIS_BUILD_DIR/gradlew assemble

#gradlew clean bootRun no termina (lanza un servidor)
$TRAVIS_BUILD_DIR/gradlew check # Necesitamos que termine para probar
