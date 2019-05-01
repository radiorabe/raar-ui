import { Component, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BroadcastModel } from "../shared/models/index";
import { BroadcastsService } from "../shared/services/broadcasts.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: "sd-broadcast-description-form",
  templateUrl: "broadcast-description-form.html"
})
export class BroadcastDescriptionFormComponent implements OnChanges {
  @Input() broadcast: BroadcastModel;

  form: FormGroup;

  editing: boolean = false;

  constructor(private broadcastsService: BroadcastsService, fb: FormBuilder) {
    this.form = fb.group({
      details: ""
    });
  }

  ngOnChanges(changes: any) {
    if (changes.broadcast) {
      this.resetForm();
    }
  }

  onSubmit() {
    const model = this.serializeForm();
    this.broadcastsService
      .update(model)
      .pipe(finalize(() => this.cancelEditing()))
      .subscribe(_entry => {
        this.broadcast.attributes.details = model.attributes.details;
      });
  }

  startEditing() {
    this.editing = true;
  }

  cancelEditing() {
    this.editing = false;
    this.resetForm();
  }

  private resetForm() {
    this.form.reset({
      details: this.broadcast.attributes.details
    });
  }

  private serializeForm(): BroadcastModel {
    const formModel = this.form.value;
    const model = new BroadcastModel();
    model.id = this.broadcast.id;
    model.type = this.broadcast.type;
    model.attributes = Object.assign({}, this.broadcast.attributes);
    model.attributes.details = formModel.details.trim();
    return model;
  }
}
