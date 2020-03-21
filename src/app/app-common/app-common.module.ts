import { NgModule } from '@angular/core';
import {RegexDirective} from './regex.directive';
import { MinDirective } from './min.directive';
import { AfterDirective } from './after.directive';

@NgModule({
  declarations: [
    RegexDirective,
    MinDirective,
    AfterDirective,
  ],
  imports: [],
  exports: [
    RegexDirective,
    MinDirective,
    AfterDirective
  ]
})
export class AppCommonModule { }
