import type Geometry from "esri/geometry/Geometry";
import type Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import { MeasurementGraphicFactory } from "./MeasurementGraphicFactory";
import Observers from 'apprt-core/Observers';

export class MeasurementLayer extends GraphicsLayer {
    public textSettings: __esri.TextSymbolProperties;
    private observers = Observers();

    public setReferenceLayer(referenceLayer: GraphicsLayer) {
        this.observers.clean();
        // remove measurements when reference graphics were removed from the referenceLayer
        this.observers.add(referenceLayer?.graphics.on("after-remove", e => this.removeMeasurement(e.item)));
    }

    public dispose() {
        this.observers.clean();
    }


    public addMeasurement(geometry: Geometry, originalGraphic: Graphic, symbol: __esri.TextSymbolProperties): void {
        // @ts-ignore
        const id = originalGraphic.uid;
        const newGraphic = (new MeasurementGraphicFactory(this.textSettings).createGraphic('', geometry, id, symbol));
        super.add(newGraphic);
    }

    public removeManyMeasurements(referenceGraphics: Graphic[]) {
        referenceGraphics.forEach(x => this.removeMeasurement(x));
    }

    public removeMeasurement(referenceGraphic: Graphic) {
        const graphicsToRemove = this.graphics.filter(g => g.getAttribute('id') === this.getMeasurementIDFromReferenceGraphic(referenceGraphic)).toArray();
        this.removeMany(graphicsToRemove);
    }

    private getMeasurementIDFromReferenceGraphic(referenceGraphic: Graphic): string {
        //@ts-ignore //TODO: Maybe use something else than the private uid
        const uid = referenceGraphic?.uid;
        return uid && `measurement-${uid}`;
    }
}