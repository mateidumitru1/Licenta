import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ArtistsService} from "../artists.service";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {NgForOf, NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss'
})
export class ArtistComponent implements OnInit, OnDestroy {
  private artistSubscription: Subscription | undefined;
  artist: any;

  constructor(private route: ActivatedRoute, private artistsService: ArtistsService) {}

  ngOnInit() {
    this.route.queryParams.subscribe( async (params) => {
      await this.artistsService.fetchArtistById(params['id']);
        this.artistSubscription = this.artistsService.getArtist().subscribe({
          next: (artist: any) => {
            this.artist = artist;
          }
      });
    });
  }

  ngOnDestroy() {
    this.artistSubscription?.unsubscribe();
  }
}
