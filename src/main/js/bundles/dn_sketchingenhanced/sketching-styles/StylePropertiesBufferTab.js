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
import StylePropertiesTab from "./StylePropertiesTab";

module.exports = declare([StylePropertiesTab], {
    activate: function () {
        const props = this._properties;
        this.title = props.title;
        this.childId = props.childId;
        const i18n = this._i18n.get().ui.styleProperties.buffer;
        this.dataformjson = props.dataformjson || {
            "dataform-version": "1.0.0",
            "type": "gridpanel",
            "showLabels": true,
            "cols": 1,
            "children": [
                {
                    "type": "numberspinner",
                    "field": "bufferDistance",
                    "title": i18n.distance
                },
                {
                    "type": "selectbox",
                    "field": "bufferUnit",
                    "searchAttribute": "name",
                    "labelAttribute": "name",
                    "title": i18n.unit,
                    "values": [
                        {
                            "name": i18n.units.meters,
                            "value": "meters"
                        }
                    ]
                }
            ]
        };
    }
});