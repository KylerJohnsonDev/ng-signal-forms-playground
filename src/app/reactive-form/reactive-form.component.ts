import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';

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

  // Signal to track date of birth
  dateOfBirth = signal<string>('');

  // Computed signal to calculate age
  calculatedAge = computed(() => {
    const dob = this.dateOfBirth();
    if (!dob) {
      return '';
    }
    const birthDate = new Date(dob);
    const today = new Date();

    // Calculate total months
    let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());

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

    // Subscribe to dateOfBirth valueChanges to sync with signal
    this.intakeForm.get('dateOfBirth')?.valueChanges.subscribe(value => {
      this.dateOfBirth.set(value || '');
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
