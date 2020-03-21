import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appMin]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinDirective, multi: true}]
})
export class MinDirective implements Validator {

  @Input() min: string;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.min) {
      const minimum = parseInt(this.min, 10);
      if (isNaN(minimum)) {
        return { min: 'Invalid min value' };
      }

      const formValue = parseInt(control.value, 10);
      if (isNaN(formValue)) {
        return { min: `Value ${control.value} is not a number`};
      }

      return formValue >= minimum ? null : { min: `Expected min value ${minimum}, got ${formValue} : ${formValue} < ${minimum}` };
    }
  }

}
