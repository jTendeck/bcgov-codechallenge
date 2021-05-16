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

import mockAxios from 'axios';
import fs from 'fs';
import path from 'path';
import { default as GeoApiService } from '../src/libs/geo-api-service';
import { Options } from '../src/types';

const p0 = path.join(__dirname, 'fixtures/get-geo-api-response-invalid-bc-location.json');
const invalidBCLocationResponse = JSON.parse(fs.readFileSync(p0, 'utf8'));

const p1 = path.join(__dirname, 'fixtures/get-geo-api-response-valid-bc-location.json');
const validBCLocationResponse = JSON.parse(fs.readFileSync(p1, 'utf8'));

describe('Services', () => {
  const options: Options = {
    baseURL: 'something',
  };
  const geo = new GeoApiService(options);
  const headers = {
    'content-type': 'application/json'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TODO - create a test that uses const invalidBCLocationResponse
  // it('queryChsaResponseSet() works correctly for invalid BC location', async () => {
  //
  // });

  it('queryChsaResponseSet() works correctly for valid BC location', async () => {
    const queriedPoint = {
      longitude: -123.711,
      latitude: 48.8277,
    };
    // @ts-ignore
    mockAxios.fn.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: validBCLocationResponse,
        headers,
      })
    );

    const result = await geo.fetchChsaResponseSet(queriedPoint);

    expect(result).toMatchSnapshot();
    // @ts-ignore
    expect(mockAxios.fn.get).toHaveBeenCalledTimes(1);
  });

  it('queryChsaResponseSet() works correctly when the external api responds non success status code', async () => {
    const queriedPoint = {
      longitude: -123.711,
      latitude: 48.8277,
    };
    // @ts-ignore
    mockAxios.fn.post.mockImplementationOnce(() =>
      Promise.reject()
    );

    const result = await geo.fetchChsaResponseSet(queriedPoint);
    expect(result).toMatchSnapshot();
  });

  it('queryChsaResponseSet() works correctly when the external api responds non json', async () => {
    const queriedPoint = {
      longitude: -123.711,
      latitude: 48.8277,
    };

    // @ts-ignore
    mockAxios.fn.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: validBCLocationResponse,
        headers: {
          'content-type': 'text/xml;charset=UTF-8',
        }
      })
    );

    const result = await geo.fetchChsaResponseSet(queriedPoint);
    expect(result).toMatchSnapshot();
  });
});
