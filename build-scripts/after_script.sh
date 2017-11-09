#!/bin/bash
# Cleanup. Not required on Travis-CI (I think), but important in local builds.
rm --interactive=never -R $PLUGIN1DIR
