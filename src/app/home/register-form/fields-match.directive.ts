import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appFieldMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: FieldsMatchDirective, multi: true}]
})
export class FieldsMatchDirective implements Validator {

  @Input('appFieldMatch') fieldNameToMatch: string;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.fieldNameToMatch) {
      const targetedControl = control.root.get(this.fieldNameToMatch);
      if (targetedControl && targetedControl.value === control.value) {
        return null;
      } else {
        return {
          matchError: `Field value does not match ${this.fieldNameToMatch} field value : ${control.value} != ${targetedControl.value}`
        };
      }
    }
    return null;
  }

}
