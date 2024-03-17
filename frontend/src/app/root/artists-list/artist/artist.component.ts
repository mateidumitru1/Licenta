import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ArtistsService} from "../artists.service";
import {LoadingComponent} from "../../../shared/loading/loading.component";
import {NgForOf, NgIf} from "@angular/common";

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
export class ArtistComponent implements OnInit{
  artist: any;
  constructor(private route: ActivatedRoute, private artistsService: ArtistsService) {}

  ngOnInit() {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.artistsService.getArtistById(params['id']).subscribe({
          next: (artist) => {
            this.artist = artist;
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
  }
}
