import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Customer } from '../customer';
import { debounceTime } from 'rxjs/operators';
/**
 * a factory function for a custom validaation for value in range
 * @param min minimum value of range
 * @param max maximum value of range
 */
function ratingRange(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const { value } = control;
    if (value !== null && (isNaN(value) || value < min || value > max)) {
      return { 'range': true };
    }
    return null;
  }
}

/**
 * custom validator for cross-field validation for maching mail values
 * @param control form group container
 */
function emailMatcher(control: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = control.get('email');
  const confirmEmailControl = control.get('confirmEmail');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  return emailControl.value === confirmEmailControl.value ?
    null :
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
  emailMessage: string;

  get addresses(): FormArray{
    return <FormArray>this.customerForm.get('addresses');
  }
  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validator: emailMatcher }),
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1, 5)],
      sendCatalog: false,
      addresses: this.fb.array([this.buildAddress()])
    });

    // change validation according notification ways
    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => this.setMessage(emailControl));
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

  /**
   * build empty address formGroup
   */
  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  /**
   * add additional address
   */
  public addAddress(): void {
   this.addresses.push(this.buildAddress());
  }

  /**
   * 
   * @param c 
   */
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }


  populateTestData() {
    this.customerForm.setValue({
      firstName: 'Adam',
      lastName: 'Abdelhamid',
      emailGroup: {
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