import { schema, required, minLength, debounce } from '@angular/forms/signals';
import { PatientIntake } from './signal-form.component';
import { validatePhoneNumber } from './validators/phone-number.validator';

/**
 * Patient Intake Form Schema
 * Defines all validation rules for the patient intake form
 */
export const patientIntakeSchema = schema<PatientIntake>((path) => {
    // Add debouncing to improve performance
    debounce(path, 300);

    // Personal Information validations
    required(path.fullName, { message: 'Full Name is required.' });
    minLength(path.fullName, 3, { message: 'Full Name must be at least 3 characters.' });

    required(path.dateOfBirth, { message: 'Date of Birth is required.' });

    // Phone number validation using custom validator
    required(path.phoneNumber, { message: 'Phone Number is required.' });
    validatePhoneNumber(path.phoneNumber);

    // Medical History validations
    required(path.primaryComplaint, { message: 'Primary Complaint is required.' });

    // Insurance validations - Policy Number is conditionally required
    required(path.policyNumber, {
        message: 'Policy Number is required when Insurance Provider is specified.',
        when: (ctx) => {
            const insuranceProvider = ctx.valueOf(path.insuranceProvider);
            return insuranceProvider !== null && insuranceProvider !== undefined && insuranceProvider.trim() !== '';
        }
    });

    // Consent validation
    required(path.consentToTreat, { message: 'You must consent to treatment to proceed.' });
});
