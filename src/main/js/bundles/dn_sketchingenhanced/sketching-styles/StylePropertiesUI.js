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
import TabContainer from "dijit/layout/TabContainer";
import _ManagedChildrenMixin from "ct/ui/controls/_ManagedChildrenMixin";

module.exports = declare([TabContainer, _ManagedChildrenMixin], {
    tabStrip: true,
    tabPosition: 'top',
    "class": "ctStyleProperties",

    showChildren: function (childrenIdsToShow, selectedChildId) {
        const lastId = this.selectedChildWidget && this.selectedChildWidget.childId;
        if (lastId && lastId !== selectedChildId && childrenIdsToShow && childrenIdsToShow.indexOf(lastId) !== -1) {
            selectedChildId = lastId;
        }

        return this.inherited(arguments);
    }
});