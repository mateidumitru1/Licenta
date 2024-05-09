import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MyHttpInterceptor} from "./util/my-http-interceptor.service";
import {provideNativeDateAdapter} from "@angular/material/core";

export const apiURL = 'https://server-backend-xmyv.onrender.com/api';
// export const apiURL = 'http://localhost:8080/api';
export const mapBoxToken = 'pk.eyJ1IjoibWF0ZHVtIiwiYSI6ImNsc29uNHdldTBoZ2cycmx6dGU1em0xNngifQ.CNxZncBUud9hmoevWrxSyg';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    provideNativeDateAdapter()
  ]
};
