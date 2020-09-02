/*
 * Copyright (C) 2020 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = {
    bundleName: 'Sketching Enhanced',
    bundleDescription: 'Sketching Enhanced',
    ui: {
        windowTitle: 'Zeichnen',
        activeConstructionLength: 'Länge',
        activeConstructionAngle: 'Winkel',
        turnOnVisibility: 'Zeichnungen einblenden',
        turnOffVisibility: 'Zeichnungen ausblenden',
        addNewSketchingLayer: 'Neuen Layer anlegen',
        notAddNewSketchingLayer: 'Kein Tool ausgewählt',
        layerLimitReached: 'Maximale Layerzahl erreicht',
        profileLoaded: 'Aufzeichnung aktiv',
        enableMeasurements: 'Messen aktivieren',
        disableKeepMeasurements: 'Alte Messungen löschen',
        enableKeepMeasurements: 'Messungen beibehalten',
        textEditor: {
            bold: 'Fett',
            italic: 'Kursiv',
            underlined: 'Unterstrichen',
            blurSize: 'Größe',
            textFontButton: 'Schriftart',
            textColorButton: 'Schriftfarbe',
            textStyleButton: 'Schriftstil',
            textSizeButton: 'Schriftgröße',
            textBlurButton: 'Schrifteffekt',
            textAngleButton: 'Textrotation',
            angle: 'Winkel',
            rules: {
                required: 'Wert wird ben\u00f6tigt',
                number: 'Wert muss vom Typ number sein',
                string: 'Wert muss vom Typ string sein',
                invalidPattern: 'Wert muss vom Typ number-number sein',
                tooBig: 'Maximum 360°',
                tooSmall: 'Minimum 0°',
            },
        },
        symbolEditor: {
            title: 'Symbol anpassen',
            layerLabel: 'Layer wählen',
            fieldLabel: 'Spalte auswählen',
            methodLabel: 'Methode wählen',
            unique: 'Eine einzige Farbe verwenden',
            classBreaks: 'Unterschiedliche Farben nach Spalte verwenden',
            openFillStyleMenuTooltip: 'Füllung',
            openLineStyleEditorTooltip: 'Umrisslinie',
            textFieldLabel: 'Werte: ',
            textFieldLabelUniqueValue: 'Wert',
            scaleVisibility: 'Maßstabsabhängigkeit Sichtbarkeit anpassen',
            styleModifier: 'Angepasste Visualisierung',
            sliderLabel: 'Transparenz',
            singleSymbolLabel: 'Einzelsymbol',
            categoriesLabel: 'Kategorie',
            lineStyleSelectorTooltip: 'Linienstil',
            PointSymbolSelectorTooltip: 'Punktsymbol',
            lineWeightSliderLabel: 'Linienstärke',
            colorPickerPointTooltip: 'Punktfarbe',
            noFillTitle: 'Keine',
            noLineTitle: 'Keine',
            colorPickerFillTooltip: 'Füllungsfarbe',
            fillStyleSelectorTooltip: 'Füllung',
            colorPickerLineTooltip: 'Linienfarbe',
            undo: 'Zurück',
            lineSizeLabel: 'Größe',
            pointRadiusSliderLabel: 'Punktgröße',
            colorBtnLabel: 'FüllFarbe',
            categorySelectorLabel: 'Kategorien',
            textEditor: 'Text Editor aktivieren',
            layerEditingWarning: 'Die Symbolisierung des Layers sollte nicht verändert werden',
            colorGradientLineSelectorLabel: 'Farbverlauf selektieren',

            loadingLayerMessage: 'Layer wird geladen...',
            loadingValuesMessage: 'Werte werden geladen...',
            applyChangesBtnTooltip: 'Änderungen vornehmen',
            discardChangesBtnTooltip: 'Änderungen verwerfen',
            colorPathLabel: '',
            getChanges: 'Ändern',
            noFieldsForSymbology: 'Es stehen keine Felder zur Verfügung',
            colorPickerLabel: 'Farbe selektieren',
            rules: {
                required: 'Wert wird ben\u00f6tigt',
                number: 'Wert muss vom Typ number sein',
                string: 'Wert muss vom Typ string sein',
                invalidPattern: 'Wert muss vom Typ number-number sein',
            },
        },
        measurement: {
            showLineMeasurementsAtPolylines: 'Zeige Länge von Linienelementen',
            showLineMeasurementsAtPolygons: 'Zeige Kantenlänge von Polygonen',
            coordinates: 'Koordinaten: ',
            totalLength: 'Gesamtlänge: ',
            currentLength: 'Aktuelle Teilstrecke: ',
            aggregateLength: 'Aktuelle Gesamtlänge: ',
            area: 'Gesamtfläche: ',
            currentArea: 'Aktuelle Fläche: ',
            perimeter: 'Umfang: ',
            copyToClipboard: 'Kopieren'
        },
        layerEditor: {
            header: 'Sketching-Layer-Übersicht',
            noProfiles: 'Es wurden noch keine Sketching-Layer angelegt.',
            noProfileTemplates: 'Es wurden noch keine Vorlagen angelegt.',
            allProfilesFiltered: 'Zu dem Filter sind keine Layer vorhanden.',
            tab_profiles: 'Persönlich',
            tab_templates: 'Vorlagen',
            noDescription: 'Keine Beschreibung',

            // Tooltips
            tooltip_import: 'Import',
            tooltip_addProfile: 'Neuen Layer anlegen',
            tooltip_edit: 'Beschreibung bearbeiten',
            tooltip_edit_save: 'Speichern',
            tooltip_edit_cancel: 'Abbrechen',
            tooltip_delete: 'Layer löschen',
            tooltip_copy: 'Layer kopieren',
            tooltip_setAsDefault: 'Layer als Standard setzen',
            tooltip_download: 'Layer exportieren',
            tooltip_sort: 'Liste sortieren',
            tooltip_selection_start: 'Mehrfachauswahl einschalten',
            tooltip_selection_stop: 'Mehrfachauswahl ausschalten',
            tooltip_addToMyThemes: 'In Meine Themen laden',
            tooltip_removeFromMyThemes: 'Aus Meine Themen entfernen',
            tooltip_recordInLayer: 'In Layer aufzeichnen',
            tooltip_pauseRecordingInLayer: 'Aufzeichnung beenden',

            // Profile properties
            createdAt: 'Erstellt am ${p1}, ${p2} Uhr', //NOSONAR
            modifiedAt: 'Geändert am ${p1}, ${p2} Uhr', //NOSONAR
            title: 'Name',
            description: 'Beschreibung',

            // Store
            profileStore: 'Layerspeicher',

            // Edit page
            editProfile_header: 'Neuen Layer anlegen',
            editProfile_saveAs: 'Anlegen als',
            editProfile_optPersonal: 'Persönliche Vorlage',
            editProfile_optTemplate: 'Layervorlage',
            editProfile_optional: 'optional',
            editProfile_setAsDefault: 'Als Standardprofil festlegen',
            copy_appendix: ' (Kopie)',

            // Rules
            title_required: 'Name ist ein Pflichtfeld',
            title_maxlength: 'Maximal ${p1} Zeichen erlaubt', //NOSONAR
            title_unique: 'Es gibt bereits einen Layer mit diesem Namen!',
            description_maxlength: 'Maximal ${p1} Zeichen erlaubt', //NOSONAR

            // Delete dialog
            deleteProfile_header: 'Layer löschen?',
            deleteProfile_text: 'Möchten Sie wirklich den Layer "${p1}" löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.', //NOSONAR
            deleteProfile_multiheader: 'Layer löschen?',
            deleteProfile_multitext: 'Möchten Sie wirklich diese ${p1} Layer löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.', //NOSONAR
            deleteProfile_confirm: 'Ja',
            deleteProfile_cancel: 'Abbrechen',

            // Set as default profile dialog
            setAsDefaultProfile_header: 'Layer als Standard setzen?',
            setAsDefaultProfile_text: 'Möchten Sie wirklich den Layer "${p1}" als Standard setzen?', //NOSONAR
            setAsDefaultProfile_confirm: 'Ja',
            setAsDefaultProfile_cancel: 'Abbrechen',

            // Sort items
            sort_title: 'Nach Name',
            sort_creationdate: 'Nach Erstellungsdatum',

            // Import page
            importProfile_header: 'Layer importieren',
            importProfile_cancel: 'Abbrechen',
            importProfile_invalidFile: 'Ungültige Datei!',

            // Download page
            downloadProfile_header: 'Layer exportieren',
            downloadProfile_cancel: 'Abbrechen',
            downloadProfile_filename: 'Dateiname',
            downloadProfile_emptyFilename: 'Der Dateiname darf nicht leer sein!',
            downloadProfile_invalidFilename: 'Der Dateiname ist ungültig!',
            downloadProfile_summary_single: 'Der folgende Layer wird exportiert:',
            downloadProfile_summary: 'Die folgenden ${p1} Layer werden exportiert:', //NOSONAR
        },
    },
    tool: {
        title: 'Zeichnen',
        tooltip: 'Zeichenwerkzeuge',
    },
};
