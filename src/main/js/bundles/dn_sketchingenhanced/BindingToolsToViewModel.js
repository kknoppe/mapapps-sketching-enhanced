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
import Binding from 'apprt-binding/Binding';
import {declare} from 'apprt-core/Mutable';
import ct_array from 'ct/array';
import ct_lang from 'ct/_lang';

function filterTools(tools, filterIds) {
    const returnTools = [];
    filterIds.forEach(id => {
        if (id.indexOf('?') !== -1 || id.indexOf('*') !== -1) {
            const regExp = new RegExp(id.replace(/\?/g, '.?').replace(/\*/g, '.*'));
            const foundTools = tools.filter(tool => regExp.test(tool.id));

            foundTools.forEach(t => {
                const toolAlreadyAdded = returnTools.find(e => e.id === t.id);
                if (!toolAlreadyAdded) {
                    returnTools.push(t);
                }
            });
        } else {
            const tool = tools.find(e => e.id === id);
            tool && returnTools.push(tool);
        }
    });
    return returnTools;
}

function copyToolProps(tools, filterIds, toolProps) {
    const returnTools = [];
    filterIds.forEach(id => {
        const regExp = new RegExp(id.replace(/\?/g, '.?').replace(/\*/g, '.*'));
        const foundTools = tools.filter(tool => regExp.test(tool.id));

        foundTools.forEach((t) => {
            const toolAlreadyAdded = returnTools.find(e => e.id === t.id);
            if (!toolAlreadyAdded) {
                returnTools.push(ct_lang.copyProps({}, t, toolProps));
            }
        })
    });
    return returnTools;
}

function watchToolState(tool, attr, bindings) {
    return tool.watch(attr, (name, oldValue, newValue) => {
        bindings.enabled && bindings.enable();
    });
}

function bindToViewModel(vueModelConfig, vueModel, property, toolIds, toolsWatchHandles, toolBindings) {
    const binding = Binding.create()
        .syncToRight('allTools', property, allTools => {
            const tools = filterTools(allTools, toolIds);
            tools.forEach(tool => {
                if (!toolsWatchHandles[tool.id]) {
                    toolsWatchHandles[tool.id] = watchToolState(tool, '*', toolBindings);
                }
            });
            tools.length !== toolIds.length && toolIds.forEach(id => {
                tools.findIndex(e => e.id === id) === -1 && delete toolsWatchHandles[id];
            });

            const vueModelToolProps = vueModelConfig.vueModelToolProps;
            return copyToolProps(tools, toolIds, vueModelToolProps);
        });
    binding.bindTo(vueModelConfig, vueModel);
    return binding;
}

export default declare({
    allTools: [],
    vueModelToolProps: [],
    toggleTools: {},
    defaultTools: {},

    activate() {
        this.vueModelToolProps = this._properties.vueModelToolProps || [];
    },

    add_tool(tool) {
        this.allTools = this.allTools.concat([tool]);
    },

    remove_tool(tool) {
        const idx = this.allTools.indexOf(tool);
        if (idx >= 0) {
            tool.get('active') && tool.set('active', false);
            this.allTools.splice(idx, 1);
            this.allTools = this.allTools.concat([]);
            delete this.toggleTools[tool.id];
            delete this.defaultTools[tool.id];
        }
    },

    getTool(toolId) {
        return ct_array.arraySearchFirst(this.allTools, {id: toolId});
    },

    getTools(toolIds) {
        return filterTools(this.allTools, toolIds);
    },

    toolClickHandler(evt) {
        const tool = this.getTool(evt.id);
        if (tool) {
            const options = evt.options;
            options && ct_lang.copyAllProps(tool, options);

            this._toolClick(tool, evt.active);
        }
    },

    _toolClick(tool, active) {
        tool.clickHandler ? tool.click() : this._toolActive(tool, active);
    },

    _toolActive(tool, active) {
        if (active === undefined || active === null) {
            active = !tool.get('active')
        }
        tool.set('active', active);
    },

    _getDefaultTool(toolId) {
        return this._getControlTool('defaultTools', toolId);
    },

    _getToggleTool(toolId) {
        return this._getControlTool('toggleTools', toolId);
    },

    _getControlTool(controlName, toolId) {
        const controlTools = this[controlName];
        if (!controlTools[toolId]) {
            controlTools[toolId] = this.getTool(toolId);
            this[controlName] = Object.assign({}, controlTools);
        }
        return controlTools[toolId];
    },

    binding(vueModel, property, toolIds, toggleToolId, defaultToolId) {
        let that = this;
        //binding handler
        const toolStateHandler = {
            enabled: false,
            enable() {
                this.enabled = true;
                widgetBinding.enable().syncToRightNow();
            },
            disable() {
                this.enabled = false;
                widgetBinding.disable();

                //deactivate all toggle tools
                that.getTools(toolIds).forEach(tool => {
                    that._toolActive(tool, false);
                });
            },
        };

        //binding
        const toolsWatchHandles = {};
        const widgetBinding = toolsWatchHandles['widgetBinding'] = bindToViewModel(this, vueModel, property, toolIds, toolsWatchHandles, toolStateHandler);

        //watch toggleTool
        if (!toggleToolId) {
            toolStateHandler.enable();
        } else {
            const toggleTool = this._getToggleTool(toggleToolId);
            if (toggleTool) {
                if (toggleTool.active) {
                    //activate default tool
                    const defaultTool = that._getDefaultTool(defaultToolId);
                    defaultTool && that._toolClick(defaultTool, true);

                    toolStateHandler.enable();
                }
                const toggleToolWatchHandle = toggleTool.watch('active', (name, oldValue, newValue) => {
                    newValue ? toolStateHandler.enable() : toolStateHandler.disable();

                    //activate default tool
                    const defaultTool = that._getDefaultTool(defaultToolId);
                    defaultTool && that._toolClick(defaultTool, newValue);
                });
                !toolsWatchHandles[toggleToolId] && (toolsWatchHandles[toggleToolId] = toggleToolWatchHandle);
            }
        }

        //handle tool active
        vueModel.$on('onToolClick', evt => {
            that.toolClickHandler(evt);
        });

        return {
            remove() {
                Object.keys(toolsWatchHandles).forEach(prop => {
                    toolsWatchHandles[prop].remove();
                });
            }
        };
    }
});
