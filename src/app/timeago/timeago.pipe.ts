import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'timeago' })
export class TimeagoPipe implements PipeTransform {
  transform(date: Date | string | number, withoutSuffix: boolean): string {
    return moment(date).fromNow(withoutSuffix);
  }
}

@Pipe({ name: 'timeagoImpure', pure: false })
export class TimeagoImpurePipe extends TimeagoPipe implements PipeTransform {
}
