import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, schema, required, Field } from '@angular/forms/signals';

interface User {
    name: string;
    shippingAddress: string;
    referralSource: string;
    newsletter: boolean;
}

@Component({
    selector: 'app-signal-form',
    imports: [CommonModule, Field],
    templateUrl: './signal-form.component.html',
    styleUrls: ['./signal-form.component.css']
})
export class SignalFormComponent {
    // 1. Define the model signal
    user = signal<User>({
        name: '',
        shippingAddress: '',
        referralSource: '',
        newsletter: false
    });

    // 2. Define Validation Schema
    userSchema = schema((user: any) => {
        required(user.name);
        required(user.shippingAddress);
        required(user.referralSource);
    });

    // 3. Create the form
    signUpForm = form(this.user, this.userSchema);

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
            return !this.signUpForm.name().invalid();
        } else if (this.currentStep === 2) {
            return !this.signUpForm.shippingAddress().invalid() && !this.signUpForm.referralSource().invalid();
        }
        return true;
    }

    markStepAsTouched() {
        // Implementation for marking touched if needed
    }

    onSubmit() {
        if (!this.signUpForm().invalid()) {
            console.log('Signal Form Submitted:', this.user());
            alert('Form Submitted! Check console for values.');
        } else {
            console.log('Form Invalid');
        }
    }
}
