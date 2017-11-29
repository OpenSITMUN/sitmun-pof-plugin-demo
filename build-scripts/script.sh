#!/bin/bash
echo
echo "Building script ..."
echo

cd $TRAVIS_BUILD_DIR
if ./gradlew assemble; then
    if ./gradlew check; then
        #./gradlew sonarqube
        echo
    else
        echo
        echo "Building script FAILED"
        echo
        return 1
    fi
else
    echo
    echo "Building script FAILED"
    echo
    return 1
fi
