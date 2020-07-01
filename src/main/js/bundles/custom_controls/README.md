# custom_controls

 
Das custom_controls Bundle hat folgenden Verwendungszweck.
 
## Verwendung
Dieses Bundle dient ausschließlich für Entwicklungszwecke.\
Es muss nicht über die app.json in eine App geladen werden!


## Motivation 
Das Bundle stellt Vue-Komponenten bereit, die einen allgemeinen Zweck erfüllen und in unterschiedlichen Bundles verwendet werden können.\

## Komponentenübersicht

Im folgenden werden alle Komponenten dieses Bundles vorgestellt.

### ActionButton
Der ActionButton ist ein Button, der aus einem Icon besteht und einen Tooltip hat.

Properties:

Name | Datentyp | Standardwert | Beschreibung
---|---|---|---
disabled | Boolean | false | Gibt an, ob der Button deaktiviert ist
color | String | "" | Farbe des Buttons
icon | String | "" | Name des Icons
iconColor | String | "" | Farbe des Icons
size | String | "small" | Größe des Buttons ("small" oder "standard")
round | Boolean | true | Gibt an, ob der Button rund ist
flat | Boolean | false | Gibt an, ob der "flat"-Stil für den Button verwendet werden soll
tooltip | String | "bottom" | Position des Tooltips ("top", "bottom", "left" oder "right")  

Slots:

Name | Beschreibung
---|---
default | Text im Tooltip
 
Events:

Name | Parameter | Beschreibung
---|---|---
click | - | Wird ausgelöst, wenn der ActionButton geklickt wurde.

Beispiele:

```html
    <action-button icon="save" color="primary" @click="_handler"></action-button>
```

### control/OverflowTooltip

Der OverflowTooltip ist ein Wrapper für den v-tooltip von Vuetify.
Er erweitert diese Komponente, um die Funktionalität, dass der Tooltip nur angezeigt wird,
wenn der Inhalt im default-Slot nicht genug Platz hat.

Properties:

Es können alle Properties des [v-tooltips](https://v15.vuetifyjs.com/en/components/tooltips) verwendet werden.

Slots:

Name | Beschreibung
---|---
default | Inhalt, der im Tooltip angezeigt werden soll
activator | Inhalt, auf den der Tooltip beim Hover reagieren soll
prepend | Inhalt, der vor dem activator-slot eingefügt werden soll
append | Inhalt, der nach dem activator-slot eingefügt werden soll
 
Beispiele:

```html
    <overflow-tooltip right>
        <span slot="activator">Ich bin der Hauptinhalt</span>
        <span>Mein erklärender Tooltip</span>
    </overflow-tooltip>
```

### form/DropZone

Die DropZone ist ein Steuerelement für die Auswahl von Dateien aus dem Dateisystem des Clients. 
Der Anwender kann mit einem Auswahldialog oder alternativ per Drag&Drop eine oder mehrere Dateien auswählen.

Properties:

Name | Datentyp | Standardwert | Beschreibung
---|---|---|---
allowedFiles | Array | ['jpg', 'bmp', 'png', 'gif', 'tif'] | Dateiendungen der Dateien, die ausgewählt werden sollen.
i18n | Object | siehe ./nls | Sprachtexte
multiple | Boolean | false | Gibt an, ob mehrere Dateien gleichzeitig ausgewählt werden dürfen. 

Slots:

Name | Beschreibung
---|---
default | Text in der Mitte der DropZone
 
Events:

Name | Parameter | Beschreibung
---|---|---
change | [File][webapi-file][] | Wird ausgelöst, wenn eine oder mehrere Dateien ausgewählt wurden.

Beispiele:

```html
    <drop-zone multiple :allowedFiles="['json']" @change="_processFile"></drop-zone>
```

### input/QuickFilter

Der QuickFilter ist ein Eingabeelement, das dazu genutzt werden kann, eine gegebene Liste nach einem Eingabebegriff 
zu filtern. Die Filterlogik selbst muss dabei von der betreffenden umliegenden Komponente implementiert werden, da keine
allgemeine Implementierung für alle Anwendungsfälle existiert.

Allgemeiner stellt der Quickfilter ein Texteingabefeld dar, dessen Eingabe verzögert weitergereicht wird. Die Motivation
ist dabei, dass beim Filtern einer großen Liste von Objekten nicht direkt nach jedem eingegebenen Zeichen gefiltert werden soll.

Properties:

Name | Datentyp | Standardwert | Beschreibung
---|---|---|---
i18n | Object | siehe ./nls | Sprachtexte
disabled | Boolean | false | Gibt an, ob das Element deaktiviert ist. 
delay | Number | 500 | Gibt in Millisekunden an, wie lange die Eingabe verzögert werden soll.
focus | Boolean | false | Falls true, so wird das Textfeld fokussiert.

Beispiele:

```html
    <quick-filter v-model="filter"></quick-filter>
```

### layout/ConfirmationDialog
Der ConfirmationDialog ist ein modales Fenster, welches eine Bestätigung des Anwenders einfordert.
Es sind stets zwei Aktionen verfügbar. Das Dialogfenster schließt sich erst, wenn eine der beiden Aktionen ausgeführt wurde.

Slots:

Name | Beschreibung
---|---
header | Überschrift des Dialogfensters
default | Hauptinhalt des Dialogfensters
confirm | Inhalt der Schaltfläche zum Bestätigen
abort | Inhalt der Schaltfläche zum Abbrechen

Events:

Name | Parameter | Beschreibung
---|---|---
confirm | - | Wird ausgelöst, wenn die Anfrage durch den Anwender positiv quittiert wurde.
abort | - | Wird ausgelöst, wenn die Anfrage durch den Anwender negativ quittiert wurde.

Methoden:

Name | Parameter | Rückgabewert | Beschreibung
---|---|---|---
ask | - | [Promise][webapi-promise] | Öffnet das Dialogfenster und gibt einen Promise zurück, der bei positiver Quittierung resolved und bei negativer Quittierung rejected wird.
abort | - | void | Schließt das Dialogfenster.

Beispiel:

```html
    <confirmation-dialog ref="deleteDialog">
        <template v-slot:header>Datei löschen?</template>
        
        Soll die Datei wirklich gelöscht werden?
        
        <template v-slot:confirm>Ja, bitte</template>
        <template v-slot:abort>Abbrechen</template>
    </confirmation-dialog>
```

```js
    this.$refs.deleteDialog.ask().then(() => {
        // Magic stuff
    });
```


### layout/ExpansionPage
Die ExpansionPage ist ein Container, der mit einer Animation vom unteren Rand über den aktuelle Inhalt schiebt.
Es kann dafür genutzt werden, um die Anzahl an einzelnen Fenstern zu reduzieren, damit der Anwender den Fokus 
für die aktuelle Arbeit behält.

Die Seite besteht aus einem Kopf-, einem Haupt- und einem Fußbereich. Der Fußbereich ist stets am unteren Rand verankert.

Slots:

Name | Beschreibung
---|---
header | Überschrift der Seite
default | Hauptinhalt der Seite
footer | Fußbereich der Seite

Beispiel:

```html
        <expansion-page>
            <template slot="header">Artikel 1</template>
    
            Lorem Ipsum sit dolor amet ...
    
    
            <template slot="footer">
                <action-button :round="false" flat icon="arrow_back" size="standard">
                    Zurück
                </action-button>
            </template>
        </expansion-page>
``` 

[webapi-file]: https://developer.mozilla.org/de/docs/Web/API/File
[webapi-promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
