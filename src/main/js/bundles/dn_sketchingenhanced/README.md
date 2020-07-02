# dn_sketchingenhanced

Dieses Bundle erstellt Layout-Widgets, mit denen die Sketching-, Konstruktion- uns Snappingfunktionen leicht verwendet werden können. Hierzu werden die Funktionen durch Laden der folgenden Bundles implementiert:

## Usage

Add the dn_sketchingenhanced bundle to your app.

* [tool-binding](#bundle=tool-binding@)
* [sketching-tools](#bundle=sketching-tools@)
* [sketching-command](#bundle=sketching-command@)
* [sketching-styles](#bundle=sketching-styles@)
* [sketching-construction](#bundle=sketching-construction@)
* [snapping-manager](#bundle=snapping-manager@)


## Verwendung

Um die Funktionen dieses Bundles zu benutzen, können Sie das Werkzeug "SketchingWidgetToggleTool" im Werkzeugsatz hinzufügen. Die Werkzeug-ID ist:

| Tool ID                           | Component                         | Description                      |
|-----------------------------------|-----------------------------------|----------------------------------|
| sketchingEnhancedWidgetToggleTool | SketchingEnhancedWidgetToggleTool | Zeichnen- und Editier-Werkzeuge. |

## Konfiguration

Um das Bundle in der app.json zu konfigurieren, verwenden Sie die konfigurierbaren, im folgenden Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"sketching_widget": {
    "SketchingEnhancedWidgetFactory": {
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

```

|Property               |Type     |Description               |Default
|-----------------------|---------|--------------------------|-----------
|firstToolGroupIds      |String   |wie im Beispiel           |Werkzeug-Ids, die im Widget links angezeigt werden
|lastToolGroupIds       |Array    |wie im Beispiel           |Werkzeug-Ids, die im Widget rechts angezeigt werden
|footerToolIds          |Array    |wie im Beispiel           |Werkzeug-Ids, die im Footer des Widget angezeigt werden
