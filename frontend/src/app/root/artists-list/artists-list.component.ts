import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {ArtistsService} from "./artists.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-artists-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './artists-list.component.html',
  styleUrl: './artists-list.component.scss'
})
export class ArtistsListComponent implements OnInit, OnDestroy {
  private artistSubscription: Subscription | undefined;
  letters: any[] = [];
  artists: any[] = [];

  constructor(private route: ActivatedRoute, private artistsService: ArtistsService) {}

  ngOnInit() {
    for(let i = 65; i <= 90; i++) {
      this.letters.push(String.fromCharCode(i));
    }
    this.route.params.subscribe(async (params) => {
      await this.artistsService.fetchArtists(params['letter']);
      this.artistSubscription = this.artistsService.getArtistList().subscribe((data: any) => {
        this.artists = data;
      });
    });
  }

  ngOnDestroy() {
    this.artistSubscription?.unsubscribe();
  }
}
