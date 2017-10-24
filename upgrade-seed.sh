#!/bin/bash
# Script for manually upgrading from angular2-seed.
# Try this if you are tired of thousands of merge conflicts
# and other inconsistencies.
# Said that, upgrading is still no fun task.

# clone current seed
git clone https://github.com/mgechev/angular2-seed.git upstream-seed

# copy seed specific files
cp upstream-seed/*.* .
cp upstream-seed/.* .
cp -r upstream-seed/.docker .
cp upstream-seed/src/client/*.* src/
cp upstream-seed/src/client/app/*.* src/app/
cp upstream-seed/tools/*.* tools/
cp upstream-seed/tools/tasks/*.* tools/tasks/
cp upstream-seed/tools/tasks/seed/*.* tools/tasks/seed/
cp upstream-seed/tools/config/seed.* tools/config/
cp upstream-seed/tools/utils/*.* tools/utils/
cp upstream-seed/tools/utils/seed/*.* tools/utils/seed/
cp upstream-seed/tools/manual_typings/seed/*.* tools/manual_typings/seed/
cp upstream-seed/tools/env/*.* tools/env/

# stage seed original files
git add tools/tasks/seed
git add tools/utils/seed
git add tools/utils/seed.utils.ts
git add tools/manual_typings/seed
git add tools/debug.ts
git add tools/README.md
git add tools/config/seed.*

git add docker-compose.*
git add .docker/
git add .dockerignore
git add appveyor.yml

git co -- README.md LICENSE

echo "Upgraded files from upstream seed!"
echo ""
echo "* Please review changes in unstaged files:"
echo "  $ git diff"
echo ""
echo "* Possibly revert changes, especially in src/app/, package.json, .travis.yml"
echo ""
echo "* When everything is ok, upgrade the added libraries:"
echo "  $ yarn upgrade"
echo ""
echo "* Check the app in the browser and the production build, figuring out and"
echo "  trying to fix all the changes in module loading, build process and so on."
echo ""
echo "* Finally, remove upstream-seed/ again:"
echo "  $ rm -rf upstream-seed"
echo ""
echo "* commit & push"
