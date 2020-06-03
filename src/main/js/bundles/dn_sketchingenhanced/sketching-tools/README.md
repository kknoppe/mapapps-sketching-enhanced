# sketching-tools

Dieses Bundle fügt Werkzeuge hinzu, mit denen Punkte, Linien, Polygone und Text erstellt, gelöscht und bearbeitet werden können. Hierzu wird die ArcGIS-API-Klasse
[SketchViewModel](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html) verwendet, und die folgenden Bundles implementiert:

* [toolrules](#bundle=toolrules@)
* [map-widget](#bundle=map-widget@)

## Usage

Um die Funktionen dieses Bundles zu benutzen, können Sie das Werkzeug "sketchingWidgetToggleTool" im Werkzeugsatz hinzufügen,

|Tool ID                         |Component                          |Description
|--------------------------------|-----------------------------------|-----------------------
|sketchingWidgetToggleTool             |sketchingWidgetToggleTool                |Zeichnen- und Editier-Werkzeuge.

oder einige der folgenden Werkzeuge:

|Tool ID                         |Component                          |Description
|--------------------------------|-----------------------------------|-----------------------
|drawpointtool                   |SketchingDrawpointtool                      |Punkt: Zeichnet einen Punkt.
|drawmultipointtool              |SketchingDrawmultipointtool                 |Punkte: Zeichnet mehrere Punkte.
|drawlinetool                    |SketchingDrawlinetool                       |Linie: Zeichnet eine gerade Linie.
|drawpolylinetool                |SketchingDrawpolylinetool                   |Linienzug: Zeichnet einen Linienzug.
|drawfreehandpolylinetool        |SketchingDrawfreehandpolylinetool           |Freihand Linienzug: Zeichnet einen freidefinierten Linienzug.
|drawpolygontool                 |SketchingDrawpolygontool                    |Polygon: Zeichnet ein Polygon.
|drawfreehandpolygontool         |SketchingDrawfreehandpolygontool            |Freihand Polygon: Zeichnet ein freidefinierbares Polygon.
|drawextenttool                  |SketchingDrawextenttool                     |Freihand Rechteck: Zeichnet ein freidefinierbares Rechteck.
|drawcircletool                  |SketchingDrawcircletool                     |Kreis: Zeichnet einen Kreis.
|drawellipsetool                 |SketchingDrawellipsetool                    |Ellipse: Zeichnet eine Ellipse.
|drawrectangletool               |SketchingDrawrectangletool                  |Rechteck: Zeichnet ein Rechteck.
|drawarrowtool                   |SketchingDrawarrowtool                      |Pfeil: Zeichnet einen Pfeil in beliebiger Richtung.
|drawtriangletool                |SketchingDrawtriangletool                   |Dreieck: Zeichnet ein Dreieck.
|drawtransformtool               |SketchingDrawtransformtool                  |Umformen.
|drawtransform1tool              |SketchingDrawtransform1tool                 |Umformen.
|drawreshapetool                 |SketchingDrawreshapetool                    |Stützpunkte bearbeiten.
|drawreshape1tool                |SketchingDrawreshape1tool                   |Stützpunkte bearbeiten.
|drawreshape2tool                |SketchingDrawreshape2tool                   |Stützpunkte bearbeiten.
|drawundotool                    |SketchingDrawundotool                       |Rückgängig.
|drawredotool                    |SketchingDrawredotool                       |Wiederherstellen.
|drawcompletetool                |SketchingDrawcompletetool                   |Fertig
|drawcanceltool                  |SketchingDrawcanceltool                     |Abbrechen.
|drawremovetool                  |SketchingDrawremovetool                     |Ausgewählte Zeichnung löschen.
|drawremovealltool               |SketchingDrawremovealltool                  |Alle Zeichnungen löschen.


## Configuration Reference

Um das Bundle in app.json zu konfigurieren, verwenden Sie die konfigurierbaren, wie folgende Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"sketching-tools": {
    "Config": {
        "graphicLayerId": "ct-resultcenter",
        "graphicLayerTitle": "Sketching-Grafiken",
        "sketch": {
            "updateOnGraphicClick": false,
            //Possible Values: point | multipoint | polyline | polygon | circle | rectangle | move | transform | reshape
            "defaultUpdateOptions": {
              "tool": "reshape",
              "enableMoveAllGraphics": false,
              "enableRotation": false,
              "enableScaling": false,
              "preserveAspectRatio": false,
              "toggleToolOnClick": false,
              "multipleSelectionEnabled": false
            },
            "textSymbol": {
              "type": "esriTS",
              "color": [
                64,
                64,
                64,
                255
              ],
              "backgroundColor": [
                0,
                0,
                0,
                0
              ],
              "horizontalAlignment": "left",
              "font": {
                "family": "Arial",
                "size": 18,
                "style": "normal",
                "weight": "normal",
                "decoration": "none"
              }
            },
            "pointSymbol": {
              "color": [
                102,
                205,
                0,
                100
              ],
              "size": 12,
              "type": "esriSMS",
              "style": "esriSMSCircle",
              "outline": {
                "color": [
                  64,
                  64,
                  64,
                  255
                ],
                "width": 1,
                "type": " esriSLS",
                "style": "esriSLSSolid"
              }
            },
            "polygonSymbol": {
              "type": "esriSFS",
              "color": [
                102,
                205,
                0,
                100
              ],
              "outline": {
                "color": [
                  64,
                  64,
                  64,
                  255
                ],
                "style": "esriSLSSolid",
                "type": "esriSLS",
                "width": 1.3
              },
              "size": 16,
              "style": "esriSFSSolid",
              "xoffset": 0,
              "yoffset": 0
            },
            "polylineSymbol": {
              "color": [
                64,
                64,
                64,
                255
              ],
              "style": "esriSLSSolid",
              "type": "esriSLS",
              "width": 2
            }
          }
        }
    }
}
```

|Property               |Type     |Description|Default
|-----------------------|---------|-----------|-----------
|`graphicLayerId`       |String   |Eine LayerId in der Map für Darstellen der Sketching-Graphik|sketchingGraphicLayer
|`graphicLayerTitle`    |String   |Eine Title der Sketching-Graphik-Layer|Sketching Grafiken
|`updateOnGraphicClick` |Boolean  |Definiert, ob eine Grafik zur Bearbeitung auf Klicken ausgewählt werden kann|false
|`defaultUpdateOptions` |Object   |Default-Update-Optionen für die Klasse [SketchViewModel](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#defaultUpdateOptions)|[defaultUpdateOptions](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#defaultUpdateOptions)
|`textSymbol`           |Object   |Ein Symbol, das zur Darstellung des eingebenen Textes verwendet wird|[textSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#textSymbol)
|`pointSymbol`          |Object   |Ein Symbol, das zur Darstellung der gezeichneten Punktgeometrie verwendet wird|[pointSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#pointSymbol)
|`polygonSymbol`        |Object   |Ein Symbol, das zur Darstellung der gezeichneten Polygongeometrie verwendet wird|[polygonSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polygonSymbol)
|`polylineSymbol`       |Object   |Ein Symbol, das zur Darstellung der gezeichneten Polyliniengeometrie verwendet wird|[polylineSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol)
