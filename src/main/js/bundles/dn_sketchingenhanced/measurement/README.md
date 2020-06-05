# measurement_widget

Dieses Bundle umfasst alle verfügbaren Messfunktionen. Zum einen wird ein Layout-Widget erstellt, mit dem die Messwerkzeuge leicht verwendet werden können. 
Zum Anderen dient die Komponente "PopupViewerMeasurement" zur Bereitstellung der Messfunktionen im Schnittviewer des Rissarchivs.

Für das Mess-Widget werden die Funktionen durch Laden der folgenden Bundles implementiert:

* [tool-binding](#bundle=tool-binding@)
* [sketching-tools](#bundle=sketching-tools@)
* [sketching-command](#bundle=sketching-command@)
* [sketching-styles](#bundle=sketching-styles@)
* [sketching-construction](#bundle=sketching-construction@)
* [snapping-manager](#bundle=snapping-manager@)

Es werden die im Sketching implementierten Tools verwendet.
Im Schnittviewer wird ein einfaches Polyline Tool verwendet, welches auf die Messfunktionen des ebenfalls in diesem Bundle implementierten "MeasurementControllers" zurückgreift.
Mithilfe von Esris GeometryEngine werden Längen und Fläche der eingezeichneten Objekte berechnet und
anschließend als TextSymbole an die entsprechenden Objekte geschrieben. 

## Verwendung

Um die Funktionen des Mess-Widgets dieses Bundles zu benutzen, können Sie das Werkzeug "MeasurementToggleTool" im Werkzeugsatz hinzufügen. Die Werkzeug-ID ist:

|Tool ID                         |Component                          |Description
|--------------------------------|-----------------------------------|-----------------------
|measurementToggleTool             |measurementToggleTool                |Messwerkzeuge.

Die Messfunktionen im Schnittviewer sind über den entsprechenden Button verfügbar und benötigen keine weitere Implementierung.

## Konfiguration

Um das Bundle in der app.json zu konfigurieren, verwenden Sie die konfigurierbaren, im folgenden Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"measurement_widget": {
    "MeasurementFactory": {
        "graphicLayerId": "measurementLayer",
        "firstToolGroupIds": [
            "drawpolylinetool",
            "constructionpolylinetool",
            "drawpolygontool",
            "constructionpolygontool",
            "drawcircletool",
            "drawellipsetool",
            "drawrectangletool"
        ],
        "footerToolIds": [
            "drawundotool",
            "drawredotool",
            "drawcanceltool"
        ],
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
}
```

Dabei sind die Eigenschaften, welche im bereich Sketch gemacht werden Einstellungen für die eingezeichneten Messobjekte, sowohl in der Karte als auch im Schnittviewer. Die weiteren im Konfigurationsbeispiel angegebenen Eigenschaften beziehen sich ausschließlich auf das Mess-Widget.

```

|Property               |Type     |Default         | Description
|-----------------------|---------|----------------|-----------
|firstToolGroupIds      |Array    |wie im Beispiel |Werkzeug-Ids, die im Widget angezeigt werden
|footerToolIds          |Array    |wie im Beispiel |Werkzeug-Ids, die im Footer des Widget angezeigt werden