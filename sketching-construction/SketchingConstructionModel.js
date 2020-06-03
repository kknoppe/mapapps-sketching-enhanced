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
import declare from "dojo/_base/declare";
import Stateful from "ct/Stateful";

module.exports = declare([Stateful], {
    snap: true,
    angle: 45,
    angleModulus: 45,
    angleTypeRelative: true,
    planarLength: 10,
    use: {
        snap: true,
        angle: false,
        angleModulus: false,
        planarLength: false
    },



    _getOption(prop, checkUse = true, invalidValue = undefined) {
        return (!checkUse || this.use[prop]) && this[prop] || invalidValue;
    }
});
