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
class LabelSettings {

    /**
     *
     * @param {LabelSettings} copy
     */
    constructor(copy) {
        this.allowed = copy ? copy.allowed : false;
        this.enabled = copy ? copy.enabled : false;

        this.visible = copy ? copy.visible : false;
        this.fields = copy ? copy.fields.slice() : [];
        this.fieldForLabeling = copy ? copy.fieldForLabeling : '';
        this.defaultField = copy ? copy.defaultField : '';

        this.minScale = copy ? copy.minScale : 0;
        this.maxScale = copy ? copy.maxScale : 0;

        this.warning = copy ? copy.warning : false;
    }
}

export default LabelSettings;
