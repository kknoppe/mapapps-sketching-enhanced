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
const mainTitle = 'Symbolisierung anpassen';
const submit = 'Änderungen übernehmen';
const discard = 'Änderungen verwerfen';
module.exports = {
    bundleName: 'Symbol Editor',
    bundleDescription: 'Das Bundle erm\u00f6glicht es das Symbol eines Feature Layer oder Graphik Layer zu editieren',
    windowTitle: mainTitle,
    tool: {
        title: mainTitle,
        tooltip: mainTitle,
    },
    ui: {
        scaleVisibilityBtnTooltip: 'Maßstabhängige Sichtbarkeit anpassen',
        textEditorBtnTooltip: 'Beschriftung anpassen',
        styleEditorBtnTooltip: 'Symbol anpassen',
        layerEditedInfoLog: 'Layer wurde erfolgreich geändert',
        notStartable: 'Der Editor konnte nicht gestartet werden!',

        scaleEditor: {
            title: 'Maßstabsabhängige Sichtbarkeit',
            submit,
            discard,
        },
        labelEditor: {
            title: 'Beschriftung anpassen',
            visible: 'Sichtbar',
            select_field: 'Beschriftungsfeld wählen',
            visible_scale_between: 'Sichtbar im Maßstab von ${p1} bis ${p2}.', // NOSONAR
            visible_scale_larger: 'Sichtbar ab ${p1} und größer.', // NOSONAR
            visible_scale_smaller: 'Sichtbar ab ${p1} und kleiner.', // NOSONAR
            default_tag: 'Standard',
            noFieldsForLabeling: 'Es stehen keine Felder zur Verfügung',
            layerLabelingWarning: 'Dieser Layer unterstützt keine Beschriftungen!',

            submit,
            discard,
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

            submit,
            discard,
        },
        errors: {
            noResultsError: 'Keine Ergebnisse f\u00fcr Ihre Abfrage gefunden!',
            'FIELD_NOT_IN_LAYER': 'Das Feld existiert nicht in diesem Layer!',
        },
    },
};
