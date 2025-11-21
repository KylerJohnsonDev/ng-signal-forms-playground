import { SchemaPath, pattern } from '@angular/forms/signals';

/**
 * Validates phone number in the format xxx-xxx-xxxx
 */
export function validatePhoneNumber(path: SchemaPath<string>): void {
    pattern(path, /^\d{3}-\d{3}-\d{4}$/, {
        message: 'Phone number must be in the format xxx-xxx-xxxx'
    });
}
