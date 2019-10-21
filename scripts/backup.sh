#!/bin/bash

dir_name="./backup/$(date +'%d-%m-%Y')"
host="$host"
username="$username"
password="$password"
authenticationDatabase="$authenticationDatabase"

mongodump --host="$host" \
--readPreference=secondary \
-u="$username" \
-p="$password" \
--authenticationDatabase="$authenticationDatabase" \
--gzip \
--out="$dir_name"

tar --remove-files -cvf "$dir_name.tar.gz" "$dir_name"

find * -type d -ctime +7 | xargs rm -rf