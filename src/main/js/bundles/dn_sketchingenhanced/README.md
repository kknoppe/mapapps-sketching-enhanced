# dn_sketchingenhanced

Dieses Bundle erstellt Layout-Widgets, mit denen die Sketching-, Konstruktion- uns Snappingfunktionen leicht verwendet werden können. Hierzu werden die Funktionen durch Laden der folgenden Bundles implementiert:

* [dn_sketchingenhanced-tools](#bundle=dn_sketchingenhanced-tools@)
* [dn_sketchingenhanced-command](#bundle=dn_sketchingenhanced-command@)
* [dn_sketchingenhanced-styles](#bundle=dn_sketchingenhanced-styles@)
* [dn_sketchingenhanced-construction](#bundle=dn_sketchingenhanced-construction@)
* [dn_sketchingenhanced-snappingmanager](#bundle=dn_sketchingenhanced-snappingmanager@)
* [dn_sketchingenhanced-measurement](#bundle=dn_sketchingenhanced-measurement@)

## Usage

1. Install the vue-color bundle: https://github.com/conterra/mapapps-vue-color
2. Add the dn_sketchingenhanced bundle to your app.


## Verwendung

Um die Funktionen dieses Bundles zu benutzen, können Sie das Werkzeug "SketchingEnhancedWidgetToggleTool" im Werkzeugsatz hinzufügen. Die Werkzeug-ID ist:

| Tool ID                           | Component                         | Description                      |
|-----------------------------------|-----------------------------------|----------------------------------|
| sketchingEnhancedWidgetToggleTool | SketchingEnhancedWidgetToggleTool | Zeichnen- und Editier-Werkzeuge. |

## Configuration Reference

Um das Bundle in der app.json zu konfigurieren, verwenden Sie die konfigurierbaren, im folgenden Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"dn_sketchingenhanced": {
    "Config": {
        "measurement": false,
        "showKeepMeasurements": false,
        "multipleMeasurementsEnabled": true,
        "lineMeasurementTimeout": 100,
        "firstToolGroupIds": [
          "drawpointtool",
          "sketchinglinegroup",
          "sketchingpolygongroup",
          "drawtexttool"
        ],
        "lastToolGroupIds": [
          "sketchingtoolbox"
        ],
        "activeToolOnStartup": "none",
        "headerToolIds": [
           "drawundotool",
           "drawredotool",
           "drawcanceltool"
        ]       ,
       "measurementUnits": {
              "area": ["auto","Quadratmeter","Hektar","Quadratkilometer"],
              "length": ["auto","Meter","Kilometer"],
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
                        "systemLabel": "DHDN3 Gaus-Krüger",
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
       },
    }
}
```

| Property              | Type    | Possible Values               | Default                  | Description                                                |
|-----------------------|---------|-------------------------------|--------------------------|------------------------------------------------------------|
| measurement           | Boolean | ```true``` &#124; ```false``` |                          | Messmodus aktivieren                                       |
| firstToolGroupIds     | Array  |                               | wie im Beispiel          | Werkzeug-Ids, die im Widget in der linken Hälfte angezeigt werden         |
| lastToolGroupIds      | Array   |                               | wie im Beispiel          | Werkzeug-Ids, die im Widget im Header rechts angezeigt werden        |
| activeToolOnStartup   | String   |                               | wie im Beispiel          | Werkzeug-Id des Tools, welches beim Öffnen des Widgets aktiviert wird        |
| headerToolIds         | Array   |                               | wie im Beispiel          | Werkzeug-Ids, die im Header des Widget angezeigt werden    |
| measurementUnits      | Object   |                               | wie im Beispiel          | Einheiten für Fläche, Länge und die auszuwählenden Koordinatensysteme   |
| showKeepMeasurements  | Boolean   | ```true``` &#124; ```false``` | wie im Beispiel          |  Button für Mehrfachmessungen anzeigen  |
| multipleMeasurementsEnabled  | Boolean   | ```true``` &#124; ```false``` | wie im Beispiel   | Mehrfachmessungen initial aktivieren  |
| lineMeasurementTimeout | Integer | 1..n milliseconds | wie im Beispiel | Verzögerung für die Anzeige von Linienmessungen |
