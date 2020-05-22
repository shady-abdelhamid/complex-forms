import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Customer } from '../customer';

function ratingRange(control: AbstractControl): { [key: string]: boolean } | null {
  const { value } = control;
  if (value !== null && (isNaN(value) || value < 1 || value > 5)) {
    return { 'range': true };
  }
  return null;
}

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      notification: 'email',
      rating: [null,ratingRange],
      sendCatalog: false,
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  populateTestData() {
    this.customerForm.setValue({
      firstName: 'Adam',
      lastName: 'Abdelhamid',
      email: 'abdelhamid@helloworld.com',
      notification: 'text',
      phone: '123456789',
      sendCatalog: false
    });
  }

  populatePartialTestData() {
    this.customerForm.patchValue({
      firstName: 'Lily'
    });
  }
}