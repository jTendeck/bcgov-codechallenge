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

import { queryChsaResponseSet } from '../src/controllers/chsa';
import { isEmptyValue } from '../src/libs/utils';
import FauxExpress from './src/fauxexpress';

jest.mock('../src/libs/utils', () => ({
  isEmptyValue: jest.fn(),
  isValidLongitude: jest.fn(),
  isValidLatitude: jest.fn(),
}));

describe('Chsa resources event handlers', () => {
  let ex;

  beforeEach(() => {
    jest.clearAllMocks();

    ex = new FauxExpress();
  });

  it('Chsa name / code response set is updated upon invalid query', async () => {
    // @ts-ignore
    isEmptyValue.mockReturnValue(true);
    // @ts-ignore
    isEmptyValue.mockReturnValue(true);

    const req = {
      body: {
        test: 'test',
      },
    };

    // @ts-ignore
    await expect(queryChsaResponseSet(req, ex.res)).rejects.toThrow();

    expect(ex.res.status).not.toBeCalled();
    expect(ex.res.json).not.toBeCalled();
  });
});
