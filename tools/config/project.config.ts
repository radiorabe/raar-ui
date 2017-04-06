import { join } from 'path';
import { SeedConfig } from './seed.config';

const proxy = require('proxy-middleware');

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  APP_SRC = `src`;
  ASSETS_SRC = `${this.APP_SRC}/assets`;
  CSS_SRC = `${this.APP_SRC}/css`;
  SCSS_SRC = `${this.APP_SRC}/scss`;
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
    'node_modules/bootstrap-sass/assets/fonts/**'
  ];
  ARTIFACT_DEST = 'dist';

  constructor() {
    super();

    this.PLUGIN_CONFIGS['browser-sync'] = {
      port: this.PORT,
      startPath: this.APP_BASE,
      server: {
        baseDir: `${this.DIST_DIR}/empty/`,
        middleware: [
          proxy({
            protocol: 'http:',
            hostname: 'localhost',
            port: 3000,
            pathname: '/',
            route: '/api'
          }),
          require('connect-history-api-fallback')({index: `${this.APP_BASE}index.html`})
        ],
        routes: {
          [`${this.APP_BASE}${this.APP_DEST}`]: this.APP_DEST,
          [`${this.APP_BASE}node_modules`]: 'node_modules',
          [`${this.APP_BASE.replace(/\/$/,'')}`]: this.APP_DEST
        }
      }
    };

    this.APP_TITLE = 'RaBe Archiv';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    this.ENABLE_SCSS = true;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      //{ src: 'moment/min/moment.min.js', inject: 'libs' },
      //{ src: 'moment/locale/de.js', inject: 'libs' },
      //{ src: 'ng2-bootstrap/bundles/ng2-bootstrap.umd.js', inject: 'libs' },
      { src: 'soundmanager2/script/soundmanager2.js', inject: 'libs' }
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    this.SYSTEM_CONFIG_DEV.paths['moment'] = 'node_modules/moment/moment.js';
    //this.SYSTEM_CONFIG_DEV.paths['ng2-bootstrap'] = 'node_modules/ng2-bootstrap/bundles/ng2-bootstrap.umd.js';

    this.APP_ASSETS = [
      { src: `${this.CSS_SRC}/main.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
    ];
  }
}
