import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, schema, required, pattern, minLength, Field } from '@angular/forms/signals';
import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';

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
    imports: [CommonModule, Field, Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, Listbox, Option, OverlayModule],
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

    // 2. Define Validation Schema
    patientSchema = schema((patient: any) => {
        required(patient.fullName);
        minLength(patient.fullName, 3);
        required(patient.dateOfBirth);
        required(patient.phoneNumber);
        pattern(patient.phoneNumber, /^\d{3}-\d{3}-\d{4}$/, { message: 'Invalid phone number format (xxx-xxx-xxxx)' });
        required(patient.primaryComplaint);
        required(patient.consentToTreat);
    });

    // 3. Create the form
    intakeForm = form(this.patient, this.patientSchema);

    genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ];

    genderDisplayValue = computed(() => {
        const value = this.patient().gender;
        const option = this.genderOptions.find(o => o.value === value);
        return option ? option.label : 'Select Gender';
    });

    setGender(value: string) {
        this.patient.update(p => ({ ...p, gender: value }));
    }

    currentStep = 1;

    nextStep() {
        if (this.currentStep < 3) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

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

    onSubmit() {
        if (!this.intakeForm().invalid()) {
            console.log('Patient Intake Form Submitted:', this.patient());
            alert('Form Submitted! Check console for values.');
        } else {
            console.log('Form Invalid');
        }
    }
}
