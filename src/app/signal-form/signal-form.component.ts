import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, schema, required, pattern, Field } from '@angular/forms/signals';

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
    imports: [CommonModule, Field],
    templateUrl: './signal-form.component.html',
    styleUrls: ['./signal-form.component.css']
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
        required(patient.dateOfBirth);
        required(patient.phoneNumber);
        pattern(patient.phoneNumber, /^\d{3}-\d{3}-\d{4}$/, { message: 'Invalid phone number format (xxx-xxx-xxxx)' });
        required(patient.primaryComplaint);
        required(patient.consentToTreat);
    });

    // 3. Create the form
    intakeForm = form(this.patient, this.patientSchema);

    currentStep = 1;

    nextStep() {
        if (this.currentStep < 3) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            } else {
                // Mark fields as touched to show errors
                this.markStepAsTouched();
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

    markStepAsTouched() {
        // Implementation for marking touched if needed
        // In a real app, we might iterate over fields in the current step and mark them touched
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
