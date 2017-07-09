import { Injectable } from '@angular/core';
import { CrudRestService } from '../services/crud-rest.service';
import { CrudModel } from '../../../app/shared/models/crud.model';
import { CrudList } from '../../../app/shared/models/crud_list';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ModelsService<T extends CrudModel> {

  protected entries: T[] = [];

  protected readonly sortAttr: string;

  private entries$ = new BehaviorSubject<T[]>([]);

  constructor(private crudRest: CrudRestService<T>) {
    this.reload();
  }

  getEntries(): Observable<T[]> {
    return this.entries$;
  }

  getEntry(id: number): Observable<T> {
    return this.crudRest.get(id).do(e => this.updateListEntry(e));
  }

  storeEntry(entry: T): Observable<T> {
    let action: Observable<T>;
    if (entry.id) {
      action = this.crudRest.update(entry);
    } else {
      action = this.crudRest.create(entry);
    }
    return action.do(result => this.updateListEntry(result));
  }

  removeEntry(entry: T): Observable<void> {
    return this.crudRest.remove(entry.id).do(_ => this.updateEntries(this.entriesWithout(entry.id)));
  }

  reload() {
    this.loadEntries().subscribe(list => this.updateEntries(list));
  }

  private loadEntries(): Observable<T[]> {
    return this.crudRest
     .getList({ sort: this.sortAttr, 'page[size]': 500 })
     .switchMap(list => this.loadAllEntries(list))
     .map(list => list.entries)
     .catch(_ => Observable.of([]));
  }

  private loadAllEntries(list: CrudList<T>): Observable<CrudList<T>> {
    if (list.links.next) {
      return this.crudRest.getNextEntries(list).switchMap(l => this.loadAllEntries(l));
    } else {
      return Observable.of(list);
    }
  }

  private updateListEntry(entry: T) {
    const result = this.entriesWithout(entry.id);
    result.push(entry);
    this.updateEntries(result);
  }

  private entriesWithout(id: number) {
    return this.entries.filter(e => e.id !== id);
  }

  private updateEntries(entries: T[]) {
    this.entries = entries.sort((a: T, b: T) => a.toString().localeCompare(b.toString()));
    this.entries$.next(entries);
  }

}
