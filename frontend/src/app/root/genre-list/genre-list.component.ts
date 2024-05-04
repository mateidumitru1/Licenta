import {Component, OnInit} from '@angular/core';
import {GenreService} from "./genre.service";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.scss'
})
export class GenreListComponent implements OnInit {
  genres: any[] = [];

  constructor(private genreService: GenreService) {}

  ngOnInit() {
    this.genreService.getGenres().subscribe({
      next: (genres: any) => {
        this.genres = genres;
      }
    });
  }
}
