import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[appAfter]',
  providers: [{provide: NG_VALIDATORS, useExisting: AfterDirective, multi: true}]
})
export class AfterDirective implements Validator {

  @Input('appAfter') after: string;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.after) {
      const targetedControl = control.root.get(this.after);
      if (targetedControl) {
        const isAfter = moment(control.value).isAfter(moment(targetedControl.value));
        return isAfter ? null : { after: `${control.value} is not after ${targetedControl.value}` };
      } else {
        return { after: 'Invalid targeted field' };
      }
    }
    return null;
  }

}
