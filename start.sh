#!/bin/sh

respath=default

if [ -n "$1" ]
then
    respath=$1
fi


createAppJsObj account main.js $1

