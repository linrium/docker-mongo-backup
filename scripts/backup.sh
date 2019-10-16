#!/bin/bash

dir_name="$(date +'%d-%m-%Y')"
host="$host"
username="$username"
password="$password"
authenticationDatabase="$authenticationDatabase"
output="$output"

mongo_dump="$(cat <<-EOF
  cd ./backup

  mongodump --host="$host" \
  --readPreference=secondary \
  -u="$username" \
  -p="$password" \
  --authenticationDatabase="$authenticationDatabase" \
  --gzip \
  --out="$dir_name"

  tar -zcvf "$dir_name".tar.gz --remove-files $dir_name
  find * -type d -ctime +7 | xargs rm -rf
EOF
)"

docker run \
--rm \
--name mongo \
-p 27018:27017 \
-v "$output":/backup \
mongo:4.0.0 \
bash -c "echo \"$mongo_dump\" | bash"