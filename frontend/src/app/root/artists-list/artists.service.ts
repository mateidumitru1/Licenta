import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  constructor(private http: HttpClient) {}

  getArtists(letter: string) {
    return this.http.get(apiURL + '/artists/first-letter/' + letter);
  }

  getArtistById(id: number) {
    return this.http.get(apiURL + '/artists/' + id);
  }
}
