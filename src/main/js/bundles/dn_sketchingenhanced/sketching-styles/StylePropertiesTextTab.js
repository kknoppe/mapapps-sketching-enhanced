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
        const i18n = this._i18n.get().ui.styleProperties.text;
        const fontNames = props.fontNames || ["Arial", "Times", "Verdana"];
        this.dataformjson = props.dataformjson || {
            "dataform-version": "1.0.0",
            "type": "gridpanel",
            "showLabels": true,
            "cols": 1,
            "children": [
                {
                    "type": "selectbox",
                    "field": "fontFamily",
                    "title": i18n.fontFamily,
                    "values": fontNames
                },
                // {
                //     "type": "selectbox",
                //     "field": "textVerticalAlignment",
                //     "title": i18n.textVerticalAlignment,
                //     "values": ["baseline","top","middle","bottom"]
                // },
                // {
                //     "type": "selectbox",
                //     "field": "textHorizontalAlignment",
                //     "title": i18n.textHorizontalAlignment,
                //     "values": ["left","right","center","justify"]
                // },
                {
                    "type": "numberspinner",
                    "field": "fontSize",
                    "title": i18n.fontSize,
                    "min": 5,
                    "max": 100
                },
                // textRightToLeft: false,
                // textRotated: false,
                // textKerning: true,
                // {
                //     "type": "numberspinner",
                //     "field": "textAngle",
                //     "title": i18n.textAngle,
                //     "min": 0,
                //     "max": 360
                // },
                {
                    "type": "panel",
                    "title": i18n.fontStyle.title,
                    "children": [
                        {
                            "type": "togglebutton",
                            "field": "fontWeight",
                            "value": "normal",
                            "uncheckedValue": "normal",
                            "noDataTypeCheck": true,
                            "iconClass": "dijitEditorIcon dijitEditorIconBold",
                            "label": i18n.fontStyle.bold,
                            "size": {
                                "l": 0
                            }
                        },
                        {
                            "type": "togglebutton",
                            "field": "fontStyle",
                            "value": "italic",
                            "uncheckedValue": "normal",
                            "noDataTypeCheck": true,
                            "iconClass": "dijitEditorIcon dijitEditorIconItalic",
                            "label": i18n.fontStyle.italic,
                            "size": {
                                "l": 30
                            }
                        }
                        // {
                        //     "type": "togglebutton",
                        //     "field": "fontDecoration",
                        //     "value": "underline",
                        //     "uncheckedValue": "none",
                        //     "noDataTypeCheck": true,
                        //     "iconClass": "dijitEditorIcon dijitEditorIconUnderline",
                        //     "label": i18n.fontStyle.underlined,
                        //     "size": {
                        //         "l": 60
                        //     }
                        // }
                    ]
                },

                //text color
                {
                    "type": "borderpanel",
                    "colspan": 1,
                    "label": i18n.textColor,
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
                                    "field": "textColor",
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
                                    "value": i18n.textTransparency
                                },
                                {
                                    "type": "numberspinner",
                                    "field": "textTransparency",
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
                //textBackgroundColor
                // {
                //     "type": "borderpanel",
                //     "colspan": 1,
                //     "label": i18n.textBackgroundColor,
                //     "size": {
                //         "h": 31,
                //         "w": "15em"
                //     },
                //     "children": [
                //         {
                //             "type": "panel",
                //             "region": "left",
                //             "size": {
                //                 "w": 65
                //             },
                //             "children": [
                //                 {
                //                     "type": "colorpicker",
                //                     "field": "textBackgroundColor",
                //                     "animatePoint": false,
                //                     "showHsv": true,
                //                     "webSafe": false,
                //                     "showRgb": true,
                //                     "asDropDown": true
                //                 }
                //             ]
                //         },
                //         {
                //             "type": "panel",
                //             "region": "center",
                //             "children": [
                //                 {
                //                     "type": "label",
                //                     "spanLabel": true,
                //                     "value": i18n.textTransparency
                //                 },
                //                 {
                //                     "type": "numberspinner",
                //                     "field": "textBackgroundTransparency",
                //                     "min": 0,
                //                     "max": 100,
                //                     "size": {
                //                         "w": 80
                //                     }
                //                 }
                //             ]
                //         }
                //     ]
                // },

                //textBorderLine
                // {
                //     "type": "numberspinner",
                //     "field": "textBorderLineSize",
                //     "title": i18n.textBorderLineSize,
                //     "min": 0,
                //     "max": 50
                // },
                // {
                //     "type": "borderpanel",
                //     "colspan": 1,
                //     "label": i18n.textBorderLineColor,
                //     "size": {
                //         "h": 31,
                //         "w": "15em"
                //     },
                //     "children": [
                //         {
                //             "type": "panel",
                //             "region": "left",
                //             "size": {
                //                 "w": 65
                //             },
                //             "children": [
                //                 {
                //                     "type": "colorpicker",
                //                     "field": "textBorderLineColor",
                //                     "animatePoint": false,
                //                     "showHsv": true,
                //                     "webSafe": false,
                //                     "showRgb": true,
                //                     "asDropDown": true
                //                 }
                //             ]
                //         },
                //         {
                //             "type": "panel",
                //             "region": "center",
                //             "children": [
                //                 {
                //                     "type": "label",
                //                     "spanLabel": true,
                //                     "value": i18n.textTransparency
                //                 },
                //                 {
                //                     "type": "numberspinner",
                //                     "field": "textBorderLineTransparency",
                //                     "min": 0,
                //                     "max": 100,
                //                     "size": {
                //                         "w": 80
                //                     }
                //                 }
                //             ]
                //         }
                //     ]
                // },

                //textHalo
                // {
                //     "type": "numberspinner",
                //     "field": "textBorderLineSize",
                //     "title": i18n.textHaloSize,
                //     "min": 0,
                //     "max": 50
                // },
                // {
                //     "type": "borderpanel",
                //     "colspan": 1,
                //     "label": i18n.textHaloColor,
                //     "size": {
                //         "h": 31,
                //         "w": "15em"
                //     },
                //     "children": [
                //         {
                //             "type": "panel",
                //             "region": "left",
                //             "size": {
                //                 "w": 65
                //             },
                //             "children": [
                //                 {
                //                     "type": "colorpicker",
                //                     "field": "textHalo",
                //                     "animatePoint": false,
                //                     "showHsv": true,
                //                     "webSafe": false,
                //                     "showRgb": true,
                //                     "asDropDown": true
                //                 }
                //             ]
                //         },
                //         {
                //             "type": "panel",
                //             "region": "center",
                //             "children": [
                //                 {
                //                     "type": "label",
                //                     "spanLabel": true,
                //                     "value": i18n.textTransparency
                //                 },
                //                 {
                //                     "type": "numberspinner",
                //                     "field": "textHaloTransparency",
                //                     "min": 0,
                //                     "max": 100,
                //                     "size": {
                //                         "w": 80
                //                     }
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ]
        };
    }
});