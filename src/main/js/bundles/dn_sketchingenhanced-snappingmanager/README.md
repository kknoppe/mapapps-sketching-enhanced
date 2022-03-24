# dn_sketchingenhanced-snappingmanager

Dieses Bundle implementiert die Snapping-Funktion für Sketching:
* [dn_sketchingenhanced-tools](#bundle=dn_sketchingenhanced-tools@)

## Usage

Es ist keine Konfiguration erforderlich! Default-Werte werden angewendet.

## Configuration Reference

Um das Bundle in app.json zu konfigurieren, verwenden Sie die konfigurierbaren, wie folgende Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"dn_sketchingenhanced-snappingmanager": {
    "Config": {
        "snappingEnabled": true,
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
                "type": "esriSLS",
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
                "type": "esriSLS",
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

| Property                   | Type    | Description                                                                                                                                                                             | Default         |
|----------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| `snappingEnabled`          | Boolean | Aktiviert oder Deaktiviert das Snapping. Diese Einstellung lässt sich über das Widget zur Laufzeit ändern.                                                                              | true            |
| `tolerance`                | Number  | Definiert den Radius des Snapping-Kreises in Pixel                                                                                                                                      | 15              |
| `snapPointSymbol`          | Object  | Ein Symbol, das zur Darstellung der Snapping-Punkt(Cursor) verwendet wird                                                                                                               | wie im Beispiel |
| `snapPointObjectSymbol`    | Object  | Ein Symbol, das zur Darstellung der gefangenen Punktgeometrie verwendet wird                                                                                                            | wie im Beispiel |
| `snapPlygonObjectSymbol`   | Object  | Ein Symbol, das zur Darstellung der gefangenen Polygongeometrie verwendet wird                                                                                                          | wie im Beispiel |
| `snapPolylineObjectSymbol` | Object  | Ein Symbol, das zur Darstellung der gefangenen Polyliniengeometrie verwendet wird                                                                                                       | wie im Beispiel |

```json
"dn_sketchingenhanced-snappingmanager": {
    "SnappingLayerSourceModel": {
        "allowBasemapSnapping": true,
        "defaultAllowSnapping": false
    }
}
```

| Property               | Type    | Description                                             | Default |
|------------------------|---------|---------------------------------------------------------|---------|
| `allowBasemapSnapping` | Boolean | If set to true, basemaps are used for snapping as well. | true    |
| `defaultAllowSnapping` | Boolean | Default snapping property for each layer                | false   |
