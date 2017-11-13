import { join } from 'path';
import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

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

  PROXY_MIDDLEWARE = proxy({
    protocol: 'http:',
    hostname: 'localhost',
    port: 3000,
    pathname: '/',
    route: '/api'
  });

  constructor() {
    super();

    this.APP_TITLE = 'RaBe Archiv';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    this.ENABLE_SCSS = true;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      { src: 'soundmanager2/script/soundmanager2.js', inject: 'libs' }
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    this.APP_ASSETS = [
      { src: `${this.CSS_SRC}/main.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
    ];

    this.SYSTEM_BUILDER_CONFIG.paths['dist/tmp/app/*'] = 'dist/tmp/app/*';
    this.SYSTEM_CONFIG_DEV.packages['/app'] = { defaultExtension: 'js' };

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
      { 'node_modules/ng2-date-picker/index.js': [ 'DpDatePickerModule' ] }
    ];

    // Add packages (e.g. ng2-translate)
    let additionalPackages: ExtendPackages[] = [
      {
        name: 'ng2-date-picker',
        path: 'node_modules/ng2-date-picker',
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },

      {
        name:'moment',
        path:'node_modules/moment',
        packageMeta: {
          main: 'moment.js',
          defaultExtension: 'js'
        }
      },

      {
        name: 'ngx-infinite-scroll',
        path: 'node_modules/ngx-infinite-scroll/bundles/ngx-infinite-scroll.umd.min.js'
      }
    ];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }
}
