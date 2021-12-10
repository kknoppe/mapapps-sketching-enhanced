///
/// Copyright (C) 2020 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import type Geometry from "esri/geometry/Geometry";
import type Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import { MeasurementGraphicFactory } from "./MeasurementGraphicFactory";
import Observers from 'apprt-core/Observers';

export class MeasurementLayer extends GraphicsLayer {
    public textSettings: __esri.TextSymbolProperties;
    private observers = Observers();

    public setReferenceLayer(referenceLayer: GraphicsLayer): void {
        this.observers.clean();
        // remove measurements when reference graphics were removed from the referenceLayer
        this.observers.add(referenceLayer?.graphics.on('after-remove', e => this.removeMeasurement(e.item)));
    }

    public dispose() {
        this.observers.clean();
    }


    public addMeasurement(geometry: Geometry, originalGraphic: Graphic, symbol: __esri.TextSymbolProperties & { temporary?: boolean }, type?: string): void {
        // @ts-ignore
        const id = originalGraphic.uid;
        const newGraphic = (new MeasurementGraphicFactory(this.textSettings).createGraphic('', geometry, id, symbol));
        type && newGraphic.setAttribute('type', type);

        super.add(newGraphic);
    }

    public removeManyMeasurements(referenceGraphics: Graphic[], type?: string) {
        referenceGraphics?.forEach(x => this.removeMeasurement(x, type));
    }

    public removeMeasurement(referenceGraphic: Graphic, type?: string) {
        const graphicsToRemove = this.graphics.filter(g => {
            if (g.getAttribute('id') !== this.getMeasurementIDFromReferenceGraphic(referenceGraphic)) {
                return false;
            }
            if (type) {
                return type === g.getAttribute('type');
            }
            return true;

        }).toArray();
        this.removeMany(graphicsToRemove);
    }

    private getMeasurementIDFromReferenceGraphic(referenceGraphic: Graphic): string {
        //@ts-ignore //TODO: Maybe use something else than the private uid
        const uid = referenceGraphic?.uid;
        return uid && `measurement-${uid}`;
    }
}