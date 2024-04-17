import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { apiURL } from "../../app.config";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  private artistListSubject = new BehaviorSubject<any[]>([]);
  private artistSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  setArtistList(artistList: any[]) {
    this.artistListSubject.next(artistList);
  }

  getArtistList() {
    return this.artistListSubject.asObservable();
  }

  setArtist(artist: any) {
    this.artistSubject.next(artist);
  }

  getArtist() {
    return this.artistSubject.asObservable();
  }

  async fetchArtists(letter: string) {
    try {
      const artists: any = await lastValueFrom(this.http.get(apiURL + '/artists/first-letter/' + letter));
      this.setArtistList(artists);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch artists', 'Close', {duration: 3000});
    }
  }

  async fetchArtistById(id: number) {
    try {
      const artist: any = await lastValueFrom(this.http.get(apiURL + '/artists/' + id));
      this.setArtist(artist);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch artist', 'Close', {duration: 3000});
    }
  }
}
