import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent {
  intakeForm: FormGroup;
  currentStep = 1;

  constructor(private fb: FormBuilder) {
    this.intakeForm = this.fb.group({
      // Step 1
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],

      // Step 2
      allergies: [''],
      medications: [''],
      primaryComplaint: ['', Validators.required],

      // Step 3
      insuranceProvider: [''],
      policyNumber: [''],
      consentToTreat: [false, Validators.requiredTrue]
    });
  }

  nextStep() {
    if (this.currentStep < 3) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      } else {
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
      const nameValid = this.intakeForm.get('fullName')?.valid ?? false;
      const dobValid = this.intakeForm.get('dateOfBirth')?.valid ?? false;
      const phoneValid = this.intakeForm.get('phoneNumber')?.valid ?? false;
      return nameValid && dobValid && phoneValid;
    } else if (this.currentStep === 2) {
      return this.intakeForm.get('primaryComplaint')?.valid ?? false;
    }
    return true;
  }

  markStepAsTouched() {
    if (this.currentStep === 1) {
      this.intakeForm.get('fullName')?.markAsTouched();
      this.intakeForm.get('dateOfBirth')?.markAsTouched();
      this.intakeForm.get('phoneNumber')?.markAsTouched();
    } else if (this.currentStep === 2) {
      this.intakeForm.get('primaryComplaint')?.markAsTouched();
    }
  }

  onSubmit() {
    if (this.intakeForm.valid) {
      console.log('Reactive Form Submitted:', this.intakeForm.value);
      alert('Form Submitted! Check console for values.');
    } else {
      this.intakeForm.markAllAsTouched();
      console.log('Form Invalid');
    }
  }
}
