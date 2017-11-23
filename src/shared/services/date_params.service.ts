export type RouteParams = { [key: string]: any };

export const DateParamsService = {

  timeFromParams(params: RouteParams): Date {
    const hour = params['time'].substring(0, 2);
    const min = params['time'].substring(2, 4);
    const sec = params['time'].substring(4, 6);
    return new Date(+params['year'], +params['month'] - 1, +params['day'], +hour, +min, +sec);
  },

  dateFromParams(params: RouteParams): Date {
    return new Date(+params['year'], +params['month'] - 1, +params['day']);
  },

  convertDateToPath(date: Date): string {
    return '/' +
           [date.getFullYear(),
            this.zeroPad(date.getMonth() + 1),
            this.zeroPad(date.getDate())]
           .join('/');
  },

  convertTimeToPath(date: Date): string {
    return this.convertDateToPath(date) +
           '/' +
           this.zeroPad(date.getHours()) +
           this.zeroPad(date.getMinutes()) +
           this.zeroPad(date.getSeconds());
  },

  convertTimeToParam(date: Date): string {
    return this.zeroPad(date.getHours()) +
           this.zeroPad(date.getMinutes());
  },

  zeroPad(n: number): string {
    return ('0' + n).slice(-2);
  },

};
