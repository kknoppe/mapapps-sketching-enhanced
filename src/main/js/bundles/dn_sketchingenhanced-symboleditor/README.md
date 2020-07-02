## symboleditor

Dieses Bundle stellt ein Widget zur Anpassung der Symbolisierung eines Layers bereit. Es ist durch die Widget-role symbolEditor verfügbar.

## Verwendung

Das Bundle symboleditor ermöglicht dem Anwender, die Visualisierung eines Layers durch maßstabsabhängige Sichtbarkeit, 
Beschriftung und Symboleditierung anzupassen. 
Um die maßstabsabhängige Sichtbarkeit anpassen zu können, 
wird ein Slider für die Auswahl des Maßstabsbereichs zur Verfügung gestellt. 
Als Auswahlmöglichkeiten für die Beschriftungen eines Layers wird eine konfigurierbare Liste von Attributen des Layers verwendet.

Die Symboleditierung des Layers kann auf zwei verschiedene Weisen erfolgen:

* Die Editierung des Einzelsymbols visualisiert alle Features eines Layers einheitlich mit dem ausgewählten Symbol.
* Die Editierung nach Kategorien ermöglicht es unterschiedliche Ausgestaltungen für verschiedene Attributwerte 
eines Layers zu definieren.
 
Dieses Bundle wird im Bundle **map_content** integriert.

Beim ersten Laden der Komponente werden Standardinformationen vom ArcGIS-Server heruntergeladen.
Das Bundle erkennt selbstständig den Geometrie-Typ (Punkt, Linie, Polygon) und die Individualisierungsmöglichkeiten des Layers.

**Beispiel**: Besitzt der Layer keine Labels (Beschriftungen), so wird dies im Beschriftungseditor angezeigt 
und die Individualisierung unterbunden. 

Alle 3 Visualisierungseditoren verfügen über eine "Änderungen speichern"- und "Änderungen verwerfen"-Schaltfläche.
Damit ist es dem Anwender möglich zum zuletzt gespeicherten Zustand zurückzukehren.

Darüberhinaus kann der gesamte Zustand des Bundles in einem myDSA-Profil gespeichert werden.


## Konfigurationsreferenz
Es wurden keine Konfigurationseigenschaften implementiert.
Die Layer-Konfigurationen müssen im jeweiligen Datenquellen-Bundle erfolgen.
