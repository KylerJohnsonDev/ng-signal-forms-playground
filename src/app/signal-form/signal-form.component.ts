import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { form, Field, submit } from '@angular/forms/signals';
import { Combobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { ValidationErrorsComponent } from '../shared/validation-errors/validation-errors.component';
import { patientIntakeSchema } from './patient-intake.schema';

export type PhoneNumber = string;

export interface PatientIntake {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: PhoneNumber;
    allergies: string;
    medications: string;
    primaryComplaint: string;
    insuranceProvider: string;
    policyNumber: string;
    consentToTreat: boolean;
}

@Component({
    selector: 'app-signal-form',
    imports: [
        Field,
        Combobox,
        ComboboxInput,
        ComboboxPopupContainer,
        Listbox,
        Option,
        OverlayModule,
        ValidationErrorsComponent
    ],
    templateUrl: './signal-form.component.html',
    styleUrls: ['./signal-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormComponent {
    // 1. Define the model signal
    patient = signal<PatientIntake>({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        allergies: '',
        medications: '',
        primaryComplaint: '',
        insuranceProvider: '',
        policyNumber: '',
        consentToTreat: false
    });

    // 2. Create the form with the extracted schema
    intakeForm = form(this.patient, patientIntakeSchema);

    // Gender dropdown options
    genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ];

    // Computed value for gender display
    genderDisplayValue = computed(() => {
        const value = this.patient().gender;
        const option = this.genderOptions.find(o => o.value === value);
        return option ? option.label : 'Select Gender';
    });

    // Computed age calculation from date of birth
    calculatedAge = computed(() => {
        const dob = this.patient().dateOfBirth;
        if (!dob) {
            return '';
        }
        const birthDate = new Date(dob);
        const today = new Date();

        // Calculate total months
        let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth());

        // Calculate days difference
        let days = today.getDate() - birthDate.getDate();
        if (days < 0) {
            totalMonths--;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }

        // Less than 1 month: show in days
        if (totalMonths === 0) {
            const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
            return `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
        }

        // Less than 1 year: show in months and days
        if (totalMonths < 12) {
            if (days === 0) {
                return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
            }
            return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}, ${days} ${days === 1 ? 'day' : 'days'}`;
        }

        // 1 year or older: show age in years
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age.toString();
    });

    // Update gender value
    setGender(value: string) {
        this.patient.update(p => ({ ...p, gender: value }));
    }

    // Stepper state
    currentStep = 1;

    // Navigate to next step
    nextStep() {
        if (this.currentStep < 3) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            } else {
                this.markStepAsTouched();
            }
        }
    }

    // Navigate to previous step
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    // Validate fields for current step
    validateCurrentStep(): boolean {
        if (this.currentStep === 1) {
            return !this.intakeForm.fullName().invalid() &&
                !this.intakeForm.dateOfBirth().invalid() &&
                !this.intakeForm.phoneNumber().invalid();
        } else if (this.currentStep === 2) {
            return !this.intakeForm.primaryComplaint().invalid();
        }
        return true;
    }

    // Mark step fields as touched to show validation errors
    markStepAsTouched() {
        if (this.currentStep === 1) {
            this.intakeForm.fullName().markAsTouched();
            this.intakeForm.dateOfBirth().markAsTouched();
            this.intakeForm.phoneNumber().markAsTouched();
        } else if (this.currentStep === 2) {
            this.intakeForm.primaryComplaint().markAsTouched();
        }
    }

    // Submit form using Signal Forms submit function
    onSubmit() {
        submit(this.intakeForm, async (form) => {
            // Form is valid, process the submission
            console.log('Patient Intake Form Submitted:', form().value());
            alert('Form Submitted Successfully! Check console for values.');

            return null; // No errors
        });
    }
}
