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
  signUpForm: FormGroup;
  currentStep = 1;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      // Step 1
      name: ['', Validators.required],

      // Step 2
      shippingAddress: ['', Validators.required],
      referralSource: ['', Validators.required],

      // Step 3
      newsletter: [false]
    });
  }

  nextStep() {
    if (this.currentStep < 3) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      } else {
        this.signUpForm.markAllAsTouched();
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
      return this.signUpForm.get('name')?.valid ?? false;
    } else if (this.currentStep === 2) {
      const addressValid = this.signUpForm.get('shippingAddress')?.valid ?? false;
      const referralValid = this.signUpForm.get('referralSource')?.valid ?? false;
      return addressValid && referralValid;
    }
    return true;
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Reactive Form Submitted:', this.signUpForm.value);
      alert('Form Submitted! Check console for values.');
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }
}
