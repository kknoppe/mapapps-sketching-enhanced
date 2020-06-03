<!--

    Copyright (C) 2020 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <div class="container dropzone">
        <div class="dz primary"
             :class="{error: error, dragover: dragging}"
             @dragover="_dragOver"
             @dragleave="_dragLeave"
             @drop="_drop">

            <!-- text overlay -->
            <div class="dz-content">
                <span><slot>{{ i18n.placeholder }}</slot></span><br/>
                <v-fade-transition>
                    <span v-show="error" class="error-text error--text">{{ error }}</span>
                </v-fade-transition>
            </div>

            <!-- input -->
            <input type="file" v-bind="{multiple, accept}" @change="_onChange"/>
        </div>
    </div>
</template>
<script>
    import i18n from 'dojo/i18n!../nls/bundle';

    export default {
        name: 'DropZone',

        props: {
            // Indicates if multiple files can be processed
            multiple: {type: Boolean, default: false},
            // Applies a filter of file extensions
            allowedFiles: {
                type: Array,
                // default images
                default: () => ['jpg', 'bmp', 'png', 'gif', 'tif'],
            },
            // language file
            i18n: {
                type: Object,
                // default i18n
                default: () => i18n.ui.form.dropzone,
            },
        },

        data() {
            return {
                // current error message
                error: '',
                // current state of dragging
                dragging: false,
            };
        },

        computed: {

            /**
             * Accept property for file input control
             * @return {*}
             */
            accept() {
                // comma separated file extensions
                return this.allowedFiles.map(x => '.' + x).join(',');
            },
        },

        methods: {

            _onChange(event) {
                this._processFiles(Array.from(event.target.files));
            },

            /**
             * Processes files
             * @param newFiles
             * @private
             */
            _processFiles(newFiles) {
                const files = newFiles.filter(f => this._fileIsValid(f));

                if (files.length) {
                    // emit valid files
                    this.$emit('change', files);
                } else {
                    // no valid files were added
                    this._showError(this.i18n.err_invalid_file);
                }

                // clean up
                //event.target.value = null;
                this._stopDragging();
            },

            /**
             * Returns if the given file matches the filter
             * @param file
             * @return {Boolean}
             * @private
             */
            _fileIsValid(file) {
                const fileExtension = this._getExtensionFromFile(file);
                return this.allowedFiles.some(x => x === fileExtension);
            },

            /**
             * Returns the extension of the given file
             * @param {File} file
             * @return {string}
             * @private
             */
            _getExtensionFromFile(file) {
                // return the part after the last dot
                return file.name.split('.').pop();
            },

            /**
             * Shows an error message for 5 seconds
             * @param errMsg
             * @private
             */
            _showError(errMsg) {
                // set the message
                this.error = errMsg || 'error';

                setTimeout(() => {
                    // clear
                    this.error = '';
                }, 5000);
            },

            /**
             * Event handler for dragover
             * @private
             */
            _dragOver(event) {
                event.preventDefault();
                this.dragging = true;
            },

            /**
             * Event handler for dragleave
             * @private
             */
            _dragLeave() {
                this._stopDragging();
            },

            /**
             * Stop dragging
             * @private
             */
            _stopDragging() {
                this.dragging = false;
            },

            /**
             * React to dropped files
             * @param event
             * @private
             */
            _drop(event) {
                event.preventDefault();

                if (!event.dataTransfer) {
                    this._stopDragging();
                    return;
                }

                const files = Array.from(event.dataTransfer.files);
                this._processFiles(files);
            },
        },
    };
</script>
