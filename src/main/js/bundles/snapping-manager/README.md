# snapping-manager

Dieses Bundle implementiert die Snapping-Funktion für Sketching:
* [sketching-tools](#bundle=sketching-tools@)

## Usage

Es ist keine Konfiguration erforderlich! Default-Werte werden angewendet.

## Configuration Reference

Um das Bundle in app.json zu konfigurieren, verwenden Sie die konfigurierbaren, wie folgende Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"feature-editor": {
    "Config": {
        "alwaysSnap": true,
        "snapKey": "alt",
        "tolerance": 15,
        "snapPointSymbol": {
            "color": [
                102,
                205,
                0,
                100
            ],
            "size": 15,
            "type": "esriSMS",
            "style": "esriSMSCross",
            "outline": {
                "color": [
                    0,
                    0,
                    0,
                    255
                ],
                "width": 1,
                "type": " esriSLS",
                "style": "esriSLSSolid"
            }
        },
        "snapPointObjectSymbol": {
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
                    0,
                    0,
                    0,
                    255
                ],
                "width": 1,
                "type": " esriSLS",
                "style": "esriSLSSolid"
            }
        },
        "snapPolygonObjectSymbol": {
            "type": "esriSFS",
            "color": [
                102,
                205,
                0,
                100
            ],
            "outline": {
                "color": [
                    0,
                    0,
                    0,
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
        "snapPolylineObjectSymbol": {
            "color": [
                102,
                205,
                0,
                255
            ],
            "style": "esriSLSSolid",
            "type": "esriSLS",
            "width": 2.5
        }
    }
}
```

|Property                         |Type     |Description|Default
|---------------------------------|---------|-----------|-----------
|`alwaysSnap`                     |Boolean  |Definiert, ob Snapping-Funktion standard aktiviert ist|true
|`snapKey`                        |String   |Definiert ein Kontroll Key, wenn es dauert gedruckt wird, wird Snapping-Funktion entgegen dem Definitionwert `alwaysSnap` aktiviert oder deaktiviert. Mögliche Werte: alt, ctrl, shift|alt
|`tolerance`                      |Number   |Definiert den Radius des Snapping-Kreises in Pixel|15
|`snapPointSymbol`                |Object   |Ein Symbol, das zur Darstellung der Snapping-Punkt(Cursor) verwendet wird|wie im Beispiel
|`snapPointObjectSymbol`          |Object   |Ein Symbol, das zur Darstellung der gefangenen Punktgeometrie verwendet wird|wie im Beispiel
|`snapPlygonObjectSymbol`         |Object   |Ein Symbol, das zur Darstellung der gefangenen Polygongeometrie verwendet wird|wie im Beispiel
|`snapPolylineObjectSymbol`       |Object   |Ein Symbol, das zur Darstellung der gefangenen Polyliniengeometrie verwendet wird|wie im Beispiel


```json
"feature-editor": {
    "SnappingSourceModel": {
        "maxLength": 1000,
        "stores": [
          "portfolioObjekt_store",
          "bestands-objekte-omnisearch"
        ]
    }
}
```

|Property               |Type     |Description|Default
|-----------------------|---------|-----------|-----------
|`maxLength`            |Number   |Definiert eine max. Anzahl der Features.|0(keine Beschränkung).
|`stores`               |Array    |Definiert eine Store-Liste der Layeres für Snapping.|Alle in der Karten sichtbaren Layeres.


```json
"feature-editor": {
    "SnappingGraphicLayerSourceModel": {
        "maxLength": 1000
    }
}
```

|Property               |Type     |Description|Default
|-----------------------|---------|-----------|-----------
|`maxLength`            |Number   |Definiert eine max. Grafikanzahl.|0(keine Beschränkung).
