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

import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { API } from '../constants';

const useAxios = () => {
  const axiosInstance = useRef<AxiosInstance>();

  useEffect(() => {
    axiosInstance.current = axios.create({
      baseURL: API.BASE_URL(),
      headers: {
        Accept: 'application/json',
      },
    });

    return () => {
      axiosInstance.current = undefined;
    };
  }, []);

  return axiosInstance;
};

const errorMsg = 'axios instance not initialized';

export default function useApi() {
  const axiosInstance = useAxios();

  const queryChsaResponseSet = async (queriedPoint: any): Promise<AxiosResponse<any>> => {
    if (!axiosInstance.current) {
      throw new Error(errorMsg);
    } else {
      return axiosInstance.current.post('chsa', queriedPoint);
    }
  };

  return {
    queryChsaResponseSet,
  };
}
