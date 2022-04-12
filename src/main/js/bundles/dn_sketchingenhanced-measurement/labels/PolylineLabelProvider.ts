import type { MeasurementLabelProvider } from "./MeasurementLabelProvider";

export class PolylineLabelProvider {
    private labelProvider: MeasurementLabelProvider;
    private showTotalLength = true;

    constructor(labelProvider: MeasurementLabelProvider, showTotalLength: boolean) {
        this.labelProvider = labelProvider;
        this.showTotalLength = showTotalLength;
    }

    public getLabel(totalLength: string): string {
        if (!this.showTotalLength) {
            return '';
        }

        return this.labelProvider?.getLabel(totalLength, "totalLength");
    }
}