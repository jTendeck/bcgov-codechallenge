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

// extra check_empty function is needed
// because lodash isEmpty seems to produce confusing results
// e.g. lodash.isEmpty(true) OR lodash.isEmpty(1) yields true
export const isEmptyValue = (value: any): boolean => {
  return value === undefined || value === null || value === ''
    || (typeof value === 'object' && Object.keys(value).length === 0)
};

export const isValidLongitude = (longitude: number): boolean => {
  if (typeof longitude !== 'number') {
    throw new Error('invalid argument to isValidLongitude function');
  }

  return isFinite(longitude) && Math.abs(longitude) <= 180;
};

export const isValidLatitude = (latitude: number): boolean => {
  if (typeof latitude !== 'number') {
    throw new Error('invalid argument to isValidLatitude function');
  }

  return isFinite(latitude) && Math.abs(latitude) <= 90;
};

export const convertNumToStrFormatForGeoApi = (value: number): string => {
  if (typeof value !== 'number') {
    throw new Error('invalid argument to convertNumToStrFormatForGeoApi function');
  }

  if (value >= 0) {
    return `+${value.toString()}`;
  } else {
    return value.toString();
  }
};

export const writeToDbSuccessCallback = (log: any): void => {
  try {
    logger.info(`successfully wrote log (${JSON.stringify(log)})`);
  } catch (err) {
    logger.error(`unable to process writeToDbSuccessCallback routine`);
  }
};
