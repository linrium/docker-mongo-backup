#!/bin/bash

dir_name="./backup/$(date +'%d-%m-%Y')"
host="flexiplus-repl-staging/51.89.23.115:27030,164.132.107.184:27031,51.38.64.139:27032"
username="59c08667-ec9a-47eb-891b-271880c6c141"
password="03a0909a-03bf-47cb-b404-021e1d7632a6"
authenticationDatabase="admin"
output="$output"

mongodump --host="$host" \
--readPreference=secondary \
-u="$username" \
-p="$password" \
--authenticationDatabase="$authenticationDatabase" \
--gzip \
--out="$dir_name" &
tar --remove-files -cvf "$dir_name.tar.gz" "$dir_name" &
find * -type d -ctime +7 | xargs rm -rf