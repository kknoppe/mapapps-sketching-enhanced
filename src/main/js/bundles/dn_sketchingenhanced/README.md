# dn_sketchingenhanced

Dieses Bundle erstellt Layout-Widgets, mit denen die Sketching-, Konstruktion- uns Snappingfunktionen leicht verwendet werden können. Hierzu werden die Funktionen durch Laden der folgenden Bundles implementiert:

## Usage

Add the dn_sketchingenhanced bundle to your app.

* [dn_sketchingenhanced-tools](#bundle=dn_sketchingenhanced-tools@)
* [dn_sketchingenhanced-command](#bundle=dn_sketchingenhanced-command@)
* [dn_sketchingenhanced-styles](#bundle=dn_sketchingenhanced-styles@)
* [dn_sketchingenhanced-construction](#bundle=dn_sketchingenhanced-construction@)
* [dn_sketchingenhanced-snappingmanager](#bundle=dn_sketchingenhanced-snappingmanager@)

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
        "firstToolGroupIds": [
          "drawpointtool",
          "sketchinglinegroup",
          "sketchingpolygongroup",
          "drawtexttool"
        ],
        "lastToolGroupIds": [
          "sketchinglayeradd",
          "sketchingtoolbox"
        ],
        "footerToolIds": [
          "drawundotool",
          "drawredotool",
          "drawcanceltool"
        ]
    }
}
```

| Property              | Type    | Possible Values               | Default                  | Description                                                |
|-----------------------|---------|-------------------------------|--------------------------|------------------------------------------------------------|
| measurement           | Boolean | ```true``` &#124; ```false``` |                          | Messmodus aktivieren                                       |
| firstToolGroupIds     | String  |                               | wie im Beispiel          | Werkzeug-Ids, die im Widget links angezeigt werden         |
| lastToolGroupIds      | Array   |                               | wie im Beispiel          | Werkzeug-Ids, die im Widget rechts angezeigt werden        |
| footerToolIds         | Array   |                               | wie im Beispiel          | Werkzeug-Ids, die im Footer des Widget angezeigt werden    |
