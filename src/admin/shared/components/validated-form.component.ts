import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

interface ValidationError {
  detail: string,
  source: {
    pointer: string
  }
}

const MESSAGES: any = {
  'required': 'Erforderlich',
  'has already been taken': 'Wird bereits verwendet',
}

export class ValidatedFormComponent {

  constructor(protected changeDetector: ChangeDetectorRef) {
  }

  form: FormGroup;

  submitted: boolean = false;

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

  protected getErrors(control: AbstractControl): string[] {
    return Object.keys(control.errors || {})
      .filter(error => control.errors && control.errors[error])
      .map(error => MESSAGES[error]);
  }

  protected findFieldControl(field: string): AbstractControl {
    let control: AbstractControl = this.form;
    if (field === 'base') {
      control = this.form;
    } else if (this.form.contains(field)) {
      control = this.form.get(field);
    } else if (field.match(/_id$/) && this.form.contains(field.substring(0, field.length - 3))) {
      control = this.form.get(field.substring(0, field.length - 3));
    } else if (field.indexOf('.') > 0) {
      let group = this.form;
      field.split('.').forEach((f) => {
        if (group.contains(f)) {
          control = group.get(f);
          if (control instanceof FormGroup) group = control;
        } else {
          control = group;
        }
      })
    } else {
      // Field is not defined in form but there is a validation error for it, set it globally
      control = this.form;
    }
    return control;
  }

}
