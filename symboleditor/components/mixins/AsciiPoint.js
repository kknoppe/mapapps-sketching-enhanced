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
/**
 * Mixin for point shape to ascii conversion
 */

/**
 * All available shapes
 * @type {Array}
 */
const shapes = [
    {name: 'circle', ascii: '&#9679'},
    {name: 'diamond', ascii: '&#9670'},
    {name: 'square', ascii: '&#9632'},
    {name: 'triangle', ascii: '&#9650'},
    {name: 'cross', ascii: '&#10010;'},
    {name: 'x', ascii: '&#10005;'},
];

export default {
    methods: {
        /**
         * Returns ASCII-symbol of a point shape
         * @param shape Name of the shape
         * @return {string}
         */
        getAsciiForPointShape(shape) {
            const ascii = shapes.find(x => x.name === shape);

            if (ascii) {
                // ascii found
                return ascii.ascii;
            }

            // return name as fallback
            return shape;
        },
    },
};
