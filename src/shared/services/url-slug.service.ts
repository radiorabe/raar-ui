import { CrudModel } from '../models/crud.model';

export const UrlSlugService = {

  escape(string: string): string {
    return string.toLocaleLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/[áâà]/g, 'a')
      .replace(/[ç]/g, 'c')
      .replace(/[éêèëэ]/g, 'e')
      .replace(/[óôò]/g, 'o')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/-$/g, '');
  }

};
