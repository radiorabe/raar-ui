import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatedFormComponent } from '../../shared/components/validated-form.component';
import { ShowModel } from '../models/show.model';
import { ShowsService } from '../services/shows.service';

@Component({
  moduleId: module.id,
  selector: 'sd-show-merge',
  templateUrl: 'show-merge.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowMergeComponent extends ValidatedFormComponent implements OnChanges {

  @Input() show: ShowModel;

  constructor(public showsService: ShowsService,
              private router: Router,
              changeDetector: ChangeDetectorRef,
              fb: FormBuilder) {
    super(fb, changeDetector);
  }

  ngOnChanges() {
    this.reset();
  }

  onSubmit() {
    this.submitted = true;
    this.merge();
  }

  reset() {
    this.submitted = false;
    this.form.reset({
      target_id: ''
    });
  }
  protected createForm(fb: FormBuilder) {
    this.form = fb.group({
      target_id: ['', Validators.required]
    });
  }

  private merge() {
    this.showsService
      .mergeEntry(this.show, this.form.value.target_id)
      .subscribe(
        show => this.router.navigate(['shows', show.id]),
        err => this.handleSubmitError(err));
  }
}
