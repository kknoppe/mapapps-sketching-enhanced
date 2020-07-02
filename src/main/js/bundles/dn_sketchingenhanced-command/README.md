# dn_sketchingenhanced-command

Dieses Bundle fügt Werkzeuge hinzu, mit denen Sketching-Zeichnungen ausgewählt und bearbeitet werden können. Hierzu werden die Funktionen durch Laden der folgenden Bundles implementiert:

* [sketching-tools](#bundle=sketching-tools@)
* [dn_sketchingenhanced-styles](#bundle=dn_sketchingenhanced-styles@)
* [snapping-manager](#bundle=snapping-manager@)


## Usage

Um die Funktionen dieses Bundles zu benutzen, können Sie Werkzeug "sketchingEnhancedWidgetToggleTool" im Werkzeugsatz hinzufügen. Die Werkzeug-ID ist:

|Tool ID                         |Component                          |Description
|--------------------------------|-----------------------------------|-----------------------
|sketchingEnhancedWidgetToggleTool             |sketchingEnhancedWidgetToggleTool                |Zeichnen- und Editier-Werkzeuge.

oder einige folgende Werkzeugen im Werkzeugsatz hinzufügen:

|Tool ID                         |Component                          |Description
|--------------------------------|-----------------------------------|-----------------------
|drawremovetool                  |SketchingDrawremovetool            |Ausgewählte Zeichnung löschen.
|drawremovealltool               |SketchingDrawremovealltool         |Alle Zeichnungen löschen.
|drawactivateobjecttool          |SketchingDrawactivateobjecttool    |Objekte aktivieren.
|drawdeactivateobjecttool        |SketchingDrawdeactivateobjecttool  |Objekte deaktivieren.
|drawremoveactivetool            |SketchingDrawremoveobjecttool      |Aktiviertes Objekt löschen.
|drawuniontool                   |SketchingDrawuniontool             |Vereinigung der ausgewählten Zeichnungen erstellen.
|drawintersecttool               |SketchingDrawintersecttool         |Schnittmenge der ausgewählten Zeichnungen erstellen.
|drawdifferencetool              |SketchingDrawdifferencetool        |Differenzierung der ausgewählten Zeichnungen erstellen.
|drawbuffertool                  |SketchingDrawbuffertool            |Buffer der ausgewählten Zeichnungen erstellen.
|drawcopytool                    |SketchingDrawcopytool              |Die ausgewählten Zeichnungen kopieren.


## Configuration Reference

Um das Bundle in app.json zu konfigurieren, verwenden Sie die konfigurierbaren, wie folgende Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"dn_sketchingenhanced-command": {
  "SketchingSelection": {
    "geometryTypes": [
      "point",
      "polyline",
      "polygon"
    ],
    "pointSymbol": {
      "color": [
        128,
        0,
        0,
        255
      ],
      "size": 12,
      "type": "esriSMS",
      "style": "esriSMSCircle",
      "outline": {
        "color": [
          128,
          0,
          0,
          255
        ],
        "width": 2,
        "type": " esriSLS",
        "style": "esriSLSSolid"
      }
    },
    "polygonSymbol": {
      "type": "esriSFS",
      "color": [
        128,
        0,
        0,
        255
      ],
      "outline": {
        "color": [
          128,
          0,
          0,
          255
        ],
        "style": "esriSLSSolid",
        "type": "esriSLS",
        "width": 2.5
      },
      "style": "esriSFSForwardDiagonal"
    },
    "polylineSymbol": {
      "color": [
        128,
        0,
        0,
        255
      ],
      "style": "esriSLSSolid",
      "type": "esriSLS",
      "width": 2.5
    },
    "snapPointPMSymbol": {
      "color": [
        128,
        0,
        0,
        128
      ],
      "size": 6,
      "type": "esriSMS",
      "style": "esriSMSCircle",
      "outline": {
        "color": [
          128,
          0,
          0,
          128
        ],
        "width": 1,
        "type": " esriSLS",
        "style": "esriSLSSolid"
      }
    },
    "snapPolylineReshapeSymbol": {
      "color": [
        0,
        255,
        0,
        255
      ],
      "style": "esriSLSSolid",
      "type": "esriSLS",
      "width": 1
    },
    "snapPolylinePlusObjectSymbol": {
      "color": [
        0,
        0,
        255,
        255
      ],
      "style": "esriSLSSolid",
      "type": "esriSLS",
      "width": 1
    },
    "snapPolylineMinusObjectSymbol": {
      "color": [
        255,
        0,
        0,
        255
      ],
      "style": "esriSLSSolid",
      "type": "esriSLS",
      "width": 2
    },
    "snapPolylineIntersectObjectSymbol": {
      "color": [
        255,
        0,
        255,
        255
      ],
      "style": "esriSLSSolid",
      "type": "esriSLS",
      "width": 2
    }
  }
}
```

|Property               |Type     |Description|Default
|-----------------------|---------|-----------|-----------
|`geometryTypes`        |Array    |Zulässige Geometrietypen zur Auswahl|alle
|`pointSymbol`          |Object   |Ein Symbol zur Darstellung der aktivierten Punktgeometrie|[pointSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#pointSymbol)
|`polygonSymbol`        |Object   |Ein Symbol zur Darstellung der aktivierten Polygongeometrie|[polygonSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polygonSymbol)
|`polylineSymbol`       |Object   |Ein Symbol zur Darstellung der aktivierten Polyliniengeometrie|[polylineSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol)
|`snapPointPMSymbol`    |Object   |Ein Symbol zur Darstellung des Snapping-Punktes|[pointSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#pointSymbol)
|`snapPolylineReshapeSymbol`        |Object   |Ein Symbol zur Darstellung des gefangenen Objektes für Stützpunkte-Bearbeiten|[polylineSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol)
|`snapPolylinePlusObjectSymbol`     |Object   |Ein Symbol zur Darstellung des gefangenen Objektes für Vereinigung|[polylineSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol)
|`snapPolylineMinusObjectSymbol`    |Object   |Ein Symbol zur Darstellung des gefangenen Objektes für Differenzierung|[polylineSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol)
|`snapPolylineIntersectObjectSymbol`|Object   |Ein Symbol zur Darstellung des gefangenen Objektes für Schnittmenge|[polylineSymbol](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html#polylineSymbol)
