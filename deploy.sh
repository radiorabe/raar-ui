#!/bin/bash

if [ "admin" == "$1" ]
then
  NAME="admin"
  BASE="/admin/"
elif [ -z "$1" ] || [ "$1" == "archive" ] || [ "$1" == "archiv" ]
then
  NAME="archive"
  BASE="/"
else
  echo "Unrecognized app name '$1'"
  exit 1
fi

# compile code
npm run build.prod.rollup.aot -- --app $NAME --base $BASE

# upload archive
scp dist/raar-ui-$NAME.tar.gz raar@archiv:/var/www/raar-ui${BASE}raar-ui-$NAME.new.tar.gz

# install archive
ssh raar@archiv /bin/bash << EOF
  cd /var/www/raar-ui$BASE
  tar xzf raar-ui-$NAME.new.tar.gz
  if [ -f "raar-ui-$NAME.tar.gz" ]; then
    mv raar-ui-$NAME.tar.gz raar-ui-$NAME.old.tar.gz
  fi
  mv raar-ui-$NAME.new.tar.gz raar-ui-$NAME.tar.gz
  if [ "$NAME" == "admin" ]; then
    sed -i -e 's/RewriteRule . \/index.html/RewriteRule . \/admin\/index.html/' .htaccess
  fi
EOF
