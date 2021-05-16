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

import { errorWithCode, logger } from '@bcgov/common-nodejs-utils';
import axios, { AxiosInstance } from 'axios';
import { GEO_API_CALL } from '../constants';
import { ChsaFeature, ChsaPayload, ChsaResponseSet, Options, QueriedPoint } from '../types';
import { convertNumToStrFormatForGeoApi } from './utils';

export default class GeoApiService {
  private axi: AxiosInstance;

  constructor(options: Options) {
    this.axi = axios.create({
      baseURL: options.baseURL,
    });
  }
  public async fetchChsaResponseSet(queriedPoint: QueriedPoint): Promise<ChsaResponseSet> {
    const { longitude, latitude } = queriedPoint;
    const longStr = convertNumToStrFormatForGeoApi(longitude);
    const latStr = convertNumToStrFormatForGeoApi(latitude);

    // TOODO: investigate the reason when cql_filter field is included in params
    // axios call somehow cause geo api throw an exception re parsing cql_filter
    const params = {
      service: GEO_API_CALL.SERVICE,
      version: GEO_API_CALL.VERSION,
      request: GEO_API_CALL.REQUEST,
      typeName: GEO_API_CALL.TYPE_NAME,
      srsname: GEO_API_CALL.SRS_NAME,
      propertyName: GEO_API_CALL.PROPERTY_NAME,
      outputFormat: GEO_API_CALL.OUTPUT_FORMAT,
    };

    try {
      const response = await this.axi.get(`ows?cql_filter=INTERSECTS(SHAPE,SRID=4326;POINT(${longStr}${latStr}))`, {
        headers: {
          'content-type': 'application/json',
        },
        params,
      });

      // TODO: implement a solution for 'content-type' / 'Content-Type' issue

      // when geo api returns 200 but with a static page that shows certain exceptions
      const contentType = response.headers['content-type'];
      if (!(contentType && contentType.includes('application/json'))) {
        throw errorWithCode('unable to query chsa response set', 500);
      }

      const payload: ChsaPayload = response.data;
      logger.info(`successfully received chsa payload (${JSON.stringify(payload)})`);
      const features: ChsaFeature[] = payload.features;

      // when geo api receives syntactically valid point but is outside of BC
      if (features.length === 0) {
        throw errorWithCode(`invalid longtitude and latitude for a BC location,\
        you can use google map to search for the correct and try again `, 422);
      }

      // when geo api receives valid point
      const { properties: { CMNTY_HLTH_SERV_AREA_CODE, CMNTY_HLTH_SERV_AREA_NAME } } = features[0];
      return { CMNTY_HLTH_SERV_AREA_CODE, CMNTY_HLTH_SERV_AREA_NAME };
    } catch (err) {
      return errorWithCode(err.message, err.code);
    }
  }
}
