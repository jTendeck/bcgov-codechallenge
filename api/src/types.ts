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

export interface Options {
    baseURL: string;
}

export interface QueriedPoint {
    longitude: number;
    latitude: number;
}

export interface ChsaResponseSet {
    CMNTY_HLTH_SERV_AREA_CODE: string;
    CMNTY_HLTH_SERV_AREA_NAME: string;
}

export interface ChsaFeature {
    type: string;
    id: string;
    geometry: any;
    properties: {
        HLTH_CHSA_SYSID: number;
        CMNTY_HLTH_SERV_AREA_CODE: string;
        CMNTY_HLTH_SERV_AREA_NAME: string;
        OBJECTID: number;
    }
}

export interface ChsaPayload {
    type: string;
    features: ChsaFeature[];
    totalFeatures: number;
    numberMatched: number;
    numberReturned: number;
    timeStamp: Date;
    crs: any;
}
