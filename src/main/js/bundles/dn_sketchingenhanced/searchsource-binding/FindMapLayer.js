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

import {parseLayerPath} from "agssearch/util";

function _findLayerById(mapWidgetModel, layerPath) {
    let layer = null;
    let path = parseLayerPath(layerPath);
    if (path) {
        layer = mapWidgetModel.map.findLayerById(path.layerId);
        if (path.subLayerId) {
            layer = layer.findSublayerById ? layer.findSublayerById(parseInt(path.subLayerId, 10)) : null;
        }
    }
    return layer;
}

function _getLayerUrl(layer) {
    return layer.parsedUrl ? layer.parsedUrl.path : layer.url;
}

function _findLayerByUrl(layers, url) {
    let layer = null;
    layers && layers.some(item => {
        const sublayers = item.layers || item.allSublayers;
        layer = sublayers ? _findLayerByUrl(sublayers, url) : (_getLayerUrl(item) === url || item.id === url) ? item : null;
        return !!layer;
    });
    return layer;
}

function _getStoreTarget(store) {
    return (store.target || store.layerId + "").replace("/FeatureServer/", "/MapServer/");
}

export default {
    getLayerUrl(layer) {
        return _getLayerUrl(layer);
    },

    findLayer(store, mapWidgetModel) {
        let layer = null;
        if (store.layerId) {
            layer = _findLayerById(mapWidgetModel, store.layerId);
        } else {
            const url = _getStoreTarget(store);
            layer = _findLayerByUrl(mapWidgetModel.map.allLayers, url);
        }

        return layer;
    },

    makeLayerPath(layer) {
        let layerPath = layer.id;
        if (!layer.layerId && !layer.allSublayers && !layer.parsedUrl) {
            while (layer.parent) {
                layer = layer.parent;
                layer.id && (layerPath = layer.id + "/" + layerPath);
            }
        }
        return layerPath;
    }
}
