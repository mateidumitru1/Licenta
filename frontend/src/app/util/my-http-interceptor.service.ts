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
  Observable, of,
  retryWhen, switchMap,
  take,
  throwError,
  timeout,
  timer
} from "rxjs";
import {Injectable} from "@angular/core";
import {LoadingService} from "../shared/loading/loading.service";

@Injectable({
  providedIn: 'root'
})
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.show();

    return next.handle(request).pipe(
      switchMap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return of(event).pipe(delay(100));
        }
        return of(event);
      }),
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index: number) => {
            if (index < 3 && this.isConnectionError(error)) {
              return timer(1000);
            }
            return throwError(error);
          })
        )
      ),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  private isConnectionError(error: HttpErrorResponse): boolean {
    // @ts-ignore
    return error.status === '(failed)net::ERR_CONNECTION_REFUSED' || error.status === 0;
  }
}
