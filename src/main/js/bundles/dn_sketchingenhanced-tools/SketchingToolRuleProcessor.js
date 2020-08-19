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
import {disjoint} from "esri/geometry/geometryEngine";

const RULE_KEY_ACTIVE = "drawActive";
const RULE_KEY_CANUNDO = "drawCanUndo";
const RULE_KEY_CANREDO = "drawCanRedo";
const RULE_KEY_HASREDLINING = "drawHasGraphic";
const RULE_KEY_REDLINING_ITEMS = "drawSketchingItems";
const RULE_KEY_REDLINING_ITEMSMAX = "drawMaximumSketchingItems";
const RULE_KEY_REDLINING_ITEMSMIN = "drawMinimumSketchingItems";
const RULE_KEY_SELECTED = "drawHasSelected";
const RULE_KEY_SELECTED_ITEMS = "drawSelectedItems";
const RULE_KEY_SELECTED_ITEMSMAX = "drawMaximumSelectedItems";
const RULE_KEY_SELECTED_ITEMSMIN = "drawMinimumSelectedItems";
const RULE_KEY_SELECTED_SAMETYPE = "drawSelectedItemsSameGeometryType";
const RULE_KEY_SELECTED_TOUCHED = "drawSelectedItemsTouched";
const RULE_KEY_SELECTED_OBJECT = "drawHasSelectedObject";
const RULE_KEY_SELECTED_OBJECT_ACTIVE = "drawHasActiveObject";
const RULE_KEY_SELECTED_OBJECT_GEOTYPE = "drawActiveObjectGeometryType";
const RULE_KEY_SELECTED_OBJECT_DIVISION = "drawActiveObjectIsDivision";
const RULE_KEY_SELECTED_OBJECT_INTERSECTS = "drawObjectSketchingIntersects";

const ruleProperties_Equal = [RULE_KEY_ACTIVE, RULE_KEY_CANUNDO, RULE_KEY_CANREDO, RULE_KEY_SELECTED, RULE_KEY_REDLINING_ITEMS, RULE_KEY_SELECTED_ITEMS, RULE_KEY_SELECTED_OBJECT_GEOTYPE, RULE_KEY_SELECTED_SAMETYPE, RULE_KEY_SELECTED_TOUCHED, RULE_KEY_HASREDLINING, RULE_KEY_SELECTED_OBJECT, RULE_KEY_SELECTED_OBJECT_ACTIVE, RULE_KEY_SELECTED_OBJECT_DIVISION, RULE_KEY_SELECTED_OBJECT_INTERSECTS];
const ruleProperties_Other = [RULE_KEY_REDLINING_ITEMSMAX, RULE_KEY_REDLINING_ITEMSMIN, RULE_KEY_SELECTED_ITEMSMAX, RULE_KEY_SELECTED_ITEMSMIN];

function getFirstGeometryType(graphics) {
    return graphics.length > 0 ? graphics[0].geometry.type : "";
}

function isSameGeometryType(graphics) {
    let eq = !!graphics.length;
    if (graphics.length > 1) {
        const type = graphics.getItemAt(0).geometry.type;
        eq = graphics.every((graphic) => {
            return graphic.geometry.type === type;
        });
    }
    return eq;
}

function isTouched(graphics) {
    let touched = false;
    if (graphics.length > 1) {
        const geometry = graphics.getItemAt(0).geometry;
        touched = graphics.every((graphic, idx) => {
            return idx === 0 || !disjoint(geometry, graphic.geometry);
        });
    }
    return touched;
}

function updateState(type, state, viewModel, context) {
    context.set(RULE_KEY_ACTIVE, !!viewModel.activeTool || state !== undefined && state !== "cancel" && state !== "complete");
    context.set(RULE_KEY_CANUNDO, viewModel.canUndo());
    context.set(RULE_KEY_CANREDO, viewModel.canRedo());
    context.set(RULE_KEY_SELECTED, viewModel.updateGraphics.length > 0);
    context.set(RULE_KEY_SELECTED_OBJECT_GEOTYPE, getFirstGeometryType(viewModel._getSelectedGraphics()));
    context.set(RULE_KEY_SELECTED_SAMETYPE, isSameGeometryType(viewModel.updateGraphics));
    context.set(RULE_KEY_SELECTED_TOUCHED, isTouched(viewModel.updateGraphics));
    context.set(RULE_KEY_HASREDLINING, viewModel.layer.graphics.length > 0);
    context.set(RULE_KEY_REDLINING_ITEMS, viewModel.layer.graphics.length);
    context.set(RULE_KEY_SELECTED_ITEMS, viewModel.updateGraphics.length);
    context.set(RULE_KEY_SELECTED_OBJECT, viewModel._getSelectedGraphics().length > 0);
    context.set(RULE_KEY_SELECTED_OBJECT_ACTIVE, viewModel._selectedGraphicsActive);
    context.set(RULE_KEY_SELECTED_OBJECT_DIVISION, viewModel._selectedGraphicsIsObjectDivision);
    context.set(RULE_KEY_SELECTED_OBJECT_INTERSECTS, viewModel._objectSketchingIntersects);
}


export default function () {
    return {
        ruleProperties: ruleProperties_Equal.concat(ruleProperties_Other),
        activate() {
            let context = this._ruleContextState;
            this.ruleProperties.forEach(key => {
                context.set(key, false);
            });
        },

        handler(evt) {
            const type = evt.type;
            const state = evt.state;
            const viewModel = this._sketchingHandler.sketchViewModel;
            const context = this._ruleContextState;
            updateState(type, state, viewModel, context);
        },

        isRuleFulfilled(tool, context, rule) {
            let fulfilled = ruleProperties_Equal.every((ruleKey) => {
                return this.isRuleFulfilled_Equal(context, rule, ruleKey, ruleKey);
            });

            fulfilled && (fulfilled = this.isRuleFulfilled_Min(context, rule, RULE_KEY_SELECTED_ITEMSMIN, RULE_KEY_SELECTED_ITEMS));
            fulfilled && (fulfilled = this.isRuleFulfilled_Max(context, rule, RULE_KEY_SELECTED_ITEMSMAX, RULE_KEY_SELECTED_ITEMS));

            fulfilled && (fulfilled = this.isRuleFulfilled_Min(context, rule, RULE_KEY_REDLINING_ITEMSMIN, RULE_KEY_REDLINING_ITEMS));
            fulfilled && (fulfilled = this.isRuleFulfilled_Max(context, rule, RULE_KEY_REDLINING_ITEMSMAX, RULE_KEY_REDLINING_ITEMS));

            return [fulfilled]
        },

        isRuleFulfilled_Equal(context, rule, ruleKey, contextKey) {
            const rValue = rule[ruleKey];
            const cValue = context.get(contextKey);
            return rValue === undefined || cValue === undefined || cValue === rValue;
        },

        isRuleFulfilled_Min(context, rule, ruleKey, contextKey) {
            const rValue = rule[ruleKey];
            const cValue = context.get(contextKey);
            return rValue === undefined || cValue === undefined || cValue >= rValue;
        },

        isRuleFulfilled_Max(context, rule, ruleKey, contextKey) {
            const rValue = rule[ruleKey];
            const cValue = context.get(contextKey);
            return rValue === undefined || cValue === undefined || cValue <= rValue;
        }
    }
}
