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

const RULE_KEY_SEARCHSOURCE_ITEMS = "searchSourceItems";
const RULE_KEY_SEARCHSOURCE_ITEMSMAX = "maximumSearchSourceItems";
const RULE_KEY_SEARCHSOURCE_ITEMSMIN = "minimumSearchSourceItems";

const ruleProperties_Equal = [RULE_KEY_SEARCHSOURCE_ITEMS];
const ruleProperties_Other = [RULE_KEY_SEARCHSOURCE_ITEMSMAX, RULE_KEY_SEARCHSOURCE_ITEMSMIN];

export default function () {
    return {
        //injected
        _bindingSearchSources: null,

        //
        ruleProperties: ruleProperties_Equal.concat(ruleProperties_Other),

        activate() {
            //set keys
            this.ruleProperties.forEach(key => {
                this._ruleContextState.set(key, false);
            });

            //set state
            this.updateState();
            this._watchSources = this._bindingSearchSources.watch("sources", () => {
                this.updateState();
            });
        },

        deactivate() {
            this._watchSources && this._watchSources.remove();
        },

        updateState() {
            const context = this._ruleContextState;
            const bindingSearchSources = this._bindingSearchSources;
            context.set(RULE_KEY_SEARCHSOURCE_ITEMS, bindingSearchSources.sources.length);
        },

        isRuleFulfilled(tool, context, rule) {
            let fulfilled = ruleProperties_Equal.every((ruleKey) => {
                return this.isRuleFulfilled_Equal(context, rule, ruleKey, ruleKey);
            });

            fulfilled && (fulfilled = this.isRuleFulfilled_Min(context, rule, RULE_KEY_SEARCHSOURCE_ITEMSMIN, RULE_KEY_SEARCHSOURCE_ITEMS));
            fulfilled && (fulfilled = this.isRuleFulfilled_Max(context, rule, RULE_KEY_SEARCHSOURCE_ITEMSMAX, RULE_KEY_SEARCHSOURCE_ITEMS));

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
