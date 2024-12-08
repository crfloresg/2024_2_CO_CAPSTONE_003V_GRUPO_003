import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appRutValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RutValidatorDirective, multi: true }],
  standalone: true
})
export class RutValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const rut = control.value;
    if (!rut || !/^\d{1,8}-[0-9kK]$/.test(rut)) {
      return { invalidFormat: true };
    }
    
    const [num, dv] = rut.split('-');
    return this.validateRut(num, dv) ? null : { invalidRut: true };
  }

  private validateRut(num: string, dv: string): boolean {
    let total = 0;
    let multiplier = 2;
    
    for (let i = num.length - 1; i >= 0; i--) {
      total += parseInt(num[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const calculatedDv = 11 - (total % 11);
    const expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'k' : calculatedDv.toString();
    
    return expectedDv === dv.toLowerCase();
  }

}
