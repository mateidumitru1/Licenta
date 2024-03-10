import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {ArtistsService} from "./artists.service";

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
export class ArtistsListComponent implements OnInit{

  letters: any[] = [];
  artists: any[] = [];

  constructor(private route: ActivatedRoute, private artistsService: ArtistsService) {}

  ngOnInit() {
    for(let i = 65; i <= 90; i++) {
      this.letters.push(String.fromCharCode(i));
    }
    this.route.params.subscribe(params => {
      this.artistsService.getArtists(params['letter']).subscribe((artists: any) => {
        this.artists = artists;
      });
    });
  }
}
