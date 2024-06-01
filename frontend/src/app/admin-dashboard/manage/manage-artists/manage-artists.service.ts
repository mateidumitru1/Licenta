import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";
import {BehaviorSubject, last, lastValueFrom} from "rxjs";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ManageArtistsService {
  private artistListSubject = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) { }

  setArtistListSubject(artists: any) {
    this.artistListSubject.next(artists);
  }

  getArtistListSubject() {
    return this.artistListSubject;
  }

  async fetchPaginatedArtists(page: number, size: number) {
    try {
      const response: any = await lastValueFrom(this.http.get(apiURL + '/artists', {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          'Authorization': 'Bearer ' +  this.identityService.getToken()
        }
      }));
      this.setArtistListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch artists', 'Close', {
        duration: 3000,
      });
    }
  }

  async fetchPaginatedArtistsFiltered(page: number, size: number, search: string, filter: string) {
    try {
      const response: any = await lastValueFrom(this.http.get(apiURL + '/artists/filtered', {
        params: {
          page: page.toString(),
          size: size.toString(),
          search: search,
          filter: filter
        },
        headers: {
          'Authorization': 'Bearer ' +  this.identityService.getToken()
        }
      }));
      this.setArtistListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch artists', 'Close', {
        duration: 3000,
      });
    }
  }

  async fetchArtistsWithoutEventGenre() {
    try {
      const response: any = await lastValueFrom(this.http.get(apiURL + '/artists/without-event-genre'));
      this.setArtistListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch artists', 'Close', {
        duration: 3000,
      });
    }
  }

  async addArtist(artist: any, page: number, size: number) {
    try {
      const response: any = await lastValueFrom(this.http.post(apiURL + '/artists', getFormData(artist), {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          'Authorization': 'Bearer ' +  this.identityService.getToken()
        }
      }));
      this.setArtistListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to add artist', 'Close', {
        duration: 3000,
      });
    }
  }

  async updateArtist(artist: any) {
    try {
      const response: any = await lastValueFrom(this.http.put(apiURL + '/artists', getFormData(artist), {
        headers: {
          'Authorization': 'Bearer ' +  this.identityService.getToken()
        }
      }));
      let artists = this.artistListSubject.value;
      artists.artistPage.content = artists.artistPage.content.map((a: any) => a.id === artist.id ? artist : a);
      this.setArtistListSubject(artists);
    }
    catch (error) {
      this.snackBar.open('Failed to update artist', 'Close', {
        duration: 3000,
      });
    }
  }

  async deleteArtist(id: string, page: number, size: number) {
    try {
      const response: any = await lastValueFrom(this.http.delete(apiURL + '/artists/' + id, {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          'Authorization': 'Bearer ' +  this.identityService.getToken()
        }
      }));
      this.setArtistListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to delete artist', 'Close', {
        duration: 3000,
      });
    }
  }
}
