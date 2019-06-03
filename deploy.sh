#!/bin/bash

# compile code
npm run build:prod || exit 1

# upload archive
scp dist/raar-ui.tar.gz raar@archiv:/var/www/raar-ui/raar-ui.new.tar.gz

# install archive
ssh raar@archiv /bin/bash << EOF
  cd /var/www/raar-ui/
  tar xzf raar-ui.new.tar.gz
  if [ -f "raar-ui.tar.gz" ]; then
    mv raar-ui.tar.gz raar-ui.old.tar.gz
  fi
  mv raar-ui.new.tar.gz raar-ui.tar.gz
EOF
