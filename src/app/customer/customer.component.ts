import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../customer';

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
      sendCatalog: false,
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData() {
    this.customerForm.setValue({
      firstName: 'Adam',
      lastName: 'Abdelhamid',
      email: 'abdelhamid@helloworld.com',
      sendCatalog: false
    });
  }

  populatePartialTestData() {
    this.customerForm.patchValue({
      firstName: 'Lily'
    });
  }
}