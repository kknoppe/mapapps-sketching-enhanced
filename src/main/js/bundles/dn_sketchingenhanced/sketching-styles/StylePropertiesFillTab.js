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
        const i18n = this._i18n.get().ui.styleProperties.symbol;
        this.dataformjson = props.dataformjson || {
            "dataform-version": "1.0.0",
            "type": "gridpanel",
            "showLabels": true,
            "cols": 1,
            "children": [
                {
                    "type": "borderpanel",
                    "colspan": 1,
                    "label": i18n.fill.color,
                    "size": {
                        "h": 31,
                        "w": "15em"
                    },
                    "children": [
                        {
                            "type": "panel",
                            "region": "left",
                            "size": {
                                "w": 65
                            },
                            "children": [
                                {
                                    "type": "colorpicker",
                                    "field": "fillColor",
                                    "animatePoint": false,
                                    "showHsv": true,
                                    "webSafe": false,
                                    "showRgb": true,
                                    "asDropDown": true
                                }
                            ]
                        },
                        {
                            "type": "panel",
                            "region": "center",
                            "children": [
                                {
                                    "type": "label",
                                    "spanLabel": true,
                                    "value": i18n.fill.transparency
                                },
                                {
                                    "type": "numberspinner",
                                    "field": "fillTransparency",
                                    "min": 0,
                                    "max": 100,
                                    "size": {
                                        "w": 80
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "selectbox",
                    "field": "fillStyle",
                    "title": i18n.fill.pattern,
                    "searchAttribute": "name",
                    "labelAttribute": "name",
                    "values": [
                        {
                            "name": i18n.fill.patternval.none,
                            "value": "none"
                        }, {
                            "name": i18n.fill.patternval.solid,
                            "value": "solid"
                        },
                        {
                            "name": i18n.fill.patternval.vertical,
                            "value": "vertical"
                        },
                        {
                            "name": i18n.fill.patternval.horizontal,
                            "value": "horizontal"
                        },
                        {
                            "name": i18n.fill.patternval.backwarddiagonal,
                            "value": "backward-diagonal"
                        },
                        {
                            "name": i18n.fill.patternval.forwarddiagonal,
                            "value": "forward-diagonal"
                        },
                        {
                            "name": i18n.fill.patternval.cross,
                            "value": "cross"
                        },
                        {
                            "name": i18n.fill.patternval.diagonalcross,
                            "value": "diagonal-cross"
                        }
                    ]
                }
            ]
        };
    }
});