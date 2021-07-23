import { Component, Input } from '@angular/core';

import { OptionDataImplementation } from '../../implementations/option.implementation';

@Component({
    selector: 'option-preview-component',
    templateUrl: './option-preview.component.html',
    styleUrls: ['./option-preview.component.scss']
})
export class OptionPreviewComponent {

    @Input('optionData') public set optionData(optionData: OptionDataImplementation<any> | undefined) {
        if (optionData) {
            try {
                this.preview = JSON.stringify(optionData, null, '   ');
            } catch (_) {
                this.error = 'Failed to parse object.';
            }
        }
    };

    public preview: string = '';
    public error: string = '';

}
