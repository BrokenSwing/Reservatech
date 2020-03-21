import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appRegex]',
  providers: [{provide: NG_VALIDATORS, useExisting: RegexDirective, multi: true}]
})
export class RegexDirective implements Validator {

  @Input('appRegex') regex: string;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.regex) {
      return null;
    }
    const exp = new RegExp(this.regex);
    return exp.test(control.value) ? null : { regex: 'Value does not match regex' };
  }

}
