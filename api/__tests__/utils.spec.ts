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

import { convertNumToStrFormatForGeoApi, isEmptyValue, isValidLatitude, isValidLongitude } from '../src/libs/utils';

describe('Utils service', () => {
  it('isEmptyValue() works correctly', async () => {
    const item0: null = null;
    expect(isEmptyValue(item0)).toEqual(true);

    const item1: undefined = undefined;
    expect(isEmptyValue(item1)).toEqual(true);

    const item2: string = '';
    expect(isEmptyValue(item2)).toEqual(true);
  });

  it('isValidLongitude() works correctly', async () => {
    const item0: number = -123.711;
    expect(isValidLongitude(item0)).toEqual(true);
  });

  it('isValidLatitude() works correctly', async () => {
    const item0: number = 48.8277;
    expect(isValidLatitude(item0)).toEqual(true);
  });

  it('convertNumToStrFormatForGeoApi() works correctly', async () => {
    const item0: number = 48.8277;
    expect(convertNumToStrFormatForGeoApi(item0)).toEqual('+48.8277');

    const item1: number = -123.711;
    expect(convertNumToStrFormatForGeoApi(item1)).toEqual('-123.711');
  });
});
