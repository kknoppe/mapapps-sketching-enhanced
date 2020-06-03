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
                    "type": "numberspinner",
                    "field": "strokeWidth",
                    "title": i18n.stroke.width,
                    "min": 0,
                    "max": 100
                },
                // {
                //     "type": "numberspinner",
                //     "field": "strokeMiterLimit",
                //     "title": i18n.stroke.miterLimit,
                //     "min": 0,
                //     "max": 100
                // },
                {
                    "type": "borderpanel",
                    "colspan": 1,
                    "label": i18n.stroke.color,
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
                                    "field": "strokeColor",
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
                                    "value": i18n.stroke.transparency
                                },
                                {
                                    "type": "numberspinner",
                                    "field": "strokeTransparency",
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
                    "field": "strokeStyle",
                    "searchAttribute": "name",
                    "labelAttribute": "name",
                    "title": i18n.stroke.style,
                    "values": [
                        {
                            "name": i18n.stroke.strokeval.none,
                            "value": "none"
                        }, {
                            "name": "___________________",
                            "value": "solid"
                        },
                        {
                            "name": ". . . . . . . . . . . . . . . . .",
                            "value": "short-dot"
                        },
                        {
                            "name": ".\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0.\u00A0\u00A0\u00A0",
                            "value": "dot"
                        },
                        {
                            "name": "- - - - - - - - - - - - - - -",
                            "value": "short-dash"
                        },
                        {
                            "name": "-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0",
                            "value": "dash"
                        },
                        {
                            "name": "--- --- --- --- --- --- ---",
                            "value": "long-dash"
                        },
                        {
                            "name": "- . - . - . - . - . - . - . - .",
                            "value": "short-dash-dot"
                        },
                        {
                            "name": "-- . -- . -- . -- . -- . -- .",
                            "value": "dash-dot"
                        },
                        {
                            "name": "--- . --- . --- . --- . --- .",
                            "value": "long-dash-dot"
                        },
                        {
                            "name": "- .. - .. - .. - .. - .. - .. -",
                            "value": "short-dash-dot-dot"
                        },
                        {
                            "name": "--- .. --- .. --- .. --- .. ---",
                            "value": "long-dash-dot-dot"
                        }
                    ]
                },
                {
                    "type": "selectbox",
                    "field": "strokeCap",
                    "searchAttribute": "name",
                    "labelAttribute": "name",
                    "title": i18n.stroke.cap,
                    "values": [
                        {
                            "name": i18n.stroke.capval.butt,
                            "value": "butt"
                        },
                        {
                            "name": i18n.stroke.capval.round,
                            "value": "round"
                        },
                        {
                            "name": i18n.stroke.capval.square,
                            "value": "square"
                        }
                    ]
                }
                // {
                //     "type": "selectbox",
                //     "field": "strokeJoin",
                //     "searchAttribute": "name",
                //     "labelAttribute": "name",
                //     "title": i18n.stroke.join,
                //     "values": [
                //         {
                //             "name": i18n.stroke.joinval.bevel,
                //             "value": "bevel"
                //         },
                //         {
                //             "name": i18n.stroke.joinval.miter,
                //             "value": "miter"
                //         },
                //         {
                //             "name": i18n.stroke.joinval.round,
                //             "value": "round"
                //         }
                //     ]
                // }
            ]
        };
    }
});