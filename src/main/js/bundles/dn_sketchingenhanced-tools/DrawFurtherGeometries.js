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
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import Point from 'esri/geometry/Point';
import Polygon from 'esri/geometry/Polygon';
import Graphic from 'esri/Graphic';
import geoEngine from 'esri/geometry/geometryEngine';
import Draw from 'esri/views/draw/Draw';

export default class DrawFurtherGeometries {

    activate() {
        this.styleContext = null;
        this.checkIfTooFast = false;
    }

    /**
     * create and draw an ellipse
     * @param viewModel: SketchViewModel
     * @param mode: draw mode
     * @param props: if available given sketching properties in manifest.json
     */
    createEllipse(viewModel, mode, props) {
        const that = this;

        // create a new Draw using the viewmodel's view
        const draw = new Draw({
            view: viewModel.view,
        });

        // create ellipse
        const action = draw.create('ellipse', {mode});

        this._changeCursor();

        const listener = this._createMouseUpListener(viewModel);

        action.on(['vertex-add'], event => {
            if (event.vertices.length === 1 && viewModel.tool && viewModel.tool.id === 'drawellipsetool') {
                viewModel.emit('create', {
                    state: 'start',
                    type: 'update',
                    tool: 'drawellipsetool',
                });
            }
        });


        action.on(['draw-complete', 'cursor-update'], event => {
            this._drawCompleteActions(event, listener);

            const viewModelOperator = viewModel && viewModel.tool && viewModel.tool.id === 'drawellipsetool';
            if (event.vertices && event.vertices.length > 1 && viewModelOperator && !this.checkIfTooFast) {
                // remove former help ellipsis
                that._removeHelpGraphics(viewModel);

                // use vertices to create ellipse ring
                const vs = event.vertices;
                const ring = that._createEllipseRing(vs);

                this._drawEventHandler(event, props, 'ellipse', viewModel, ring);

            } else {
                if (viewModel.tool && viewModel.tool.id === 'drawellipsetool') {
                    event.type === 'draw-complete' && viewModel.emit('update', {
                        state: 'cancel',
                        type: 'update',
                    });
                }
            }
        });
    }

    /**
     * create and draw a triangle
     * @param viewModel
     * @param props
     */
    createTriangle(viewModel, props) {
        const that = this;

        // create a new Draw using the viewmodel's view
        const draw = new Draw({
            view: viewModel.view,
        });

        // create ellipse
        const triangle = draw.create('triangle');

        this._changeCursor();

        const listener = this._createMouseUpListener(viewModel);


        triangle.on(['vertex-add'], event => {
            if (event.vertices.length === 1 && viewModel.tool && viewModel.tool.id === 'drawtriangletool') {
                viewModel.emit('create', {
                    state: 'start',
                    type: 'update',
                    tool: 'drawtriangletool',
                });
            }
        });


        triangle.on(['draw-complete', 'cursor-update'], event => {
            this._drawCompleteActions(event, listener);

            const viewModelOperator = viewModel && viewModel.tool && viewModel.tool.id === 'drawtriangletool';
            if (event.vertices && event.vertices.length > 1 && viewModelOperator && !this.checkIfTooFast) {

                // remove former help ellipsis
                that._removeHelpGraphics(viewModel);

                // use vertices to create ellipse ring
                const vs = event.vertices;
                const ring = that._createTriangleRing(vs);

                this._drawEventHandler(event, props, 'triangle', viewModel, ring);
            } else {
                if (viewModel.tool && viewModel.tool.id === 'drawtriangletool') {
                    event.type === 'draw-complete' && viewModel.emit('update', {
                        state: 'cancel',
                        type: 'update',
                    });
                }
            }
        });
    }

    /**
     * create and draw an arrow
     * @param viewModel: SketchViewModel
     * @param props: if available given sketching properties in manifest.json
     */
    createArrow(viewModel, props) {
        const that = this;
        let verticesCount = 0;

        viewModel.on(['create'], evt => {
            if (evt.target.tool && evt.target.tool.id === 'drawarrowtool') {

                if (evt.toolEventInfo && evt.toolEventInfo.type === 'vertex-add') {
                    verticesCount++;
                }

                const graphicOperator = that._calculateGraphicOperator(evt);
                if (evt.state === 'active' && graphicOperator) {
                    // create arrow graphic and draw it after finishing the drawn line
                    that._createAndAddArrow(evt, viewModel, props);
                }

                // reset vertices counter when draw is complete
                if (evt.state === 'complete') {
                    verticesCount = 0;
                }
            }
        });
    }

    /**
     * create a simple fill symbol with given style context
     * @param styleContext
     * @private
     */
    _createSFS(styleContext) {
        return new SimpleFillSymbol({
            color: styleContext.getColor('fill'),
            style: styleContext.get('fillStyle'),
            outline: this._createSLS(styleContext),
        });
    }

    /**
     * create a simple line symbol with given style context
     * @param styleContext
     * @param minWidth
     * @private
     */
    _createSLS(styleContext, minWidth) {
        return new SimpleLineSymbol({
            cap: styleContext.get('strokeCap'),
            color: styleContext.getColor('stroke'),
            join: styleContext.getColor('strokeJoin'),
            miterLimit: styleContext.getColor('strokeMiterLimit'),
            style: styleContext.get('strokeStyle'),
            width: Math.max(minWidth || 0, styleContext.get('strokeWidth')),
        });
    }

    /**
     * create the ellipse ring by using the given vertices
     * @param vs: vertices
     * @returns Array: ellipse ring
     * @private
     */
    _createEllipseRing(vs) {
        const ring = [];
        const maxX = Math.max(vs[0][0], vs[1][0]);
        const maxY = Math.max(vs[0][1], vs[1][1]);
        const minX = Math.min(vs[0][0], vs[1][0]);
        const minY = Math.min(vs[0][1], vs[1][1]);
        const width = maxX - minX;
        const height = maxY - minY;
        const cX = maxX - (width / 2);
        const cY = maxY - (height / 2);
        for (let i = 0; i < 360; i++) {
            const t = i * Math.PI / 180;
            const x = cX - width / 2 * Math.cos(t);
            const y = cY + height / 2 * Math.sin(t);
            ring.push([x, y]);
        }
        ring.push(ring[0]);
        return ring;
    }

    /**
     * create the triangle ring by using the given vertices
     * @param vs: vertices
     * @returns Array: triangle ring
     * @private
     */
    _createTriangleRing(vs) {
        const ring = [[vs[1][0], vs[1][1]]];
        const lx = vs[0][0] + vs[0][0] - vs[1][0];
        const ly = vs[1][1];
        ring.push([lx, ly]);
        const ux = vs[0][0];
        const uy = vs[0][1] + vs[0][1] - vs[1][1];
        ring.push([ux, uy]);
        return ring;
    }

    /**
     * remove all shown help ellipsis from current sketching layer to be able to add a new one
     * @param viewModel: SketchViewModel
     * @private
     */
    _removeHelpGraphics(viewModel) {
        if (viewModel.layer.graphics && viewModel.layer.graphics.length > 0) {
            const gs = viewModel.layer.graphics.filter(x => x.temporary);
            viewModel.layer.removeMany(gs);
        }
    }

    /**
     * create the polygon symbol for the ellipse and the arrow using given style context or properties given in manifest.json
     * @param props: properties given in manifest.json
     * @returns Symbol
     * @private
     */
    _createPolygonSymbol(props) {
        const polygonData = props.sketch.polygonSymbol;
        return this.styleContext ? this._createSFS(this.styleContext) : new SimpleFillSymbol({
            color: polygonData.color,
            style: polygonData.style,
            outline: new SimpleLineSymbol({
                color: polygonData.outline.color,
                style: polygonData.outline.style,
                width: polygonData.outline.width,
            }),
        });
    }

    /**
     * create a graphic representing the ellipse that is being drawn and add graphic to current sketching layer
     * @param viewModel: SketchViewModel
     * @param ring: Ellipse ring
     * @param polygonSymbol: symbol of the polygon
     * @param temporary: Boolean parameter which says whether the graphic is only temporary (help ellipse) or not (final ellipse)
     * @private
     */
    _createAndAddGraphic(viewModel, ring, polygonSymbol, temporary) {
        const graphic = new Graphic({
            geometry: {
                type: 'polygon',
                rings: [ring],
                spatialReference: viewModel.view.spatialReference,
            },
            symbol: polygonSymbol,
            temporary,
        });
        // graphic to current sketching layer
        viewModel.layer.add(graphic);
        return graphic;
    }

    /**
     * returns boolean operator that decides if arrow should be created
     * @param evt: Event
     * @returns Boolean
     * @private
     */
    _calculateGraphicOperator(evt) {
        return evt.graphic && evt.graphic.geometry && evt.graphic.geometry.paths && evt.graphic.geometry.paths[0].length === 3;
    }

    /**
     * create arrow graphic and draw it after finishing the drawn line
     * @param evt: Event
     * @param viewModel: SketchViewModel
     * @param props: properties from manifest.json
     * @private
     */
    _createAndAddArrow(evt, viewModel, props) {
        const g = this._createArrowGraphic(evt.graphic.geometry.paths[0], viewModel, props);
        evt.graphic.geometry = g.geometry;
        evt.graphic.symbol = g.symbol;
        viewModel.complete(evt.graphic);
    }

    /**
     * use given path of the drawn line to create the arrow
     * @param geom: geometry of sketched line
     * @param viewModel: SketchViewModel
     * @param props: properties in manifest.json
     * @private
     */
    _createArrowGraphic(geom, viewModel, props) {
        // first of all set start and end point
        const start = new Point({
            x: geom[0][0],
            y: geom[0][1],
        });
        const end = new Point({
            x: geom[1][0],
            y: geom[1][1],
        });

        // calculate all edge points of the arrow to create the needed ring
        const dist = start.distance(end);
        const dy = end.y - start.y;
        const dx = end.x - start.x;
        let rads = Math.atan2(dx, dy);

        if (rads < 0) {
            rads = Math.abs(rads);
        } else {
            rads = 2 * Math.PI - rads;
        }

        const degrees = (rads * 180) / Math.PI;
        const width = 0.3 * dist;

        const bottomLeft = [start.x - width / 10, start.y];
        const bottomRight = [start.x + width / 10, start.y];
        const midLeft = [bottomLeft[0], [bottomLeft[1] + dist - width]];
        const midRight = [bottomRight[0], [bottomRight[1] + dist - width]];
        const edgeLeft = [midLeft[0] - width / 2, midLeft[1]];
        const edgeRight = [midRight[0] + width / 2, midRight[1]];
        const point = [start.x, start.y + dist];

        const rings = [
            point,
            edgeLeft,
            midLeft,
            bottomLeft,
            bottomRight,
            midRight,
            edgeRight,
        ];

        // create a polygon using the given rings
        const poly = new Polygon({
            rings: [rings],
            spatialReference: viewModel.view.spatialReference,
        });

        // rotate the polygon by the calculated angle
        const rotatedPoly = geoEngine.rotate(poly, degrees, start);

        // create the polygon symbol using style context or properties from manifest.json
        const polygonSymbol = this._createPolygonSymbol(props);

        // and return new graphic using calculated geometry of the arrow polygon and the symbol
        return new Graphic({
            geometry: rotatedPoly,
            symbol: polygonSymbol,
        });
    }

    /**
     * handles draw-complete event for ellipse and triangle tool
     * @param event
     * @param props
     * @param tool
     * @param viewModel
     * @param ring
     * @private
     */
    _drawEventHandler(event, props, tool, viewModel, ring) {
        // create the polygon symbol based given style context or on properties set in manifest.json
        const polygonSymbol = this._createPolygonSymbol(props);

        // create a graphic representing the ellipse that is being drawn and add it to the current sketching layer
        const temporary = event.type === 'cursor-update';
        const graphic = this._createAndAddGraphic(viewModel, ring, polygonSymbol, temporary);

        // emit update event, so that the tool is activated again
        // only if draw is completed
        event.type === 'draw-complete' && viewModel.emit('update', {
            target: viewModel,
            state: 'complete',
            type: 'create',
            graphic,
            tool,
        });
    }


    _changeCursor() {
        // change mouse cursor when tool is activated
        if (!document.getElementsByClassName('esri-view-surface')[0].classList.contains('sketching-cursor')) {
            document.getElementsByClassName('esri-view-surface')[0].classList.add('sketching-cursor');
        }
    }

    _drawCompleteActions(event, listener) {
        if (event.type === 'draw-complete') {
            this.checkIfTooFast = false;
            listener.remove();
        }
    }

    _createMouseUpListener(viewModel) {
        return viewModel.view.on('pointer-up', () => {
            this.checkIfTooFast = true;
            setTimeout(() => {
                this.checkIfTooFast = false;
            }, 1000);
        });

    }
}
