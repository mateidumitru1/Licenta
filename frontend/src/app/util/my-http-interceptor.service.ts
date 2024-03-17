import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {
  catchError,
  delay,
  finalize,
  map,
  mergeMap,
  Observable,
  retryWhen,
  take,
  throwError,
  timeout,
  timer
} from "rxjs";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoadingService} from "../shared/loading/loading.service";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.show();
    return next.handle(request).pipe(
      timeout(10000),
      catchError((error: HttpErrorResponse) => {
        this.loadingService.hide();
        return throwError(error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
