import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

interface ValidationError {
  detail: string;
  source: {
    pointer: string
  };
}

const MESSAGES: any = {
  'required': 'Erforderlich',
  'can\'t be blank': 'Erforderlich',
  'must be blank': 'Muss Voller Zugriff sein',
  'has already been taken': 'Wird bereits verwendet',
  'must be defined': 'muss gesetzt sein',
  'is not included in the list': 'ist kein gültiger Wert',
  'must not be changed': 'darf nicht verändert werden',
  'must decrease over time': 'muss mit der Zeit kleiner werden',
  'delete must be the last action': 'Löschen muss die letzte Aktion sein.',
  'may only contain a-z, 0-9 and \'_\'': 'darf nur aus den Zeichen a-z, 0-9 und _ bestehen',
  'must be less than or equal to 1': 'muss kleiner als die initiale Anzahl Kanäle sein',
  'Cannot delete record because dependent broadcasts exist':
    'Diese Sendung kann nicht gelöscht werden, da sie bereits ausgestrahlt wurde.',
  'Cannot delete record because dependent shows exist':
    'Dieses Profil kann nicht gelöscht werden, da es von Sendungen verwendet wird',
};

export class ValidatedFormComponent {

  form: FormGroup;

  submitted: boolean = false;

  constructor(protected changeDetector: ChangeDetectorRef) {
  }

  formErrors(): string[] | void {
    if (this.submitted && this.form.errors) {
      return this.getErrors(this.form);
    } else {
      return undefined;
    }
  }

  fieldErrors(name: string): string[] | void {
    let control = this.findFieldControl(name);
    if (control && (control.touched || this.submitted) && control.errors) {
      return this.getErrors(control);
    } else {
      return undefined;
    }
  }

  resetFieldErrors(name: string): void {
    this.form.get(name).setErrors(null);
  }

  protected handleSubmitError(error: any) {
    if (error.status === 422) {
      const data = this.collectValidationErrors(error.json());
      Object.keys(data).forEach((field) => {
        this.findFieldControl(field).setErrors(data[field]);
      });
      this.changeDetector.markForCheck();
    }
  }

  protected getErrors(control: AbstractControl): string[] {
    return Object.keys(control.errors || {})
      .filter(error => control.errors && control.errors[error])
      .map(error => MESSAGES[error] || error);
  }

  protected findFieldControl(field: string): AbstractControl {
    let control: AbstractControl = this.form;
    if (field === 'base') {
      control = this.form;
    } else if (this.form.get(field)) {
      control = this.form.get(field);
    } else if (field.match(/_id$/) && this.form.get(field.substring(0, field.length - 3))) {
      control = this.form.get(field.substring(0, field.length - 3));
    } else if (field.indexOf('.') > 0) {
      let group = this.form;
      field.split('.').forEach((f) => {
        if (group.get(f)) {
          control = group.get(f);
          if (control instanceof FormGroup) group = control;
        } else {
          control = group;
        }
      });
    } else {
      // Field is not defined in form but there is a validation error for it, set it globally
      control = this.form;
    }
    return control;
  }

  private collectValidationErrors(res: any): any {
    let errors: any = {};
    res.errors.forEach((e: ValidationError) => {
      const attr = e.source.pointer.split('/').pop();
      if (attr) {
        if (!errors.hasOwnProperty(attr)) {
          errors[attr] = {};
        }
        errors[attr][e.detail] = true;
      }
    });
    return errors;
  }

}
