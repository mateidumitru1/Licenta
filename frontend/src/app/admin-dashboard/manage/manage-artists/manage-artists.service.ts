import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {JwtHandler} from "../../../identity/jwt.handler";
import {getFormData} from "../shared/form-data.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageArtistsService {

    constructor(private http: HttpClient, private jwtHandler: JwtHandler) { }

    fetchArtists() {
      return this.http.get(apiURL + '/artists');
    }

    addArtist(artist: any) {
      console.log(getFormData(artist));
      return this.http.post(apiURL + '/artists', getFormData(artist), {
        headers: {
          'Authorization': 'Bearer ' +  this.jwtHandler.getToken()
        }
      });
    }

    updateArtist(artist: any) {
      return this.http.put(apiURL + '/artists', getFormData(artist), {
        headers: {
          'Authorization': 'Bearer ' +  this.jwtHandler.getToken()
        }
      });
    }

    deleteArtist(id: number) {
      return this.http.delete(apiURL + '/artists/' + id, {
        headers: {
          'Authorization': 'Bearer ' +  this.jwtHandler.getToken()
        }
      });
    }
}
