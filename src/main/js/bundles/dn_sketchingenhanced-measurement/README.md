# dn_sketchingenhanced-measurement

Dieses Bundle umfasst alle verfügbaren Messfunktionen.

Für das Mess-Widget werden die Funktionen durch Laden der folgenden Bundles implementiert:

* [dn_sketchingenhanced-tools](#bundle=dn_sketchingenhanced-tools@)
* [dn_sketchingenhanced-command](#bundle=dn_sketchingenhanced-command@)
* [dn_sketchingenhanced-styles](#bundle=dn_sketchingenhanced-styles@)
* [dn_sketchingenhanced-construction](#bundle=dn_sketchingenhanced-construction@)
* [dn_sketchingenhanced-snappingmanager](#bundle=dn_sketchingenhanced-snappingmanager@)

Es werden die im Sketching implementierten Tools verwendet.
Mithilfe von Esris GeometryEngine werden Längen und Fläche der eingezeichneten Objekte berechnet und
anschließend als TextSymbole an die entsprechenden Objekte geschrieben.
Zusätzlich werden die Messwerte im Messen-Tab des Sketching-Widgets angezeigt und können von dort einfach in die Zwischenablage kopiert werden.

## Verwendung

Um die Funktionen des Mess-Bundles zu benutzen, können Sie im Bundle [dn_sketchingenhanced](#bundle=dn_sketchingenhanced@) mit der Property `measurement: true` die Messfunktionen aktivieren.

## Konfiguration

Um das Bundle in der app.json zu konfigurieren, verwenden Sie die konfigurierbaren, im folgenden Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
 "dn_sketchingenhanced-measurement": {
        "Config": {
            "lineMeasurementTimeout": 100,
            "disabledMeasurementTools": [
                "drawarrowtool",
                "drawfreehandpolygontool",
                "drawfreehandpolylinetool",
                "drawcircletool",
                "drawellipsetool",
                "drawtexttool"
            ],
            "decimalPlacesMeter": 1,
            "decimalPlacesKiloMeter": 2,
            "showLineMeasurementsAtPolylines": true,
            "showLineMeasurementsAtPolygons": false,
            "pointCoordPlaces": "3",
            "pointCoordUnitSymbolX": "°E",
            "pointCoordUnitSymbolY": "°N",
            "srs":{
                "geodetic": [
                    4326,
                    3857,
                    4258
                ],
                "planar": [
                    2398,
                    2399,
                    25832,
                    25833,
                    31466,
                    31467,
                    31468,
                    31469
                ]
            }
            "sketch": {
                 "textSymbol": {
                   "type": "esriTS",
                   "color": {
                     "r": 255,
                     "g": 0,
                     "b": 0,
                     "a": 1
                   },
                   "backgroundColor": [
                     255,
                     255,
                     255,
                     1
                   ],
                   "horizontalAlignment": "left",
                   "font": {
                     "family": "Arial",
                     "size": 16,
                     "style": "normal",
                     "weight": "bold",
                     "decoration": "none"
                   },
                   "haloColor": {
                     "r": 255,
                     "g": 255,
                     "b": 255,
                     "a": 1
                   },
                   "haloSize": 2
                 },
                 "polygonSymbol": {
                   "type": "esriSFS",
                   "color": {
                     "r": 64,
                     "g": 64,
                     "b": 64,
                     "a": 0.4
                   },
                   "style": "solid"
                 },
                 "polylineSymbol": {
                   "color": {
                     "r": 255,
                     "g": 0,
                     "b": 0,
                     "a": 1
                   },
                   "style": "solid",
                   "type": "esriSLS",
                   "width": 2
                 }
            }
        }
 },
```

Dabei sind die Eigenschaften, welche im bereich Sketch gemacht werden Einstellungen für die eingezeichneten Messobjekte in der Karte.



|Property               |Type     |Default         | Description
|-----------------------|---------|----------------|-----------
|lineMeasurementTimeout      |Number    |wie im Beispiel |Zeit die die Maus ruhig gehalten werden muss, damit die aktuelle Messung temporär angezeigt wird
|disabledMeasurementTools          |Array    |wie im Beispiel |ToolIds für die keine Messungen durchgeführt werden sollen
|decimalPlacesMeter          |Number    |wie im Beispiel |Nachkommastellen für Meter-Angaben
|decimalPlacesKiloMeter          |Number    |wie im Beispiel |Nachkommastellen für Kilometer-Angaben
|showLineMeasurementsAtPolylines          |Boolean    |wie im Beispiel |Anzeige der Messwerte an Polylinien (an/aus)
|showLineMeasurementsAtPolygons          |Boolean    |wie im Beispiel |Anzeige der Messwerte von Linien an Polygonen (an/aus)
|pointCoordPlaces          |Number    |wie im Beispiel |Nachkommastellen der Koordinatenanzeige
|pointCoordUnitSymbolX          |String    |wie im Beispiel |x-Label für Koordinatenanzeige
|pointCoordUnitSymbolY          |String    |wie im Beispiel |y-Label für Koordinatenanzeige
|srs          |Array    |wie im Beispiel |WKIDs planarer und geodätisch Koordinatensysteme
|sketch          |Object    |wie im Beispiel |Einstellungen für die eingezeichneten Messobjekte in der Karte.
