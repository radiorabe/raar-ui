import { join } from 'path';

import { SeedConfig } from './seed.config';
import { InjectableDependency } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
    'node_modules/bootstrap-sass/assets/fonts/**'
  ];

  constructor() {
    super();
    this.APP_TITLE = 'RaBe Archiv';
    let additional_deps: InjectableDependency[] = [
      //{src: 'intl/dist/Intl.min.js', inject: 'libs'},
      //{src: 'intl/locale-data/jsonp/de-CH.js', inject: 'libs'},
      {src: 'moment/min/moment.min.js', inject: 'libs'},
      {src: 'moment/locale/de.js', inject: 'libs'},
      {src: 'ng2-bootstrap/bundles/ng2-bootstrap.js', inject: 'libs'},
    ];

    const seedDependencies = this.NPM_DEPENDENCIES;

    this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

    this.CSS_PROD_BUNDLE = 'main.css';
    this.APP_ASSETS = [
      { src: `${this.ASSETS_SRC}/main.scss`, inject: true }, // renamed SASS file
    ];
  }
}
