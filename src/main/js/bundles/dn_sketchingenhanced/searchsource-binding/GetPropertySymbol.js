/*
 * Copyright (C) 2020 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*** SKIP-SONARQUBE-ANALYSIS ***/
/*
 * Copyright (C) con terra GmbH
 */

import ct_array from "ct/array";

function getPropertySymbol(name, obj) {
    const sbs = Object.getOwnPropertySymbols(obj);
    return sbs && ct_array.arraySearchFirst(sbs, sb => {
        return sb.toString() === name;
    });
}

function getSymbolProperty(name, obj) {
    const symbol = getPropertySymbol(name, obj);
    return symbol && obj[symbol];
}

export {getPropertySymbol, getSymbolProperty};