import { environment } from 'src/environments/environment';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = error.error.message;
                    } else {
                        // server-side error
                        errorMessage = error.message;
                    }

                    try {
                        var h = new XMLHttpRequest();
                        var r = JSON.stringify(error);
                        h.open('POST',environment.serverUrl+'jserr/appjs', true);
                        h.setRequestHeader('Content-type', 'application/json');
                        h.send(r);
                    } catch(e) {
                        console.error(e);
                    }
                    
                    return throwError(errorMessage);
                })
            )
    }
}