#!/bin/bash

# compile code
ng build --prod --extra-webpack-config webpack.extra.js || exit 1

# build tarball
cd dist/raar-ui && tar czf raar-ui.tar.gz *

# upload archive
scp dist/raar-ui/raar-ui.tar.gz raar@archiv:/var/www/raar-ui/raar-ui.new.tar.gz

# install archive
ssh raar@archiv /bin/bash << EOF
  cd /var/www/raar-ui/
  tar xzf raar-ui.new.tar.gz
  if [ -f "raar-ui.tar.gz" ]; then
    mv raar-ui.tar.gz raar-ui.old.tar.gz
  fi
  mv raar-ui.new.tar.gz raar-ui.tar.gz
  if [ "$NAME" == "admin" ]; then
    sed -i -e 's/RewriteRule . \/index.html/RewriteRule . \/admin\/index.html/' .htaccess
  fi
EOF
