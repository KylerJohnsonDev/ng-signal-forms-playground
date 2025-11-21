import { Component, input, computed } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Component({
    selector: 'app-validation-errors',
    imports: [],
    template: `
        @if (errorMessages().length > 0) {
            <div class="validation-errors">
                @for(message of errorMessages(); track message) {
                    <div class="error-message">{{ message }}</div>
                }
            </div>
        }
    `,
    styleUrl: './validation-errors.component.css'
})
export class ValidationErrorsComponent {
    errors = input.required<ValidationError[]>();
    showFieldNames = input(false);

    errorMessages = computed(() =>
        this.errors().map(error => {
            const prefix = this.showFieldNames() ? this.getFieldName(error) + ': ' : '';
            const message = error.message ?? this.getDefaultMessage(error);
            return prefix + message;
        })
    );

    private getFieldName(error: ValidationError): string {
        if ('field' in error && error.field) {
            const field = error.field as any;
            if (field.name && typeof field.name === 'function') {
                return field.name().split('.').at(-1) || '';
            }
        }
        return '';
    }

    private getDefaultMessage(error: ValidationError): string {
        switch (error.kind) {
            case 'required':
                return 'This field is required';
            case 'minLength':
                return 'Minimum length not met';
            case 'pattern':
                return 'Invalid format';
            case 'min':
                return 'Value is below minimum';
            case 'max':
                return 'Value exceeds maximum';
            default:
                return error.kind ?? 'Validation error';
        }
    }
}
