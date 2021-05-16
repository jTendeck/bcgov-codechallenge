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

import { Label } from '@rebass/forms';
import React from 'react';
import { Field, Form } from 'react-final-form';
import useApi from '../hooks/useApi';
import getValidator from '../utils/getValidator';
import TextInput from './UI/TextInput';

const validator = getValidator();
const convertFormData = (formData: any) => {
  const longitude = parseFloat(formData.longitude);
  const latitude = parseFloat(formData.latitude);

  if (isNaN(longitude) || isNaN(latitude)) {
    throw new Error(
      'invalid longitude / latitude input, make sure they are (signed) numeric value',
    );
  }
  return {
    longitude,
    latitude,
  };
};

const ChsaQueryForm: React.FC = () => {
  const api = useApi();

  const onSubmit = async (formData: any) => {
    try {
      const queriedPoint = convertFormData(formData);

      api
        .queryChsaResponseSet(queriedPoint)
        .then((response) => {
          const chsaName = response.data.CMNTY_HLTH_SERV_AREA_NAME;
          alert(`The name of the corresponding Community Health Service Area: ${chsaName}`);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={(values) => {
        const errors = {};
        return errors;
      }}
    >
      {(formProps) => (
        <form onSubmit={formProps.handleSubmit}>
          Please provide a valid BC location to query Community Health Service Area name.
          <Label htmlFor="longitude">Longitude</Label>
          <Field<string>
            name="longitude"
            component={TextInput}
            validate={validator.mustBeValidLongitude}
            placeholder="-123.711"
          />
          <Label htmlFor="latitude">Latitude</Label>
          <Field<string>
            name="latitude"
            component={TextInput}
            validate={validator.mustBeValidLatitude}
            placeholder="48.8277"
          />
          {/* eslint-disable */}
          <button style={{ display: 'block' }}>Submit</button>
        </form>
      )}
    </Form>
  );
};

export default ChsaQueryForm;
