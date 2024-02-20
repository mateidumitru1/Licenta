import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const apiURL = 'http://localhost:8080/api';
export const mapBoxToken = 'pk.eyJ1IjoibWF0ZHVtIiwiYSI6ImNsc29uNHdldTBoZ2cycmx6dGU1em0xNngifQ.CNxZncBUud9hmoevWrxSyg';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
