//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import validate from 'validate.js';

// TODO: make regex validation work for frontend user convenience
const schema = {
  longitude: {
    presence: { allowEmpty: false, message: 'Required' },
    length: {
      maximum: 40,
      tooLong: 'Max 40 characters',
    },
    // format: {
    //   pattern: '^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,6}',
    //   flags: 'i',
    //   message: 'Must be a valid longitude',
    // },
  },
  latitude: {
    presence: { allowEmpty: false, message: 'Required' },
    length: {
      maximum: 40,
      tooLong: 'Max 40 characters',
    },
    // format: {
    //   pattern: '^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}',
    //   flags: 'i',
    //   message: 'Must be a valid latitude',
    // },
  },
};

export default function getValidator() {
  const mustBeValidLongitude = (value: any) => {
    const errors = validate({ longitude: value }, schema, { fullMessages: false });
    console.log(errors);
    if (errors && errors.longitude) {
      return errors.longitude[0];
    }
  };

  const mustBeValidLatitude = (value: any) => {
    const errors = validate({ latitude: value }, schema, { fullMessages: false });
    console.log(errors);
    if (errors && errors.latitude) {
      return errors.latitude[0];
    }
  };

  return {
    mustBeValidLongitude,
    mustBeValidLatitude,
  };
}
