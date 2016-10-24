import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toArray' })
export class ToArrayPipe implements PipeTransform {
  transform(obj: {}, args: any[] = null): any {
    if (!obj) return null;
    return Object.keys(obj).map((key) => obj[key]);
  }
}
