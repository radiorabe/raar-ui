/*
 * Fix special characters (+,=,?,/) not encoding correctly
 * See: https://github.com/angular/angular/issues/11058
 */
import { QueryEncoder } from '@angular/http';

export class PatchedQueryEncoder extends QueryEncoder {

  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

}
