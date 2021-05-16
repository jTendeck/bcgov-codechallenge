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
import { Request, Response } from 'express';
import { writeGeoApiUsageLog } from '../libs/geo-api-usage-log';
import shared from '../libs/shared';
import { isEmptyValue, isValidLatitude, isValidLongitude, writeToDbSuccessCallback } from '../libs/utils';
import { ChsaResponseSet, QueriedPoint } from '../types';

export const queryChsaResponseSet = async (req: Request, res: Response): Promise<void> => {
  const { body: { longitude, latitude }, body } = req;
  const rv: Error | undefined = validate(body);
  if (rv) {
    throw rv;
  }

  try {
    const queriedPoint: QueriedPoint = { longitude, latitude };
    const rv1: Error | ChsaResponseSet = await shared.geo.fetchChsaResponseSet(queriedPoint);

    if (rv1 instanceof Error) {
      writeGeoApiUsageLog(queriedPoint, {}).then(writeToDbSuccessCallback);
      throw rv1;
    } else {
      writeGeoApiUsageLog(queriedPoint, rv1).then(writeToDbSuccessCallback);
      res.status(200).json(rv1);
    }
  } catch (err) {
    const message = 'unable to query chsa response set';
    logger.error(`${message}, err = ${err.message}`);

    throw errorWithCode(err.message, err.code);
  }
};

const validate = (body: any): Error | undefined => {
  const { longitude, latitude } = body;

  if (isEmptyValue(longitude) || isEmptyValue(latitude)) {
    const message = 'missing required fields in body, longitude / latitude input';
    return errorWithCode(message, 400);
  }

  if (!(typeof longitude === 'number' && typeof latitude === 'number')) {
    const message = 'invalid longitude / latitude input, make sure they are (signed) numeric value';
    return errorWithCode(message, 400);
  }

  if (!(isValidLongitude(longitude) && isValidLatitude(latitude))) {
    const message = `invalid longitude / latitude input,\
    make sure the absolute value of longitude is no bigger than 180,\
    and the absolute value of latitude is no bigger than 90`;
    return errorWithCode(message, 400);
  }
  return;
};
