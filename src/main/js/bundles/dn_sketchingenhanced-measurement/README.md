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
            "componentEnabled": true,
            "disabledMeasurementTools": [
                "drawarrowtool",
                "drawfreehandpolygontool",
                "drawfreehandpolylinetool",
                "drawtriangletool",
                "drawcircletool",
                "drawellipsetool",
                "drawtexttool"
            ],
            "decimalPlacesMeter": 1,
            "decimalPlacesKiloMeter": 2,
            "showLineMeasurementsAtPolylines": true,
            "showLineMeasurementsAtPolygons": false,
            "showAngleMeasurementsAtPolylines": false,
            "enableAngleMeasurement": false,
            "pointCoordPlaces": "3",
            "pointCoordUnitSymbolX": "°E",
            "pointCoordUnitSymbolY": "°N",
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
            },
            "measurementUnits": {
                "area": [
                    "auto",
                    "square-meters",
                    "square-kilometers",
                    "hectares"
                ],
                "length": [
                    "auto",
                    "meters",
                    "kilometers"
                ],
                "point": [
                    {
                        "systemLabel": "WGS 84 (Dezimalgrad)",
                        "systemWkid": 4326
                    },
                    {
                        "systemLabel": "WGS 84 (lat/lon)",
                        "systemWkid": 4326,
                        "transform": "dms"
                    },
                    {
                        "systemLabel": "WGS 84 (Pseudo-Mercator)",
                        "systemWkid": 3857
                    },
                    {
                        "systemLabel": "DHDN3 Gauß-Krüger",
                        "systemWkid": 31467
                    },
                    {
                        "systemLabel": "UTM 32N",
                        "systemWkid": 25832
                    },
                    {
                        "systemLabel": "UTM 33N",
                        "systemWkid": 25833
                    }
                ]
            }
        }
 },
```

Dabei sind die Eigenschaften, welche im bereich Sketch gemacht werden Einstellungen für die eingezeichneten Messobjekte in der Karte.



|Property               |Type     |Default         | Description
|-----------------------|---------|----------------|-----------
|componentEnabled    |Boolean  |true | Gibt an, ob das Messen aktiviert ist
|disabledMeasurementTools          |Array    |wie im Beispiel |ToolIds für die keine Messungen durchgeführt werden sollen
|decimalPlacesMeter          |Number    |wie im Beispiel |Nachkommastellen für Meter-Angaben
|decimalPlacesKiloMeter          |Number    |wie im Beispiel |Nachkommastellen für Kilometer-Angaben
|showLineMeasurementsAtPolylines          |Boolean    |wie im Beispiel |Anzeige der Messwerte an Polylinien (an/aus)
|showLineMeasurementsAtPolygons          |Boolean    |wie im Beispiel |Anzeige der Messwerte von Linien an Polygonen (an/aus)
|showAngleMeasurementsAtPolylines               | Boolean | wie im Beispiel| Anzeige von Winkelmessungen zwischen Polylinien-Teilen (an/aus)
|showTotalLineMeasurementsAtPolylines |Boolean  |true  |Anzeige der Gesamtlänge an Linien
|showCircumferenceMeasurementAtPolygons |Boolean |true |Anzeige des Umfangs der Polygone
|enableAngleMeasurement                 | Boolean | wie im Beispiel | (De-)Aktiviert die Winkelmessfunktion für Polylinien
|pointCoordPlaces          |Number    |wie im Beispiel |Nachkommastellen der Koordinatenanzeige
|pointCoordUnitSymbolX          |String    |wie im Beispiel |x-Label für Koordinatenanzeige
|pointCoordUnitSymbolY          |String    |wie im Beispiel |y-Label für Koordinatenanzeige
|srsDefinition.geodesic   |Number[] | [4326, 102113, 102100, 3857]  | WKIDs der Koordinatensysteme, die geodätisch gemessen werden sollen
|sketch          |Object    |wie im Beispiel |Einstellungen für die eingezeichneten Messobjekte in der Karte.
| measurementUnits      | Object   |                               | wie im Beispiel          | Einheiten für Fläche, Länge und die auszuwählenden Koordinatensysteme   |

## Changelog
### 2.1.12
`Added`
- Konfiguration der Koordinatensysteme für die die Messwerte geodätisch berechnet werden sollen (siehe srsDefinition.geodesic)
- Konfiguration der Einheiten wurde in dieses Bundle verschoben.
