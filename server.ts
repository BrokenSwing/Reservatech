// import 'zone.js/dist/zone-node';

import * as express from 'express';
import {join} from 'path';
import models from './server/models';
import {apiRoutes} from './server/routes';
import * as bodyParser from 'body-parser';

models.init().then(() => {

  const app = express();

  const PORT = process.env.PORT || 8000;
  const DIST_FOLDER = join(process.cwd(), 'dist/browser');

  // const {AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap} = require('./dist/server/main');

  /* app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  })); */

  // app.set('view engine', 'html');
  // app.set('views', DIST_FOLDER);

  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/api', apiRoutes());

  app.get('*', express.static(DIST_FOLDER, {
    maxAge: '0', // TODO: Change max age
  }));

  app.get('*', (req, res) => {
      // TODO: Add cache policy
      res.sendFile(join(DIST_FOLDER, 'index.html'));
  });


  app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
  });

});
