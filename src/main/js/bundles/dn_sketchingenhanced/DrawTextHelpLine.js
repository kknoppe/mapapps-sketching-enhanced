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
import Graphic from 'esri/Graphic';
import Polyline from 'esri/geometry/Polyline';

export default class DrawTextHelpLine {

    activate() {
        this.graphic = null;
    }

    createHelpLine(firstGraphic, viewModel, rotation) {
        const angle = this._getAngle(viewModel, rotation);

        if (angle < 0 || angle > 360) {
            return;
        }

        if (angle === 0) {
            return;
        }
        const [dx, dy] = this._calculateLine(viewModel, angle);

        const graphic = this.graphic = firstGraphic ? firstGraphic : this.graphic;

        const path = [[graphic.geometry.x, graphic.geometry.y],
            [graphic.geometry.x + dx, graphic.geometry.y + dy]];
        // set the style of the help line
        const polylineSymbol = {
            type: 'simple-line',
            color: 'black',
            width: '1',
            style: 'dot',
        };
        // create the line
        const line = new Polyline({
            hasZ: false,
            hasM: true,
            paths: path,
            spatialReference: graphic.geometry.spatialReference,
        });
        // and add it to the graphics layer
        const helpLine = new Graphic({
            geometry: line,
            symbol: polylineSymbol,
            name: 'helpLine',
        });
        viewModel.layer.add(helpLine);
    }

    removeHelpLine(viewModel) {
        // find all help lines and remove them from the graphics layer
        const graphics = viewModel.layer.graphics.items;
        const gs = graphics.filter(x => x.name === 'helpLine');
        viewModel.layer.removeMany(gs);
    }

    _getAngle(viewModel, rotation) {
        let angle;
        if (rotation || rotation === 0) {
            angle = rotation;
        } else if (viewModel.tool && viewModel.tool.toolId === 'drawreshape1tool') {
            angle = (viewModel._orgSymbols && viewModel._orgSymbols.length > 0 && viewModel._orgSymbols[0].type === 'text') ?
                viewModel._orgSymbols[0].angle : viewModel.textSymbol.angle;
        } else {
            angle = viewModel.textSymbol.angle;
        }

        return angle;
    }

    _calculateLine(viewModel, angle) {
        // choose the length of the help line to be 20% of the height of the current map extent
        // and calculate a second point to create the line by using the given angle
        const l = viewModel.view.extent.height * 0.2;
        const radAngle = -angle * Math.PI / 180.;
        const dy = Math.sin(radAngle) * l;
        const dx = Math.cos(radAngle) * l;

        return [dx, dy];
    }
}
