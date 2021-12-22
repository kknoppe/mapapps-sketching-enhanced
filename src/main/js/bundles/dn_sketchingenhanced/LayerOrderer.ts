import type Accessor from 'esri/core/Accessor';
import type Layer from 'esri/layers/Layer';
import type Map from 'esri/Map';
import Observers from 'apprt-core/Observers';
import { whenOnce } from 'esri/core/watchUtils';

export class LayerOrderer {

    private layers: { layer: Layer, order: number }[];
    private mapWidgetModel: Accessor & { map: Map };
    private observers = Observers();

    activate() {
        whenOnce(this.mapWidgetModel, 'ready', () => this.addMapChangeHandler(this.mapWidgetModel.map));
    }

    deactivate() {
        // stop all event handlers
        this.observers.clean();
    }

    /**
     * Adds an event handler when layers are added to the map
     * @param map 
     */
    private addMapChangeHandler(map: Map): void {
        const handler = map.allLayers.on('change', (evt: __esri.CollectionChangeEvent<Layer>) => {
            if (evt.added && evt.added.length) {
                // one or more layers were added to the map
                this.rearrangeLayers(map);
            }
        })
        this.observers.add(handler);
    }

    /**
     * Rearrange the layers of the sketching bundle
     * @param map 
     */
    private rearrangeLayers(map: Map): void {
        const layers = this.layers.slice();
        layers.sort((a, b) => a.order - b.order);

        for (const { layer: layerComponent } of layers) {
            this.moveLayerToTop(map, layerComponent.id);
        }
    }

    /**
     * 
     * @param map Moves the layer with the given layerId to the top of the map
     * @param layerId 
     * @returns 
     */
    private moveLayerToTop(map: Map, layerId: string): void {
        const layer = map.findLayerById(layerId);
        if (!layer) {
            return
        }
        map.reorder(layer, map.layers.length - 1);
    }
}