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
const gulp = require("gulp");
const mapapps = require('ct-mapapps-gulp-js');

mapapps.registerTasks({
    /* A detailed description of available setting is available at https://www.npmjs.com/package/ct-mapapps-gulp-js */
    /* a list of themes inside this project */
    themes: ["everlasting", "winter", "summer", "spring", "autumn"],
    /* state that the custom theme will be dependant from map.apps everlasting theme that provides the base styles */
    hasBaseThemes: false,
    /* state that we want to support vuetify components and therefore need the the vuetify core styles*/
    hasVuetify: true,
    themesSrcLocation: "./src/main/js/bundles/dn_sketchingenhanced-themes-extension",
    themesDestLocation: "./target/webapp/js/bundles/dn_sketchingenhanced-themes-extension",
    themeChangeTargets: {
        "everlasting": ["winter", "summer", "spring", "autumn"]
    }
});

gulp.task("default",
    gulp.series(
        "copy-resources",
        "themes-copy",
        gulp.parallel("js-transpile", "themes-compile")
    )
);
