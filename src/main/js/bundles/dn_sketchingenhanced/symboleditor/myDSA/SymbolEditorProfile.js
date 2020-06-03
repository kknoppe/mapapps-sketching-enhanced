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
import SymbolEditorModel from '../SymbolEditorModel';
import {whenOnce} from 'esri/core/watchUtils';
import LayerSettings from '../LayerSettings';
import on from 'dojo/on';
import LayerRegistryItem from '../model/LayerRegistryItem';

class SymbolEditorProfile {

    /**
     * Get Component name
     */
    getName() {
        return 'symboleditor:symboleditor';
    }

    /**
     * Get Profile information
     */
    getProfile() {
        // return deepcopy of layerRegistry
        const layersToSave = this._registry.getAllLayers()
            .filter(x => !!this._registry.getLayerFromMap(x.settings))
            .map(x => x.settings.appliedState);

        return {
            layerRegistry: JSON.parse(JSON.stringify(layersToSave)),
            categories: [...this._registry._categories],
        };
    }

    /**
     * Apply Profile information
     */
    async applyProfile(profile) {
        if (profile && profile.categories) {
            this._registry._categories = [...profile.categories];
        }
        if (profile && profile.layerRegistry) {
            // apply settings after MyThemes layers are loaded to the map
            const handler = await on(this._loadProfileHandler, 'MyThemesLoaded', () => {
                handler.remove();
                this._applyToLayerRegistry(profile.layerRegistry);
            });
        }
    }

    async _applyToLayerRegistry(layerRegistry) {
        this._registry._allLayers.clear();
        await this._waitForMap();

        await layerRegistry.map(async x => {
            const model = Object.assign(new SymbolEditorModel(), x);
            model.appliedState = new LayerSettings(model);
            model.registry = this._registry;

            model.applyScaling(model.scaleSettings);
            model.applyLabeling(model.labelSettings);
            model.applySymboling(model.symbolSettings);

            this._registry._allLayers.add(new LayerRegistryItem(model));

            // emit event that profile is loaded, so that MyThemes vue component can rerender to show the right status of the symbol editor
            this._eventService && this._eventService.postEvent('dsa/symbolEditorProfile/loadingProfileReady', {message: 'SymbolEditor Profile loaded'});
        });
    }

    _waitForMap() {
        return new Promise(resolve => {
            whenOnce(this._registry._mapWidgetModel, 'ready', () => {
                whenOnce(this._registry._mapWidgetModel.view, 'ready', () => resolve());
            });
        });
    }
}

module.exports = SymbolEditorProfile;
