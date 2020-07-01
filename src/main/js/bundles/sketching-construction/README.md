# sketching-construction

Dieses Bundle enthält die Konstruktion-Anwendung für Sketching. Hierzu werden die Funktionen durch Laden der folgenden Bundles implementiert:

* [sketching-tools](#bundle=sketching-tools@)
* [snapping-manager](#bundle=snapping-manager@)


## Usage

Um die Funktionen dieses Bundles zu benutzen, können Sie Werkzeug "SketchingToggleTool" im Werkzeugsatz hinzufügen. Die Werkzeug-ID ist:

|Tool ID                         |Component                          |Description
|--------------------------------|-----------------------------------|-----------------------
|sketchingToggleTool             |SketchingToggleTool                |Zeichnen- und Editier-Werkzeuge.


## Configuration Reference

Um das Bundle in app.json zu konfigurieren, verwenden Sie die konfigurierbaren, wie folgende Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"sketching-construction": {
  "Config": {
        "angleModulus": 45,
        "planarLength": 10,
        "commaPlace": 2,
        "use": {
          "snap": true,
          "angleModulus": false,
          "planarLength": false
        },
        "hotkeys": {
          "snap": ["s","S"],
          "angleModulus": ["w","W"],
          "planarLength": ["l","L"]
        },
        "tools": [
          "drawpolylinetool",
          "drawpolygontool"
        ]
    }
  }
}
```

|Property               |Type     |Description|Default
|-----------------------|---------|-----------|-----------
|`angleModulus`        |number    |Konstruktion: Winkelmodul|
|`planarLength`        |number    |Konstruktion: Länge|
|`commaPlace`          |number    |Konstruktion-Darstellen: Anzahl der Stellen nach dem Komma|
|`use`                 |array     |Welche Konstruktionselemente aktiviert sind|
|`hotkeys`             |array     |Hotkeys zum Konstruktionselemente-Aktivieren / Deaktivieren|
|`tools`               |array     |Tools zum Konstruktion|