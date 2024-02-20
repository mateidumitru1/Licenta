import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'locationName'
})
export class LocationNamePipe implements PipeTransform {

  transform(value: any): string {
    if(typeof value === 'object' && value !== null) {
      if('name' in value)
        return value.name;
    }
    return value;
  }
}
