import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const isValid = control.value && control.value.trim().length > 0;
    return isValid ? null : { whitespace: true };
  };
}
