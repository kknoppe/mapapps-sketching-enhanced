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
import {declare} from "apprt-core/Mutable";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic";
import * as jsonUtils from "esri/geometry/support/jsonUtils";
import {fromJSON} from "esri/symbols/support/jsonUtils";

const SketchingParameterResolver = declare({

    encodeURLParameter: function () {
        const layers = this._mapWidgetModel.map.allLayers.items;
        let graphicLayers = [];
        layers.forEach( (layer) => {
           if(layer.type === "graphics" && layer.graphics && layer.graphics.length && layer.visible){
               const graphics = layer.graphics.items;
               let gs = [];
               graphics.forEach( (graphic) => {
                   gs.push(graphic.toJSON());
               });

               graphicLayers.push(
                   {
                       id:layer.id,
                       title:layer.title,
                       listMode:layer.listMode,
                       graphics:gs
                   }

               )
           }
        });
        if(graphicLayers.length){
            return {graphics:graphicLayers};
        }
        return null;
    },

    decodeURLParameter: function (params) {
        if(params && params.graphics){
            let mapWidgetModel = this._mapWidgetModel;
            params.graphics.forEach( (graphic) => {
                let graphics = [];
                graphic.graphics.forEach( (g) => {
                   graphics.push(new Graphic({
                        geometry: jsonUtils.fromJSON(g.geometry),
                        symbol: fromJSON(g.symbol),
                        attributes:g.attributes || {}
                    }));

                });
                let layer = new GraphicsLayer({
                    id: graphic.id,
                    title:graphic.title,
                    graphics:graphics,
                     listMode: graphic.listMode
                });
                mapWidgetModel.map.layers.add(layer);
            });
        }
    }

});

export default SketchingParameterResolver;
