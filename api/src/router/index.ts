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

import cors from 'cors';
import config from '../config';
import chsa from './routes/chsa';
import ehlo from './routes/ehlo';

const corsOptions = {
  origin: config.get('environment') === 'development' ? '*' : config.get('apiUrl'),
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export const router = app => {
  app.use(cors(corsOptions));
  app.use('/api/v1/ehlo', ehlo); // probes
  app.use('/api/v1/chsa', chsa); // chsa resources
};
