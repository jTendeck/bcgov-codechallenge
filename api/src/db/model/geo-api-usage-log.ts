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

import { logger } from '@bcgov/common-nodejs-utils';
import { Pool } from 'pg';
import { CommonFields, Model } from './model';

export interface GeoApiUsageLog extends CommonFields {
  queriedLongitude: number;
  queriedLatitude: number;
  resultChsaCode?: string;
  resultChsaName?: string;
}

export default class GeoApiUsageLogModel extends Model {
  table: string = 'geo_api_usage_log';
  requiredFields: string[] = [
    'queriedLongitude',
    'queriedLatitude',
  ];
  pool: Pool;

  constructor(pool: any) {
    super();
    this.pool = pool;
  }

  async create(data: GeoApiUsageLog): Promise<GeoApiUsageLog> {
    const query = {
      text: `
        INSERT INTO ${this.table}
          (queried_longitude, queried_latitude, result_chsa_code, result_chsa_name)
          VALUES ($1, $2, $3, $4) RETURNING *;`,
      values: [
        data.queriedLongitude,
        data.queriedLatitude,
        data.resultChsaCode,
        data.resultChsaName,
      ],
    };

    try {
      const results = await this.runQuery(query);
      return results.pop();
    } catch (err) {
      const message = `Unable to create GeoApiUsageLog`;
      logger.error(`${message}, err = ${err.message}`);

      throw err;
    }
  }

  async delete(id: number): Promise<GeoApiUsageLog> {
    const query = {
      text: `
            UPDATE ${this.table}
              SET
                archived = true
              WHERE id = ${id}
              RETURNING *;
          `,
    };

    try {
      const results = await this.runQuery(query);
      return results.pop();
    } catch (err) {
      const message = `Unable to archive GeoApiUsageLog`;
      logger.error(`${message}, err = ${err.message}`);

      throw err;
    }
  }
}
