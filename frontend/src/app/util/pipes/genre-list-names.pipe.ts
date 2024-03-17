import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'genreListNames'
})
export class GenreListNamesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.map((genre: any) => genre.name).join(', ');
  }
}
