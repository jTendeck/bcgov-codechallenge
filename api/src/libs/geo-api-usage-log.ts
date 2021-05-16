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
import DataManager from '../db';
import { GeoApiUsageLog } from '../db/model/geo-api-usage-log';
import { ChsaResponseSet, QueriedPoint } from '../types';
import shared from './shared';

const dm = new DataManager(shared.pgPool);
const { GeoApiUsageLogModel } = dm;

export const writeGeoApiUsageLog = async (queriedPoint: QueriedPoint, chsaResponseSet: ChsaResponseSet | any): Promise<GeoApiUsageLog> => {
    try {
        const { CMNTY_HLTH_SERV_AREA_CODE, CMNTY_HLTH_SERV_AREA_NAME } = chsaResponseSet;
        const { latitude, longitude } = queriedPoint;

        return await GeoApiUsageLogModel.create({
            queriedLongitude: longitude,
            queriedLatitude: latitude,
            resultChsaCode: CMNTY_HLTH_SERV_AREA_CODE,
            resultChsaName: CMNTY_HLTH_SERV_AREA_NAME,
        });
    } catch (err) {
        const message = `unable to write geo api usage log for querying ${JSON.stringify(queriedPoint)}`;
        logger.error(`${message}, err = ${err.message}`);

        throw err;
    }
};
