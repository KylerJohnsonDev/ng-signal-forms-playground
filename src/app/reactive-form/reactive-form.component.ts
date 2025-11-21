import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Combobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule, Combobox, ComboboxInput, ComboboxPopupContainer, Listbox, Option, OverlayModule],
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormComponent {
  intakeForm: FormGroup;
  currentStep = 1;

  constructor(private fb: FormBuilder) {
    this.intakeForm = this.fb.group({
      // Step 1
      fullName: ['', [Validators.required, Validators.minLength(3)]],
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

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  get genderDisplayValue(): string {
    const value = this.intakeForm.get('gender')?.value;
    const option = this.genderOptions.find(o => o.value === value);
    return option ? option.label : 'Select Gender';
  }

  setGender(value: string) {
    this.intakeForm.patchValue({ gender: value });
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
