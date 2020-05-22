import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Customer } from '../customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const { value } = control;
    if (value !== null && (isNaN(value) || value < min || value > max)) {
      return { 'range': true };
    }
    return null;
  }
}

function emailMatcher(control: AbstractControl): { [key: string]: boolean } | null {
    const emailControl = control.get('email');
    const confirmEmailControl = control.get('confirmEmail');
    
    if (emailControl.pristine || confirmEmailControl.pristine) {
      return null;
    }

    return emailControl.value === confirmEmailControl.value ?
      null:
      { 'match': true };
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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
      phone: '',
      notification: 'email',
      rating: [null,ratingRange(1,5)],
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
      emailGroup:{
        email: 'abdelhamid@helloworld.com',
        confirmEmail: 'abdlhamid@helloworld.com',
      },
      notification: 'text',
      phone: '123456789',
      rating: 3,
      sendCatalog: false
    });
  }

  populatePartialTestData() {
    this.customerForm.patchValue({
      firstName: 'Lily'
    });
  }
}