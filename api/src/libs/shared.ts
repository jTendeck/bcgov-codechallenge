//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict';

import { Pool } from 'pg';
import config from '../config';
import { Options } from '../types';
import { default as GeoApiService } from './geo-api-service';

interface Shared {
  pgPool: Pool;
  geo: GeoApiService;
}

const pgPoolKey = Symbol.for('chsa.pgpool');
const geoKey = Symbol.for('chsa.geo');

const gs = Object.getOwnPropertySymbols(global);

const main = async () => {
  if (gs.indexOf(geoKey) <= -1) {
    const opts: Options = {
      baseURL: config.get('geo:baseURL'),
    };

    const geo = new GeoApiService(opts);
    global[geoKey] = geo;
  }

  if (gs.indexOf(pgPoolKey) <= -1) {
    const params = {
      host: config.get('db:host'),
      port: config.get('db:port'),
      database: config.get('db:database'),
      user: config.get('db:user'),
      password: config.get('db:password'),
      max: config.get('db:maxConnections'),
      idleTimeoutMillis: config.get('db:idleTimeout'),
      connectionTimeoutMillis: config.get('db:connectionTimeout'),
    }

    global[pgPoolKey] = new Pool(params);
  }
}

main();

const shared = {};

Object.defineProperty(shared, 'geo', {
  get: () => global[geoKey],
});

Object.defineProperty(shared, 'pgPool', {
  get: () => global[pgPoolKey],
});

Object.freeze(shared);

export default shared as Shared;
