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
import Vue from 'apprt-vue/Vue';
import SymbolEditorWidget from './SymbolEditorWidget.vue';
import Binding from 'apprt-binding/Binding';

export default class SymbolEditorWidgetFactory {

    activate() {
        const myWidget = SymbolEditorWidget;
        const factory = this;
        // this needs to be done
        SymbolEditorWidgetFactory._createInstance();
        const layerRegistry = this._layerRegistry;

        myWidget.watch.layer = async function () {
            this.watcher && this.watcher.remove();

            if (!this.model || (this.model.id !== this.layer.id)) {
                this.model = await factory._loadModel(this, layerRegistry);
                // refresh binding and reset watcher
                this.binding && this.binding.remove();
                this.binding = factory._createBinding(this, this.model);
                factory._createWatcher(this);
            }
        };

        myWidget.created = async function () {
            if (this.layer && !this.model) {
                this.defaultScales = await layerRegistry._getScales();
                this.model = await factory._loadModel(this, layerRegistry);
                this.registry = layerRegistry;
                // add binding
                this.binding = factory._createBinding(this, this.model);
            }

            factory._createWatcher(this);
        };

        myWidget.destroyed = function () {
            // remove binding
            this.binding && this.binding.remove();
            this.binding = null;
            this.watcher && this.watcher.remove();
            this.watcher = null;
        };

        Vue.component('layer-editor', myWidget);
    }

    async _loadModel(component, layerRegistry) {
        return await layerRegistry.getLayer({
            id: component.layer.id,
            source: component.layer.dataSourceTitle,
        });
    }

    /**
     * Watch on changes of the appliedState
     * @param component
     * @private
     */
    _createWatcher(component) {
        component.watcher = component.model.watch('revision', () => {
            component.applyState(component.model.appliedState);
        });
    }

    /**
     * Create binding of the applied state
     * @param component
     * @param model
     * @returns {*|void}
     * @private
     */
    _createBinding(component, model) {
        return Binding.for(component, model).syncToLeft('appliedState', component.applyState).enable().syncToLeft().syncToLeftNow();
    }

    static _createInstance() {
        return new Vue(SymbolEditorWidget);
    }
}
