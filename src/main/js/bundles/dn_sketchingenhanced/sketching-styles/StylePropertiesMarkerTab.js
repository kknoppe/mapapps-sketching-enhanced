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
        const i18n = this._i18n.get().ui.styleProperties;
        this.dataformjson = props.dataformjson || {
            "dataform-version": "1.0.0",
            "type": "gridpanel",
            "showLabels": true,
            "cols": 1,
            "children": [
                {
                    "type": "selectbox",
                    "field": "markerStyle",
                    "title": i18n.marker.style,
                    "searchAttribute": "name",
                    "labelAttribute": "name",
                    "values": [
                        {
                            "name": i18n.marker.styleval.circle,
                            "value": "circle"
                        }, {
                            "name": i18n.marker.styleval.square,
                            "value": "square"
                        },
                        {
                            "name": i18n.marker.styleval.cross,
                            "value": "cross"
                        },
                        {
                            "name": i18n.marker.styleval.x,
                            "value": "x"
                        },
                        {
                            "name": i18n.marker.styleval.diamond,
                            "value": "diamond"
                        },
                        {
                            "name": i18n.marker.styleval.triangle,
                            "value": "triangle"
                        }
                    ]
                },
                {
                    "type": "numberspinner",
                    "field": "markerSize",
                    "title": i18n.marker.size,
                    "min": 1,
                    "max": 100
                },
                {
                    "type": "numberspinner",
                    "field": "markerAngle",
                    "title": i18n.marker.angle,
                    "min": 0,
                    "max": 360
                },
                {
                    "type": "borderpanel",
                    "colspan": 1,
                    "label": i18n.symbol.fill.color,
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
                                    "value": i18n.symbol.fill.transparency
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
            ]
        };
    }
});